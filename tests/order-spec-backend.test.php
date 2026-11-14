<?php
declare(strict_types=1);

/** CLI-only, fake/synthetic values. NEVER sends mail or reaches a network. */
require __DIR__ . '/../server/order-spec/validation.php';
require __DIR__ . '/../server/order-spec/pdf.php';
require __DIR__ . '/../server/order-spec/state.php';
require __DIR__ . '/../server/order-spec/mailer.php';

function check(bool $ok, string $label): void {
    if (!$ok) { fwrite(STDERR, "FAIL: $label\n"); exit(1); }
    echo "PASS: $label\n";
}
function reject(callable $f, string $label): void {
    try { $f(); } catch (InvalidArgumentException) { check(true, $label); return; }
    check(false, $label);
}
$fixture = json_decode(file_get_contents(__DIR__ . '/../server/order-spec/tests/example.v1.json'), true, 48, JSON_THROW_ON_ERROR);
check(hp_order_validate($fixture) === $fixture, 'Frozen v1 fixture validates exactly');

$alter = $fixture; $alter['approvalStatus'] = 'released';
reject(static fn()=>hp_order_validate($alter), 'No client manufacturing approval');
$alter = $fixture; $alter['purchasePrice'] = 1;
reject(static fn()=>hp_order_validate($alter), 'No cost or price field');
$alter = $fixture; $alter['project']['building']['heightMm'] = -1;
reject(static fn()=>hp_order_validate($alter), 'Negative dimension');
$alter = $fixture; $alter['items'][0]['dimensions']['thicknessMm'] = '10,5';
reject(static fn()=>hp_order_validate($alter), 'Comma decimal must be parsed to numeric before submit');
$alter = $fixture; $alter['items'][1]['lineId'] = $alter['items'][0]['lineId'];
reject(static fn()=>hp_order_validate($alter), 'Duplicate line identifier');
$alter = $fixture; $alter['submitter']['role'] = 'admin';
reject(static fn()=>hp_order_validate($alter), 'No self-declared privileged role');
$alter = $fixture; $alter['sections']['roofSandwichPanels'] = 'excluded';
reject(static fn()=>hp_order_validate($alter), 'Cannot exclude included item category');
$alter = $fixture; $alter['finishAssignments'][] = ['materialClass'=>'roofPanel','ral'=>'RAL 9010'];
reject(static fn()=>hp_order_validate($alter), 'Conflicting category and item RAL');

$alter = $fixture;
$alter['items'][0]['notes'] = '<script>alert("bad")</script> ÄÖ Å';
$alter['unresolvedQuestions'][] = 'Öppet mått <b>inte godkänt</b>';
$clean = hp_order_validate($alter);
$html = hp_order_pdf_html($clean, 'HP-1A2B3C4D5E', '2026-11-14 10:00 UTC');
check(str_contains($html, 'EJ SIGNERAT') && str_contains($html, 'EJ GODKÄNT'), 'PDF sign-off is always blocked');
check(!str_contains($html,'<script>') && str_contains($html,'&lt;script&gt;'), 'Untrusted markup escaped');
check(str_contains($html,'ÄÖ Å') && str_contains($html,'Öppet mått'), 'UTF-8 content retained');
check(str_contains($html,'table-header-group') && str_contains($html,'Godkännande före tillverkning'), 'Pageable tables and blank signature blocks');
check(str_contains($html,'SYNTH-F01') && str_contains($html,'RAL 7016'), 'Item reference and finish present');

$tmp = sys_get_temp_dir() . '/hp-order-spec-unit-' . bin2hex(random_bytes(8));
check(mkdir($tmp,0700), 'Created private test state');
$config = ['state_dir'=>$tmp, 'rate_secret'=>str_repeat('Z',48),'enabled'=>true,
    'smtp_port'=>587,'smtp_from'=>'offert@hallpartner.se'];
