const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const MIME = {'.html':'text/html;charset=utf-8','.css':'text/css;charset=utf-8','.js':'application/javascript;charset=utf-8'};
http.createServer((req,res)=>{
  let p = decodeURIComponent((req.url||'/').split('?')[0]);
  if(p==='/'||p==='') p='/index.html';
  const file = path.join(ROOT, p);
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404);res.end('Not Found');return;}
    res.writeHead(200,{'Content-Type':MIME[path.extname(file).toLowerCase()]||'text/plain'});
    res.end(data);
  });
}).listen(PORT,'0.0.0.0');
