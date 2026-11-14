type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type Json = Record<string, unknown>;
type FieldIssue = { input: InputElement; message: string };
type ItemField = { key: string; label: string; numeric?: boolean; options?: string[]; maxLength?: number };
const API = '/api/order-spec.php';

const sections: Record<string, string> = {
  steelStructure: 'Stålstomme', roofSandwichPanels: 'Taksandwichpaneler',
  wallSandwichPanels: 'Väggsandwichpaneler', roofSheets: 'Takplåt',
  wallSheets: 'Väggplåt', flashings: 'Beslag', pvcMembrane: 'PVC-duk',
  finishes: 'Ytbehandling', fixings: 'Infästningar', openings: 'Öppningar',
  documentation: 'Dokumentation', transport: 'Transport'
};
const categorySection: Record<string, string> = {
  roofPanel: 'roofSandwichPanels', wallPanel: 'wallSandwichPanels',
  roofSheet: 'roofSheets', wallSheet: 'wallSheets', flashing: 'flashings',
  pvc: 'pvcMembrane', fixing: 'fixings', opening: 'openings'
};
const stateText: Record<string, string> = {
  included: 'Ingår', excluded: 'Ingår inte', unresolved: 'Behöver fastställas'
};
const generalFields: ItemField[] = [
  {key: 'itemType', label: 'Artikeltyp / benämning', maxLength: 100},
  {key: 'description', label: 'Beskrivning', maxLength: 400},
  {key: 'supplierArticleNumber', label: 'Leverantörens artikelnummer', maxLength: 100},
  {key: 'quantity', label: 'Antal / mängd', numeric: true},
  {key: 'unit', label: 'Enhet', options: ['pcs','m','m2','kg','set','roll']}
];
const dimensions: ItemField[] = [
  {key: 'dimensions.thicknessMm', label: 'Tjocklek (mm)', numeric: true},
  {key: 'dimensions.widthMm', label: 'Bredd (mm)', numeric: true},
  {key: 'dimensions.lengthMm', label: 'Längd (mm)', numeric: true},
  {key: 'dimensions.heightMm', label: 'Höjd (mm)', numeric: true}
];
const commonExtra: ItemField[] = [
  {key: 'profile', label: 'Profil', maxLength: 100},
  {key: 'materialGrade', label: 'Materialkvalitet', maxLength: 100},
  {key: 'finish', label: 'Ytbehandling', maxLength: 100},
  {key: 'ral', label: 'RAL-kod', maxLength: 32},
  {key: 'insideRal', label: 'RAL insida', maxLength: 32},
  {key: 'outsideRal', label: 'RAL utsida', maxLength: 32},
  {key: 'drawingReference', label: 'Ritningsreferens', maxLength: 160},
  {key: 'notes', label: 'Kommentar', maxLength: 1200}
];
const categoryExtra: Record<string, ItemField[]> = {
  roofPanel: [
    {key: 'core', label: 'Isoleringskärna', options: ['PIR','PUR','MW','other']},
    {key: 'widthBasis', label: 'Breddtyp', options: ['effectiveCover','overall','notApplicable']}
  ],
  wallPanel: [
    {key: 'core', label: 'Isoleringskärna', options: ['PIR','PUR','MW','other']},
    {key: 'widthBasis', label: 'Breddtyp', options: ['effectiveCover','overall','notApplicable']}
  ],
  roofSheet: [{key: 'dimensions.profileHeightMm', label: 'Profilhöjd (mm)', numeric:true}],
  wallSheet: [{key: 'dimensions.profileHeightMm', label: 'Profilhöjd (mm)', numeric:true}],
  flashing: [
    {key: 'dimensions.developedWidthMm', label: 'Utvecklad bredd (mm)', numeric:true},
    {key: 'dimensions.finishedWidthMm', label: 'Färdig bredd (mm)', numeric:true},
    {key: 'foldingProfile', label: 'Bockning / profil', maxLength:300}
  ],
  pvc: [
    {key: 'weightGm2', label: 'Vikt (g/m²)', numeric:true},
    {key: 'fireClass', label: 'Brandklass', maxLength:80},
    {key: 'uvResistance', label: 'UV-beständighet', maxLength:120},
    {key: 'materialQuality', label: 'Materialkvalitet', maxLength:160},
    {key: 'fixingSystem', label: 'Infästningssystem', maxLength:160}
  ],
  fixing: [
    {key: 'corrosionProtection', label: 'Korrosionsskydd', maxLength:120}
  ],
  opening: [
    {key: 'dimensions.clearWidthMm', label: 'Fri öppningsbredd (mm)', numeric:true},
    {key: 'dimensions.clearHeightMm', label: 'Fri öppningshöjd (mm)', numeric:true},
    {key: 'openingPosition', label: 'Placering', maxLength:120}
  ]
};
const finishFields: ItemField[] = [
  {key: 'materialClass',label:'Materialgrupp',options:['roofPanel','wallPanel','roofSheet','wallSheet','flashing','steelStructure','pvc','door']},
  {key: 'ral',label:'RAL-kod',maxLength:32},
  {key: 'finish',label:'Ytbehandling',maxLength:100},
  {key: 'notes',label:'Kommentar',maxLength:500}
];

