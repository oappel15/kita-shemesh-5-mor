/* Kita · מערכת השמש – deck controller: navigation (keys, clicks, swipe), timer, teacher notes (code 1010), tasks. */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s);},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var PFX="kitaShm5";
var slides=$$(".slide"),cur=-1,N=slides.length;
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var bc=null;try{bc=new BroadcastChannel("kita-shemesh-5");}catch(e){}
var S=window.KitaSolar,B=S.BODIES,ORDER=S.ORDER;
var instances={};

/* ---------- navigation ---------- */
function idx(key){if(key==null)return -1;var n=parseInt(key,10);if(String(n)===String(key))return Math.max(0,Math.min(N-1,n-1));for(var i=0;i<N;i++)if(slides[i].id===key)return i;return -1;}
function go(i,opts){
  i=Math.max(0,Math.min(N-1,i));if(i===cur)return;
  slides.forEach(function(s,k){var on=k===i;s.classList.toggle("active",on);s.setAttribute("aria-hidden",on?"false":"true");if(on){s.removeAttribute("inert");}else{s.setAttribute("inert","");}});
  cur=i;var s=slides[i];
  $("#counter").textContent=(i+1)+" / "+N;$("#bar").style.width=((i+1)/N*100)+"%";
  $("#prev").disabled=i===0;$("#next").disabled=i===N-1;
  $("#phase").textContent=s.getAttribute("data-phase")||"";
  $("#announce").textContent="שקופית "+(i+1)+" מתוך "+N+": "+(s.getAttribute("aria-label")||"");
  try{history.replaceState(null,"","#"+s.id);}catch(e){}
  s.scrollTop=0;
  timerSlide();
  Object.keys(instances).forEach(function(k){var inst=instances[k];inst.setActive(slides[i].contains(inst.c));});
  if(s.id==="anim"&&!reduce&&!go.autoplayed){go.autoplayed=true;instances["solar-main"].play();}
  renderNotes();
  try{localStorage.setItem(PFX+"Slide",s.id);}catch(e){}
  if(bc)bc.postMessage({slide:s.id,n:i+1});
}
function next(){go(cur+1);}function prev(){go(cur-1);}
$("#next").addEventListener("click",next);$("#prev").addEventListener("click",prev);
document.addEventListener("keydown",function(e){
  if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey)return;
  if($("#gate").open)return;
  var t=e.target,tag=(t.tagName||"").toLowerCase();
  if(tag==="input"||tag==="textarea"||tag==="select"||t.isContentEditable)return;
  var onCtrl=tag==="button"||tag==="a"||tag==="summary";
  switch(e.key){
    case "ArrowRight":case "ArrowDown":case "PageDown":next();e.preventDefault();break;
    case "ArrowLeft":case "ArrowUp":case "PageUp":prev();e.preventDefault();break;
    case " ":case "Enter":if(onCtrl)return;next();e.preventDefault();break;
    case "Home":go(0);e.preventDefault();break;
    case "End":go(N-1);e.preventDefault();break;
    case "f":case "F":case "כ":toggleFS();break;
    case "n":case "N":case "מ":openNotes();break;
  }
});
var NONAV="button,a,input,label,select,textarea,canvas,summary,details,table,.opt,.chip,.ctrls,.factcard,.agecalc,.quiz,[data-nonav]";
$("#deck").addEventListener("click",function(e){
  var pt=e.pointerType;if(pt&&pt!=="mouse")return;
  if(e.target.closest(NONAV))return;
  var sel=window.getSelection&&getSelection();if(sel&&!sel.isCollapsed)return;
  next();
});
var tx=null,ty=0,tt=0;
$("#deck").addEventListener("touchstart",function(e){var t=e.target;if(t.closest("canvas,input,.opts,.ctrls")){tx=null;return;}tx=e.touches[0].clientX;ty=e.touches[0].clientY;tt=Date.now();},{passive:true});
$("#deck").addEventListener("touchend",function(e){if(tx==null)return;var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=null;
  if(Math.abs(dx)>50&&Math.abs(dx)>1.5*Math.abs(dy)&&Date.now()-tt<900){if(dx>0)next();else prev();}},{passive:true});
