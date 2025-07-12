(function() {
    'use strict';
    
    // 环境检测
    const isGitHubPages = location.hostname.includes('github.io');
    const isLocalhost = location.hostname === 'localhost';
    
    console.log('Details Sort Environment:', {
        isGitHubPages,
        isLocalhost,
        protocol: location.protocol,
        hostname: location.hostname
    });
    
    // 存储管理 - GitHub Pages 优化版本
    const StorageManager = {
        prefix: isGitHubPages ? 'ghp_ds_' : 'loc_ds_',
        
        set(key, value) {
            const fullKey = this.prefix + key;
            try {
                localStorage.setItem(fullKey, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Storage failed:', e);
                return false;
            }
        },
        
        get(key) {
            const fullKey = this.prefix + key;
            try {
                const item = localStorage.getItem(fullKey);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('Storage read failed:', e);
                return null;
            }
        },
        
        remove(key) {
            const fullKey = this.prefix + key;
            try {
                localStorage.removeItem(fullKey);
            } catch (e) {
                console.warn('Storage remove failed:', e);
            }
        },
        
        clearAll() {
            try {
                const keys = Object.keys(localStorage).filter(key => 
                    key.startsWith(this.prefix)
                );
                keys.forEach(key => localStorage.removeItem(key));
                console.log('Cleared storage keys:', keys);
            } catch (e) {
                console.warn('Storage clear failed:', e);
            }
        }
    };
    
    // 强化重置功能
    function resetDetailsSort() {
        console.log('Starting details sort reset...');
        
        // 1. 清除存储
        StorageManager.clearAll();
        
        // 2. 重置 DOM
        const containers = document.querySelectorAll('.details-container');
        containers.forEach((container, containerIndex) => {
            const details = Array.from(container.querySelectorAll('details'));
            
            // 重置到原始顺序
            details.forEach((detail, index) => {
                detail.style.order = '';
                detail.style.transform = '';
                detail.removeAttribute('data-original-index');
                detail.removeAttribute('data-sort-key');
            });
            
            // 物理重排（重要！）
            const parent = container.parentNode;
            const nextSibling = container.nextSibling;
            parent.removeChild(container);
            
            // 强制重排
            requestAnimationFrame(() => {
                parent.insertBefore(container, nextSibling);
                console.log(`Container ${containerIndex} reset completed`);
            });
        });
        
        // 3. 重置按钮状态
        resetButtonStates();
        
        console.log('Reset completed');
    }
    
    function resetButtonStates() {
        // 隐藏重置按钮
        document.querySelectorAll('.details-reset-btn').forEach(btn => {
            btn.style.display = 'none';
        });
        
        // 重置排序按钮
        document.querySelectorAll('.details-sort-btn').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        });
    }
    
    // 绑定重置事件
    function bindResetEvents() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('details-reset-btn')) {
                e.preventDefault();
                resetDetailsSort();
            }
        });
    }
    
    // 初始化
    function init() {
        bindResetEvents();
        
        // GitHub Pages 特殊处理
        if (isGitHubPages) {
            console.log('Applying GitHub Pages optimizations...');
            
            // 页面可见性变化时检查状态
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    setTimeout(() => {
                        console.log('Page visible, checking states...');
                    }, 200);
                }
            });
        }
    }
    
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 全局导出供调试
    window.DetailsSort = {
        reset: resetDetailsSort,
        storage: StorageManager
    };
    
})();