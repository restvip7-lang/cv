(() => {
 'use strict';
 const root=document.documentElement,tabs=[...document.querySelectorAll('.tab')],panels=[...document.querySelectorAll('.panel')],indexes={experience:0,interests:0},language=document.querySelector('.language');
 let modalTrigger;
 function fit(){
  root.classList.remove('needs-space');
  const active=document.querySelector('.panel:not([hidden])'),detail=active?.querySelector('.detail:not([hidden])');
  if(detail&&detail.scrollHeight>active.querySelector('.detail-stack').clientHeight+1)root.classList.add('needs-space');
 }
 function render(){
  const match=location.hash.match(/^#(services|experience|interests)(?:-([0-2]))?$/),key=match?.[1]||'services';
  if(match?.[2]!==undefined&&key in indexes)indexes[key]=+match[2];
  panels.forEach(panel=>panel.hidden=panel.id!==key);
  tabs.forEach(tab=>{const selected=tab.hash==='#'+key;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;selected?tab.setAttribute('aria-current','true'):tab.removeAttribute('aria-current');});
  Object.entries(indexes).forEach(([id,index])=>{const panel=document.getElementById(id);panel.querySelectorAll('.detail').forEach((card,i)=>card.hidden=i!==index);panel.querySelectorAll('[data-page]').forEach(button=>button.setAttribute('aria-pressed',String(+button.dataset.page===index)));panel.querySelector('[data-step="-1"]').disabled=index===0;panel.querySelector('[data-step="1"]').disabled=index===2;});
  requestAnimationFrame(fit);
 }
 function navigate(hash){if(location.hash!==hash)history.pushState(null,'',hash);render();}
 document.querySelector('.tabs').setAttribute('role','tablist');
 tabs.forEach(tab=>{const id=tab.hash.slice(1);tab.setAttribute('role','tab');tab.setAttribute('aria-controls',id);document.getElementById(id).setAttribute('role','tabpanel');tab.addEventListener('keydown',event=>{let index=tabs.indexOf(tab);if(event.key==='ArrowRight')index=(index+1)%tabs.length;else if(event.key==='ArrowLeft')index=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;event.preventDefault();navigate(tabs[index].hash);tabs[index].focus();});});
 document.querySelectorAll('.tab,.service-row').forEach(link=>link.addEventListener('click',event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();navigate(link.hash);if(link.classList.contains('service-row')){const heading=document.querySelector('.panel:not([hidden]) .detail:not([hidden]) h3');heading.tabIndex=-1;heading.focus({preventScroll:true});}}));
 document.querySelectorAll('[data-page],[data-step]').forEach(button=>button.addEventListener('click',()=>{const key=button.closest('.panel').id,index=button.hasAttribute('data-page')?+button.dataset.page:indexes[key]+ +button.dataset.step;navigate('#'+key+'-'+Math.max(0,Math.min(2,index)));}));
 document.querySelectorAll('[data-dialog]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();modalTrigger=link;document.getElementById(link.dataset.dialog).showModal();}));
 document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{const box=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))dialog.close();});dialog.addEventListener('close',()=>modalTrigger?.focus({preventScroll:true}));});
 document.addEventListener('click',event=>{if(!language.contains(event.target))language.open=false;});document.addEventListener('keydown',event=>{if(event.key==='Escape')language.open=false;});
 window.addEventListener('popstate',render);window.addEventListener('hashchange',render);window.addEventListener('resize',fit);root.classList.add('js');render();
})();
