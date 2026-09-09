const {test}=require('node:test');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
function php(file,...args){return execFileSync('php',['-d','xdebug.mode=off',file,...args],{encoding:'utf8'});}
test('validação de configurações no WordPress',()=>assert.match(php('tests/settings.php'),/PASS:/));
test('resolução de áudio e restrições de acesso',()=>assert.match(php('tests/download.php'),/PASS:/));
test('download entrega bytes e rejeita HTML/nonce inválido',()=>{
 assert.equal(php('tests/download.php','success'),'ID3-test-audio');
 for(const mode of ['html','nonce'])assert.equal(JSON.parse(php('tests/download.php',mode)).success,false);
});
