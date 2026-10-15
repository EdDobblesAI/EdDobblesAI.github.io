(function(){
  var TO='ed@dobbles.ai';
  var LEAD_URL='https://xwguviuinmafenlqwtka.supabase.co/functions/v1/wtm-lead';
  var FIELDS=['email','name','title','company','role','company_type','brand','brands','question','website'];
  var KEY='wtm-prefill';
  // Older links may still carry ?email=...; drop the query string so no address stays in the URL or history.
  try{ if(/[?&]email=/.test(location.search)) history.replaceState(null,'',location.pathname+location.hash); }catch(e){}
  // Home-page form hands brand/email over in sessionStorage, never in the URL.
  try{
    var pre=JSON.parse(sessionStorage.getItem(KEY)||'null');
    if(pre){
      sessionStorage.removeItem(KEY);
      Object.keys(pre).forEach(function(k){var el=document.querySelector('form[data-lead] [name="'+k+'"]'); if(el&&!el.value) el.value=pre[k];});
    }
  }catch(e){}
  document.querySelectorAll('form[data-handoff]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var v={};
      Array.prototype.forEach.call(f.elements,function(el){ if(el.name&&el.value) v[el.name]=el.value; });
      try{ sessionStorage.setItem(KEY,JSON.stringify(v)); }catch(err){}
      location.href=f.getAttribute('data-handoff');
    });
  });
  function errBox(f){
    var d=f.querySelector('.lead-err');
    if(!d){
      d=document.createElement('p');
      d.className='lead-err'; d.setAttribute('role','alert');
      d.style.cssText='margin:12px 0 0;color:#9B2335;font-size:15px';
      var btn=f.querySelector('[type="submit"]');
      btn&&btn.parentNode===f?f.insertBefore(d,btn.nextSibling):f.appendChild(d);
    }
    return d;
  }
  document.querySelectorAll('form[data-lead]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=f.querySelector('[type="submit"]');
      var body={form:f.getAttribute('data-lead'),page:location.pathname};
      FIELDS.forEach(function(k){var el=f.querySelector('[name="'+k+'"]'); if(el) body[k]=el.value;});
      var box=errBox(f); box.textContent='';
      if(btn){btn.disabled=true;}
      fetch(LEAD_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
        .then(function(r){return r.json().catch(function(){return {};});})
        .then(function(j){
          if(!j||j.ok!==true) throw new Error('not ok');
          var d=document.getElementById(f.getAttribute('data-done'));
          if(d){f.style.display='none'; d.style.display='block'; d.focus();}
        })
        .catch(function(){
          box.innerHTML='';
          box.appendChild(document.createTextNode('We couldn’t send that. Please check your email address and try again, or write to us at '));
          var a=document.createElement('a'); a.href='mailto:'+TO; a.textContent=TO; box.appendChild(a);
          box.appendChild(document.createTextNode('.'));
        })
        .then(function(){ if(btn){btn.disabled=false;} });
    });
  });
})();
