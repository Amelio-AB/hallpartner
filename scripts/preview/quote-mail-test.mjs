/** Real PHPMailer against loopback SMTP only. No external mail, credentials or customers. */
import assert from 'node:assert/strict';
import { createServer } from 'node:net';
import { spawn } from 'node:child_process';

const decode = message => message.replace(/=\r\n/g,'').replace(/=([0-9A-F]{2})/g,(_,hex)=>String.fromCharCode(parseInt(hex,16)));
for (const mode of ['accepted','copy-rejected','copy-disconnected','copy-timeout','primary-rejected','contact']) {
  const messages=[]; let connections=0;
  const sockets=new Set();
  const server=createServer(socket=>{
    sockets.add(socket);socket.on('close',()=>sockets.delete(socket));socket.on('error',()=>{});
    const index=connections++;
    const message={from:'',to:[],data:''}; messages.push(message);
    let buffer='',data=false;
    socket.write('220 loopback test SMTP\r\n');
    socket.on('data',chunk=>{
      buffer+=chunk.toString();
      while(buffer.includes('\r\n')){
        const end=buffer.indexOf('\r\n'), line=buffer.slice(0,end);buffer=buffer.slice(end+2);
        if(data){
          if(line!=='.'){message.data+=line+'\r\n';continue;}
          data=false;
          if(index===1 && mode==='copy-disconnected'){socket.destroy();return;}
          if(index===1 && mode==='copy-timeout')return;
          socket.write('250 accepted\r\n');continue;
        }
        if(/^(EHLO|HELO)/.test(line))socket.write('250 loopback\r\n');
        else if(line.startsWith('MAIL FROM:')){message.from=line;socket.write('250 OK\r\n');}
        else if(line.startsWith('RCPT TO:')){
          message.to.push(line);
          socket.write((mode==='primary-rejected'||(index===1&&mode==='copy-rejected'))?'550 rejected\r\n':'250 OK\r\n');
        }else if(line==='DATA'){data=true;socket.write('354 send data\r\n');}
        else if(line==='QUIT'){socket.end('221 bye\r\n');}
        else socket.write('250 OK\r\n');
      }
    });
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try{
    const args=['tests/fixtures/lead-delivery.php',String(server.address().port),
      mode==='contact'?'hallpartner-contact-v1':'hallpartner-offert-v2-review'];
    const child=spawn(process.env.HP_PHP||'php',args,{stdio:['ignore','pipe','pipe']});
    let out='',err='';child.stdout.on('data',b=>out+=b);child.stderr.on('data',b=>err+=b);
    const timer=setTimeout(()=>child.kill(),20000);
    const code=await new Promise((resolve,reject)=>{child.on('error',reject);child.on('exit',resolve);});
    clearTimeout(timer);assert.equal(code,0,err);
    const result=JSON.parse(out);
    assert.equal(result.status,mode==='primary-rejected'?'unknown':'success',mode+': '+err);
    assert.equal(connections,['primary-rejected','contact'].includes(mode)?1:2,'no automatic retry');
    assert.deepEqual(messages[0].to,['RCPT TO:<internal@example.invalid>']);
    if(connections===2){
      assert.equal(result.customerCopy,mode==='accepted'?'accepted':'unconfirmed');
      assert.equal(result.requestId,'1234567890abcdef12345678');
      assert.deepEqual(messages[1].to,['RCPT TO:<visitor@example.invalid>']);
      assert.equal(messages[1].from,'MAIL FROM:<sender@example.invalid>');
      if(messages[1].data){
        const mail=decode(messages[1].data);
        assert.match(mail,/Lager eller f/);
        assert.doesNotMatch(mail,/private-host|private-user|private-password|X-Mailer:|storage|need_help/);
        assert.match(mail,/Reply-To: Amelio <internal@example.invalid>/);
        assert.match(mail,/1234567890abcdef12345678/);
        assert.match(mail,/Teststad/);
        assert.doesNotMatch(mail,/Adress eller fastighetsbeteckning|Sidoh/,'inactive/unanswered fields excluded');
        assert.match(mail,/ingen prisuppgift, bindande offert/);
      }
    } else assert.equal(result.customerCopy,undefined);
    console.log('LOOPBACK SMTP PASS: '+mode+'; connections='+connections);
  }finally{
    for(const socket of sockets)socket.destroy();
    await new Promise(resolve=>server.close(resolve));
  }
}
