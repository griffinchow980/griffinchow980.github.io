// 代码块复制功能
document.addEventListener('DOMContentLoaded', function() {
    // 为每个代码块添加复制按钮
    const highlights = document.querySelectorAll('.highlight');
    
    highlights.forEach(function(highlight) {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', '复制代码');
        
        // 添加按钮到代码块
        highlight.appendChild(copyButton);
        
        // 添加点击事件
        copyButton.addEventListener('click', function() {
            // 获取代码内容
            const codeElement = highlight.querySelector('code');
            const code = codeElement ? codeElement.textContent : highlight.textContent;
            
            // 复制到剪贴板
            navigator.clipboard.writeText(code).then(function() {
                // 显示复制成功状态
                copyButton.textContent = 'Copied!';
                copyButton.classList.add('copied');
                
                // 2秒后恢复原状
                setTimeout(function() {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch(function(err) {
                console.error('复制失败:', err);
                
                // 降级方案：使用旧的复制方法
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