function inputNodes(container: ParentNode): InputElement[] {
  return Array.from(container.querySelectorAll<InputElement>('input, select, textarea'));
}
function nestedSet(target: Json, path: string, value: string | number): void {
  const parts = path.split('.');
  let node: Json = target;
  parts.slice(0, -1).forEach(part => {
    if (!(part in node)) node[part] = {};
    node = node[part] as Json;
  });
  node[parts[parts.length - 1]] = value;
}
function fieldValue(input: InputElement): string {
  return input.value.trim();
}
function numericValue(value: string): number | null {
  // Only finite decimal quantities; reject thousands separators and exponent notation.
  if (!/^(?:\d+)(?:[.,]\d+)?$/.test(value)) return null;
  const n = Number(value.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}
function validPositive(value: number, key: string): boolean {
  if (key === 'project.building.roofPitchDegrees') return value >= 0 && value <= 89.9;
  if (key.endsWith('quantity')) return value > 0 && value <= 100000000;
  if (key.endsWith('weightGm2')) return value > 0 && value <= 100000;
  if (key.endsWith('thicknessMm')) return value > 0 && value <= 5000;
  if (key.endsWith('profileHeightMm')) return value > 0 && value <= 2000;
  if (key.endsWith('heightMm')) return value > 0 && value <= 100000;
  if (key.endsWith('widthMm') || key.endsWith('lengthMm')) return value > 0 && value <= 100000;
  return value > 0;
}
function appendFields(target: HTMLElement, specs: ItemField[], prefix: string): void {
  specs.forEach(spec => {
    const wrap = document.createElement('div');
    wrap.className = 'hp-order__field';
    const id = prefix + '-' + spec.key.replaceAll('.', '-');
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = spec.label;
    wrap.append(label);
    let input: HTMLInputElement | HTMLSelectElement;
    if (spec.options) {
      input = document.createElement('select');
      const initial = document.createElement('option');
      initial.value = '';
      initial.textContent = 'Välj';
      input.append(initial);
      spec.options.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        const labels: Record<string,string> = {
          pcs:'st',m:'m',m2:'m²',kg:'kg',set:'sats',roll:'rulle',
          effectiveCover:'Täckande bredd',overall:'Total bredd',notApplicable:'Inte tillämpligt',
          other:'Övrigt',steelStructure:'Stålstomme',roofPanel:'Takpanel',wallPanel:'Väggpanel',
          roofSheet:'Takplåt',wallSheet:'Väggplåt',flashing:'Beslag',pvc:'PVC-duk',door:'Dörr'
        };
        option.textContent = labels[value] ?? value;
        input.append(option);
      });
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.maxLength = spec.maxLength ?? (spec.numeric ? 20 : 180);
      if (spec.numeric) input.inputMode = 'decimal';
    }
    input.id = id;
    input.dataset.itemField = spec.key;
    if (spec.numeric) input.dataset.number = 'true';
    input.setAttribute('aria-describedby', id + '-error');
    wrap.append(input);
    const error = document.createElement('span');
    error.id = id + '-error';
    error.className = 'hp-order__error';
    error.setAttribute('aria-live', 'polite');
    wrap.append(error);
    target.append(wrap);
  });
}
function appendRow(group: HTMLElement, category: string, index: number, onChange: () => void): void {
  const count = group.querySelectorAll('[data-item-row]').length;
  if (count >= 120) return;
  const article = document.createElement('article');
  article.className = 'hp-order__line';
  article.dataset.itemRow = category;
  article.dataset.lineId = 'L-' + crypto.randomUUID().replaceAll('-', '').slice(0, 16);
  const head = document.createElement('div');
  head.className = 'hp-order__line-head';
  const title = document.createElement('h3');
  title.textContent = 'Artikel ' + index;
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.textContent = 'Ta bort';
  remove.className = 'hp-order__remove';
  remove.addEventListener('click', () => { article.remove(); onChange(); renumber(group); });
  head.append(title,remove);
  const grid = document.createElement('div');
  grid.className = 'hp-order__grid';
  appendFields(grid, generalFields, 'hp-line-' + article.dataset.lineId);
  article.append(head,grid);
  const details = document.createElement('details');
  details.className = 'hp-order__extra';
  const summary = document.createElement('summary');
  summary.textContent = 'Mått och fler produktegenskaper';
  details.append(summary);
  const extra = document.createElement('div');
  extra.className = 'hp-order__grid';
  appendFields(extra, [...dimensions,...(categoryExtra[category] ?? []),...commonExtra], 'hp-more-' + article.dataset.lineId);
  details.append(extra);
  article.append(details);
  group.append(article);
  onChange();
}
function renumber(group: HTMLElement): void {
  group.querySelectorAll<HTMLElement>('[data-item-row]').forEach((item, index) => {
    const heading = item.querySelector('h3');
    if (heading) heading.textContent = 'Artikel ' + (index + 1);
  });
}
function createFinishRow(host: HTMLElement, onChange: () => void): void {
  if (host.children.length >= 30) return;
  const row = document.createElement('div');
  row.className = 'hp-order__line hp-order__finish-line';
  row.dataset.finishRow = 'true';
  const top = document.createElement('div');
  top.className = 'hp-order__line-head';
  const heading = document.createElement('h3');
  heading.textContent = 'Ytbehandling';
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'hp-order__remove';
  remove.textContent = 'Ta bort';
  remove.addEventListener('click', () => { row.remove(); onChange(); });
  top.append(heading,remove);
  const grid = document.createElement('div');
  grid.className = 'hp-order__grid';
  appendFields(grid, finishFields, 'hp-finish-' + crypto.randomUUID().slice(0,8));
  row.append(top,grid);
  host.append(row);
  onChange();
}

