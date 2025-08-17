(function() {
    'use strict';
    
    console.log('=== Details 排序脚本开始加载 ===');
    
    let originalOrder = [];
    let isInitialized = false;
    
    function checkPage() {
        console.log('=== 检查页面是否启用排序 ===');
        
        const sortMeta = document.querySelector('meta[name="sort"]');
        console.log('找到的sort meta标签:', sortMeta);
        
        if (sortMeta) {
            console.log('meta标签内容:', sortMeta.content);
            const isEnabled = sortMeta.content === 'true';
            console.log('排序功能启用状态:', isEnabled);
            return isEnabled;
        }
        
        console.log('没有找到sort meta标签，排序功能未启用');
        return false;
    }
    
    function findDetailsElements() {
        const simpleDetails = document.querySelectorAll('.simple-details');
        const allDetails = document.querySelectorAll('details');
        
        console.log('找到 .simple-details:', simpleDetails.length);
        console.log('找到 details:', allDetails.length);
        
        return simpleDetails.length > 0 ? Array.from(simpleDetails) : Array.from(allDetails);
    }
    
    function createSortControls() {
        console.log('=== 创建排序控制按钮 ===');
        
        // 移除已存在的控制组
        const existing = document.getElementById('details-sort-controls');
        if (existing) {
            existing.remove();
        }
        
        // 创建按钮组
        const controls = document.createElement('div');
        controls.id = 'details-sort-controls';
        controls.className = 'details-sort-controls';
        
        controls.innerHTML = `
            <button class="sort-button" onclick="shuffleDetails()">
                <span class="icon">🔀</span> 打乱
            </button>
            <button class="sort-button" onclick="resetDetails()">
                <span class="icon">🔄</span> 重置
            </button>
        `;
        
        // 尝试插入到 post-header 的右上角
        const postHeader = document.getElementById('post-header');
        console.log('找到 post-header:', !!postHeader);
        
        if (postHeader) {
            // 直接插入到 post-header 容器中，CSS 会处理定位
            postHeader.appendChild(controls);
            console.log('✅ 排序控制按钮已插入到 post-header 右上角');
            return;
        }
        
        // 备用方案：插入到第一个details之前
        const details = findDetailsElements();
        if (details.length > 0) {
            const firstDetail = details[0];
            firstDetail.parentNode.insertBefore(controls, firstDetail);
            console.log('✅ 排序控制按钮已创建并插入到details前面（备用方案）');
        } else {
            console.log('❌ 没有找到details元素，无法插入控制按钮');
        }
    }

    function showMessage(text) {
        const existingMsg = document.getElementById('details-sort-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        const msg = document.createElement('div');
        msg.id = 'details-sort-message';
        msg.className = 'details-sort-message';
        msg.textContent = text;
        
        document.body.appendChild(msg);
        
        setTimeout(() => {
            if (msg && msg.parentNode) {
                msg.remove();
            }
        }, 2000);
    }
    
    function saveOrder(details) {
        originalOrder = details.map((detail, index) => {
            const parent = detail.parentNode;
            const allChildren = Array.from(parent.children);
            const position = allChildren.indexOf(detail);
            
            return {
                element: detail,
                parent: parent,
                nextSibling: detail.nextSibling,
                position: position,
                originalIndex: index
            };
        });
        
        console.log('✅ 已保存原始顺序，共', originalOrder.length, '个元素');
        console.log('原始顺序详情:', originalOrder.map(item => ({
            index: item.originalIndex,
            position: item.position,
            summary: item.element.querySelector('summary')?.textContent?.trim().substring(0, 50) + '...'
        })));
    }
    
    function restoreOrder() {
        if (originalOrder.length === 0) {
            console.log('❌ 没有保存的原始顺序');
            return false;
        }
        
        console.log('=== 开始恢复原始顺序 ===');
        
        // 按原始索引排序
        const sortedOrder = [...originalOrder].sort((a, b) => a.originalIndex - b.originalIndex);
        
        // 逐个恢复位置
        sortedOrder.forEach((item, index) => {
            const { element, parent, nextSibling } = item;
            
            if (nextSibling && nextSibling.parentNode === parent) {
                parent.insertBefore(element, nextSibling);
            } else {
                parent.appendChild(element);
            }
            
            console.log(`恢复第${index + 1}个元素:`, element.querySelector('summary')?.textContent?.trim().substring(0, 30) + '...');
        });
        
        console.log('✅ 原始顺序恢复完成');
        return true;
    }
    
    // 打乱顺序
    window.shuffleDetails = function() {
        console.log('=== 🔀 开始打乱 Details 顺序 ===');
        
        const details = findDetailsElements();
        if (details.length === 0) {
            console.log('❌ 没有找到details元素');
            showMessage('没有找到可排序的内容');
            return;
        }
        
        console.log('找到', details.length, '个details元素，开始打乱...');
        
        // 创建打乱后的数组
        const shuffled = [...details];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // 获取第一个details的父容器和位置
        const parent = details[0].parentNode;
        const referenceNode = details[0];
        
        // 重新插入所有元素
        shuffled.forEach((detail, index) => {
            if (index === 0) {
                parent.insertBefore(detail, referenceNode);
            } else {
                parent.insertBefore(detail, shuffled[index - 1].nextSibling);
            }
        });
        
        console.log('✅ Details 顺序打乱完成');
        showMessage('Details 顺序已打乱');
    }
    
    // 重置到原始顺序
    window.resetDetails = function() {
        console.log('=== 🔄 开始重置 Details 顺序 ===');
        
        if (restoreOrder()) {
            showMessage('Details 顺序已重置');
        } else {
            showMessage('重置失败：没有保存的原始顺序');
        }
    }
    
    function init() {
        if (isInitialized) {
            console.log('已经初始化过了，跳过');
            return;
        }
        
        console.log('=== 🚀 开始初始化 ===');
        console.log('页面标题:', document.title);
        console.log('页面URL:', window.location.href);
        console.log('DOM状态:', document.readyState);
        
        // 检查是否启用排序功能
        const isEnabled = checkPage();
        if (!isEnabled) {
            console.log('❌ 排序功能未启用，不创建控制按钮');
            isInitialized = true;
            return;
        }
        
        // 只有启用了排序功能才继续
        console.log('✅ 排序功能已启用，继续初始化...');
        
        const details = findDetailsElements();
        if (details.length > 0) {
            saveOrder(details);
            createSortControls();
            console.log('✅ 初始化完成 - 排序控制按钮已显示');
        } else {
            console.log('❌ 没有找到details元素，不创建控制按钮');
        }
        
        isInitialized = true;
    }
    
    function tryInit() {
        console.log('尝试初始化 - 当前时间:', new Date().toLocaleTimeString());
        init();
    }
    
    // 多种初始化时机
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        setTimeout(tryInit, 100);
    }
    
    // 备用初始化
    window.addEventListener('load', tryInit);
    
    // 再次备用
    setTimeout(tryInit, 500);
    setTimeout(tryInit, 1000);
    
    console.log('=== Details 排序脚本加载完成 ===');
})();