document.addEventListener("click",function(e){var a=e.target.closest("[data-goto]");if(!a)return;var i=idx(a.getAttribute("data-goto"));if(i>=0){e.preventDefault();go(i);}});
addEventListener("hashchange",function(){var i=idx(location.hash.slice(1));if(i>=0)go(i);});
/* fullscreen */
function toggleFS(){try{if(!document.fullscreenElement){document.documentElement.requestFullscreen();}else{document.exitFullscreen();}}catch(e){}}
$("#fs-btn").addEventListener("click",toggleFS);
if(!document.documentElement.requestFullscreen)$("#fs-btn").hidden=true;

/* ---------- timer ---------- */
var tLeft=0,tRun=null,tBtn=$("#timer-btn"),tOut=$("#timer-out");
function fmt(sec){sec=Math.max(0,Math.round(sec));return Math.floor(sec/60)+":"+("0"+sec%60).slice(-2);}
function timerSlide(){if(tRun)return;var m=parseFloat(slides[cur].getAttribute("data-min")||"0");tLeft=m*60;tOut.textContent=fmt(tLeft);tBtn.classList.remove("done");tBtn.disabled=!m;tBtn.setAttribute("aria-label",m?("הפעלת שעון של "+m+" דקות לשלב"):"אין שעון בשקופית הזו");}
tBtn.addEventListener("click",function(){
  if(tRun){clearInterval(tRun);tRun=null;tBtn.classList.remove("running");return;}
  if(tLeft<=0)timerSlide();var end=Date.now()+tLeft*1000;tBtn.classList.add("running");tBtn.classList.remove("done");
  tRun=setInterval(function(){tLeft=(end-Date.now())/1000;tOut.textContent=fmt(tLeft);if(tLeft<=0){clearInterval(tRun);tRun=null;tBtn.classList.remove("running");tBtn.classList.add("done");}},250);
});
$("#timer-reset").addEventListener("click",function(){if(tRun){clearInterval(tRun);tRun=null;}tBtn.classList.remove("running","done");timerSlide();});

/* ---------- reveal buttons ---------- */
$$("[data-reveal]").forEach(function(b){b.addEventListener("click",function(){var box=document.getElementById(b.getAttribute("data-reveal")),open=box.hidden;box.hidden=!open;b.setAttribute("aria-expanded",open?"true":"false");});});

