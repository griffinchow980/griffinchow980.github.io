document.addEventListener('DOMContentLoaded', function() {
    const highlights = document.querySelectorAll('.highlight');
    const mermaidKeywords = [
      'graph TD', 'graph LR', 'graph RL', 'graph BT', 'graph TB', // Flowchart
      'flowchart TD', 'flowchart LR', 'flowchart RL', 'flowchart BT', 'flowchart TB',
      'sequenceDiagram', // Sequence Diagram
      'classDiagram', // Class Diagram
      'stateDiagram', // State Diagram
      'erDiagram', // Entity Relationship Diagram
      'gantt', // Gantt Chart
      'pie', // Pie Chart
      'mindmap', // Mindmap
      'timeline', // Timeline
      'journey', // User Journey
      'gitGraph', // GitGraph
      'quadrantChart', // Quadrant Chart
      'requirementDiagram', // Requirement Diagram
      'C4Context', 'C4Container', 'C4Component', 'C4Dynamic', // C4 Model
      'sankey', // Sankey Diagram
      'xychart', // XY Chart
      'block', // Block Diagram
      'zenuml', // ZenUML Sequence Diagram
      'subgraph' // Subgraph (for nested graphs)
    ];

    // 定义复制按钮的图标
    const ICON_COPY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>`;
    const ICON_COPIED = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg>`;

    const DIAGRAM_LANGS = new Set(['language-mermaid','language-flowchart','language-markmap','language-plantuml','language-echarts']);

    highlights.forEach(function(highlight) {
        // 如果 highlight 内部有 .mermaid 元素，跳过
        if (highlight.querySelector('.mermaid')) {
            return;
        }

        // 如果 highlight 本身就是 mermaid 图表，跳过
        if (highlight.classList.contains('mermaid')) {
            return;
        }

        const codeElem = highlight.querySelector('code');
        const codeText = codeElem ? codeElem.innerText.trim() : '';

    // 跳过 mermaid/flowchart/markmap/plantuml 代码块（class 或内容判断）
        if (
            codeElem &&
            (
        Array.from(codeElem.classList).some(cls => DIAGRAM_LANGS.has(cls)) ||
                (codeElem.classList.contains('language-fallback') && mermaidKeywords.some(k => codeText.startsWith(k)))
            )
        ) {
            return;
        }

                // 跳过内容为图表DSL（mermaid/flowchart/plantuml/markmap）的代码块（防止特殊情况）
                if (
                    mermaidKeywords.some(k => codeText.startsWith(k)) ||
                    (/(@startuml)/.test(codeText)) ||
                    (/(\w+)=>\w+:/m.test(codeText) && /->/.test(codeText)) ||
                    ((/^\s*#\s+/.test(codeText)) && (codeText.split(/\r?\n/).filter(l => /^\s*-\s+/.test(l)).length >= 2))
                ) {
            return;
        }

        // 只为真正的代码块添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.innerHTML = ICON_COPY;
        copyButton.setAttribute('aria-label', '复制代码');
        highlight.appendChild(copyButton);

        copyButton.addEventListener('click', function() {
            const codeElement = highlight.querySelector('code');
            const code = codeElement ? codeElement.textContent : highlight.textContent;

            navigator.clipboard.writeText(code).then(function() {
                copyButton.innerHTML = ICON_COPIED;
                copyButton.classList.add('copied');
                setTimeout(function() {
                    copyButton.innerHTML = ICON_COPY;
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                const textArea = document.createElement('textarea');
                textArea.value = code;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    copyButton.innerHTML = ICON_COPIED;
                    copyButton.classList.add('copied');
                    setTimeout(function() {
                        copyButton.innerHTML = ICON_COPY;
                        copyButton.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('复制失败:', err);
                }
                document.body.removeChild(textArea);
            });
        });
    });
});