try {
    hp_os_limit($config,'test','synthetic',2,3600);
    hp_os_limit($config,'test','synthetic',2,3600);
    try { hp_os_limit($config,'test','synthetic',2,3600); check(false,'Limiter blocks'); }
    catch (RuntimeException) { check(true,'Limiter blocks'); }
    $a = hp_os_reserve($config,'syntetisk@example.invalid',$fixture['idempotencyKey'],'HASH-A');
    $b = hp_os_reserve($config,'syntetisk@example.invalid',$fixture['idempotencyKey'],'HASH-A');
    check($a['new'] && !$b['new'], 'Idempotent reservation cannot duplicate');
    try { hp_os_reserve($config,'syntetisk@example.invalid',$fixture['idempotencyKey'],'HASH-B'); check(false,'Different payload rejected'); }
    catch (DomainException) { check(true,'Different payload rejected'); }
    $session=['verified'=>['email'=>'syntetisk@example.invalid','hash'=>hash('sha256','test-token'),'expires'=>time()+120]];
    check(hp_os_claim_verification($session,'test-token','syntetisk@example.invalid','KEY-1','HASH-A'), 'Verification token authorizes first payload');
    check(hp_os_claim_verification($session,'test-token','syntetisk@example.invalid','KEY-1','HASH-A'), 'Same order replay remains authorized');
    check(!hp_os_claim_verification($session,'test-token','syntetisk@example.invalid','KEY-2','HASH-A'), 'No second order per verification token');
    check(!hp_os_claim_verification($session,'test-token','syntetisk@example.invalid','KEY-1','HASH-B'), 'No changed payload per verification token');
    hp_os_complete($config,'syntetisk@example.invalid',$fixture['idempotencyKey'],'HASH-A',['status'=>'accepted']);
    check(hp_os_reserve($config,'syntetisk@example.invalid',$fixture['idempotencyKey'],'HASH-A')['record']['status'] === 'accepted',
        'Stored accepted state can be replayed without resending');

    final class FakeEnvelope {
        public array $to = []; public array $attachments = [];
        public string $Subject = ''; public string $Body = '';
        public function addAddress(string $s): void {$this->to[]=$s;}
        public function addStringAttachment(string $data, string $name, string $encoding, string $mime): void {
            $this->attachments[]=[$data,$name,$encoding,$mime];
        }
        public function send(): bool {return true;}
    }
    $capture = new FakeEnvelope();
    $accepted=hp_os_send($config,'testmottagare@example.invalid','Synthetic test','Test body',
        '%PDF-1.4 synthetic data','HP-1A2B3C4D5E',static fn()=>$capture);
    check($accepted && $capture->to === ['testmottagare@example.invalid'], 'Mock SMTP only reaches selected recipient');
    check(count($capture->attachments)===1 && $capture->attachments[0][1]==='HP-1A2B3C4D5E.pdf', 'PDF attachment bound to reference');
    $disabled=$config;$disabled['enabled']=false;
    try {hp_os_send($disabled,'x@example.invalid','x','x',null,null,static fn()=>$capture);check(false,'Disabled SMTP rejects');}
    catch(RuntimeException){check(true,'Disabled SMTP rejects');}
} finally {
    foreach (glob($tmp.'/*.json') ?: [] as $file) unlink($file);
    rmdir($tmp);
}

if (class_exists(\Dompdf\Dompdf::class)) {
    $tmp=sys_get_temp_dir().'/hp-order-pdf-'.bin2hex(random_bytes(6));
    mkdir($tmp,0700);
    try{
        $pdf=hp_order_generate_pdf($fixture,'HP-1A2B3C4D5E','2026-11-14 10:00 UTC',$tmp);
        check(str_starts_with($pdf,'%PDF-') && strlen($pdf)>1000,'Real Dompdf A4 bytes');
    } finally {
        foreach (glob($tmp.'/*') ?: [] as $file) if (is_file($file)) unlink($file);
        rmdir($tmp);
    }
} else {
    echo "NOT RUN: Real PDF rendering (Dompdf vendor/autoload missing)\n";
}
echo "Order-spec backend CLI regression complete; no SMTP network attempted.\n";
