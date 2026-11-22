const KEY='cst_path_v1';
let done=new Set(JSON.parse(localStorage.getItem(KEY)||'[]'));
let cur=0;
const S=window.SESSIONS;
const parts=[...new Set(S.map(s=>s.part))];

function toc(){
  const el=document.getElementById('toc');
  el.innerHTML='';
  parts.forEach(p=>{
    const h=document.createElement('div'); h.className='part'; h.textContent=p; el.appendChild(h);
    S.filter(s=>s.part===p).forEach(s=>{
      const b=document.createElement('button');
      b.className='item'+(s.id-1===cur?' on':'')+(done.has(s.id)?' done':'');
      b.innerHTML=`<span class="n">${String(s.id).padStart(2,'0')}</span><span>${s.title}</span>`;
      b.onclick=()=>{cur=s.id-1;render();window.scrollTo({top:0,behavior:'smooth'});};
      el.appendChild(b);
    });
  });
}
function bar(){document.getElementById('bar').style.width=(done.size/S.length*100)+'%';}
function render(){
  const s=S[cur];
  document.getElementById('main').innerHTML=`
    <p class="kicker">Session ${s.id} of ${S.length} · ${s.part}</p>
    <h1>${s.title}</h1>
    <p class="purpose">${s.purpose}</p>
    <div class="remember"><small>Remember this</small><p>${s.remember}</p></div>
    ${s.body.map(p=>`<p>${p}</p>`).join('')}
    <div class="block"><h3>Questions to sit with</h3><ol>${s.questions.map(q=>`<li>${q}</li>`).join('')}</ol></div>
    <div class="block"><h3>A case</h3><p>${s.caseNote}</p></div>
    <div class="block"><h3>What this is not</h3><div class="notthis">${s.notThis}</div></div>
    <div class="nav">
      <button class="btn" id="prev" ${cur===0?'disabled':''}>← Previous</button>
      <button class="btn" id="next">${done.has(s.id)?'Next →':'Mark read · next →'}</button>
    </div>`;
  document.getElementById('prev').onclick=()=>{if(cur>0){cur--;render();window.scrollTo({top:0});}};
  document.getElementById('next').onclick=()=>{
    done.add(s.id); localStorage.setItem(KEY,JSON.stringify([...done]));
    if(cur<S.length-1){cur++;render();window.scrollTo({top:0});}else{render();}
    toc();bar();
  };
  toc();bar();
}
document.getElementById('reset').onclick=()=>{done=new Set();localStorage.setItem(KEY,'[]');cur=0;render();};
render();
