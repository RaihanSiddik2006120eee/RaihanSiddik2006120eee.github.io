'use strict';
const root=document.documentElement;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const themeButton=document.getElementById('themeButton');
function setTheme(theme){root.dataset.theme=theme;themeButton.textContent=theme==='dark'?'☼':'☾';themeButton.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} theme`);document.querySelector('meta[name="theme-color"]').content=theme==='dark'?'#090e18':'#f5f7f1';}
let savedTheme;try{savedTheme=localStorage.getItem('raihan-theme');}catch{}
setTheme(savedTheme==='light'?'light':'dark');
themeButton.addEventListener('click',()=>{const theme=root.dataset.theme==='dark'?'light':'dark';setTheme(theme);try{localStorage.setItem('raihan-theme',theme);}catch{}});
const menu=document.getElementById('navigationLinks'),menuButton=document.getElementById('menuButton');
function closeMenu(restoreFocus=false){menu.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');menuButton.textContent='☰';if(restoreFocus)menuButton.focus();}
menuButton.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');menuButton.textContent=open?'×':'☰';});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open'))closeMenu(true);});
document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
window.matchMedia('(min-width: 681px)').addEventListener('change',()=>closeMenu());
if('IntersectionObserver' in window){
 if(!reduced.matches){root.classList.add('motion');const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));}
 const navObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){menu.querySelectorAll('a').forEach(a=>{const active=a.hash==='#'+e.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}}),{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('main section[id],header[id]').forEach(el=>navObserver.observe(el));
}
let scrollPending=false;const progress=document.querySelector('.scroll-progress');function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;scrollPending=false;}
addEventListener('scroll',()=>{if(!scrollPending){requestAnimationFrame(updateScroll);scrollPending=true;}},{passive:true});updateScroll();
const projectCards=[...document.querySelectorAll('.project-card')];document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});let count=0;projectCards.forEach(card=>{const visible=button.dataset.filter==='all'||card.dataset.category===button.dataset.filter;card.hidden=!visible;if(visible){count++;card.classList.add('visible');}});document.getElementById('filterStatus').textContent=`Showing ${count} project${count===1?'':'s'}.`;requestAnimationFrame(updateScroll);}));
const copyButton=document.getElementById('copyEmail');copyButton.addEventListener('click',async()=>{const status=document.getElementById('copyStatus');try{await navigator.clipboard.writeText('raihansiddik2006120@gmail.com');status.textContent='Copied!';setTimeout(()=>status.textContent='',2500);}catch{status.textContent='Select the email address to copy it.';}});
document.getElementById('currentYear').textContent=new Date().getFullYear();function clock(){document.getElementById('dhakaTime').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Dhaka',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())+' BST';}clock();setInterval(clock,60000);
if(matchMedia('(pointer:fine)').matches&&!reduced.matches){document.querySelectorAll('.research-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`);}));}
// A lightweight ambient network. Decorative only; paused offscreen and in hidden tabs.
const canvas=document.getElementById('network'),ctx=canvas.getContext('2d');let w=0,h=0,nodes=[],frame=0,heroVisible=true,last=0;
function resizeCanvas(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);nodes=Array.from({length:w<680?22:46},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2}));}
function draw(t){frame=0;if(reduced.matches||document.hidden||!heroVisible)return;if(t-last>=32){last=t;ctx.clearRect(0,0,w,h);const light=root.dataset.theme==='light';ctx.fillStyle=light?'#41652255':'#c3f38055';nodes.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,1.3,0,Math.PI*2);ctx.fill();nodes.slice(i+1).forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<130){ctx.strokeStyle=light?`rgba(65,101,34,${(1-d/130)*.22})`:`rgba(195,243,128,${(1-d/130)*.16})`;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}});});}frame=requestAnimationFrame(draw);}
function syncAnimation(){if(frame)cancelAnimationFrame(frame);frame=0;if(!reduced.matches&&!document.hidden&&heroVisible)frame=requestAnimationFrame(draw);}
if(ctx){resizeCanvas();addEventListener('resize',resizeCanvas);document.addEventListener('visibilitychange',syncAnimation);reduced.addEventListener('change',()=>{if(reduced.matches)root.classList.remove('motion');syncAnimation();});if('IntersectionObserver'in window)new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;syncAnimation();}).observe(document.getElementById('home'));syncAnimation();}