/* ---------- solar system instances ---------- */
function factHTML(id){
  var b=B[id],h="<h3>"+b.he+"</h3><p class=\"ftype\">"+b.type+"</p><dl><div><dt>קוטר</dt><dd>"+b.diam+"</dd></div>";
  if(id!=="sun")h+="<div><dt>מרחק מהשמש</dt><dd>"+b.dist+"</dd></div><div><dt>שנה (הקפה אחת)</dt><dd>"+b.year+"</dd></div>";
  h+="<div><dt>סיבוב סביב הציר</dt><dd>"+b.day+"</dd></div>";if(id!=="sun")h+="<div><dt>ירחים</dt><dd>"+b.moons+"</dd></div>";
  return h+"</dl><p class=\"fun\">💡 "+b.fact+"</p>";
}
function spdText(inst){var s=inst.speed(),sec=S.SEC_PER_YEAR/s;return "×"+s+" · שנה = "+(sec>=1?Math.round(sec*10)/10:sec.toFixed(2))+" שנ׳";}
function wire(id,opts){
  var cv=document.getElementById(id);if(!cv)return;var inst=new S.SolarSystem(cv,opts);instances[id]=inst;
  var grp=$("[data-ctrl=\""+id+"\"]"),slide=cv.closest(".slide");
  var playB=grp.querySelector("[data-act=play]"),spd=grp.querySelector("[data-act=speed]"),out=spd?document.getElementById(spd.getAttribute("aria-describedby")):null;
  function st(){if(playB){playB.textContent=inst.playing?"⏸ עצירה":"▶ הפעלה";playB.setAttribute("aria-pressed",inst.playing?"true":"false");}if(spd){spd.value=inst.speedIdx;spd.setAttribute("aria-valuetext",spdText(inst));out.textContent=spdText(inst);}}
  inst.on("state",st);st();
  var yb=slide.querySelector("[data-out=years]"),db=slide.querySelector("[data-out=days]");
  inst.on("time",function(){var y=inst.days/365.256;yb.textContent=y.toFixed(2);if(db)db.textContent=Math.round(inst.days).toLocaleString("he-IL");});
  grp.addEventListener("click",function(e){var b=e.target.closest("button[data-act]");if(!b)return;var a=b.getAttribute("data-act");
    if(a==="play")inst.toggle();
    else if(a==="reset"){inst.pause();inst.reset();}
    else if(a==="year"){if(opts.resetOnRun)inst.reset();if(opts.yearSpeed!=null)inst.setSpeedIdx(opts.yearSpeed);inst.runFor(365.256);}
    else if(a==="years12"){inst.reset();inst.setSpeedIdx(5);inst.runFor(12*365.256);}
  });
  if(spd)spd.addEventListener("input",function(){inst.setSpeedIdx(+spd.value);inst.draw();});
  $$("input[type=checkbox][data-act]",grp).forEach(function(c){c.addEventListener("change",function(){inst[c.getAttribute("data-act")]=c.checked;inst.draw();});});
  var chips=$("[data-chips=\""+id+"\"]"),card=document.getElementById("fact-"+id.split("-")[1]);
  if(chips){["sun"].concat(ORDER).forEach(function(pid){var c=document.createElement("button");c.type="button";c.className="chip";c.textContent=B[pid].he;c.setAttribute("aria-pressed","false");c.setAttribute("data-pid",pid);c.addEventListener("click",function(){inst.select(pid);});chips.appendChild(c);});}
  inst.on("select",function(pid){if(card)card.innerHTML=factHTML(pid);if(chips)$$(".chip",chips).forEach(function(c){c.setAttribute("aria-pressed",c.getAttribute("data-pid")===pid?"true":"false");});});
  inst.draw();return inst;
}
wire("solar-main",{labels:true,laps:false,speedIdx:2,stagger:true});
wire("solar-mini",{labels:true,laps:true,speedIdx:2,resetOnRun:true,yearSpeed:2,startAngle:Math.PI/2,fontScale:0.034});

/* ---------- sizes to scale ---------- */
$("#sizes-btn").addEventListener("click",function(){
  var R={mercury:2439.5,venus:6052,earth:6378,mars:3396,jupiter:71492,saturn:60268,uranus:25559,neptune:24764},sunR=696000;
  var W=1700,H=430,cy=200,k=150/71492,x=W-120,svg='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="כוכבי הלכת בגדלים יחסיים נכונים, וקצה השמש בצד ימין">';
  svg+='<circle cx="'+(W-120+sunR*k)+'" cy="'+cy+'" r="'+(sunR*k)+'" fill="#FFD86B"/><text x="'+(W-60)+'" y="'+(H-22)+'" fill="#5A3B00" font-size="26" text-anchor="middle" font-weight="700">השמש</text>';
  x-=40;
  ORDER.forEach(function(id){var r=R[id]*k,half=id==="saturn"?r*2.27:r;x-=half;var b=B[id];
    if(id==="saturn")svg+='<ellipse cx="'+x+'" cy="'+cy+'" rx="'+(r*2.27)+'" ry="'+(r*0.5)+'" fill="none" stroke="#F0DCA0" stroke-width="'+(r*0.3)+'" opacity=".85"/>';
    svg+='<circle cx="'+x+'" cy="'+cy+'" r="'+Math.max(r,1.5)+'" fill="'+b.c2+'" stroke="#fff" stroke-width="'+(r>20?2:1)+'"/>';
    var small=r<20,up=small&&(id==="venus"||id==="mars"),ly=up?(cy-Math.max(r,8)-16):(cy+Math.max(r,8)+(id==="saturn"?10:0)+34);
    svg+='<text x="'+x+'" y="'+ly+'" fill="#fff" font-size="26" text-anchor="middle" font-weight="700">'+b.he+'</text>';
    x-=half+(id==="mercury"||id==="venus"||id==="earth"?64:34);});
  svg+="</svg>";$("#sizes-stage").innerHTML=svg;$("#sizes-note").hidden=false;this.setAttribute("aria-expanded","true");
});

