// Try to detect if vendor libs are missing, and if so, load from CDN as fallback.
(function(){
  function loadOnce(src){
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = src; s.async = true; s.onload = () => resolve(true); s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }
  async function ensure(){
    // raphael -> flowchart
    if (!window.Raphael){ await loadOnce('https://cdn.jsdelivr.net/npm/raphael@2.3.0/raphael.min.js'); }
    if (!window.flowchart){ await loadOnce('https://cdn.jsdelivr.net/npm/flowchart.js@1.17.1/release/flowchart.min.js'); }
    // markmap
    if (!window.d3){ await loadOnce('https://cdn.jsdelivr.net/npm/d3@6'); }
    if (!(window.markmap && window.markmap.Transformer)){
      await loadOnce('https://cdn.jsdelivr.net/npm/markmap-lib@0.15.10/dist/browser/index.min.js');
    }
    if (!(window.markmap && window.markmap.Markmap)){
      await loadOnce('https://cdn.jsdelivr.net/npm/markmap-view@0.15.10/dist/browser/index.min.js');
    }
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ensure);
  } else {
    ensure();
  }
})();
