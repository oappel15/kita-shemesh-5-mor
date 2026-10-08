/* Kita · מערכת השמש – animated solar system (canvas, drawn by Kita; no external images).
   Orbital periods, diameters and distances: NASA Planetary Fact Sheet (nssdc.gsfc.nasa.gov/planetary/factsheet). */
(function(){
"use strict";
var BODIES={
 sun:{he:"השמש",type:"כוכב (לא כוכב לכת!) – כדור ענק של גז לוהט",diam:"כ־1.39 מיליון ק״מ – בערך 109 כדורי ארץ בשורה",dist:"–",year:"–",day:"כ־25 ימים בקו המשווה שלה",moons:"–",fact:"השמש מכילה כ־99.8% מכל החומר במערכת השמש. האור שלה מגיע אלינו בתוך כ־8 דקות ו־20 שניות."},
 mercury:{he:"חמה",type:"כוכב לכת סלעי – הקרוב ביותר לשמש",period:87.97,diam:"4,879 ק״מ – בערך שליש מכדור הארץ",dist:"כ־58 מיליון ק״מ",year:"88 ימים",day:"כ־59 ימים",moons:"0",fact:"הקטן מבין 8 כוכבי הלכת. כמעט אין לו אוויר: ביום חם בו עד כ־430°C, ובלילה קר עד כ־180°C מתחת לאפס.",c1:"#D9D2C9",c2:"#9E968C",size:0.012,orbit:0.15},
 venus:{he:"נוגה",type:"כוכב לכת סלעי",period:224.7,diam:"12,104 ק״מ – כמעט כמו כדור הארץ",dist:"כ־108 מיליון ק״מ",year:"225 ימים",day:"243 ימים – ובכיוון ההפוך!",moons:"0",fact:"הכי חם: כ־460°C בממוצע, כי האוויר העבה שלו (פחמן דו־חמצני) כולא חום. סיבוב אחד סביב צירו ארוך משנה שלמה בו!",c1:"#FFE7B0",c2:"#E3B567",size:0.019,orbit:0.23},
 earth:{he:"כדור הארץ",type:"כוכב לכת סלעי – הבית שלנו",period:365.256,diam:"12,756 ק״מ",dist:"כ־150 מיליון ק״מ",year:"365¼ ימים",day:"כ־24 שעות",moons:"1 – הירח",fact:"כוכב הלכת היחיד שידוע לנו שיש בו חיים. כ־70% מפני השטח שלו מכוסים במים.",c1:"#9FD3FF",c2:"#3E8FD6",land:"#7CCB8E",size:0.02,orbit:0.31},
 mars:{he:"מאדים",type:"כוכב לכת סלעי – ״הכוכב האדום״",period:686.98,diam:"6,792 ק״מ – בערך חצי מכדור הארץ",dist:"כ־228 מיליון ק״מ",year:"687 ימים – כמעט שנתיים שלנו",day:"כ־24 שעות ו־37 דקות",moons:"2 – פובוס ודימוס",fact:"הצבע האדום מגיע מתחמוצת ברזל (״חלודה״) באבק ובסלעים. במאדים נמצא הר הגעש הגדול ביותר במערכת השמש – אולימפוס מונס.",c1:"#FFB49A",c2:"#D8644A",size:0.015,orbit:0.39},
 jupiter:{he:"צדק",type:"ענק גז – כוכב הלכת הגדול ביותר",period:4332.6,diam:"142,984 ק״מ – בערך 11 כדורי ארץ ברוחבו",dist:"כ־778 מיליון ק״מ",year:"כמעט 12 שנים שלנו",day:"כ־10 שעות – הסיבוב המהיר ביותר",moons:"95 ירחים ידועים*",fact:"״הכתם האדום הגדול״ הוא סופה ענקית שרחבה יותר מכדור הארץ כולו.",c1:"#F6D8B8",c2:"#C8956A",band:"#E8B48E",size:0.045,orbit:0.55},
 saturn:{he:"שבתאי",type:"ענק גז – בעל הטבעות המפורסמות",period:10759,diam:"120,536 ק״מ – בערך 9½ כדורי ארץ",dist:"כ־1.4 מיליארד ק״מ",year:"כ־29½ שנים שלנו",day:"כ־10.7 שעות",moons:"274 ירחים ידועים* – הכי הרבה",fact:"הטבעות עשויות בעיקר מגושי קרח וסלע, מגרגר קטן ועד גוש בגודל של בית.",c1:"#FFF0C4",c2:"#D9BE7A",size:0.038,orbit:0.69},
 uranus:{he:"אורנוס",type:"ענק קרח",period:30687,diam:"51,118 ק״מ – בערך 4 כדורי ארץ",dist:"כ־2.9 מיליארד ק״מ",year:"84 שנים שלנו",day:"כ־17 שעות",moons:"28 ירחים ידועים*",fact:"אורנוס ״מתגלגל על הצד״: הציר שלו נטוי כמעט לגמרי, כך שהקטבים שלו פונים בתורם אל השמש.",c1:"#D3F5F5",c2:"#7CC9CF",size:0.028,orbit:0.82},
 neptune:{he:"נפטון",type:"ענק קרח – הרחוק ביותר מהשמש",period:60190,diam:"49,528 ק״מ – כמעט 4 כדורי ארץ",dist:"כ־4.5 מיליארד ק״מ",year:"כ־165 שנים שלנו",day:"כ־16 שעות",moons:"16 ירחים ידועים*",fact:"בנפטון נושבות הרוחות החזקות ביותר במערכת השמש – יותר מ־2,000 קמ״ש.",c1:"#BFD2FF",c2:"#5A7BE0",size:0.027,orbit:0.95}
};
var ORDER=["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"];
var SPEEDS=[0.25,0.5,1,2,5,10,25,50,100];
var SEC_PER_YEAR=10; /* at ×1: one Earth year = 10 seconds */

function SolarSystem(canvas,opts){
  opts=opts||{};this.c=canvas;this.ctx=canvas.getContext("2d");this.o=opts;
  this.days=0;this.speedIdx=opts.speedIdx!=null?opts.speedIdx:2;this.playing=false;this.labels=opts.labels!==false;this.laps=!!opts.laps;
  this.selected=null;this.active=false;this.offsets=opts.stagger?{mercury:0.6,venus:2.3,earth:4.1,mars:5.5,jupiter:1.3,saturn:3.2,uranus:4.9,neptune:0.2}:{};this.fscale=opts.fontScale||0.028;this.stopAt=null;this.last=0;this.listeners={};
  var self=this;this._loop=function(ts){self.frame(ts);};
  this.resize();
  if(window.ResizeObserver){new ResizeObserver(function(){self.resize();self.draw();}).observe(canvas.parentNode);}else{addEventListener("resize",function(){self.resize();self.draw();});}
  canvas.addEventListener("click",function(e){var r=canvas.getBoundingClientRect();var id=self.hit(e.clientX-r.left,e.clientY-r.top);if(id){self.select(id);}});
  canvas.addEventListener("mousemove",function(e){var r=canvas.getBoundingClientRect();canvas.style.cursor=self.hit(e.clientX-r.left,e.clientY-r.top)?"pointer":"default";});
}
SolarSystem.prototype.on=function(ev,fn){(this.listeners[ev]=this.listeners[ev]||[]).push(fn);};
SolarSystem.prototype.emit=function(ev,a){(this.listeners[ev]||[]).forEach(function(f){f(a);});};
SolarSystem.prototype.resize=function(){
  var p=this.c.parentNode,w=p.clientWidth,h=p.clientHeight||w,s=Math.max(120,Math.min(w,h));
  var dpr=Math.min(window.devicePixelRatio||1,2);this.size=s;this.c.width=Math.round(s*dpr);this.c.height=Math.round(s*dpr);
  this.c.style.width=s+"px";this.c.style.height=s+"px";this.ctx.setTransform(dpr,0,0,dpr,0,0);this.stars=null;
};
SolarSystem.prototype.speed=function(){return SPEEDS[this.speedIdx];};
SolarSystem.prototype.setSpeedIdx=function(i){this.speedIdx=Math.max(0,Math.min(SPEEDS.length-1,i));this.emit("state");};
SolarSystem.prototype.play=function(){if(this.playing)return;this.playing=true;this.last=0;this.emit("state");if(this.active)requestAnimationFrame(this._loop);};
SolarSystem.prototype.pause=function(){this.playing=false;this.stopAt=null;this.emit("state");this.draw();};
SolarSystem.prototype.toggle=function(){this.playing?this.pause():this.play();};
SolarSystem.prototype.reset=function(){this.days=0;this.stopAt=null;this.emit("time");this.draw();};
SolarSystem.prototype.runFor=function(days){this.stopAt=this.days+days;this.playing=false;this.play();};
SolarSystem.prototype.setActive=function(a){this.active=a;if(a){this.resize();this.draw();if(this.playing){this.last=0;requestAnimationFrame(this._loop);}}};
SolarSystem.prototype.frame=function(ts){
  if(!this.playing||!this.active)return;
  if(this.last){var dt=Math.min(0.1,(ts-this.last)/1000);this.days+=dt*this.speed()*365.256/SEC_PER_YEAR;}
  this.last=ts;
  if(this.stopAt!=null&&this.days>=this.stopAt){this.days=this.stopAt;this.stopAt=null;this.playing=false;this.emit("state");}
  this.emit("time");this.draw();
  if(this.playing)requestAnimationFrame(this._loop);
};
SolarSystem.prototype.geom=function(){var s=this.size;return {cx:s/2,cy:s/2,R:s/2*0.93,s:s};};
SolarSystem.prototype.pos=function(id){
  var g=this.geom(),b=BODIES[id];if(id==="sun")return {x:g.cx,y:g.cy,r:g.R*0.075};
  var a=(this.offsets[id]||(this.o.startAngle||0))+2*Math.PI*this.days/b.period, rr=g.R*b.orbit;
  return {x:g.cx+rr*Math.cos(a),y:g.cy-rr*Math.sin(a),r:Math.max(3.5,g.R*b.size*1.2),orbit:rr,angle:a};
};
SolarSystem.prototype.hit=function(x,y){
  var best=null,bd=1e9,self=this;
  ORDER.concat(["sun"]).forEach(function(id){var p=self.pos(id),d=Math.hypot(p.x-x,p.y-y),lim=Math.max(p.r+10,20);if(d<lim&&d<bd){bd=d;best=id;}});
  return best;
};
SolarSystem.prototype.select=function(id){this.selected=id;this.draw();this.emit("select",id);};
SolarSystem.prototype.makeStars=function(){
  var s=this.size,cv=document.createElement("canvas"),dpr=Math.min(window.devicePixelRatio||1,2);cv.width=s*dpr;cv.height=s*dpr;
  var x=cv.getContext("2d");x.scale(dpr,dpr);var seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
  for(var i=0;i<Math.round(s*0.35);i++){x.fillStyle="rgba(255,255,255,"+(0.25+rnd()*0.6)+")";x.beginPath();x.arc(rnd()*s,rnd()*s,rnd()*1.3+0.3,0,7);x.fill();}
  var g=this.geom();x.fillStyle="rgba(220,210,255,.35)";
  for(i=0;i<260;i++){var a=rnd()*Math.PI*2,r=g.R*(0.455+rnd()*0.05);x.beginPath();x.arc(g.cx+r*Math.cos(a),g.cy+r*Math.sin(a),rnd()*1.1+0.4,0,7);x.fill();}
  this.stars=cv;
};
SolarSystem.prototype.draw=function(){
  var x=this.ctx,g=this.geom(),s=g.s,self=this;if(!this.stars)this.makeStars();
  x.clearRect(0,0,s,s);x.drawImage(this.stars,0,0,s,s);
  ORDER.forEach(function(id){var b=BODIES[id];x.beginPath();x.arc(g.cx,g.cy,g.R*b.orbit,0,7);
    x.strokeStyle=id===self.selected?"rgba(255,233,160,.95)":"rgba(214,206,255,.32)";x.lineWidth=id===self.selected?2.5:1.2;x.setLineDash(id===self.selected?[]:[4,5]);x.stroke();});
  x.setLineDash([]);
  /* sun */
  var sp=this.pos("sun"),gr=x.createRadialGradient(sp.x,sp.y,sp.r*0.2,sp.x,sp.y,sp.r*2.2);
  gr.addColorStop(0,"rgba(255,236,150,1)");gr.addColorStop(0.45,"rgba(255,200,110,.95)");gr.addColorStop(0.46,"rgba(255,190,120,.35)");gr.addColorStop(1,"rgba(255,170,120,0)");
  x.fillStyle=gr;x.beginPath();x.arc(sp.x,sp.y,sp.r*2.2,0,7);x.fill();
  x.fillStyle="#FFD86B";x.beginPath();x.arc(sp.x,sp.y,sp.r,0,7);x.fill();
  if(this.selected==="sun"){x.strokeStyle="#FFF4C8";x.lineWidth=3;x.beginPath();x.arc(sp.x,sp.y,sp.r+6,0,7);x.stroke();}
  var fs=Math.max(11,Math.round(s*this.fscale));var placed=[];var sunR=this.pos('sun').r*1.15;x.font="600 "+fs+"px 'IBM Plex Sans Hebrew',Arial,sans-serif";x.textAlign="center";x.direction="rtl";
  ORDER.forEach(function(id){
    var b=BODIES[id],p=self.pos(id);
    if(id==="saturn"){x.strokeStyle="rgba(240,220,160,.9)";x.lineWidth=Math.max(1.5,p.r*0.28);x.beginPath();x.ellipse(p.x,p.y,p.r*1.9,p.r*0.65,-0.35,0,7);x.stroke();}
    var pg=x.createRadialGradient(p.x-p.r*0.35,p.y-p.r*0.35,p.r*0.1,p.x,p.y,p.r);pg.addColorStop(0,b.c1);pg.addColorStop(1,b.c2);
    x.fillStyle=pg;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();
    if(id==="jupiter"){x.save();x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.clip();x.fillStyle=b.band;x.fillRect(p.x-p.r,p.y-p.r*0.35,p.r*2,p.r*0.22);x.fillRect(p.x-p.r,p.y+p.r*0.2,p.r*2,p.r*0.18);x.fillStyle="#D9735A";x.beginPath();x.ellipse(p.x+p.r*0.35,p.y+p.r*0.3,p.r*0.22,p.r*0.12,0,0,7);x.fill();x.restore();}
    if(id==="earth"){x.fillStyle=b.land;x.beginPath();x.arc(p.x-p.r*0.3,p.y-p.r*0.1,p.r*0.4,0,7);x.fill();
      if(self.speed()<=2){var ma=(self.offsets.earth||0)+2*Math.PI*self.days/27.32,mr=p.r*2+5;x.fillStyle="#E8E6F0";x.beginPath();x.arc(p.x+mr*Math.cos(ma),p.y-mr*Math.sin(ma),Math.max(1.8,p.r*0.32),0,7);x.fill();}}
    if(id==="saturn"){x.strokeStyle="rgba(240,220,160,.95)";x.lineWidth=Math.max(1.5,p.r*0.28);x.beginPath();x.ellipse(p.x,p.y,p.r*1.9,p.r*0.65,-0.35,Math.PI*0.08,Math.PI*0.92);x.stroke();}
    if(id===self.selected){x.strokeStyle="#FFF4C8";x.lineWidth=3;x.beginPath();x.arc(p.x,p.y,p.r+5,0,7);x.stroke();}
    if(self.labels){
      var txt=b.he;if(self.laps)txt+=" · "+Math.floor(self.days/b.period+1e-9);
      var tw=x.measureText(txt).width+12,th=fs*1.3,pr=p.r*(id==="saturn"?1.9:1),gap=3;
      var cands=[[0,pr+gap+th/2],[0,-(pr+gap+th/2)],[pr+gap+tw/2,0],[-(pr+gap+tw/2),0],[0,pr+gap+th*1.5],[0,-(pr+gap+th*1.5)],[pr+gap+tw/2,th],[-(pr+gap+tw/2),-th],[0,pr+gap+th*2.5],[0,-(pr+gap+th*2.5)]];
      var best=null;
      for(var ci=0;ci<cands.length;ci++){var cx=p.x+cands[ci][0],cy=p.y+cands[ci][1],r={x:cx-tw/2,y:cy-th/2,w:tw,h:th};
        var bad=placed.some(function(q){return r.x<q.x+q.w&&r.x+r.w>q.x&&r.y<q.y+q.h&&r.y+r.h>q.y;})||(Math.abs(cx-g.cx)<sunR+tw/2&&Math.abs(cy-g.cy)<sunR+th/2)||r.x<0||r.y<0||r.x+r.w>s||r.y+r.h>s;
        if(!bad){best=r;break;}}
      if(!best){best={x:p.x-tw/2,y:p.y+pr+gap,w:tw,h:th};}
      placed.push(best);
      x.fillStyle=id===self.selected?"rgba(120,90,10,.85)":"rgba(30,35,80,.78)";roundRect(x,best.x,best.y,tw,th,th/2);x.fill();
      x.fillStyle="#FFFFFF";x.textBaseline="middle";x.fillText(txt,best.x+tw/2,best.y+th/2+1);x.textBaseline="alphabetic";
    }
  });
  if(this.labels){x.fillStyle="#3B2A00";x.font="700 "+fs+"px 'IBM Plex Sans Hebrew',Arial,sans-serif";x.fillText("השמש",sp.x,sp.y+fs*0.35);}
};
function roundRect(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
window.KitaSolar={BODIES:BODIES,ORDER:ORDER,SPEEDS:SPEEDS,SEC_PER_YEAR:SEC_PER_YEAR,SolarSystem:SolarSystem};
})();
