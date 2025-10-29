Place third-party browser bundles here to avoid external CDNs.
Required files for diagrams:
- d3.v6.min.js (D3 v6 UMD build - REQUIRED for markmap)
- markmap-lib.browser.min.js (markmap-lib 0.15.10 browser UMD)
- markmap-view.browser.min.js (markmap-view 0.15.10 browser UMD)
- echarts.min.js (ECharts UMD with map support)
- echarts-gl.min.js (ECharts GL extension for 3D charts)

How to obtain (download once, then serve locally):
- d3 v6: https://unpkg.com/d3@6/dist/d3.min.js (270KB)
- markmap-lib browser: https://unpkg.com/markmap-lib@0.15.10/dist/browser/index.min.js
- markmap-view browser: https://unpkg.com/markmap-view@0.15.10/dist/browser/index.min.js
- echarts: https://unpkg.com/echarts@5/dist/echarts.min.js
- echarts-gl: https://unpkg.com/echarts-gl@2/dist/echarts-gl.min.js

Rename to the target filenames listed above after downloading.

Note: D3 v6 is used for markmap compatibility. The system will fall back to CDN if local file is unavailable.
