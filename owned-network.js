(()=>{
  'use strict';
  window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};
  if(!document.querySelector('script[src="/_vercel/insights/script.js"]')){
    const s=document.createElement('script');
    s.defer=true;
    s.src='/_vercel/insights/script.js';
    document.head.appendChild(s);
  }
  const owned={
    'chrisizworski.com':null,
    'gazette.chrisizworski.com':'gazette',
    'michigantroutreport.com':'trout-report',
    'michiganbirdingreport.com':'birding',
    'freighterviewfarms.com':'freighter-view-farms'
  };
  const destinationFor=(a)=>{
    try{
      const u=new URL(a.href,location.href);
      if(u.hostname==='chrisizworski.com'&&u.pathname.startsWith('/great-lakes-buoys'))return 'great-lakes-buoys';
      if(u.hostname==='chrisizworski.com')return 'chris-home';
      return owned[u.hostname]||'';
    }catch{return '';}
  };
  function wire(){
    const links=[...document.querySelectorAll('footer a')];
    const destinations=[];
    links.forEach(a=>{
      const destination=destinationFor(a);
      if(!destination)return;
      a.dataset.ownedNetworkDestination=destination;
      if(!destinations.includes(destination))destinations.push(destination);
    });
    if(destinations.length){
      window.va('event',{name:'Network Amplification Exposure',data:{source:'great-lakes-levels',surface:'owned-domain-footer',destinations:destinations.join(',')}});
    }
  }
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-owned-network-destination]');
    if(!a)return;
    window.va('event',{name:'Contextual Tool Handoff',data:{source:'great-lakes-levels',destination:a.dataset.ownedNetworkDestination,surface:a.dataset.ownedNetworkDestination==='great-lakes-buoys'?'companion-tool':'owned-domain-footer'}});
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
})();
