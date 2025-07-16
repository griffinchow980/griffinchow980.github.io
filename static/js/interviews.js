document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('interview-details');
  if (!container) return; // 如果不在interviews页面，直接退出
  
  const shuffleBtn = document.getElementById('shuffle-button');
  const testBtn = document.getElementById('test-button');
  const resetBtn = document.getElementById('reset-button');
  const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
  
  console.log("Interviews.js loaded - Found checkboxes:", categoryCheckboxes.length);

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

  /* ---------------- Category filtering ----------------- */
  function updateCategoryVisibility() {
    // Get all selected categories
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.dataset.category);
    
    console.log("Selected categories:", selectedCategories);

    // Check if "All" is selected
    const allSelected = selectedCategories.includes('all');

    // Get all top-level details
    const allDetails = getTopDetails();

    // Show/hide details based on selected categories
    allDetails.forEach(d => {
      const detailCategory = d.dataset.category;
      const shouldShow = allSelected || selectedCategories.includes(detailCategory);
      
      d.style.display = shouldShow ? 'block' : 'none';
    });
    
    // Update the counter after filtering
    updateInterviewsCounter();
  }

  // Handle "All" checkbox special behavior
  function handleAllCheckbox() {
    const allCheckbox = document.querySelector('.category-checkbox[data-category="all"]');
    if (!allCheckbox) {
      console.warn("All checkbox not found!");
      return;
    }

    // When "All" is checked, uncheck others
    allCheckbox.addEventListener('change', () => {
      if (allCheckbox.checked) {
        categoryCheckboxes.forEach(cb => {
          if (cb.dataset.category !== 'all') {
            cb.checked = false;
          }
        });
      }
      updateCategoryVisibility();
    });

    // When any other category is checked, uncheck "All"
    categoryCheckboxes.forEach(cb => {
      if (cb.dataset.category !== 'all') {
        cb.addEventListener('change', () => {
          if (cb.checked) {
            allCheckbox.checked = false;
          }
          // If no categories are selected, check "All"
          const anyChecked = Array.from(categoryCheckboxes)
            .filter(cb => cb.dataset.category !== 'all')
            .some(cb => cb.checked);
          if (!anyChecked) {
            allCheckbox.checked = true;
          }
          updateCategoryVisibility();
        });
      }
    });
  }

  // Initialize category checkboxes
  categoryCheckboxes.forEach(cb => {
    if (cb.dataset.category === 'all') {
      cb.checked = true;
    } else {
      cb.checked = false;
    }
    
    // Ensure checkbox change events update visibility
    cb.addEventListener('change', () => {
      console.log(`Change event on ${cb.dataset.category} checkbox, checked=${cb.checked}`);
      updateCategoryVisibility();
    });
  });
  
  handleAllCheckbox();
  updateCategoryVisibility();
  
  // Initial counter update
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
      // Get all selected categories
      const selectedCategories = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.dataset.category);

      // Check if "All" is selected
      const allSelected = selectedCategories.includes('all');

      // Get visible details
      const visible = getTopDetails()
        .filter(d => allSelected || selectedCategories.includes(d.dataset.category));

      const map = {};
      visible.forEach(d => {
        const cat = d.dataset.category;
        (map[cat] = map[cat] || []).push(d);
      });
      
      // hide all first
      getTopDetails().forEach(d => (d.style.display = 'none'));
      
      // show 2 per cat for selected categories only
      Object.entries(map).forEach(([cat, list]) => {
        if (allSelected || selectedCategories.includes(cat)) {
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
      // Reset checkboxes - select only "All"
      categoryCheckboxes.forEach(cb => {
        cb.checked = cb.dataset.category === 'all';
      });
      
      // Show all details
      const allDetails = getTopDetails();
      allDetails.forEach(d => (d.style.display = 'block'));
      
      // Restore original DOM order
      originalOrder.forEach(d => container.appendChild(d));
      
      // 重新处理嵌套details和箭头旋转
      handleNestedDetails();
      setupArrowRotation();
      
      // Update the counter after reset
      updateInterviewsCounter();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
  