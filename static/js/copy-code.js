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

        // 跳过 mermaid 代码块（class 或内容判断）
        if (
            codeElem &&
            (
                codeElem.classList.contains('language-mermaid') ||
                (codeElem.classList.contains('language-fallback') && mermaidKeywords.some(k => codeText.startsWith(k)))
            )
        ) {
            return;
        }

        // 跳过内容为 mermaid 图表的代码块（防止特殊情况）
        if (mermaidKeywords.some(k => codeText.startsWith(k))) {
            return;
        }

        // 只为真正的代码块添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', '复制代码');
        highlight.appendChild(copyButton);

        copyButton.addEventListener('click', function() {
            const codeElement = highlight.querySelector('code');
            const code = codeElement ? codeElement.textContent : highlight.textContent;

            navigator.clipboard.writeText(code).then(function() {
                copyButton.textContent = 'Copied!';
                copyButton.classList.add('copied');
                setTimeout(function() {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                const textArea = document.createElement('textarea');
                textArea.value = code;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    copyButton.textContent = 'Copied!';
                    copyButton.classList.add('copied');
                    setTimeout(function() {
                        copyButton.textContent = 'Copy';
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