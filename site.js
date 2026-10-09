(function(){
  var TO='ed@dobbles.ai';
  try{
    var q=new URLSearchParams(location.search);
    q.forEach(function(v,k){var el=document.querySelector('[data-mail] [name="'+k+'"]'); if(el&&!el.value) el.value=v;});
  }catch(e){}
  document.querySelectorAll('form[data-mail]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(f.website && f.website.value) return;
      var lines=[];
      Array.prototype.forEach.call(f.elements,function(el){
        if(!el.name||el.name==='website'||el.type==='submit') return;
        var lab=f.querySelector('label[for="'+el.id+'"]');
        lines.push((lab?lab.textContent:el.name)+': '+el.value);
      });
      var subj=f.getAttribute('data-mail');
      var b=f.querySelector('[name="brand"]'); if(b&&b.value) subj+=' — '+b.value;
      location.href='mailto:'+TO+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(lines.join('\n'));
      var d=document.getElementById(f.getAttribute('data-done'));
      if(d){f.style.display='none'; d.style.display='block'; d.focus();}
    });
  });
})();
