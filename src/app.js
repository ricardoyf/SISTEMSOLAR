import { BODIES, QUESTIONS, MISSIONS } from './data.js';
import { createSolarScene } from './scene.js';
import { initCompare } from './compare.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const nf = new Intl.NumberFormat('es-ES', {maximumFractionDigits: 1});
const integer = new Intl.NumberFormat('es-ES', {maximumFractionDigits: 0, useGrouping: true});
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getBody = id => BODIES.find(b => b.id === id) || BODIES.find(b => b.id === 'earth');
const storageKey = 'orbita-progress-v1';
const state = {selected:'earth', fact:0, paused:window.matchMedia('(prefers-reduced-motion: reduce)').matches, view:'explore', mission:0, activeMission:null, missionAnswers:{}, quiz:null, completed:[], best:0, storageAvailable:true};
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
  state.completed = Array.isArray(stored.completed) ? stored.completed.filter(id => MISSIONS.some(m => m.id === id)) : [];
  state.best = Number.isFinite(stored.best) ? Math.max(0, Math.min(QUESTIONS.length, stored.best)) : 0;
} catch { state.storageAvailable = false; }
function saveProgress() { try { localStorage.setItem(storageKey, JSON.stringify({completed:state.completed,best:state.best})); } catch {state.storageAvailable=false;} updateProgress(); }
let toastTimer;
function toast(message) { $('#toast').textContent=message; $('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),5000); }
let solar = null;
let compare = null;
function showView(view, scroll = true) {
  state.view = view;
  ['explore','compare','learn'].forEach(v => { $(`#${v}-view`).hidden=v!==view; });
  $$('.nav-tab').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if(view==='compare') { if(!compare) compare=initCompare($('#compare-container'),BODIES,{onExplore:id=>{showView('explore');selectBody(id);}});else compare.refresh(); }
  if(view==='explore') requestAnimationFrame(()=>solar?.resize());
  if(scroll) window.scrollTo({top:0,behavior:'auto'});
}
function planetArt(body, extra='') { return `<span class="planet-art art-${body.id} ${extra}" style="--planet-color:${body.color}" aria-hidden="true"></span>`; }
function orbitalText(body) {
  if(body.type==='star') return 'Una estrella';
  if(body.id==='moon') return '27,3 <small>días / Tierra</small>';
  return body.orbitDays>1000 ? `${nf.format(body.orbitDays/365.256)} <small>años terrestres</small>` : `${nf.format(body.orbitDays)} <small>días terrestres</small>`;
}
function rotationText(body){ const hours=Math.abs(body.rotationHours);return hours>=48?`${nf.format(hours/24)} <small>días</small>`:`${nf.format(hours)} <small>horas</small>`; }
function renderInspector() {
  const b=getBody(state.selected),index=BODIES.filter(x=>!['star','moon'].includes(x.type)).findIndex(x=>x.id===b.id);
  const distance=b.type==='star'?'Centro del sistema':b.id==='moon'?'384.400 <small>km de la Tierra</small>':`${nf.format(b.distanceAU)} <small>UA del Sol</small>`;
  const facts=b.facts||[];
  const fact=facts[state.fact%facts.length];
  $('#inspector').innerHTML=`<div class="inspector-top"><span class="body-kind">${esc(b.kind)}</span><span class="body-index">${b.type==='star'?'NUESTRA ESTRELLA':b.id==='moon'?'SATÉLITE NATURAL':String(index+1).padStart(2,'0')+' / 08'}</span></div>
    <div class="inspector-title">${planetArt(b)}<div><h2>${esc(b.name)}</h2><p>${esc(b.tagline)}</p></div></div><p class="body-description">${esc(b.description)}</p>
    <dl class="body-stats"><div class="stat"><dt>Diámetro medio</dt><dd>${integer.format(b.radiusKm*2)} <small>km</small></dd></div><div class="stat"><dt>${b.type==='star'?'Tipo de objeto':'Una vuelta completa'}</dt><dd>${orbitalText(b)}</dd></div><div class="stat"><dt>Distancia media</dt><dd>${distance}</dd></div><div class="stat"><dt>${b.type==='star'?'Rotación de referencia':'Rotación sidérea'}</dt><dd>${rotationText(b)}${b.rotationHours<0?'<small> · retrógrada</small>':''}</dd></div></dl>
    <div class="fact-heading"><span class="fact-label">MIRA UN POCO MÁS ALLÁ</span><div class="fact-navigation"><button id="prev-fact" aria-label="Dato anterior">‹</button><span>${state.fact+1} / ${facts.length}</span><button id="next-fact" aria-label="Siguiente dato">›</button></div></div><div class="fact-box" aria-live="polite"><h3>${esc(fact.title)}</h3><p>${esc(fact.text)}</p></div>
    <details class="learn-question"><summary>${esc(b.learn.question)}</summary><p>${esc(b.learn.answer)}</p></details><div class="inspector-actions"><button class="small-button" id="compare-selected">Comparar mundos ↗</button><a href="${esc(b.source)}" target="_blank" rel="noopener noreferrer">Fuente NASA ↗</a></div>`;
  $('#prev-fact').addEventListener('click',()=>{state.fact=(state.fact-1+facts.length)%facts.length;renderInspector();$('#prev-fact').focus({preventScroll:true});});
  $('#next-fact').addEventListener('click',()=>{state.fact=(state.fact+1)%facts.length;renderInspector();$('#next-fact').focus({preventScroll:true});});
  $('#compare-selected').addEventListener('click',()=>{showView('compare');compare?.setMode?.('sizes');compare?.setPair?.('earth',b.id==='earth'?'jupiter':b.id);});
  $$('.planet-button').forEach(el=>{const active=el.dataset.id===b.id;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
}
function selectBody(id, focus=true){state.selected=id;state.fact=0;renderInspector();$('#inspector').scrollTop=0;if(focus)solar?.select(id);}
$('#planet-nav').innerHTML=BODIES.map(b=>`<button class="planet-button" data-id="${b.id}" aria-label="Explorar ${b.name}" aria-pressed="false">${planetArt(b)}<span>${b.name}</span><span class="planet-subtitle">${b.type==='star'?'Estrella':b.type==='moon'?'Satélite':b.type==='rocky'?'Rocoso':b.type==='gas'?'Gaseoso':'De hielo'}</span></button>`).join('');
$('#planet-nav').addEventListener('click',e=>{const button=e.target.closest('.planet-button');if(button)selectBody(button.dataset.id);});
renderInspector();

function updatePause(){ $('#pause-button').setAttribute('aria-pressed',String(state.paused));$('#pause-button').setAttribute('aria-label',state.paused?'Reanudar simulación':'Pausar simulación');$('#play-icon').textContent=state.paused?'▶':'Ⅱ'; }
function togglePause(){state.paused=!state.paused;solar?.setPaused(state.paused);updatePause();}
$('#pause-button').addEventListener('click',togglePause);
$('#speed-select').addEventListener('change',e=>solar?.setSpeed(Number(e.target.value)));
$('#labels-toggle').addEventListener('change',e=>solar?.setLabels(e.target.checked));
$('#orbits-toggle').addEventListener('change',e=>solar?.setOrbits(e.target.checked));
$('#zoom-in').addEventListener('click',()=>solar?.zoom(0.78));
$('#zoom-out').addEventListener('click',()=>solar?.zoom(1.28));
let topView=false;
$('#top-view').addEventListener('click',()=>{topView=!topView;solar?.setView(topView?'top':'perspective');$('#top-view').setAttribute('aria-pressed',String(topView));$('#top-view').setAttribute('aria-label',topView?'Vista inclinada':'Vista desde arriba');});
$('#overview-button').addEventListener('click',()=>{solar?.select(null);solar?.setView(topView?'top':'perspective');});
$('#restart-time').addEventListener('click',()=>{solar?.reset();state.paused=solar?.getState()?.paused??state.paused;updatePause();toast('El tiempo vuelve a cero. Empieza otra observación.');});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&state.view==='explore'&&!$('#help-dialog').open&&!e.target.closest('button,input,select,textarea,a,summary,[contenteditable]')){e.preventDefault();togglePause();}});
updatePause();
function ready(){ $('#scene-loading').hidden=true; }
function sceneError(error){ready();$('#scene-error').hidden=false;console.warn('Vista 3D no disponible:',error?.message||error);['pause-button','speed-select','labels-toggle','orbits-toggle','zoom-in','zoom-out','top-view','overview-button','restart-time'].forEach(id=>$('#'+id).disabled=true);}
try { solar=createSolarScene({container:$('#solar-scene'),bodies:BODIES,onSelect:id=>selectBody(id,false),onTick:info=>{ $('#elapsed-days').textContent=integer.format(info.days); if(state.paused!==info.paused){state.paused=info.paused;updatePause();} },onReady:ready,onError:sceneError}); } catch(error){sceneError(error);}

function updateProgress(){ $('#saved-progress').textContent=`${state.completed.length} de ${MISSIONS.length} misiones completadas${state.storageAvailable?' · Guardado en este navegador':' · Progreso solo durante esta visita'}`; }
function renderMissionBanner(){ $('.mission-banner')?.remove(); if(state.activeMission===null)return; const m=MISSIONS[state.activeMission]; if(state.completed.includes(m.id))return;const box=document.createElement('div');box.className='mission-banner';box.innerHTML=`<span><strong>Misión activa:</strong> ${esc(m.title)}</span><button class="text-button" id="back-mission">Volver a la pregunta ↗</button>`;$('.explorer-layout').before(box);$('#back-mission').addEventListener('click',()=>{state.mission=state.activeMission;renderMissions();showView('learn');setLearningTab('missions');}); }
function renderMissions(){
  const m=MISSIONS[state.mission],answer=state.missionAnswers[m.id];
  $('#missions-panel').innerHTML=`<div class="mission-cards">${MISSIONS.map((x,i)=>`<button class="mission-card ${i===state.mission?'active':''}" data-mission="${i}" aria-pressed="${i===state.mission}"><span class="mission-index">MISIÓN ${String(i+1).padStart(2,'0')}</span>${state.completed.includes(x.id)?'<span class="mission-check" aria-label="Completada">✓</span>':''}<strong>${esc(x.title)}</strong><small>${state.completed.includes(x.id)?'Completada · puedes repetirla':'Observar · pensar · descubrir'}</small></button>`).join('')}</div><article class="mission-stage"><div class="mission-intro"><p class="eyebrow">TU PRÓXIMO DESCUBRIMIENTO</p><h2>${esc(m.title)}</h2><p>${esc(m.description)}</p><button class="primary-button" id="observe-mission">${m.bodyId==='scale'?'Abrir el comparador':'Ir a observar'} <span>↗</span></button></div><div class="mission-question"><h3>${esc(m.question)}</h3><div class="answer-list">${m.choices.map((c,i)=>`<button class="answer-button ${answer!==undefined?(i===m.answer?'correct':i===answer?'wrong':'faded'):''}" data-mission-answer="${i}" ${answer!==undefined?'disabled':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${esc(c)}${answer!==undefined&&i===m.answer?' ✓':''}</span></button>`).join('')}</div><div id="mission-feedback" aria-live="polite">${answer!==undefined?missionFeedback(m,answer):''}</div></div></article>`;
  $$('.mission-card').forEach(button=>button.addEventListener('click',()=>{state.mission=Number(button.dataset.mission);renderMissions();$(`[data-mission="${state.mission}"]`).focus({preventScroll:true});}));
  $('#observe-mission').textContent=m.id==='empty-space'?'Abrir el comparador ↗':'Ir a observar ↗';
  $('#observe-mission').addEventListener('click',()=>{state.activeMission=state.mission;renderMissionBanner();if(m.id==='empty-space'){showView('compare');compare?.setMode?.('distances');}else{showView('explore');selectBody(m.bodyId);toast('Observa con calma. Después vuelve a Misiones para responder.');}});
  $$('[data-mission-answer]').forEach(button=>button.addEventListener('click',()=>{const answer=Number(button.dataset.missionAnswer);state.missionAnswers[m.id]=answer;if(answer===m.answer&&!state.completed.includes(m.id)){state.completed.push(m.id);saveProgress();}renderMissions();renderMissionBanner();}));
  $('#retry-mission')?.addEventListener('click',()=>{delete state.missionAnswers[m.id];renderMissions();});
  $('#next-mission')?.addEventListener('click',()=>{state.mission=(state.mission+1)%MISSIONS.length;renderMissions();});
  updateProgress();
}
function missionFeedback(m,answer){const right=answer===m.answer;return `<div class="answer-feedback ${right?'':'wrong'}" role="status"><strong>${right?'¡Lo has descubierto!':'Buena pregunta para seguir pensando.'}</strong>${esc(m.explanation)}<br><button class="text-button" id="${right?'next-mission':'retry-mission'}">${right?'Siguiente misión ↗':'Volver a intentarlo ↻'}</button></div>`;}
function setLearningTab(tab){ $$('[data-learn-tab]').forEach(b=>{const active=b.dataset.learnTab===tab;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$('#missions-panel').hidden=tab!=='missions';$('#quiz-panel').hidden=tab!=='quiz'; }
$$('[data-learn-tab]').forEach(b=>b.addEventListener('click',()=>setLearningTab(b.dataset.learnTab)));
renderMissions();

function startQuiz(){const order=QUESTIONS.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}state.quiz={order,index:0,answers:[],finished:false};renderQuiz();}
function quizScore(){return state.quiz.answers.reduce((sum,a,i)=>sum+(a===QUESTIONS[state.quiz.order[i]].answer?1:0),0);}
function renderQuiz(){
  const root=$('#quiz-panel'),qstate=state.quiz;
  if(!qstate){root.innerHTML=`<div class="quiz-intro"><div class="quiz-symbol" aria-hidden="true">?</div><div><p class="eyebrow">UN RETO DE CURIOSIDAD</p><h2>¿Qué has descubierto?</h2><p>${QUESTIONS.length} preguntas, sin cronómetro. Después de cada respuesta encontrarás una explicación. Puedes explorar y volver al reto cuando quieras.</p>${state.best?`<p>Tu mejor resultado en este navegador: <strong>${state.best} / ${QUESTIONS.length}</strong></p>`:''}<button class="primary-button" id="start-quiz">Empezar el reto ↗</button></div></div>`;$('#start-quiz').addEventListener('click',startQuiz);return;}
  if(qstate.finished){const score=quizScore();root.innerHTML=`<div class="quiz-card quiz-result"><p class="eyebrow">HAS TERMINADO EL VIAJE</p><div class="quiz-score">${score}<span> / ${QUESTIONS.length}</span></div><h2>${score===QUESTIONS.length?'Una mirada muy curiosa.':score>=QUESTIONS.length*.6?'Cada vez ves más lejos.':'Cada pregunta es un comienzo.'}</h2><p>Lo valioso es entender por qué. Revisa las explicaciones y vuelve a explorar.</p><p>Mejor resultado en este navegador: ${state.best} / ${QUESTIONS.length}</p><button class="primary-button" id="repeat-quiz">Hacer otro intento ↻</button><div class="quiz-review"><p class="eyebrow">REPASA TUS DESCUBRIMIENTOS</p>${qstate.order.map((idx,i)=>{const q=QUESTIONS[idx],correct=qstate.answers[i]===q.answer;return `<details><summary><span class="${correct?'correct-mark':''}">${correct?'✓':'○'}</span> ${esc(q.question)}</summary><p><strong>Respuesta:</strong> ${esc(q.choices[q.answer])}</p><p>${esc(q.explanation)}</p></details>`;}).join('')}</div></div>`;$('#repeat-quiz').addEventListener('click',startQuiz);return;}
  const q=QUESTIONS[qstate.order[qstate.index]],answer=qstate.answers[qstate.index],right=answer===q.answer;
  root.innerHTML=`<div class="quiz-card"><div class="quiz-top"><span>PREGUNTA ${String(qstate.index+1).padStart(2,'0')} / ${QUESTIONS.length}</span><span>${quizScore()} ${quizScore()===1?'acierto':'aciertos'} · Sin prisa</span></div><div class="quiz-progress"><span style="width:${qstate.index/QUESTIONS.length*100}%"></span></div><h2>${esc(q.question)}</h2><div class="answer-list">${q.choices.map((c,i)=>`<button class="answer-button ${answer!==undefined?(i===q.answer?'correct':i===answer?'wrong':'faded'):''}" data-quiz-answer="${i}" ${answer!==undefined?'disabled':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${esc(c)}${answer!==undefined&&i===q.answer?' ✓':''}</span></button>`).join('')}</div><div aria-live="polite">${answer!==undefined?`<div class="answer-feedback ${right?'':'wrong'}"><strong>${right?'¡Exacto!':'Aquí está la clave.'}</strong>${esc(q.explanation)}</div><div class="quiz-actions"><button class="primary-button" id="next-question">${qstate.index===QUESTIONS.length-1?'Ver mis descubrimientos':'Siguiente pregunta'} ↗</button></div>`:''}</div></div>`;
  $$('[data-quiz-answer]').forEach(button=>button.addEventListener('click',()=>{if(qstate.answers[qstate.index]!==undefined)return;qstate.answers[qstate.index]=Number(button.dataset.quizAnswer);renderQuiz();$('#next-question')?.focus({preventScroll:true});}));
  $('#next-question')?.addEventListener('click',()=>{if(qstate.index===QUESTIONS.length-1){qstate.finished=true;state.best=Math.max(state.best,quizScore());saveProgress();}else qstate.index++;renderQuiz();});
}
renderQuiz();

document.addEventListener('click',e=>{const trigger=e.target.closest('[data-go]');if(trigger)showView(trigger.dataset.go);});
$$('.nav-tab').forEach(button=>button.addEventListener('click',()=>showView(button.dataset.view)));
$('.brand').addEventListener('click',e=>{e.preventDefault();showView('explore');});
const dialog=$('#help-dialog');
['help-button','sources-button','scale-info'].forEach(id=>$('#'+id).addEventListener('click',()=>dialog.showModal()));
['close-help','help-done'].forEach(id=>$('#'+id).addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
let clearArmed=false;
$('#clear-progress').addEventListener('click',()=>{if(!clearArmed){clearArmed=true;$('#clear-progress').textContent='Confirmar: borrar misiones y mejor resultado';return;}try{localStorage.removeItem(storageKey);}catch{}state.completed=[];state.best=0;state.missionAnswers={};state.quiz=null;clearArmed=false;$('#clear-progress').textContent='Borrar mi progreso local';$('#clear-result').textContent='Progreso borrado en este navegador.';renderMissions();renderQuiz();renderMissionBanner();});
dialog.addEventListener('close',()=>{clearArmed=false;$('#clear-progress').textContent='Borrar mi progreso local';});
window.addEventListener('pagehide',()=>{clearTimeout(toastTimer);});
