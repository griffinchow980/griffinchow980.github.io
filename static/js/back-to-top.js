// 回到顶部功能
document.addEventListener('DOMContentLoaded', function() {
    // 创建回到顶部按钮
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', '回到顶部');
    backToTopButton.setAttribute('title', '回到顶部');
    backToTopButton.setAttribute('tabindex', '0');
    
    // 添加 SVG 图标
    backToTopButton.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
    `;
    
    // 添加按钮到页面
    document.body.appendChild(backToTopButton);
    
    // 滚动事件监听
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // 点击事件监听
    backToTopButton.addEventListener('click', function() {
        // 平滑滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 添加点击动画效果
        backToTopButton.style.transform = 'scale(0.95)';
        setTimeout(function() {
            backToTopButton.style.transform = '';
        }, 150);
    });
    
    // 键盘支持 (可选)
    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            backToTopButton.click();
        }
    });
    
    // 让按钮可以通过 Tab 键聚焦
    backToTopButton.setAttribute('tabindex', '0');
});