export function mountOrderSpecification(form: HTMLFormElement): void {
  const ready = form.dataset.enabled === 'true';
  const status = document.querySelector<HTMLElement>('[data-message]');
  const summary = document.querySelector<HTMLElement>('[data-summary]');
  const verification = document.querySelector<HTMLElement>('[data-verification-status]');
  const download = document.querySelector<HTMLAnchorElement>('[data-download]');
  let verificationToken: string | null = null;
  let challengeId: string | null = null;
  let verifiedEmail = '';
  let idempotencyKey: string | null = null;
  let pending = false;
  let uncertain = false;
  let everSubmitted = false;

  function message(text: string, kind: 'success' | 'error' | 'info' = 'info'): void {
    if (!status) return;
    status.textContent = text;
    status.dataset.kind = kind;
  }
  function changed(): void {
    // No persistent browser storage: a shared computer retains no order draft.
    if (!everSubmitted) idempotencyKey = null;
    if (download) download.hidden = true;
    if (summary) summary.hidden = true;
  }
  form.addEventListener('input', event => {
    changed();
    if (event.target instanceof HTMLElement) {
      event.target.removeAttribute('aria-invalid');
      const wrap = event.target.closest('.hp-order__field');
      const error = wrap?.querySelector<HTMLElement>('.hp-order__error');
      if (error) error.textContent = '';
    }
    if (event.target instanceof HTMLInputElement && event.target.dataset.path === 'submitter.email') {
      challengeId = null;
      verificationToken = null;
      verifiedEmail = '';
      if (verification) verification.textContent = 'E-postadressen måste verifieras.';
    }
  });
  form.addEventListener('change',changed);
  form.querySelectorAll<HTMLButtonElement>('[data-add-line]').forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.addLine ?? '';
      const host = form.querySelector<HTMLElement>('[data-item-group="' + category + '"]');
      if (!host) return;
      const total = form.querySelectorAll('[data-item-row]').length;
      if (total >= 120) { message('Högst 120 artikelrader kan anges.', 'error'); return; }
      appendRow(host, category, host.children.length + 1, changed);
    });
  });
  form.querySelector<HTMLButtonElement>('[data-add-finish]')?.addEventListener('click', () => {
    const host = form.querySelector<HTMLElement>('[data-finish-lines]');
    if (host) createFinishRow(host,changed);
  });

  function collect(): { payload: Json; issues: FieldIssue[] } {
    const issues: FieldIssue[] = [];
    const submitter: Json = {}, orderingParty: Json = {}, supplier: Json = {};
    const project: Json = {building: {frameParts: []}}, recipient: Json = {};
    const delivery: Json = {packingRequirements: []};
    const pvcSpecification: Json = {};
    const documentation: Json = {requested: []};
    const finalReview: Json = {confirmed: [], detailsReviewed: false};
    const staticRoots: Record<string,Json> = {
      submitter,orderingParty,supplier,project,recipient,delivery,pvcSpecification,
      documentation,finalReview
    };
    form.querySelectorAll<InputElement>('[data-path]').forEach(input => {
      const path = input.dataset.path ?? '';
      const [root,...rest] = path.split('.');
      const value = fieldValue(input);
      const key = rest.join('.');
      if (input.required && !value) issues.push({input,message:'Fyll i detta fält.'});
      if (value && input.type === 'email' && !input.checkValidity()) issues.push({input,message:'Ange en giltig e-postadress.'});
      if (!value || !staticRoots[root]) return;
      if (input.dataset.number === 'true') {
        const num = numericValue(value);
        if (num === null || !validPositive(num,path)) issues.push({input,message:'Ange ett giltigt mått eller tal inom tillåtet intervall.'});
        else nestedSet(staticRoots[root],key,num);
      } else nestedSet(staticRoots[root],key,value);
    });
    (project.building as Json).frameParts = Array.from(form.querySelectorAll<HTMLInputElement>('[data-multi="frameParts"]:checked')).map(x => x.value);
    delivery.packingRequirements = Array.from(form.querySelectorAll<HTMLInputElement>('[data-multi="packingRequirements"]:checked')).map(x => x.value);
    documentation.requested = Array.from(form.querySelectorAll<HTMLInputElement>('[data-multi="documentation"]:checked')).map(x => x.value);
    finalReview.confirmed = Array.from(form.querySelectorAll<HTMLInputElement>('[data-multi="finalReview"]:checked')).map(x => x.value);
    finalReview.detailsReviewed = Boolean(form.querySelector<HTMLInputElement>('[data-details-reviewed]')?.checked);

    const sectionStates: Record<string,string> = {};
    form.querySelectorAll<HTMLSelectElement>('[data-section]').forEach(input => {
      if (input.dataset.section) sectionStates[input.dataset.section] = input.value;
    });
    const items: Json[] = [];
    form.querySelectorAll<HTMLElement>('[data-item-row]').forEach(row => {
      const category = row.dataset.itemRow ?? '';
      const item: Json = {lineId:row.dataset.lineId ?? '',category};
      row.querySelectorAll<InputElement>('[data-item-field]').forEach(input => {
        const name = input.dataset.itemField ?? '';
        const value = fieldValue(input);
        if (!value) {
          if (['itemType','quantity','unit'].includes(name)) issues.push({input,message:'Obligatorisk uppgift för artikelraden.'});
          return;
        }
        if (input.dataset.number === 'true') {
          const number = numericValue(value);
          if (number === null || !validPositive(number,name)) issues.push({input,message:'Ange ett giltigt positivt tal.'});
          else nestedSet(item,name,number);
        } else nestedSet(item,name,value);
      });
      items.push(item);
      if (sectionStates[categorySection[category]] === 'excluded') {
        const first = row.querySelector<InputElement>('[data-item-field="itemType"]');
        if (first) issues.push({input:first,message:'Materialet är markerat som inte ingående. Ta bort raden eller ändra status.'});
      }
    });
    const finishAssignments: Json[] = [];
    form.querySelectorAll<HTMLElement>('[data-finish-row]').forEach(row => {
      const finish: Json = {};
      row.querySelectorAll<InputElement>('[data-item-field]').forEach(input => {
        const value = fieldValue(input);
        if (value) finish[input.dataset.itemField ?? ''] = value;
      });
      if (!finish.materialClass) {
        const first = row.querySelector<InputElement>('[data-item-field="materialClass"]');
        if (first) issues.push({input:first,message:'Välj materialgrupp för ytbehandlingen.'});
      }
      finishAssignments.push(finish);
    });
    const questionText = form.querySelector<HTMLTextAreaElement>('[data-unresolved]')?.value ?? '';
    const unresolvedQuestions = questionText.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    const questionInput = form.querySelector<HTMLTextAreaElement>('[data-unresolved]');
    if (questionInput && (unresolvedQuestions.length > 30 || unresolvedQuestions.some(x => x.length > 500))) {
      issues.push({input:questionInput,message:'Högst 30 frågor, maximalt 500 tecken per rad.'});
    }
    if (finishAssignments.length && sectionStates.finishes === 'excluded') {
      const first = form.querySelector<InputElement>('[data-finish-row] [data-item-field="materialClass"]');
      if (first) issues.push({input:first,message:'Ytbehandlingar finns trots att de är markerade som inte ingående.'});
    }
    return {
      payload:{
        schemaVersion:1, formType:'hallpartner-order-spec-v1',
        idempotencyKey:idempotencyKey ?? crypto.randomUUID(),
        submitter, orderingParty, supplier, project, recipient, delivery,
        sections:sectionStates, items, finishAssignments,
        ...(Object.keys(pvcSpecification).length ? {pvcSpecification} : {}),
        documentation, finalReview, unresolvedQuestions
      },
      issues
    };
  }
  function clearErrors(): void {
    form.querySelectorAll<HTMLElement>('[aria-invalid="true"]').forEach(x => x.removeAttribute('aria-invalid'));
    form.querySelectorAll<HTMLElement>('.hp-order__error').forEach(x => {x.textContent='';});
  }
  function showIssues(issues: FieldIssue[]): boolean {
    clearErrors();
    for (const issue of issues) {
      issue.input.setAttribute('aria-invalid','true');
      const error = issue.input.closest('.hp-order__field')?.querySelector<HTMLElement>('.hp-order__error');
      if (error) error.textContent = issue.message;
      if (issue.input.closest('details')) issue.input.closest('details')?.setAttribute('open','');
    }
    if (issues.length) {
      issues[0].input.focus();
      message('Kontrollera markerade fält innan du skickar. Inga uppgifter har skickats.','error');
      return false;
    }
    return true;
  }
  function showSummary(payload: Json): void {
    if (!summary) return;
    const add = (text: string, heading = false): void => {
      const el = document.createElement(heading ? 'h3' : 'p');
      el.textContent = text;
      summary.append(el);
    };
    const submitter = payload.submitter as Json;
    const project = payload.project as Json;
    const orderingParty = payload.orderingParty as Json;
    const recipient = payload.recipient as Json;
    const items = payload.items as Json[];
    const states = payload.sections as Record<string,string>;
    summary.replaceChildren();
    add('Sammanfattning före utskick',true);
    add('Projekt: ' + String(project.name ?? 'Ej angivet'));
    add('Beställande part: ' + String(orderingParty.companyName ?? 'Ej angivet'));
    add('Inskickare: ' + String(submitter.name ?? 'Ej angivet') + ' · ' + String(submitter.email ?? 'Ej angivet'));
    add('PDF-mottagare: ' + String(recipient.email ?? 'Ej angivet'));
    add('Artikelrader: ' + items.length);
    Object.entries(states).forEach(([key,value]) => add((sections[key] ?? key) + ': ' + (stateText[value] ?? value)));
    if (items.length) {
      add('Registrerade artiklar',true);
      items.forEach((item,index) => add((index+1) + '. ' + String(item.itemType ?? 'Ej angiven artikel') + ' · ' + String(item.quantity ?? '?') + ' ' + String(item.unit ?? '')));
    }
    add('Dokumentstatus: Ej signerat, ej godkänt för tillverkning.');
    summary.hidden = false;
    summary.focus();
  }

  form.querySelector<HTMLButtonElement>('[data-preview]')?.addEventListener('click', () => {
    const {payload} = collect();
    showSummary(payload);
    message('Sammanfattningen är skapad lokalt. Inget har skickats.','info');
  });
  async function sendRequest(body: Json): Promise<{ok:boolean; data:Json}> {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(API,{
        method:'POST',credentials:'same-origin',cache:'no-store',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(body),signal:controller.signal
      });
      const value: unknown = await response.json().catch(() => ({}));
      const data: Json = value && typeof value === 'object' && !Array.isArray(value) ? value as Json : {};
      return {ok:response.ok,data};
    } finally { window.clearTimeout(timeout); }
  }
  form.querySelector<HTMLButtonElement>('[data-request-code]')?.addEventListener('click',async () => {
    if (!ready || pending) return;
    const input = form.querySelector<HTMLInputElement>('[data-path="submitter.email"]');
    if (!input || !input.value.trim() || !input.checkValidity()) {
      if (input) showIssues([{input,message:'Ange en giltig e-postadress innan du begär kod.'}]);
      return;
    }
    pending = true;
    verificationToken = null;
    try {
      const {ok,data} = await sendRequest({action:'challenge-request',email:input.value.trim()});
      if (!ok || data.status !== 'pending' || typeof data.challengeId !== 'string') throw Error('Challenge rejected');
      challengeId = data.challengeId;
      verifiedEmail = input.value.trim();
      if (verification) verification.textContent = 'Kod begärd. Kontrollera din inkorg.';
    } catch {
      if (verification) verification.textContent = 'Kunde inte begära kod. Ingen verifiering har genomförts.';
    } finally {pending = false;}
  });
  form.querySelector<HTMLButtonElement>('[data-confirm-code]')?.addEventListener('click',async () => {
    if (!ready || pending || !challengeId) return;
    const code = form.querySelector<HTMLInputElement>('[data-verification-code]')?.value.trim() ?? '';
    if (!/^[0-9A-Za-z]{4,12}$/.test(code)) {
      if (verification) verification.textContent = 'Ange verifieringskoden från mejlet.';
      return;
    }
    pending = true;
    try {
      const {ok,data} = await sendRequest({action:'challenge-confirm',challengeId,code});
      if (!ok || data.status !== 'verified' || typeof data.verificationToken !== 'string') throw Error('Unverified');
      const email = form.querySelector<HTMLInputElement>('[data-path="submitter.email"]')?.value.trim();
      if (email !== verifiedEmail) throw Error('Address changed');
      verificationToken = data.verificationToken;
      if (verification) verification.textContent = 'E-postadress verifierad. Du kan granska och skicka.';
    } catch {
      verificationToken = null;
      if (verification) verification.textContent = 'Koden kunde inte verifieras. Kontrollera koden eller begär en ny.';
    } finally {pending = false;}
  });
  form.addEventListener('submit',async event => {
    event.preventDefault();
    if (!ready) {message('Utskick är ännu inte aktiverat. Inget har skickats.','error');return;}
    if (pending || uncertain || everSubmitted) {
      message('Skicka inte om. Vid osäkert leveransresultat behöver Hallpartner kontaktas innan ett nytt försök.','error');
      return;
    }
    const {payload,issues} = collect();
    if (!showIssues(issues)) return;
    if (!verificationToken || verifiedEmail !== (payload.submitter as Json).email) {
      message('Verifiera först din e-postadress med engångskoden.','error');
      form.querySelector<HTMLInputElement>('[data-verification-code]')?.focus();
      return;
    }
    if (!(payload.finalReview as Json).detailsReviewed) {
      message('Bekräfta att du granskat de ifyllda uppgifterna. Detta är ingen signering.','error');
      form.querySelector<HTMLInputElement>('[data-details-reviewed]')?.focus();
      return;
    }
    showSummary(payload);
    const recipient = (payload.recipient as Json).email;
    if (!window.confirm('Skicka ett osignerat PDF-underlag till ' + String(recipient) + '?')) {
      message('Utskicket avbröts. Inget har skickats.','info');
      return;
    }
    pending = true;
    idempotencyKey = payload.idempotencyKey as string;
    message('Begäran behandlas. Stäng inte sidan.','info');
    try {
      const {ok,data} = await sendRequest({action:'submit',payload,verificationToken});
      if (ok && data.status === 'accepted' && typeof data.documentRef === 'string') {
        everSubmitted = true;
        verificationToken = null;
        message('Servern har accepterat utskicket med referens ' + data.documentRef + '. Det betyder inte att mottagarens inkorg har bekräftat leverans.','success');
        const link = typeof data.downloadUrl === 'string' ? data.downloadUrl : '';
        if (download && /^\/api\/order-spec\.php\?action=download&token=[A-Za-z0-9_-]{12,256}$/.test(link)) {
          download.href = link;
          download.hidden = false;
        }
      } else if (data.status === 'invalid' && data.fields && typeof data.fields === 'object') {
        const fields = data.fields as Record<string,unknown>;
        const serverIssues: FieldIssue[] = [];
        Object.entries(fields).forEach(([path,detail]) => {
          const input = inputNodes(form).find(x => x.dataset.path === path);
          if (input && typeof detail === 'string') serverIssues.push({input,message:detail.slice(0,200)});
        });
        if (!serverIssues.length) message('Servern avvisade uppgifterna. Kontrollera formuläret. Inget utskick är bekräftat.','error');
        else showIssues(serverIssues);
      } else if (data.status === 'disabled') {
        message('Utskicket är inte aktiverat på servern. Ingen leverans har bekräftats.','error');
      } else if (data.status === 'unconfirmed') {
        uncertain = true;
        message('Servern kunde inte bekräfta resultatet. Skicka inte igen innan Hallpartner har kontrollerat ärendet.','error');
      } else {
        message('Servern kunde inte bekräfta utskicket. Kontrollera med Hallpartner innan ett nytt försök.','error');
        uncertain = true;
      }
    } catch {
      uncertain = true;
      message('Anslutningen avbröts eller tog för lång tid. Leveransstatus är okänd – skicka inte igen utan kontroll.','error');
    } finally {pending = false;}
  });
}
