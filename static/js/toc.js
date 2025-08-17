/**
 * TOC (Table of Contents) 目录功能
 * 精简版，完全兼容 github-style 主题
 */
(function() {
    'use strict';
    
    let isOpen = false;
    let tocDetails, tocToggle, tocList;
    
    function initTOC() {
        tocDetails = document.querySelector("#toc-details");
        tocToggle = document.querySelector("#toc-toggle");
        tocList = document.querySelector("#toc-list");
        
        console.log('TOC Init:', { tocDetails, tocToggle, tocList });
        
        if (!tocDetails || !tocToggle || !tocList) {
            console.log('TOC elements not found');
            return;
        }
        
        // 绑定按钮点击事件
        tocToggle.addEventListener('click', toggleTOC);
        
        // 生成目录内容
        generateTOC();
        
        // 确保初始状态是隐藏的
        tocDetails.style.display = 'none';
        
        console.log('TOC initialized successfully');
    }
    
    function toggleTOC(event) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('TOC toggle clicked, current state:', isOpen);
        
        isOpen = !isOpen;
        
        if (isOpen) {
            showTOC();
        } else {
            hideTOC();
        }
    }
    
    function showTOC() {
        if (!tocDetails || !tocToggle) return;
        
        console.log('Showing TOC');
        
        tocDetails.style.display = 'block';
        positionTOC();
        
        // 监听滚动和窗口变化
        window.addEventListener('scroll', positionTOC, { passive: true });
        window.addEventListener('resize', positionTOC, { passive: true });
        
        // 点击外部关闭
        setTimeout(() => {
            document.addEventListener('click', closeOnOutsideClick);
        }, 100);
    }
    
    function hideTOC() {
        if (!tocDetails) return;
        
        tocDetails.style.display = 'none';
        
        // 移除事件监听
        window.removeEventListener('scroll', positionTOC);
        window.removeEventListener('resize', positionTOC);
        document.removeEventListener('click', closeOnOutsideClick);
    }
    
    function positionTOC() {
        if (!tocToggle || !tocDetails || !isOpen) return;
        
        const postHeader = document.getElementById('post-header');
        if (!postHeader) return;
        
        // 获取位置信息
        // postHeader 有 sticky-header 类，CSS 中定义为 position: sticky; top: 0;
        // 这意味着当页面滚动时，header 会固定在页面顶部
        const headerRect = postHeader.getBoundingClientRect();
        const toggleRect = tocToggle.getBoundingClientRect();
        
        // 计算菜单位置：紧贴 sticky header 下边框，无间距
        const top = headerRect.bottom;
        let left = toggleRect.left;
        
        // 防止菜单超出视窗
        const menuWidth = 280;
        const viewportWidth = window.innerWidth;
        
        if (left + menuWidth > viewportWidth - 16) {
            left = Math.max(16, viewportWidth - menuWidth - 16);
        }
        
        if (left < 16) {
            left = 16;
        }
        
        // 应用定位 - 使用 transform 保证性能
        tocDetails.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    }
    
    function closeOnOutsideClick(event) {
        if (!tocDetails || !tocToggle) return;
        
        if (!tocDetails.contains(event.target) && !tocToggle.contains(event.target)) {
            isOpen = false;
            hideTOC();
        }
    }
    
    function generateTOC() {
        if (!tocList) return;
        
        const markdownBody = document.querySelector('.markdown-body');
        if (!markdownBody) return;
        
        const headings = markdownBody.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        // 清空目录列表
        tocList.innerHTML = '';
        
        if (headings.length === 0) {
            const noHeadings = document.createElement('div');
            noHeadings.className = 'toc-item';
            noHeadings.style.color = 'var(--color-fg-muted)';
            noHeadings.textContent = '无目录';
            tocList.appendChild(noHeadings);
            return;
        }
        
        // 生成目录项
        headings.forEach(heading => {
            if (!heading.id) {
                // 生成唯一ID
                heading.id = heading.textContent
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    + '-' + Math.random().toString(36).substr(2, 5);
            }
            
            const level = parseInt(heading.tagName.charAt(1));
            const link = document.createElement('a');
            
            link.className = 'toc-item';
            link.href = `#${heading.id}`;
            // link.textContent = heading.textContent;
            // 清空链接内容，然后逐一克隆并添加标题的所有子节点
            link.innerHTML = '';
            Array.from(heading.childNodes).forEach(node => {
                link.appendChild(node.cloneNode(true));
            });

            // 根据标题级别设置缩进
            link.style.paddingLeft = `${8 + (level - 1) * 12}px`;
            
            // 点击TOC项时关闭菜单
            link.addEventListener('click', function() {
                isOpen = false;
                hideTOC();
            });
            
            tocList.appendChild(link);
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTOC);
    } else {
        initTOC();
    }
    
})();
