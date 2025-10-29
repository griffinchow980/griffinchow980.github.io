(function(){
  // Render mermaid, flowchart.js, markmap, and plantuml (via plantuml server) code blocks
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  // Strip YAML frontmatter if present; return body only
  function stripFrontmatter(text){
    if (!text) return text;
    const m = text.match(/^---\s*[\r\n]([\s\S]*?)\r?\n---\s*[\r\n]([\s\S]*)$/);
    if (m) return m[2].trim();
    return text;
  }

  function loadScript(src){
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load '+src));
      document.head.appendChild(s);
    });
  }

  function loadAny(urls, testFn, timeout = 4000){
    try{ if (typeof testFn === 'function' && testFn()) return Promise.resolve(); }catch{ /* ignore */ }
    return new Promise((resolve, reject) => {
      let resolved = false;
      const done = () => { if (!resolved) { resolved = true; clearTimeout(timer); resolve(); } };
      const timer = setTimeout(() => { if (!resolved) reject(new Error('loadAny timeout')); }, timeout);
      urls.forEach(u => {
        // If already present, try resolving via test
        if (document.querySelector(`script[src="${u}"]`)) {
          try{ if (!testFn || testFn()) done(); }catch{ /* ignore */ }
          return;
        }
        const s = document.createElement('script');
        s.src = u;
        s.defer = true;
        s.onload = () => { try{ if (!testFn || testFn()) done(); }catch{ /* ignore */ } };
        s.onerror = () => { /* ignore single failure; others may succeed */ };
        document.head.appendChild(s);
      });
    });
  }

  function waitFor(testFn, { timeout = 7000, interval = 50 } = {}){
    return new Promise((resolve, reject) => {
      const start = Date.now();
      (function poll(){
        try{
          if (testFn()) return resolve(true);
        }catch{ /* ignore */ }
        if (Date.now() - start > timeout) return reject(new Error('waitFor timeout'));
        setTimeout(poll, interval);
      })();
    });
  }

  async function ensureFlowchart(){
    // Flowchart.js has CDN MIME type issues, so we skip it
    // Users should use Mermaid flowchart instead
    if (window.flowchart && window.Raphael) return;
    
    // Silently fail - don't load flowchart.js due to CDN MIME issues
    // This prevents console errors while maintaining compatibility
    return Promise.resolve();
  }

  async function ensureMarkmap(){
    const hasTransformer = !!(window.markmap?.Transformer || window.markmaplib?.Transformer);
    const hasView = !!(window.markmap?.Markmap || window.markmapview?.Markmap || window.Markmap);
    if (hasTransformer && hasView) return;
    
    // KaTeX is already loaded by Hugo's math support in head.html
    // Just verify it's available
    if (!window.katex) {
      console.warn('KaTeX not found, math formulas in Markmap may not render correctly');
    }
    
    // Load D3 first - prefer local files, then CDN as fallback
    if (!window.d3) {
      try {
        // Try local d3 v6 first (known working file)
        await loadScript('/vendor/d3.v6.min.js');
        await waitFor(() => !!window.d3, { timeout: 2000 });
      } catch(e) {
        console.warn('Failed to load local D3, trying CDN...', e);
        // Fallback to CDN
        await loadScript('https://cdn.jsdelivr.net/npm/d3@6/dist/d3.min.js');
        await waitFor(() => !!window.d3, { timeout: 3000 });
      }
    }
    
    // Then load markmap libraries
    await Promise.all([
      loadScript('/vendor/markmap-lib.browser.min.js'),
      loadScript('/vendor/markmap-view.browser.min.js')
    ]);
    
    // Wait for both to be available
    await waitFor(() => !!(window.markmap?.Transformer || window.markmaplib?.Transformer), { timeout: 2000 });
    await waitFor(() => !!(window.markmap?.Markmap || window.markmapview?.Markmap || window.Markmap), { timeout: 2000 });
    
    const ok = !!(window.markmap?.Transformer || window.markmaplib?.Transformer) && !!(window.markmap?.Markmap || window.markmapview?.Markmap || window.Markmap);
    if (!ok) throw new Error('markmap libs not available after loading');
  }
  function createContainer(afterElem){
    const c = document.createElement('div');
    c.className = 'diagram-rendered';
    afterElem.parentNode.insertBefore(c, afterElem.nextSibling);
    return c;
  }

  function flowchartOptions(container){
    const color = getComputedStyle(container).color;
    const base = {
      'line-width': 2,
      'font-size': 14,
      'font-color': color,
      'line-color': color,
      'element-color': color,
      'fill': 'transparent',
      'yes-text': 'Yes',
      'no-text': 'No'
    };
    base.symbols = {
      start: { 'font-color': color, 'line-color': color, 'fill': 'transparent' },
      end: { 'font-color': color, 'line-color': color, 'fill': 'transparent' },
      operation: { 'font-color': color, 'line-color': color, 'fill': 'transparent' },
      condition: { 'font-color': color, 'line-color': color, 'fill': 'transparent' },
      inputoutput: { 'font-color': color, 'line-color': color, 'fill': 'transparent' },
      subroutine: { 'font-color': color, 'line-color': color, 'fill': 'transparent' }
    };
    return base;
  }

  function markdownToMermaidMindmap(md){
    const lines = md.split(/\r?\n/);
    let root = 'Mindmap';
    const tree = [];
    let currentSection = null;
    for (const line of lines){
      const m1 = line.match(/^\s*#\s+(.+)/);
      if (m1){ root = m1[1].trim(); continue; }
      const m2 = line.match(/^\s*##\s+(.+)/);
      if (m2){ currentSection = m2[1].trim(); tree.push({ title: currentSection, items: [] }); continue; }
      const m3 = line.match(/^\s*-\s+(.+)/);
      if (m3){
        if (!currentSection){ currentSection = 'Notes'; tree.push({ title: currentSection, items: [] }); }
        tree[tree.length-1].items.push(m3[1].trim());
      }
    }
    const out = ['mindmap', `  root((${root}))`];
    for (const sec of tree){
      out.push(`    ${sec.title}`);
      for (const it of sec.items){ out.push(`      ${it}`); }
    }
    return out.join('\n');
  }
  function getTheme(){
    // Try to infer from data-color-mode used by theme-mode.js
    const html = document.documentElement;
    const mode = html.getAttribute('data-color-mode') || 'light';
    return mode === 'dark' ? 'dark' : 'light';
  }
  
  function getMermaidTheme(){
    // Use real mermaid theme by site color mode
    return getTheme() === 'dark' ? 'dark' : 'default';
  }
  // Read --mermaid-theme CSS var, fallback to JS theme
  function getMermaidCSSTheme(){
    const theme = getComputedStyle(document.documentElement).getPropertyValue('--mermaid-theme');
    if (theme) return theme.trim();
    return getMermaidTheme();
  }

  async function renderMermaid(block){
    const raw = block.innerText.trim();
    const code = stripFrontmatter(raw);
    const highlight = block.closest('.highlight');
    const container = createContainer(highlight);
    try{
      window.mermaid ||= {};
      // Initialize with spacing tuned a bit looser and transparent bg
      const fg = getComputedStyle(container).color;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: getMermaidCSSTheme(),
        themeVariables: {
          background: 'transparent',
          textColor: fg,
          primaryTextColor: fg,
          lineColor: fg,
          actorTextColor: fg,
          labelColor: fg,
          sequenceNumberColor: fg
        },
        flowchart: { useMaxWidth: true, nodeSpacing: 50, rankSpacing: 50 }
      });
      const id = 'm'+Math.random().toString(36).slice(2);
      const { svg } = await mermaid.render(id, code);
      container.innerHTML = svg;
  if (highlight) highlight.style.display = 'none';
      container.dataset.lang = 'mermaid';
  container.classList.add('diagram-mermaid');
      // Tag mermaid type for fine-grained styling (e.g., font-weight overrides)
      try{
        const head = code.trim().slice(0, 32).toLowerCase();
        if (head.startsWith('gantt')) container.classList.add('diagram-mermaid--gantt');
        if (head.startsWith('packet')) container.classList.add('diagram-mermaid--packet');
      }catch{ /* noop */ }
      container.dataset.code = code;
  block.dataset.diagramDone = '1';
  }catch(e){ console.error('mermaid render error', e); }
  finally { delete block.dataset.diagramPending; }
  }

  async function renderFlowchart(block){
    const code = block.innerText.trim();
    const highlight = block.closest('.highlight');
    const container = createContainer(highlight);
    try{
      await ensureFlowchart();
      const chart = window.flowchart.parse(code);
      const id = 'fc'+Math.random().toString(36).slice(2);
      const el = document.createElement('div');
      el.id = id;
      container.appendChild(el);
  chart.drawSVG(id, flowchartOptions(container));
  block.dataset.diagramDone = '1';
      if (highlight) highlight.style.display = 'none';
  container.dataset.lang = 'flowchart';
  container.classList.add('diagram-flowchart');
  container.dataset.code = code;
  }catch(e){ console.error('flowchart render error', e); }
  finally { delete block.dataset.diagramPending; }
  }

  // Lightweight local toolbar for markmap
  function attachMarkmapToolbar(container, mm){
    try{
      const bar = document.createElement('div');
      bar.className = 'diagram-toolbar diagram-toolbar--markmap';
      // Buttons: Fit, Copy Markdown, Export SVG
      const btns = [
        { key: 'fit', label: '适配', title: '适配画布', onClick: () => mm.fit() },
        { key: 'copy', label: '复制', title: '复制源码', onClick: () => {
            const text = container.dataset.code || '';
            navigator.clipboard && navigator.clipboard.writeText(text).catch(()=>{});
          }
        },
        { key: 'svg', label: '导出', title: '导出SVG', onClick: () => {
            // serialize current svg
            const svgEl = container.querySelector('svg');
            if (!svgEl) return;
            const clone = svgEl.cloneNode(true);
            // ensure background transparent
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            const svgStr = new XMLSerializer().serializeToString(clone);
            const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'markmap.svg';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          }
        }
      ];
      for (const b of btns){
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'diagram-toolbar__btn';
        el.title = b.title;
        el.textContent = b.label;
        el.addEventListener('click', (ev) => { ev.stopPropagation(); b.onClick(); });
        bar.appendChild(el);
      }
      container.appendChild(bar);
    }catch{ /* ignore toolbar errors */ }
  }

  async function renderMarkmap(block){
    // Expect markdown list-based content
    const code = block.innerText.trim();
    const highlight = block.closest('.highlight');
    const container = createContainer(highlight);
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  // Give each SVG a unique ID to avoid conflicts
  svg.id = 'markmap-' + Math.random().toString(36).slice(2);
  // Let SVG size follow container naturally
  svg.style.width = '100%';
  svg.style.height = '600px'; // Increased height for better layout
    container.appendChild(svg);
    try{
      await ensureMarkmap();
      const Transformer = window.markmap?.Transformer || window.markmaplib?.Transformer;
      const Markmap = window.markmap?.Markmap || window.markmapview?.Markmap || window.Markmap;
      if (typeof Transformer !== 'function') throw new Error('Markmap Transformer not available');
      
      // Create transformer without options to avoid e.map error
      const transformer = new Transformer();
      const { root } = transformer.transform(code);
      
      // Create markmap instance with compact layout
      const mm = Markmap.create(svg, { 
        autoFit: true,
        paddingX: 10,
        spacingVertical: 8,
        spacingHorizontal: 80,
        duration: 500
      }, root);
      
      // Let mm.fit() initialize the markmap properly
      if (mm && mm.fit) mm.fit();
      
      // NOTE: KaTeX rendering is handled separately by markmap-katex.js
      // Do NOT render KaTeX here to avoid interfering with Markmap's native layout
      
      // handle resize - use arrow function to maintain reference
      const resizeHandler = () => { if (mm && mm.fit) mm.fit(); };
      window.addEventListener('resize', resizeHandler);
      
      // add type class and toolbar
      container.classList.add('diagram-markmap');
      attachMarkmapToolbar(container, mm);
      if (highlight) highlight.style.display = 'none';
  container.dataset.lang = 'markmap';
  container.dataset.code = code;
  block.dataset.diagramDone = '1';
  }catch(e){ console.error('markmap render error', e); }
  finally { delete block.dataset.diagramPending; }
  }

  async function rerenderMarkmap(container, code){
    await ensureMarkmap();
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.id = 'markmap-' + Math.random().toString(36).slice(2);
  svg.style.width = '100%';
  svg.style.height = '600px';
    container.appendChild(svg);
    const Transformer = window.markmap?.Transformer || window.markmaplib?.Transformer;
    const Markmap = window.markmap?.Markmap || window.markmapview?.Markmap || window.Markmap;
    
    const transformer = new Transformer();
    const { root } = transformer.transform(code);
    const mm = Markmap.create(svg, { 
      autoFit: true,
      paddingX: 10,
      spacingVertical: 8,
      spacingHorizontal: 80,
      duration: 500
    }, root);
    
    // Let mm.fit() initialize the markmap properly
    if (mm && mm.fit) mm.fit();
    
    // NOTE: KaTeX rendering is handled separately by markmap-katex.js
  }

  // ECharts integration
  async function ensureEcharts(){
    if (window.echarts) return;
    await loadAny(['/vendor/echarts.min.js'], () => !!window.echarts, 4000);
    if (!window.echarts) throw new Error('echarts not available (local)');
  }

  // Track if GL is loaded
  let echartsGLLoaded = false;
  
  // Load echarts-gl extension if needed (for 3D charts, globe, etc.)
  async function ensureEchartsGL(){
    if (echartsGLLoaded) return;
    try {
      await loadScript('/vendor/echarts-gl.min.js');
      echartsGLLoaded = true;
    } catch(e) {
      console.error('Failed to load echarts-gl:', e);
      throw e;
    }
  }

  // Detect if option needs GL (3D charts, globe, etc.)
  function needsEchartsGL(option){
    if (!option) return false;
    try{
      // Check for 3D axis components (definitive sign of 3D chart)
      if (option.xAxis3D || option.yAxis3D || option.zAxis3D || option.grid3D) {
        return true;
      }
      
      // Check for other GL components
      if (option.globe || option.geo3D) {
        return true;
      }
      
      // Check series types
      if (option.series){
        const series = Array.isArray(option.series) ? option.series : [option.series];
        for (const s of series){
          if (s && s.type){
            const type = s.type.toLowerCase();
            // 3D series types
            if (type.includes('3d') || type === 'bar3d' || type === 'line3d' || 
                type === 'scatter3d' || type === 'surface' || type === 'scattergl' || 
                type === 'graphgl' || type === 'flowgl') {
              return true;
            }
          }
        }
      }
      
      return false;
    }catch(e){
      console.error('Error detecting GL requirement:', e);
      return false;
    }
  }

  async function renderEcharts(block){
    const code = block.innerText.trim();
    let option;
    try { 
      option = JSON.parse(code);
    } catch(e){ 
      console.error('echarts option must be valid JSON', e); 
      delete block.dataset.diagramPending;
      return; 
    }
    const highlight = block.closest('.highlight');
    const container = createContainer(highlight);
    const el = document.createElement('div');
    el.style.width = '100%';
    el.style.minHeight = '400px';
    el.style.height = '400px';
    container.appendChild(el);
    try{
      await ensureEcharts();
      
      // Load GL extension if needed BEFORE initializing chart
      const needsGL = needsEchartsGL(option);
      if (needsGL){
        try {
          await ensureEchartsGL();
          // Wait a bit for GL to be fully ready
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch(e) {
          console.error('Failed to load echarts-gl:', e);
          el.innerHTML = '<div style="padding: 20px; color: #f56c6c; border: 1px solid #f56c6c; border-radius: 4px;">无法加载 ECharts GL 扩展。3D 图表功能不可用。<br>错误: ' + e.message + '</div>';
          delete block.dataset.diagramPending;
          return;
        }
      }
      
      // Initialize chart with theme
      const theme = getTheme();
      
      // Don't use built-in themes - we'll apply custom theme with transparent background
      const chart = window.echarts.init(el, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      
      const fg = getComputedStyle(container).color;
      const themed = applyEchartsTheme(option, fg, theme);
      
      // Try to set option, catch errors
      try {
        chart.setOption(themed, true);
      } catch(e) {
        // Check if error is related to map not being registered
        const isMapError = e.message && (
          e.message.includes('not exists') || 
          e.message.includes('not registered') ||
          e.message.includes('regions') ||
          e.stack && e.stack.includes('ZT(e,n,i).regions')
        );
        
        if (isMapError) {
          // Map error - show friendly message without console error
          const mapName = option.geo?.map || option.series?.[0]?.map || 'unknown';
          el.innerHTML = `<div style="padding: 20px; color: #e6a23c; background: #fdf6ec; border: 1px solid #f5dab1; border-radius: 4px;">
            <strong>📍 地图数据未注册</strong><br><br>
            地图名称: <code>${mapName}</code><br><br>
            ECharts 需要先注册地图的 GeoJSON 数据才能渲染地图。<br>
            这是预期的行为，不是错误。<br><br>
            <small>如需使用地图功能，请参考 <a href="https://echarts.apache.org/handbook/zh/how-to/chart-types/geo/map" target="_blank" style="color: #409eff;">ECharts 地图使用文档</a></small>
          </div>`;
          // Don't log map errors to console - they're expected
        } else {
          // Other errors should be logged
          console.error('Error setting chart option:', e);
          throw e;
        }
      }
      
      if (highlight) highlight.style.display = 'none';
      container.dataset.lang = 'echarts';
      container.classList.add('diagram-echarts');
      container.dataset.code = code;
      
      // Resize handling
      window.addEventListener('resize', () => chart.resize());
      block.dataset.diagramDone = '1';
    } catch(e){ 
      console.error('echarts render error:', e);
      console.error('Error stack:', e.stack);
      // Show error in the container
      el.innerHTML = `<div style="padding: 20px; color: #f56c6c; border: 1px solid #f56c6c; border-radius: 4px;">
        <strong>渲染失败</strong><br>
        错误: ${e.message}<br>
        <small>请查看浏览器控制台获取详细信息</small>
      </div>`;
    } finally { 
      delete block.dataset.diagramPending; 
    }
  }

  async function rerenderEcharts(container, code){
    try{
      await ensureEcharts();
      const option = JSON.parse(code);
      const needsGL = needsEchartsGL(option);
      
      // Load GL extension if needed
      if (needsGL){
        await ensureEchartsGL();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      let el = container.querySelector('div');
      if (!el){
        el = document.createElement('div');
        el.style.width = '100%';
        el.style.minHeight = '400px';
        el.style.height = '400px';
        container.appendChild(el);
      }
      
      // Dispose old instance and create new one with current theme
      const oldChart = window.echarts.getInstanceByDom(el);
      if (oldChart) oldChart.dispose();
      
      const theme = getTheme();
      // Don't use built-in themes - we'll apply custom theme with transparent background
      const chart = window.echarts.init(el, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      const fg = getComputedStyle(container).color;
      const themed = applyEchartsTheme(option, fg, theme);
      
      try {
        chart.setOption(themed, true);
      } catch(e) {
        // Check if error is related to map not being registered
        const isMapError = e.message && (
          e.message.includes('not exists') || 
          e.message.includes('not registered') ||
          e.message.includes('regions') ||
          e.stack && e.stack.includes('ZT(e,n,i).regions')
        );
        
        if (isMapError) {
          // Map error - show friendly message without console error
          const mapName = option.geo?.map || option.series?.[0]?.map || 'unknown';
          el.innerHTML = `<div style="padding: 20px; color: #e6a23c; background: #fdf6ec; border: 1px solid #f5dab1; border-radius: 4px;">
            <strong>📍 地图数据未注册</strong><br><br>
            地图名称: <code>${mapName}</code><br><br>
            ECharts 需要先注册地图的 GeoJSON 数据才能渲染地图。<br>
            这是预期的行为，不是错误。<br><br>
            <small>如需使用地图功能，请参考 <a href="https://echarts.apache.org/handbook/zh/how-to/chart-types/geo/map" target="_blank" style="color: #409eff;">ECharts 地图使用文档</a></small>
          </div>`;
          // Don't log map errors to console - they're expected
        } else {
          // Other errors should be logged
          console.error('echarts re-render error', e);
          throw e;
        }
      }
    } catch(e) { 
      console.error('echarts re-render error', e); 
    }
  }

  // Apply theme-aware colors to echarts options (including map, geo, GL components)
  function applyEchartsTheme(option, fg, theme){
    try{
      const isDark = theme === 'dark';
      const hasColor = !!(option && option.textStyle && option.textStyle.color);
      const clone = JSON.parse(JSON.stringify(option));
      
      // Force transparent background for all charts
      clone.backgroundColor = 'transparent';
      
      // Global text style
      if (!hasColor){
        clone.textStyle = Object.assign({}, clone.textStyle, { color: fg });
      }
      
      // Title text color
      if (clone.title){
        const setTitleColor = (o) => {
          if (!o) return o;
          o.textStyle = Object.assign({}, o.textStyle, { color: (o.textStyle && o.textStyle.color) || fg });
          return o;
        };
        if (Array.isArray(clone.title)){
          clone.title = clone.title.map(t => setTitleColor(Object.assign({}, t)));
        } else if (typeof clone.title === 'object'){
          clone.title = setTitleColor(Object.assign({}, clone.title));
        }
      }
      
      // Legend colors
      if (clone.legend){
        const gray = isDark ? '#8b949e' : '#6e7781';
        if (Array.isArray(clone.legend)){
          clone.legend = clone.legend.map(l => Object.assign({
            textStyle: Object.assign({ color: fg }, (l && l.textStyle) || {}),
            inactiveColor: l && l.inactiveColor || gray,
          }, l));
        } else if (typeof clone.legend === 'object'){
          clone.legend.textStyle = Object.assign({ color: fg }, clone.legend.textStyle || {});
          clone.legend.inactiveColor = clone.legend.inactiveColor || gray;
        }
      }
      
      // Geo/Map component theme adaptation
      if (clone.geo){
        const geos = Array.isArray(clone.geo) ? clone.geo : [clone.geo];
        geos.forEach(geo => {
          if (!geo) return;
          // Set label colors if not specified
          if (geo.label && !geo.label.color){
            geo.label.color = fg;
          }
          if (geo.emphasis && geo.emphasis.label && !geo.emphasis.label.color){
            geo.emphasis.label.color = fg;
          }
          // Adaptive item style for map regions
          if (!geo.itemStyle){
            geo.itemStyle = {
              areaColor: isDark ? '#37474f' : '#e0e0e0',
              borderColor: isDark ? '#607d8b' : '#bdbdbd'
            };
          }
          if (geo.emphasis && !geo.emphasis.itemStyle){
            geo.emphasis.itemStyle = {
              areaColor: isDark ? '#546e7a' : '#bdbdbd'
            };
          }
        });
      }
      
      // VisualMap component
      if (clone.visualMap){
        const vms = Array.isArray(clone.visualMap) ? clone.visualMap : [clone.visualMap];
        vms.forEach(vm => {
          if (!vm) return;
          if (vm.textStyle && !vm.textStyle.color){
            vm.textStyle.color = fg;
          } else if (!vm.textStyle){
            vm.textStyle = { color: fg };
          }
        });
      }
      
      // Axis labels (for 3D charts)
      ['xAxis3D', 'yAxis3D', 'zAxis3D'].forEach(key => {
        if (clone[key]){
          const items = Array.isArray(clone[key]) ? clone[key] : [clone[key]];
          items.forEach(item => {
            if (!item) return;
            // Axis label text color
            if (!item.axisLabel){
              item.axisLabel = {};
            }
            if (!item.axisLabel.color){
              item.axisLabel.color = fg;
            }
            // Axis line color
            if (!item.axisLine){
              item.axisLine = {};
            }
            if (!item.axisLine.lineStyle){
              item.axisLine.lineStyle = {};
            }
            if (!item.axisLine.lineStyle.color){
              item.axisLine.lineStyle.color = isDark ? '#607d8b' : '#9e9e9e';
            }
            // Axis name text color
            if (item.name && !item.nameTextStyle){
              item.nameTextStyle = { color: fg };
            } else if (item.nameTextStyle && !item.nameTextStyle.color){
              item.nameTextStyle.color = fg;
            }
            // Split line color
            if (!item.splitLine){
              item.splitLine = {};
            }
            if (!item.splitLine.lineStyle){
              item.splitLine.lineStyle = {};
            }
            if (!item.splitLine.lineStyle.color){
              item.splitLine.lineStyle.color = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            }
          });
        }
      });
      
      // Grid3D component - critical for 3D chart visibility
      if (clone.grid3D){
        const grids = Array.isArray(clone.grid3D) ? clone.grid3D : [clone.grid3D];
        grids.forEach(grid => {
          if (!grid) return;
          
          // Set transparent environment
          if (grid.environment === undefined){
            grid.environment = 'none';  // Transparent background for 3D charts
          }
          
          // Set light for better 3D effect with stronger intensity for transparent background
          if (!grid.light){
            grid.light = {
              main: {
                intensity: isDark ? 1.5 : 2.0,
                shadow: true,
                shadowQuality: 'high'
              },
              ambient: {
                intensity: isDark ? 0.5 : 0.6
              }
            };
          }
          
          // Axis pointer for better interaction
          if (!grid.axisPointer){
            grid.axisPointer = {
              show: true,
              lineStyle: {
                color: isDark ? '#fff' : '#333',
                width: 2
              }
            };
          }
          
          // Set background color to transparent
          if (!grid.backgroundColor){
            grid.backgroundColor = 'transparent';
          }
        });
      }
      
      // Globe component (3D earth)
      if (clone.globe){
        if (!clone.globe.baseColor){
          clone.globe.baseColor = isDark ? '#37474f' : '#e0e0e0';
        }
        if (clone.globe.label && !clone.globe.label.color){
          clone.globe.label.color = fg;
        }
      }
      
      return clone;
    }catch{
      return option;
    }
  }
  async function renderPlantUML(block){
    let code = block.innerText.trim();
  const highlight = block.closest('.highlight');
  const container = createContainer(highlight);
    // Prefer kroki (more features), fallback to official PlantUML server; force transparent bg
    try{
      await ensurePlantumlEncoder();
      // Inject transparent background if not specified
      if (!/skinparam\s+backgroundColor\s+transparent/i.test(code)){
        code = code.replace(/@start\w+/i, (m) => m + "\nskinparam backgroundColor transparent");
      }
      let url;
      if (window.plantumlEncoder){
        const encoded = window.plantumlEncoder.encode(code);
        const kroki = 'https://kroki.io/plantuml/svg/' + encoded;
        const plant = 'https://www.plantuml.com/plantuml/svg/' + encoded + '?bg=transparent';
        const img = document.createElement('img');
        img.alt = 'PlantUML diagram';
        img.style.background = 'transparent';
        img.src = kroki;
        img.onerror = () => { img.onerror = null; img.src = plant; };
        container.appendChild(img);
  if (highlight) highlight.style.display = 'none';
  container.dataset.lang = 'plantuml';
  container.dataset.code = code;
  block.dataset.diagramDone = '1';  // Mark as done!
      } else {
        const pre = document.createElement('pre');
        pre.textContent = '浏览器不支持压缩流，PlantUML 未渲染。';
        container.appendChild(pre);
  block.dataset.diagramDone = '1';  // Mark as done even if failed
      }
  }catch(e){ 
    console.error('plantuml render error', e);
    block.dataset.diagramDone = '1';  // Mark as done even on error
  }
  finally { delete block.dataset.diagramPending; }
  }

  async function ensurePlantumlEncoder(){
    if (window.plantumlEncoder) return;
    const urls = [
      'https://cdn.jsdelivr.net/npm/plantuml-encoder@1.4.0/dist/plantuml-encoder.min.js',
      'https://unpkg.com/plantuml-encoder@1.4.0/dist/plantuml-encoder.min.js'
    ];
    try{
      await loadAny(urls, () => !!window.plantumlEncoder, 5000);
    }catch{/* ignore */}
  }

  function process(){
    // Process all unprocessed blocks (allow multiple calls for dynamic content)
    const langBlocks = qsa('pre code.language-mermaid, pre code.language-flowchart, pre code.language-markmap, pre code.language-plantuml, pre code.language-echarts');
    langBlocks.forEach(codeEl => {
      if (codeEl.dataset.diagramDone === '1' || codeEl.dataset.diagramPending === '1') return;
      const lang = Array.from(codeEl.classList).find(c => c.startsWith('language-')).replace('language-','');
      // mark as pending before kicking off async render to avoid duplicate attempts
      codeEl.dataset.diagramPending = '1';
      if (lang === 'mermaid') return renderMermaid(codeEl);
      if (lang === 'flowchart') return renderFlowchart(codeEl);
      if (lang === 'markmap') return renderMarkmap(codeEl);
      if (lang === 'plantuml') return renderPlantUML(codeEl);
      if (lang === 'echarts') return renderEcharts(codeEl);
    });

  // Heuristic detection for language-fallback (GitHub-style highlighting often sets language-fallback)
  const fallbackBlocks = qsa('pre code.language-fallback');
  const maybeJsonBlocks = qsa('pre code.language-json, pre code.language-plain, pre code.language-plaintext, pre code.language-text');
  // Any code blocks not processed yet
  const anyBlocks = qsa('pre code').filter(el => !el.dataset.diagramDone && !el.dataset.diagramPending && !/language-(mermaid|flowchart|markmap|plantuml|echarts)/.test(el.className));
    const isMermaid = (t) => {
      const s = stripFrontmatter(t).trim();
      const keys = [
        'graph TD','graph LR','graph RL','graph BT','graph TB',
        'flowchart TD','flowchart LR','flowchart RL','flowchart BT','flowchart TB',
        'sequenceDiagram','classDiagram','stateDiagram','erDiagram','gantt','pie','mindmap',
        'timeline','journey','gitGraph','quadrantChart','requirementDiagram',
        'C4Context','C4Container','C4Component','C4Dynamic','sankey','xychart','block','subgraph',
        'packet','packetDiagram'
      ];
      return keys.some(k => s.startsWith(k));
    };
    const isFlowchartDSL = (t) => {
      // simple dsl signals
      return /(\w+)=>\w+:/m.test(t) && /->/.test(t);
    };
  const isPlantUML = (t) => /@start[a-z]+/i.test(t);
    const isEcharts = (t) => {
      const s = t.trim();
      if (!s.startsWith('{') || !s.endsWith('}')) return false;
      try{ const o = JSON.parse(s); return typeof o === 'object' && (o.series || o.xAxis || o.yAxis); }catch{ return false; }
    };
    const isMarkmap = (t) => {
      // naive: has a heading and multiple list items
      const lines = t.split(/\r?\n/);
      const hasH = lines.some(l => /^\s*#\s+/.test(l));
      const bullets = lines.filter(l => /^\s*-\s+/.test(l)).length;
      return hasH && bullets >= 2 && !/@startuml/.test(t);
    };
    function tryRender(codeEl){
      if (!codeEl || codeEl.dataset.diagramDone === '1' || codeEl.dataset.diagramPending === '1') return;
      const text = (codeEl && (codeEl.innerText || codeEl.textContent || '')).trim();
      if (!text) return;
      // set pending immediately to avoid another path picking it up
      codeEl.dataset.diagramPending = '1';
      if (isMermaid(text)) return renderMermaid(codeEl);
      if (isFlowchartDSL(text)) return renderFlowchart(codeEl);
      if (isPlantUML(text)) return renderPlantUML(codeEl);
      if (isMarkmap(text)) return renderMarkmap(codeEl);
      if (isEcharts(text)) return renderEcharts(codeEl);
    }
  fallbackBlocks.forEach(tryRender);
  maybeJsonBlocks.forEach(tryRender);
  anyBlocks.forEach(tryRender);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      process();
      // Run again after a short delay to catch any dynamically loaded content
      setTimeout(process, 500);
      setTimeout(process, 1500);
    });
  } else {
    process();
    // Run again after a short delay to catch any dynamically loaded content
    setTimeout(process, 500);
    setTimeout(process, 1500);
  }
  
  // Also run on window load to ensure everything is processed
  window.addEventListener('load', () => {
    setTimeout(process, 100);
    setTimeout(process, 1000);
  });

  // Respond to theme changes (if theme-mode.js toggles data-color-mode)
  const obs = new MutationObserver(async () => {
    // Re-render diagrams using stored source to adapt theme
    const containers = qsa('.diagram-rendered');
    for (const c of containers){
      const lang = c.dataset.lang;
      const code = c.dataset.code || '';
  if (!lang || !code) continue;
      try{
        if (lang === 'mermaid'){
          // Re-render mermaid with correct theme from CSS var
          const fg = getComputedStyle(c).color;
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: getMermaidCSSTheme(),
            themeVariables: {
              background: 'transparent',
              textColor: fg,
              primaryTextColor: fg,
              lineColor: fg,
              actorTextColor: fg,
              labelColor: fg,
              sequenceNumberColor: fg
            },
            flowchart: { useMaxWidth: true, nodeSpacing: 50, rankSpacing: 50 }
          });
          c.innerHTML = '';
          const id = 'm'+Math.random().toString(36).slice(2);
          const { svg } = await mermaid.render(id, code);
          c.innerHTML = svg;
        } else if (lang === 'flowchart'){
          c.innerHTML = '';
          await ensureFlowchart();
          const id = 'fc'+Math.random().toString(36).slice(2);
          const el = document.createElement('div');
          el.id = id;
          c.appendChild(el);
          const chart = window.flowchart.parse(code);
          chart.drawSVG(id, flowchartOptions(c));
        } else if (lang === 'markmap'){
          c.innerHTML = '';
          await rerenderMarkmap(c, code);
        } else if (lang === 'plantuml'){
          // PlantUML doesn't need theme re-rendering since it's a static image
          // Skip re-rendering to avoid duplicate images
          continue;
        } else if (lang === 'echarts'){
          c.innerHTML = '';
          // Re-render echarts from stored JSON
          await rerenderEcharts(c, code);
        }
      }catch(e){ /* noop */ }
    }
  });
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });
})();