// Scroll-linked choreography. One scheduled frame per scroll, no scroll hijacking.
(()=>{
 const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
 const sections=[...document.querySelectorAll('main section[id]')];
 const desktop=matchMedia('(min-width:681px)');
 const aura=document.createElement('div');aura.className='scroll-aura';aura.setAttribute('aria-hidden','true');document.body.prepend(aura);
 const chapter=document.createElement('div');chapter.className='scroll-chapter';chapter.setAttribute('aria-hidden','true');document.body.append(chapter);
 const top=document.createElement('a');top.href='#home';top.className='scroll-top';top.setAttribute('aria-label','Back to top');top.innerHTML='<svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="20"/></svg><span aria-hidden="true">↑</span>';document.body.append(top);
 document.querySelectorAll('.two-column-grid,.project-grid,.about-layout,.publication-list').forEach(grid=>[...grid.children].forEach((item,i)=>item.style.setProperty('--reveal-delay',`${Math.min(i%3,2)*95}ms`)));
 const hero=document.querySelector('.hero');const art=[...document.querySelectorAll('.project-art')];const contact=document.querySelector('.contact-shell');
 let scheduled=0;
 function render(){
  scheduled=0;
  const vh=innerHeight,y=scrollY,max=document.documentElement.scrollHeight-vh;
  const progress=max>0?clamp(y/max):0;
  top.style.setProperty('--ring-offset',String(126*(1-progress)));top.classList.toggle('shown',y>vh*.6);
  if(reduced.matches){root.classList.remove('scroll-effects');chapter.classList.remove('shown');return;}
  root.classList.add('scroll-effects');
  // Read layout first, then write styles to avoid alternating forced layouts.
  const heroBox=hero.getBoundingClientRect();
  const boxes=sections.map(el=>({el,rect:el.getBoundingClientRect()}));
  const artBoxes=art.map(el=>({el,rect:el.getBoundingClientRect()}));
  const contactBox=contact.getBoundingClientRect();
  root.style.setProperty('--aura-y',`${(progress-.5)*100}px`);
  if(heroBox.bottom>0){const distance=clamp(y,0,heroBox.height);hero.style.setProperty('--hero-y',`${desktop.matches?distance*.12:0}px`);hero.style.setProperty('--copy-y',`${desktop.matches?distance*-.045:0}px`);hero.style.setProperty('--orbit-turn',`${distance*.045}deg`);hero.style.setProperty('--glow-y',`${distance*.2}px`);}
  let current='';
  boxes.forEach(({el,rect})=>{if(rect.top<vh&&rect.bottom>0){const p=clamp((vh*.9-rect.top)/(vh*.7));el.style.setProperty('--section-progress',p.toFixed(3));}if(rect.top<vh*.5&&rect.bottom>vh*.25)current=el.querySelector('.section-label')?.textContent||'';});
  chapter.textContent=current;chapter.classList.toggle('shown',Boolean(current));
  artBoxes.forEach(({el,rect})=>{if(rect.top<vh&&rect.bottom>0){const p=clamp((vh-rect.top)/(vh+rect.height));el.style.setProperty('--art-y',`${(p-.5)*45}px`);el.style.setProperty('--art-turn',`${(p-.5)*8}deg`);el.style.setProperty('--shine-x',`${(p*2-1)*140}%`);}});
  if(contactBox.top<vh&&contactBox.bottom>0)contact.style.setProperty('--contact-scale',String(.8+clamp((vh-contactBox.top)/vh)*.7));
 }
 function queue(){if(!scheduled&&!document.hidden)scheduled=requestAnimationFrame(render);}
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});reduced.addEventListener('change',queue);document.addEventListener('visibilitychange',queue);
 document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',queue));
 document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',queue));
 if(document.fonts)document.fonts.ready.then(queue);
 queue();
})();
