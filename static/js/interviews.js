document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('interview-details');
  if (!container) return; // 如果不在interviews页面，直接退出
  const filtersBox = document.getElementById('interviews-filters');
  
  const shuffleBtn = document.getElementById('shuffle-button');
  const testBtn = document.getElementById('test-button');
  const resetBtn = document.getElementById('reset-button');
  const categoryDropdown = document.getElementById('category-dropdown');
  const tagsDropdown = document.getElementById('tags-dropdown');
  
  console.log("Interviews.js loaded - Found dropdowns:", categoryDropdown ? "Categories OK" : "Categories Missing", tagsDropdown ? "Tags OK" : "Tags Missing");

  // 初始化Select2插件
  if (typeof $ !== 'undefined' && typeof $.fn.select2 !== 'undefined') {
    $('#category-dropdown').select2({
      placeholder: "选择或搜索分类...",
      allowClear: true,
      closeOnSelect: false,
      width: '100%'
    });
    
    $('#tags-dropdown').select2({
      placeholder: "选择或搜索标签...",
      allowClear: true,
      closeOnSelect: false,
      width: '100%'
    });
    console.log("Select2 initialized for dropdowns with search enabled");
    // 确保在 Select2 下也能触发筛选
    try {
      const $cat = $('#category-dropdown');
      const $tags = $('#tags-dropdown');
      $cat.on('change select2:select select2:unselect', () => updateVisibility && updateVisibility());
      $tags.on('change select2:select select2:unselect', () => updateVisibility && updateVisibility());
    } catch (e) { /* no-op */ }
    if (filtersBox) filtersBox.setAttribute('data-enhanced', '1');
  } else {
    console.warn("jQuery or Select2 library not loaded, using native selects");
    // 没有Select2时也立即显示，避免一直隐藏
    if (filtersBox) filtersBox.setAttribute('data-enhanced', '1');
  }

  // 兜底：如果在1秒后还没显示，强制显示，避免偶发阻塞
  if (filtersBox) {
    setTimeout(() => {
      if (filtersBox.getAttribute('data-enhanced') !== '1') {
        filtersBox.setAttribute('data-enhanced', '1');
      }
    }, 1000);

    // 根据 sticky 状态切换圆角：贴顶时去掉顶部圆角
    const updateStickyState = () => {
      try {
        const rect = filtersBox.getBoundingClientRect();
        if (rect.top <= 0) {
          filtersBox.classList.add('is-stuck');
        } else {
          filtersBox.classList.remove('is-stuck');
        }
      } catch (_) { /* no-op */ }
    };
    window.addEventListener('scroll', updateStickyState, { passive: true });
    window.addEventListener('resize', updateStickyState);
    // 初始调用
    updateStickyState();
  }

  // Helper to get all top-level <details> that are **direct** children of #interview-details
  function getTopDetails() {
    const details = Array.from(container.children).filter(el => el.tagName && el.tagName.toLowerCase() === 'details');
    return details;
  }

  // Helper: Fisher-Yates shuffle
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /* ------------------------------------------------------------
     1.  Flatten details blocks so that every <details> sits
         directly under #interview-details. This removes the
         original per-file spacing and makes later shuffling easy.
  -------------------------------------------------------------*/
  const fileBlocks = Array.from(container.querySelectorAll('.interview-file-content'));
  console.log(`Found ${fileBlocks.length} file blocks to process`);
  
  fileBlocks.forEach(block => {
    const cat = block.dataset.category;
    // Only pick FIRST-LEVEL <details> (ignore any nested inside another <details>)
    const detailsEls = Array.from(block.querySelectorAll('details')).filter(d => !d.parentElement.closest('details'));
    console.log(`Processing category ${cat}: ${detailsEls.length} details elements`);
    
    detailsEls.forEach(d => {
      d.dataset.category = cat;
      container.appendChild(d); // move to root level
    });
    block.remove();
  });
  
  // Now we have only top-level <details> sitting directly under #interview-details
  const originalOrder = getTopDetails();
  console.log(`Total details elements after processing: ${originalOrder.length}`);
  
  // 处理嵌套details
  function handleNestedDetails() {
    // 获取所有嵌套的details
    const nestedDetails = container.querySelectorAll('details details');
    
    // 为每个嵌套details添加事件处理
    nestedDetails.forEach(detail => {
      // 确保点击嵌套details时不会触发父级details的事件
      detail.addEventListener('click', function(event) {
        // 阻止事件冒泡
        event.stopPropagation();
      });
      
      // 确保点击嵌套details的summary时不会触发父级details的事件
      const summary = detail.querySelector('summary');
      if (summary) {
        summary.addEventListener('click', function(event) {
          event.stopPropagation();
        });
      }
    });
  }
  
  // 执行嵌套details处理
  handleNestedDetails();

  // 添加旋转箭头功能
  function setupArrowRotation() {
    // 找到所有details元素
    const allDetails = document.querySelectorAll('#interview-details details');
    
    // 为每个details添加toggle事件监听器
    allDetails.forEach(function(details) {
      // 获取箭头元素（直接子元素的summary中的arrow）
      const arrow = details.querySelector(':scope > summary > .arrow');
      if (!arrow) return;
      
      // 初始化箭头状态
      if (details.open) {
        arrow.style.transform = 'rotate(90deg)';
        arrow.style.transition = 'transform 0.3s';
      } else {
        arrow.style.transform = 'rotate(0deg)';
        arrow.style.transition = 'transform 0.3s';
      }
      
      // 添加toggle事件监听器
      details.addEventListener('toggle', function() {
        if (this.open) {
          arrow.style.transform = 'rotate(90deg)';
          arrow.style.transition = 'transform 0.3s';
        } else {
          arrow.style.transform = 'rotate(0deg)';
          arrow.style.transition = 'transform 0.3s';
        }
      });
    });
    
    // 特别处理嵌套details
    const nestedDetails = document.querySelectorAll('#interview-details details details');
    nestedDetails.forEach(function(nestedDetail) {
      // 获取嵌套details的箭头
      const nestedArrow = nestedDetail.querySelector(':scope > summary > .arrow');
      if (!nestedArrow) return;
      
      // 确保嵌套details的箭头初始状态正确
      if (nestedDetail.open) {
        nestedArrow.style.transform = 'rotate(90deg)';
      } else {
        nestedArrow.style.transform = 'rotate(0deg)'; // 确保初始状态是水平的
      }
      
      // 防止事件冒泡
      nestedDetail.addEventListener('click', function(e) {
        e.stopPropagation();
      });
      
      // 为嵌套details添加toggle事件监听
      nestedDetail.addEventListener('toggle', function(e) {
        // 阻止事件冒泡
        e.stopPropagation();
        
        if (this.open) {
          nestedArrow.style.transform = 'rotate(90deg)';
          nestedArrow.style.transition = 'transform 0.3s';
        } else {
          nestedArrow.style.transform = 'rotate(0deg)';
          nestedArrow.style.transition = 'transform 0.3s';
        }
      });
    });
  }
  
  // 执行箭头旋转设置
  setupArrowRotation();
  
  // DOM变化时重新设置箭头旋转
  const observer = new MutationObserver(() => {
    setupArrowRotation();
    updateInterviewsCounter();
  });
  observer.observe(container, { childList: true, subtree: true });

  // Update the Interviews counter (may exist multiple places)
  function updateInterviewsCounter() {
    const visibleCount = getTopDetails().filter(d => d.style.display !== 'none').length;
    const totalCount = getTopDetails().length;
    
    document.querySelectorAll('.interviews-counter').forEach(counter => {
      counter.textContent = visibleCount;
    });
  }

  // 收集所有可用标签
  function collectAllTags() {
    const allTags = new Set();
    
    // 遍历所有details元素，收集它们的标签
    getTopDetails().forEach(detail => {
      const tags = detail.dataset.tags;
      if (tags) {
        // 将标签字符串分割成数组，去除空白，并添加到Set中
        tags.split(',').forEach(tag => {
          const trimmedTag = tag.trim();
          if (trimmedTag) {
            allTags.add(trimmedTag);
          }
        });
      }
    });
    
    // 将Set转换为排序后的数组
    return Array.from(allTags).sort();
  }

  function initTagsDropdown() {
    const allTags = collectAllTags();
    console.log(`Found ${allTags.length} unique tags`);

    if (tagsDropdown) {
      // 只保留 value="all" 的 option，其它全部移除
      Array.from(tagsDropdown.options).forEach(opt => {
        if (opt.value !== 'all') tagsDropdown.removeChild(opt);
      });

      // 防止重复添加
      const exists = new Set(Array.from(tagsDropdown.options).map(opt => opt.value));

      // 添加所有标签作为选项
      allTags.forEach(tag => {
        if (!exists.has(tag)) {
          const option = document.createElement('option');
          option.value = tag;
          option.textContent = tag;
          tagsDropdown.appendChild(option);
        }
      });

      // 如果使用Select2，刷新
      if (typeof $ !== 'undefined' && typeof $.fn.select2 !== 'undefined') {
        $(tagsDropdown).trigger('change');
      }
    }
  }
  
  // 在页面加载后初始化标签下拉框
  initTagsDropdown();
  // 初始化后应用一次过滤，确保状态正确
  // 将在 Select2 绑定之后也会再次触发
  
  function getSelectedValues(selectEl) {
    if (!selectEl) return [];
    if (typeof $ !== 'undefined' && typeof $.fn.select2 !== 'undefined') {
      const v = $(selectEl).val();
      if (v == null) return [];
      return Array.isArray(v) ? v : [v];
    }
    return Array.from(selectEl.selectedOptions).map(opt => opt.value);
  }

  /* ---------------- 筛选逻辑 ----------------- */
  function updateVisibility() {
    // 获取选中的分类
    const selectedCategories = getSelectedValues(categoryDropdown);
    const allCategoriesSelected = selectedCategories.includes('all') || selectedCategories.length === 0;
    
    // 获取选中的标签
    const selectedTags = getSelectedValues(tagsDropdown);
    const allTagsSelected = selectedTags.includes('all') || selectedTags.length === 0;
    
    console.log("Selected categories:", selectedCategories, "All selected:", allCategoriesSelected);
    console.log("Selected tags:", selectedTags, "All tags selected:", allTagsSelected);

    // 获取所有顶层details元素
    const allDetails = getTopDetails();

    // 根据选中的分类和标签显示/隐藏details
    allDetails.forEach(detail => {
      const detailCategory = detail.dataset.category;
      const detailTags = detail.dataset.tags ? detail.dataset.tags.split(',').map(tag => tag.trim()) : [];
      
      // 检查分类是否匹配
      const categoryMatch = allCategoriesSelected || selectedCategories.includes(detailCategory);
      
      // 检查标签是否匹配（如果选择了标签且details有标签）
      let tagMatch = allTagsSelected;
      
      if (!allTagsSelected && detailTags.length > 0) {
        // 只要有一个标签匹配就显示
        tagMatch = selectedTags.some(tag => detailTags.includes(tag));
      }
      
      // 只有当分类和标签都匹配时才显示
      detail.style.display = (categoryMatch && tagMatch) ? 'block' : 'none';
    });
    
    // 更新计数器
    updateInterviewsCounter();
  }

  // 下拉框事件处理
  if (categoryDropdown) {
    categoryDropdown.addEventListener('change', () => {
      console.log("Category dropdown changed");
      // 如存在"all"选项则按其逻辑，否则空选表示全部，不强制选择
      const allOption = Array.from(categoryDropdown.options).find(opt => opt.value === 'all');
      const selectedOptions = Array.from(categoryDropdown.selectedOptions);
      if (allOption) {
        if (selectedOptions.includes(allOption)) {
          Array.from(categoryDropdown.options).forEach(opt => { if (opt.value !== 'all') opt.selected = false; });
        } else if (selectedOptions.length === 0) {
          allOption.selected = true;
        }
      }
      
      updateVisibility();
      
      // 如果使用Select2，刷新
      if (typeof $ !== 'undefined' && typeof $.fn.select2 !== 'undefined') {
        $(categoryDropdown).trigger('change.select2');
      }
    });
  }
  
  if (tagsDropdown) {
    tagsDropdown.addEventListener('change', () => {
      console.log("Tags dropdown changed");
      // 如存在"all"选项则按其逻辑，否则空选表示全部
      const allOption = Array.from(tagsDropdown.options).find(opt => opt.value === 'all');
      const selectedOptions = Array.from(tagsDropdown.selectedOptions);
      if (allOption) {
        if (selectedOptions.includes(allOption)) {
          Array.from(tagsDropdown.options).forEach(opt => { if (opt.value !== 'all') opt.selected = false; });
        } else if (selectedOptions.length === 0) {
          allOption.selected = true;
        }
      }
      
      updateVisibility();
      
      // 如果使用Select2，刷新
      if (typeof $ !== 'undefined' && typeof $.fn.select2 !== 'undefined') {
        $(tagsDropdown).trigger('change.select2');
      }
    });
  }
  
  // 初始筛选
  updateVisibility();
  
  // 初始计数器更新
  updateInterviewsCounter();

  /* ---------------- Shuffle all visible details ----------------- */
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      const visibleDetails = getTopDetails()
        .filter(d => d.style.display !== 'none');
      const shuffled = shuffle([...visibleDetails]);
      shuffled.forEach(d => container.appendChild(d));
      
      // 重新处理嵌套details，确保它们的事件处理正确
      handleNestedDetails();
      setupArrowRotation();
    });
  }

  /* ---------------- Test: pick 2 visible per category ------------- */
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      // 获取选中的分类
  const selectedCategories = getSelectedValues(categoryDropdown);
      const allCategoriesSelected = selectedCategories.includes('all') || selectedCategories.length === 0;
      
      // 获取选中的标签
  const selectedTags = getSelectedValues(tagsDropdown);
      const allTagsSelected = selectedTags.includes('all') || selectedTags.length === 0;

      // 获取符合当前筛选条件的details
      const visible = getTopDetails().filter(d => {
        const detailCategory = d.dataset.category;
        const detailTags = d.dataset.tags ? d.dataset.tags.split(',').map(tag => tag.trim()) : [];
        
        // 检查分类是否匹配
        const categoryMatch = allCategoriesSelected || selectedCategories.includes(detailCategory);
        
        // 检查标签是否匹配
        let tagMatch = allTagsSelected;
        if (!allTagsSelected && detailTags.length > 0) {
          tagMatch = selectedTags.some(tag => detailTags.includes(tag));
        }
        
        return categoryMatch && tagMatch;
      });

      const map = {};
      visible.forEach(d => {
        const cat = d.dataset.category;
        (map[cat] = map[cat] || []).push(d);
      });
      
      // hide all first
      getTopDetails().forEach(d => (d.style.display = 'none'));
      
      // show 2 per cat for selected categories only
      Object.entries(map).forEach(([cat, list]) => {
        if (allCategoriesSelected || selectedCategories.includes(cat)) {
          shuffle(list).slice(0, 2).forEach(d => (d.style.display = 'block'));
        }
      });
      
      // Update the counter after filtering
      updateInterviewsCounter();
    });
  }

  /* ---------------- Reset: show all & go top ---------------- */
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // 重置分类下拉框 - 只选择"All"
      if (categoryDropdown) {
        Array.from(categoryDropdown.options).forEach(opt => {
          opt.selected = opt.value === 'all';
        });
        
        // 如果使用Select2，刷新
        if (typeof $ !== 'undefined' && typeof $.fn.select2 !== 'undefined') {
          $(categoryDropdown).trigger('change.select2');
        }
      }
      
      // 重置标签下拉框 - 只选择"All"
      if (tagsDropdown) {
        Array.from(tagsDropdown.options).forEach(opt => {
          opt.selected = opt.value === 'all';
        });
        
        // 如果使用Select2，刷新
        if (typeof $ !== 'undefined' && typeof $.fn.select2 !== 'undefined') {
          $(tagsDropdown).trigger('change.select2');
        }
      }
      
      // 显示所有details
      const allDetails = getTopDetails();
      allDetails.forEach(d => (d.style.display = 'block'));
      
      // 恢复原始DOM顺序
      originalOrder.forEach(d => container.appendChild(d));
      
  // 折叠所有展开的 details（包含嵌套）
  container.querySelectorAll('details[open]').forEach(el => { el.open = false; });
      
      // 重新处理嵌套details和箭头旋转
      handleNestedDetails();
      setupArrowRotation();
      
      // 更新计数器
      updateInterviewsCounter();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
  