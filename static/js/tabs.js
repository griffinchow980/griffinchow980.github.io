/*!
 * Tabs 分页功能 - 适配 Hugo github-style 主题
 * 支持键盘导航和无障碍访问
 */
(function() {
  'use strict';

  function initTabs() {
    // 查找所有tabs容器
    const tabsContainers = document.querySelectorAll('.tabs-container');
    
    tabsContainers.forEach(function(container) {
      const tabs = container.querySelectorAll('.tab');
      const contents = container.querySelectorAll('.tab-content');
      
      if (tabs.length === 0 || contents.length === 0) return;
      
      // 为每个tab按钮添加事件监听
      tabs.forEach(function(tab, index) {
        // 点击事件
        tab.addEventListener('click', function() {
          const targetId = tab.getAttribute('data-tab');
          switchToTab(container, targetId);
        });
        
        // 键盘导航
        tab.addEventListener('keydown', function(e) {
          handleKeyNavigation(e, container, index);
        });
        
        // 设置无障碍属性
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
        tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
      });
      
      // 为内容区域设置无障碍属性
      contents.forEach(function(content) {
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-hidden', content.classList.contains('active') ? 'false' : 'true');
      });
      
      // 为tabs导航设置角色
      const tabsNav = container.querySelector('.tabs');
      if (tabsNav) {
        tabsNav.setAttribute('role', 'tablist');
        tabsNav.setAttribute('aria-label', 'Tabs');
      }
    });
  }
  
  function switchToTab(container, targetId) {
    const tabs = container.querySelectorAll('.tab');
    const contents = container.querySelectorAll('.tab-content');
    
    // 移除所有活跃状态
    tabs.forEach(function(tab) {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });
    
    contents.forEach(function(content) {
      content.classList.remove('active');
      content.setAttribute('aria-hidden', 'true');
    });
    
    // 激活目标tab
    const targetTab = container.querySelector('.tab[data-tab="' + targetId + '"]');
    const targetContent = container.querySelector('.tab-content#' + targetId);
    
    if (targetTab && targetContent) {
      targetTab.classList.add('active');
      targetTab.setAttribute('aria-selected', 'true');
      targetTab.setAttribute('tabindex', '0');
      
      targetContent.classList.add('active');
      targetContent.setAttribute('aria-hidden', 'false');
      
      // 聚焦到激活的tab（仅在键盘导航时）
      if (document.activeElement === targetTab || 
          container.contains(document.activeElement)) {
        targetTab.focus();
      }
    }
  }
  
  function handleKeyNavigation(e, container, currentIndex) {
    const tabs = container.querySelectorAll('.tab');
    let targetIndex = currentIndex;
    
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        targetIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        targetIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        targetIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        tabs[currentIndex].click();
        return;
      default:
        return;
    }
    
    if (tabs[targetIndex]) {
      const targetId = tabs[targetIndex].getAttribute('data-tab');
      switchToTab(container, targetId);
    }
  }
  
  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTabs);
  } else {
    initTabs();
  }
  
  // 支持动态内容（如果需要）
  if (typeof window !== 'undefined') {
    window.initTabs = initTabs;
  }
})();
