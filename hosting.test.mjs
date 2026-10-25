import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from './server.mjs';
test('hosting health check returns no room or credential data',async()=>{
  const server=createServer();
  try{
    const result=await new Promise(resolve=>{
      let status,headers;
      server.emit('request',{url:'/healthz',method:'GET',headers:{}},{headersSent:false,
        writeHead(s,h){status=s;headers=h;},end(body){resolve({status,headers,body:JSON.parse(body)});}});
    });
    assert.equal(result.status,200);assert.deepEqual(result.body,{status:'ok'});
    assert.equal(result.headers['Cache-Control'],'no-store');
  }finally{await new Promise(resolve=>server.close(()=>resolve()));}
});