/* ---------- age calculator ---------- */
var YEARS={mercury:0.2408,venus:0.6152,earth:1,mars:1.8809,jupiter:11.862,saturn:29.457,uranus:84.01,neptune:164.8};
function ageCalc(){
  var a=parseFloat($("#age-in").value);if(!(a>0&&a<=120)){$("#age-in").focus();return;}
  var rows=ORDER.map(function(id){var v=a/YEARS[id],t=v>=1?(Math.round(v*10)/10).toLocaleString("he-IL"):v.toFixed(2)+" (עוד לא שנה אחת!)";return "<tr><td>"+B[id].he+"</td><td>"+B[id].year+"</td><td>"+t+"</td></tr>";});
  $("#age-table tbody").innerHTML=rows.join("");$("#age-table").hidden=false;
}
$("#age-go").addEventListener("click",ageCalc);$("#age-in").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();ageCalc();}});

/* ---------- quiz ---------- */
var Q=[
 {l:"זוכרים",q:"מה נמצא במרכז מערכת השמש?",o:["כדור הארץ","השמש","הירח","צדק"],a:1,e:"השמש במרכז, וכל כוכבי הלכת מקיפים אותה."},
 {l:"זוכרים",q:"איזה כוכב לכת הכי קרוב לשמש?",o:["נוגה","מאדים","חמה","נפטון"],a:2,e:"חמה הוא הראשון מהשמש – וגם הקטן ביותר."},
 {l:"מבינים",q:"מה גורם ליום וללילה?",o:["כדור הארץ מסתובב סביב צירו","השמש מקיפה את כדור הארץ","הירח מסתיר את השמש","כדור הארץ מקיף את השמש"],a:0,e:"הסיבוב סביב הציר (יממה): הצד שפונה לשמש – יום. הקפת השמש יוצרת שנה."},
 {l:"מיישמים",q:"המסלול של כוכב לכת מסוים גדול מהמסלול של מאדים. מה נכון לגביו?",o:["השנה בו קצרה מהשנה במאדים","השנה בו ארוכה מהשנה במאדים","אין בו שנה בכלל","השנה בו שווה לשנה במאדים"],a:1,e:"מסלול גדול יותר = דרך ארוכה יותר ותנועה איטית יותר, ולכן שנה ארוכה יותר."},
 {l:"מנתחים",q:"נוגה רחוק מהשמש יותר מחמה, אבל חם יותר. מה ההסבר?",o:["נוגה גדול יותר","לנוגה אוויר עבה שכולא את החום","נוגה מסתובב מהר יותר","נוגה קרוב יותר לשמש"],a:1,e:"האוויר העבה של נוגה (בעיקר פחמן דו־חמצני) כולא חום – כמו מכונית סגורה בשמש."},
 {l:"מעריכים",q:"נועה אומרת: ״בדגם שלנו כל כוכבי הלכת על שולחן אחד, ורואים טוב את כולם – אז הדגם מדויק בכול.״ מה נכון?",o:["היא צודקת","דגם קטן לא יכול להראות נכון גם גדלים וגם מרחקים","כדור הארץ גדול מהשמש","מדענים לא משתמשים בדגמים"],a:1,e:"דגם עוזר להבין, אבל תמיד מוותרים על משהו. אם הגדלים נכונים, המרחקים צריכים להיות עצומים."}
];
var qi=0,qBox=$("#quiz-box");
function renderQ(){var q=Q[qi];
  qBox.innerHTML='<span class="lvl">רמת חשיבה: '+q.l+'</span><p class="q">'+(qi+1)+". "+q.q+'</p><div class="opts">'+q.o.map(function(o,k){return '<button type="button" class="opt" data-k="'+k+'"><span class="n">'+(k+1)+'</span>'+o+'</button>';}).join("")+'</div><p class="explain" hidden></p>';
  $("#quiz-count").textContent="שאלה "+(qi+1)+" מתוך "+Q.length;$("#quiz-prev").disabled=qi===0;$("#quiz-next").disabled=qi===Q.length-1;}
