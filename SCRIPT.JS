let isDegree = false;

function toggleMode(){
  isDegree = !isDegree;
  document.getElementById('modeBtn').textContent = isDegree ? "Mode: DEG" : "Mode: RAD";
}

function clearResult(){
  document.getElementById("result").value="";
}
function deleteChar(){
  let res=document.getElementById("result");
  res.value=res.value.slice(0,-1);
}
function appendValue(val){
  document.getElementById("result").value+=val;
}
function calculate(){
  let res=document.getElementById("result");
  let expr=res.value;
  expr=expr.replace(/(\d+)!/g,function(match,num){
    return factorial(parseInt(num));
  });
  expr=expr.replace(/(\d+)²/g,"Math.pow($1,2)");
  expr=expr.replace(/(\d+)³/g,"Math.pow($1,3)");
  let ans=safeEvaluate(expr);
  res.value=isNaN(ans) ? "Error" : ans;
}
function factorial(n){
  if(n<0) return NaN;
  if(n===0||n===1) return 1;
  let f=1;
  for(let i=2;i<=n;i++) f*=i;
  return f;
}
function safeEvaluate(expr){
  if(!expr||expr.trim()==='') return 0;
  expr=expr.replace(/π/g,'Math.PI');
  expr=expr.replace(/\be\b/g,'Math.E');
  expr=expr.replace(/×/g,'*').replace(/÷/g,'/');
  expr=expr.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g,'Math.pow($1,$2)');
  expr=expr.replace(/\(([^()]*)\)\s*\^\s*(\d+(?:\.\d+)?)/g,'Math.pow(($1),$2)');
  if(isDegree){
    expr=expr.replace(/\bsin\(([^()]*)\)/g,'Math.sin(($1)*Math.PI/180)');
    expr=expr.replace(/\bcos\(([^()]*)\)/g,'Math.cos(($1)*Math.PI/180)');
    expr=expr.replace(/\btan\(([^()]*)\)/g,'Math.tan(($1)*Math.PI/180)');
  } else {
    expr=expr.replace(/\bsin\(/g,'Math.sin(');
    expr=expr.replace(/\bcos\(/g,'Math.cos(');
    expr=expr.replace(/\btan\(/g,'Math.tan(');
  }
  expr=expr.replace(/\bln\(/g,'Math.log(');
  expr=expr.replace(/\blog\(/g,'Math.log10(');
  expr=expr.replace(/√\(([^()]*)\)/g,'Math.sqrt($1)');
  expr=expr.replace(/∛\(([^()]*)\)/g,'Math.cbrt($1)');
  expr=expr.replace(/(\d+(\.\d+)?)%/g,'($1/100)');
  try{
    let fn=new Function('return ('+expr+');');
    let res=fn();
    if(Object.is(res,-0)) res=0;
    if(typeof res==='number' && isFinite(res)){
      res=Math.round((res+Number.EPSILON)*1e12)/1e12;
    }
    return res;
  } catch(err){
    return NaN;
  }
}
