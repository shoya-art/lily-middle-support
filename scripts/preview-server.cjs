// Serve only public frontend files. Never serve ignored files, scripts or backend secrets.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const api=process.argv[2];
http.createServer((request,response)=>{
  const pathname=new URL(request.url,'http://127.0.0.1').pathname;
  const file=pathname==='/'?'index.html':pathname.slice(1);
  if(!/^[a-z0-9-]+\.(html|js|css|png)$/.test(file)&&file!=='archives/003.json'){response.writeHead(404);response.end();return;}
  try{
    let body=fs.readFileSync(path.join(base,file));
    if(file==='work-sync-config.js'&&api)body=Buffer.from(body.toString().replace('https://lily-middle-work-api.jiro-threads-v2.workers.dev',api));
    const type={html:'text/html',js:'text/javascript',css:'text/css',png:'image/png',json:'application/json'}[file.split('.').pop()];
    response.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});response.end(body);
  }catch{response.writeHead(404);response.end();}
}).listen(3012,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:3012/'));