qBox.addEventListener("click",function(e){var b=e.target.closest(".opt");if(!b)return;var q=Q[qi],k=+b.getAttribute("data-k");
  $$(".opt",qBox).forEach(function(o){var kk=+o.getAttribute("data-k");o.classList.remove("right","wrong");if(kk===q.a)o.classList.add("right");});
  if(k!==q.a)b.classList.add("wrong");var ex=$(".explain",qBox);ex.hidden=false;ex.innerHTML=(k===q.a?"✅ נכון! ":"❌ לא בדיוק. התשובה הנכונה: "+(q.a+1)+". ")+q.e;});
$("#quiz-prev").addEventListener("click",function(){if(qi>0){qi--;renderQ();}});
$("#quiz-next").addEventListener("click",function(){if(qi<Q.length-1){qi++;renderQ();}});
renderQ();

/* ---------- teacher notes (house gate: code 1010, content stored encoded) ---------- */
var NOTES=null;
function teacherOK(){try{return sessionStorage.getItem(PFX+"TeacherOK")==="1";}catch(e){return false;}}
function loadNotes(){if(!NOTES){NOTES=JSON.parse(decodeURIComponent(escape(atob($("#teacher-data").textContent.trim()))));}return NOTES;}
function renderNotes(){var box=$("#notes");if(box.hidden||!NOTES)return;var s=slides[cur];$("#notes-slide").textContent="שקופית "+(cur+1)+": "+(s.getAttribute("aria-label")||"");$("#notes-body").innerHTML=NOTES[s.id]||"<p>אין הערות לשקופית הזו.</p>";}
function showNotes(){loadNotes();$("#notes").hidden=false;renderNotes();}
function openNotes(){if(!$("#notes").hidden){$("#notes").hidden=true;return;}if(teacherOK()){showNotes();return;}var d=$("#gate");$("#gate-err").hidden=true;$("#gate-pw").value="";if(d.showModal){d.showModal();}else{d.setAttribute("open","");}$("#gate-pw").focus();}
$("#notes-btn").addEventListener("click",openNotes);
$("#gate-form").addEventListener("submit",function(e){e.preventDefault();if($("#gate-pw").value.trim()==="1010"){try{sessionStorage.setItem(PFX+"TeacherOK","1");}catch(x){}$("#gate").close();showNotes();$("#notes-close").focus();}else{$("#gate-err").hidden=false;$("#gate-pw").value="";$("#gate-pw").focus();}});
$("#gate-cancel").addEventListener("click",function(){$("#gate").close();});
$("#notes-close").addEventListener("click",function(){$("#notes").hidden=true;$("#notes-btn").focus();});
$("#notes-popout").addEventListener("click",function(){window.open("teacher.html#presenter","kitaShm5Notes","width=620,height=760");});

/* ---------- start ---------- */
window.KitaDeck={go:go,current:function(){return cur;},instances:instances};
var start=idx(location.hash.slice(1));go(start>=0?start:0);
})();
