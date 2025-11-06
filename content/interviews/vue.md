---
title: "Vue"
date: 2024-11-05
---

# Vue 基础

{{< details "**Vue 2 和 Vue 3 有哪些主要区别？**" >}}

主要区别包括：

**性能提升**：
- Vue 3 使用 Proxy 代替 Object.defineProperty，性能更好
- 编译器优化，静态提升，事件缓存
- Tree-shaking 支持更好，打包体积更小

**Composition API**：
- Vue 3 引入 Composition API，提供更好的逻辑复用
- setup 函数替代选项式 API

**其他特性**：
- 支持多个根节点（Fragments）
- Teleport 组件
- Suspense 组件
- 更好的 TypeScript 支持

{{< /details >}}

{{< details "**什么是响应式原理？Vue 2 和 Vue 3 的实现有何不同？**" >}}

**Vue 2 响应式原理**：
- 使用 `Object.defineProperty` 劫持对象属性的 getter/setter
- 通过依赖收集和派发更新实现响应式
- 局限性：无法检测对象属性的添加/删除，数组索引和长度的变化

**Vue 3 响应式原理**：
- 使用 `Proxy` 代理整个对象
- 可以监听对象属性的添加/删除，数组的变化
- 性能更好，支持 Map、Set 等数据结构

```javascript
// Vue 2
Object.defineProperty(obj, 'key', {
  get() { /* 收集依赖 */ },
  set() { /* 触发更新 */ }
});

// Vue 3
new Proxy(obj, {
  get(target, key) { /* 收集依赖 */ },
  set(target, key, value) { /* 触发更新 */ }
});
```

{{< /details >}}

{{< details "**v-if 和 v-show 的区别？什么时候使用哪个？**" >}}

- `v-if`：条件渲染，会销毁和重建 DOM 元素，有更高的切换开销
- `v-show`：只是切换 CSS `display` 属性，有更高的初始渲染开销

**使用场景**：
- 频繁切换：使用 `v-show`
- 条件很少改变：使用 `v-if`
- 涉及权限控制：使用 `v-if`（不渲染 DOM）

{{< /details >}}

{{< details "**computed 和 watch 的区别？**" >}}

**computed（计算属性）**：
- 基于依赖缓存，只有依赖变化才会重新计算
- 必须有返回值
- 适合：复杂的数据计算、过滤、排序

**watch（侦听器）**：
- 监听数据变化执行回调
- 不需要返回值
- 适合：异步操作、开销较大的操作、监听 props 变化

```javascript
// computed
computed: {
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// watch
watch: {
  firstName(newVal) {
    this.fetchUserData(newVal); // 异步操作
  }
}
```

{{< /details >}}

{{< details "**Vue 的 key 属性有什么作用？**" >}}

`key` 是 Vue 用于识别 VNode 的唯一标识，在 diff 算法中起到关键作用。

**作用**：
- 帮助 Vue 追踪节点的身份，优化更新性能
- 重用和重新排序现有元素
- 强制替换元素而不是复用

**注意事项**：
- 不要使用数组索引作为 key（会导致性能问题和状态错误）
- key 应该是稳定、唯一的标识符
- 使用 v-for 时必须提供 key

{{< /details >}}

# 组件通信

{{< details "**Vue 组件间通信有哪些方式？**" >}}

1. **Props / Emit**：父子组件通信
2. **Provide / Inject**：祖先组件向后代组件传递数据
3. **Event Bus**：任意组件间通信（Vue 3 推荐使用 mitt 库）
4. **Vuex / Pinia**：全局状态管理
5. **$attrs / $listeners**：透传属性和事件
6. **$parent / $children**：直接访问父子组件实例（不推荐）
7. **ref**：获取组件实例

{{< /details >}}

{{< details "**如何实现父子组件双向绑定？**" >}}

使用 `v-model` 或 `.sync` 修饰符（Vue 2）/ `v-model:propName`（Vue 3）。

```vue
<!-- 父组件 -->
<ChildComponent v-model="value" />
<!-- 等同于 -->
<ChildComponent :modelValue="value" @update:modelValue="value = $event" />

<!-- 子组件 -->
<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    updateValue(newValue) {
      this.$emit('update:modelValue', newValue);
    }
  }
}
</script>
```

{{< /details >}}

{{< details "**Provide / Inject 的使用场景？有什么限制？**" >}}

**使用场景**：
- 深层嵌套组件间传递数据
- 组件库开发（如 Form 和 FormItem 通信）
- 主题配置、国际化等全局配置

**限制**：
- 不是响应式的（Vue 2），需要提供响应式对象
- Vue 3 中默认是响应式的
- 不能用于非祖先后代关系的组件

```javascript
// 祖先组件
provide() {
  return {
    theme: this.theme,
    updateTheme: this.updateTheme
  }
}

// 后代组件
inject: ['theme', 'updateTheme']
```

{{< /details >}}

# 生命周期

{{< details "**Vue 生命周期钩子有哪些？各自的作用是什么？**" >}}

**创建阶段**：
- `beforeCreate`：实例初始化后，data、methods 未初始化
- `created`：实例创建完成，可访问 data、methods，但未挂载 DOM

**挂载阶段**：
- `beforeMount`：模板编译完成，即将挂载
- `mounted`：DOM 挂载完成，可操作 DOM

**更新阶段**：
- `beforeUpdate`：数据更新，DOM 更新前
- `updated`：DOM 更新完成

**销毁阶段**：
- `beforeUnmount`（Vue 3）/ `beforeDestroy`（Vue 2）：实例销毁前
- `unmounted`（Vue 3）/ `destroyed`（Vue 2）：实例销毁完成

**常用场景**：
- `created`：调用 API 获取数据
- `mounted`：操作 DOM、初始化第三方库
- `beforeUnmount`：清理定时器、取消订阅

{{< /details >}}

{{< details "**父子组件生命周期执行顺序是怎样的？**" >}}

**加载渲染过程**：
1. 父 beforeCreate
2. 父 created
3. 父 beforeMount
4. 子 beforeCreate
5. 子 created
6. 子 beforeMount
7. 子 mounted
8. 父 mounted

**更新过程**：
1. 父 beforeUpdate
2. 子 beforeUpdate
3. 子 updated
4. 父 updated

**销毁过程**：
1. 父 beforeUnmount
2. 子 beforeUnmount
3. 子 unmounted
4. 父 unmounted

{{< /details >}}

# Vue Router

{{< details "**Vue Router 的路由模式有哪些？区别是什么？**" >}}

**1. Hash 模式**：
- URL 带 `#`，如 `http://example.com/#/user`
- 利用 hashchange 事件监听
- 兼容性好，不需要服务器配置

**2. History 模式**：
- URL 正常，如 `http://example.com/user`
- 利用 HTML5 History API
- 需要服务器配置，刷新时返回 index.html

**3. Memory 模式**：
- 不依赖浏览器 URL
- 用于 SSR 或非浏览器环境

```javascript
const router = createRouter({
  history: createWebHistory(),  // History 模式
  // history: createWebHashHistory(),  // Hash 模式
  // history: createMemoryHistory(),  // Memory 模式
  routes
});
```

{{< /details >}}

{{< details "**路由守卫有哪些？如何实现登录验证？**" >}}

**全局守卫**：
- `beforeEach`：全局前置守卫
- `beforeResolve`：全局解析守卫
- `afterEach`：全局后置钩子

**路由独享守卫**：
- `beforeEnter`

**组件内守卫**：
- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

**登录验证示例**：

```javascript
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

// 路由配置
{
  path: '/dashboard',
  component: Dashboard,
  meta: { requiresAuth: true }
}
```

{{< /details >}}

{{< details "**如何实现路由懒加载？为什么要懒加载？**" >}}

**为什么要懒加载**：
- 减少首屏加载时间
- 按需加载，提升性能
- 减小打包体积

**实现方式**：

```javascript
// 1. 动态 import
const Home = () => import('./views/Home.vue');

// 2. webpack 魔法注释
const About = () => import(/* webpackChunkName: "about" */ './views/About.vue');

// 3. 分组打包
const UserProfile = () => import(/* webpackChunkName: "user" */ './views/UserProfile.vue');
const UserPosts = () => import(/* webpackChunkName: "user" */ './views/UserPosts.vue');

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user/profile', component: UserProfile },
  { path: '/user/posts', component: UserPosts }
];
```

{{< /details >}}

# Vuex / Pinia

{{< details "**Vuex 和 Pinia 的区别？为什么 Vue 3 推荐使用 Pinia？**" >}}

**Pinia 优势**：
- 更简洁的 API，去除了 mutations
- 完整的 TypeScript 支持
- 模块化更简单，不需要嵌套
- 支持多个 store 实例
- 更好的 DevTools 支持
- 体积更小

**对比**：

```javascript
// Vuex
export default new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) { state.count++; }
  },
  actions: {
    increment({ commit }) { commit('increment'); }
  }
});

// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++; }
  }
});
```

{{< /details >}}

{{< details "**如何在 Pinia 中处理异步操作？**" >}}

在 Pinia 中，actions 可以直接是异步函数：

```javascript
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchUser(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`/api/users/${id}`);
        this.user = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async updateUser(userData) {
      try {
        const response = await fetch(`/api/users/${this.user.id}`, {
          method: 'PUT',
          body: JSON.stringify(userData)
        });
        this.user = await response.json();
      } catch (error) {
        console.error('Update failed:', error);
        throw error;
      }
    }
  }
});
```

{{< /details >}}

# Composition API

{{< details "**Composition API 相比 Options API 有什么优势？**" >}}

**优势**：
1. **更好的逻辑复用**：通过 composables 函数
2. **更好的类型推导**：完整 TypeScript 支持
3. **更灵活的代码组织**：按功能而非选项组织
4. **更好的 Tree-shaking**：未使用的功能不会打包

**示例**：

```javascript
// Composable 函数
export function useMouse() {
  const x = ref(0);
  const y = ref(0);
  
  function update(e) {
    x.value = e.pageX;
    y.value = e.pageY;
  }
  
  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));
  
  return { x, y };
}

// 在组件中使用
const { x, y } = useMouse();
```

{{< /details >}}

{{< details "**ref 和 reactive 的区别？什么时候用哪个？**" >}}

**ref**：
- 用于基本类型和对象类型
- 访问值需要 `.value`
- 适合：基本类型、单个值

**reactive**：
- 只能用于对象类型
- 直接访问属性，无需 `.value`
- 适合：复杂对象、表单数据

```javascript
// ref
const count = ref(0);
count.value++; // 需要 .value

// reactive
const state = reactive({
  count: 0,
  name: 'John'
});
state.count++; // 直接访问

// 注意：reactive 解构会失去响应性
const { count } = state; // ❌ 失去响应性
const { count } = toRefs(state); // ✅ 保持响应性
```

{{< /details >}}

{{< details "**watchEffect 和 watch 的区别？**" >}}

**watchEffect**：
- 立即执行，自动追踪依赖
- 不需要指定监听源
- 适合：副作用操作

**watch**：
- 惰性执行（除非设置 immediate: true）
- 需要明确指定监听源
- 可以访问新旧值
- 适合：需要对比新旧值、条件执行

```javascript
// watchEffect
watchEffect(() => {
  console.log(`Count is: ${count.value}`);
  // 自动追踪 count 的变化
});

// watch
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// watch 多个源
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  // ...
});
```

{{< /details >}}

# 性能优化

{{< details "**Vue 性能优化有哪些手段？**" >}}

**1. 代码层面**：
- 使用 `v-show` 代替 `v-if`（频繁切换）
- 使用 `computed` 缓存计算结果
- 使用 `keep-alive` 缓存组件
- 使用虚拟滚动处理长列表
- 避免在模板中使用复杂表达式

**2. 打包优化**：
- 路由懒加载
- 组件按需引入
- Tree-shaking
- 代码分割

**3. 渲染优化**：
- 使用 `Object.freeze()` 冻结不需要响应式的数据
- 合理使用 `key` 属性
- 避免不必要的组件抽象

**4. 网络优化**：
- 使用 CDN
- 开启 Gzip 压缩
- 图片懒加载
- 接口防抖节流

```javascript
// 冻结数据
data() {
  return {
    list: Object.freeze(largeArray)
  }
}

// 虚拟滚动
<virtual-scroller :items="items" :item-height="50" />
```

{{< /details >}}

{{< details "**如何优化大型列表渲染？**" >}}

**1. 虚拟滚动（Virtual Scroll）**：
- 只渲染可视区域的元素
- 使用 `vue-virtual-scroller` 或 `vue-virtual-scroll-list`

**2. 分页加载**：
- 每次只加载一部分数据
- 无限滚动 + 懒加载

**3. 使用 `Object.freeze()`**：
- 冻结不需要响应式的数据

**4. 合理使用 `key`**：
- 使用唯一标识而非索引

**示例**：

```vue
<template>
  <virtual-scroller
    :items="items"
    :item-height="50"
    class="scroller"
  >
    <template #default="{ item }">
      <div class="item">{{ item.name }}</div>
    </template>
  </virtual-scroller>
</template>

<script setup>
import { ref } from 'vue';

const items = ref(
  Object.freeze(
    Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`
    }))
  )
);
</script>
```

{{< /details >}}

{{< details "**keep-alive 的作用和使用场景？**" >}}

**作用**：
- 缓存不活跃的组件实例
- 避免重复渲染，保留组件状态

**使用场景**：
- 标签页切换
- 表单填写中途切换
- 列表详情页切换

**属性**：
- `include`：匹配的组件会被缓存
- `exclude`：匹配的组件不会被缓存
- `max`：最多缓存多少组件实例

```vue
<!-- 缓存所有路由组件 -->
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>

<!-- 只缓存特定组件 -->
<keep-alive :include="['ComponentA', 'ComponentB']">
  <component :is="currentView" />
</keep-alive>

<!-- 生命周期钩子 -->
<script>
export default {
  activated() {
    console.log('组件被激活');
  },
  deactivated() {
    console.log('组件被缓存');
  }
}
</script>
```

{{< /details >}}

# 实战场景题

{{< details "**如何实现一个数据看板系统？需要考虑哪些技术点？**" "场景题" >}}

一个完整的数据看板系统需要考虑以下技术点：

**1. 架构设计**：
```
├── api/               # API 封装
├── components/        # 公共组件
│   ├── charts/       # 图表组件
│   ├── filters/      # 筛选组件
│   └── layouts/      # 布局组件
├── composables/       # 可复用逻辑
├── stores/           # 状态管理
├── utils/            # 工具函数
└── views/            # 页面
```

**2. 核心功能实现**：

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import * as echarts from 'echarts';

const dataStore = useDataStore();

// 数据采集
const fetchData = async () => {
  await dataStore.fetchSalesData();
  await dataStore.fetchUserStats();
  await dataStore.fetchProductAnalysis();
};

// 数据处理
const processedData = computed(() => {
  const data = dataStore.salesData;
  return data.map(item => ({
    ...item,
    avgOrderValue: item.sales / item.orders,
    growthRate: calculateGrowth(item)
  }));
});

// 图表初始化
const initCharts = () => {
  const chart = echarts.init(document.getElementById('chart'));
  chart.setOption({
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: values }]
  });
};

// 实时更新
const startAutoRefresh = () => {
  setInterval(() => {
    fetchData();
  }, 30000); // 每30秒刷新
};

onMounted(() => {
  fetchData();
  initCharts();
  startAutoRefresh();
});
</script>
```

**3. 性能优化**：
- 使用 Pinia 统一管理数据
- ECharts 按需引入
- 虚拟滚动处理大量数据
- 防抖节流处理筛选操作
- 使用 Web Worker 处理复杂计算

**4. 交互设计**：
- 筛选条件联动
- 图表联动（点击柱状图，折线图联动更新）
- 导出数据功能
- 响应式布局

**5. 数据可视化**：
- 折线图：展示趋势
- 柱状图：对比数据
- 饼图：展示占比
- 散点图：相关性分析
- 地图：地理分布

{{< /details >}}

{{< details "**如何实现一个表单构建器（Form Builder）？**" "场景题" >}}

**核心功能**：
1. 拖拽式表单设计
2. 组件配置
3. 表单验证
4. 数据绑定
5. 表单渲染

**实现思路**：

```vue
<!-- FormBuilder.vue -->
<template>
  <div class="form-builder">
    <!-- 组件库 -->
    <div class="component-library">
      <draggable v-model="components" :group="{ name: 'fields', pull: 'clone', put: false }">
        <div v-for="comp in availableComponents" :key="comp.type" class="component-item">
          {{ comp.label }}
        </div>
      </draggable>
    </div>

    <!-- 画布区域 -->
    <div class="canvas">
      <draggable v-model="formConfig.fields" group="fields" @change="handleFieldChange">
        <div v-for="(field, index) in formConfig.fields" :key="field.id" 
             class="field-wrapper"
             @click="selectField(field)">
          <component :is="getFieldComponent(field.type)" v-bind="field" />
          <button @click="removeField(index)">删除</button>
        </div>
      </draggable>
    </div>

    <!-- 属性配置 -->
    <div class="properties">
      <div v-if="selectedField">
        <h3>字段配置</h3>
        <el-form>
          <el-form-item label="字段名">
            <el-input v-model="selectedField.name" />
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="selectedField.label" />
          </el-form-item>
          <el-form-item label="必填">
            <el-switch v-model="selectedField.required" />
          </el-form-item>
          <el-form-item label="验证规则">
            <el-select v-model="selectedField.rules" multiple>
              <el-option label="邮箱" value="email" />
              <el-option label="手机号" value="phone" />
              <el-option label="身份证" value="idCard" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import draggable from 'vuedraggable';

const formConfig = ref({
  fields: []
});

const selectedField = ref(null);

const availableComponents = [
  { type: 'input', label: '输入框' },
  { type: 'textarea', label: '多行文本' },
  { type: 'select', label: '下拉选择' },
  { type: 'radio', label: '单选框' },
  { type: 'checkbox', label: '复选框' },
  { type: 'date', label: '日期选择' },
  { type: 'upload', label: '文件上传' }
];

const getFieldComponent = (type) => {
  const componentMap = {
    input: 'el-input',
    textarea: 'el-input',
    select: 'el-select',
    radio: 'el-radio-group',
    checkbox: 'el-checkbox-group',
    date: 'el-date-picker',
    upload: 'el-upload'
  };
  return componentMap[type];
};

const addField = (type) => {
  formConfig.value.fields.push({
    id: Date.now(),
    type,
    name: `field_${formConfig.value.fields.length}`,
    label: '',
    required: false,
    rules: []
  });
};

const removeField = (index) => {
  formConfig.value.fields.splice(index, 1);
};

const selectField = (field) => {
  selectedField.value = field;
};

// 导出配置
const exportConfig = () => {
  return JSON.stringify(formConfig.value, null, 2);
};

// 导入配置
const importConfig = (config) => {
  formConfig.value = JSON.parse(config);
};
</script>
```

**表单渲染器**：

```vue
<!-- FormRenderer.vue -->
<template>
  <el-form :model="formData" :rules="formRules" ref="formRef">
    <el-form-item 
      v-for="field in formConfig.fields" 
      :key="field.id"
      :label="field.label"
      :prop="field.name"
    >
      <component 
        :is="getFieldComponent(field.type)" 
        v-model="formData[field.name]"
        v-bind="field.props"
      />
    </el-form-item>
    
    <el-button type="primary" @click="submitForm">提交</el-button>
  </el-form>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  formConfig: Object
});

const formRef = ref(null);
const formData = ref({});

// 生成验证规则
const formRules = computed(() => {
  const rules = {};
  props.formConfig.fields.forEach(field => {
    if (field.required || field.rules.length > 0) {
      rules[field.name] = [];
      
      if (field.required) {
        rules[field.name].push({
          required: true,
          message: `请输入${field.label}`,
          trigger: 'blur'
        });
      }
      
      field.rules.forEach(rule => {
        rules[field.name].push(getRuleConfig(rule));
      });
    }
  });
  return rules;
});

const submitForm = async () => {
  await formRef.value.validate();
  console.log('提交数据:', formData.value);
};
</script>
```

{{< /details >}}

{{< details "**如何实现一个权限管理系统？包括路由权限和按钮权限。**" "场景题" >}}

**1. 路由权限**：

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

// 路由配置
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      roles: ['admin', 'user'] // 允许的角色
    }
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      roles: ['admin'] // 仅管理员
    },
    children: [
      {
        path: 'users',
        component: UserManagement,
        meta: { permission: 'user:view' }
      },
      {
        path: 'settings',
        component: Settings,
        meta: { permission: 'system:settings' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // 需要登录
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }
  
  // 角色验证
  if (to.meta.roles) {
    const hasRole = to.meta.roles.some(role => userStore.roles.includes(role));
    if (!hasRole) {
      return next({ name: 'Forbidden' });
    }
  }
  
  // 权限验证
  if (to.meta.permission) {
    if (!userStore.hasPermission(to.meta.permission)) {
      return next({ name: 'Forbidden' });
    }
  }
  
  next();
});
```

**2. 动态路由**：

```javascript
// stores/permission.js
import { defineStore } from 'pinia';

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [],
    addRoutes: []
  }),
  
  actions: {
    async generateRoutes(roles) {
      // 根据角色过滤路由
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      this.addRoutes = accessedRoutes;
      this.routes = constantRoutes.concat(accessedRoutes);
      return accessedRoutes;
    }
  }
});

// 过滤路由
function filterAsyncRoutes(routes, roles) {
  const res = [];
  
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  
  return res;
}

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  }
  return true;
}
```

**3. 按钮权限指令**：

```javascript
// directives/permission.js
export const permission = {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();
    
    if (value && value instanceof Array && value.length > 0) {
      const permissions = userStore.permissions;
      const hasPermission = value.some(permission => {
        return permissions.includes(permission);
      });
      
      if (!hasPermission) {
        el.style.display = 'none';
        // 或者 el.parentNode && el.parentNode.removeChild(el);
      }
    }
  }
};

// 使用
<button v-permission="['user:edit']">编辑</button>
<button v-permission="['user:delete']">删除</button>
```

**4. 权限检查组合函数**：

```javascript
// composables/usePermission.js
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';

export function usePermission() {
  const userStore = useUserStore();
  
  const hasPermission = (permission) => {
    return userStore.permissions.includes(permission);
  };
  
  const hasAnyPermission = (permissions) => {
    return permissions.some(p => userStore.permissions.includes(p));
  };
  
  const hasAllPermissions = (permissions) => {
    return permissions.every(p => userStore.permissions.includes(p));
  };
  
  const hasRole = (role) => {
    return userStore.roles.includes(role);
  };
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole
  };
}

// 使用
<script setup>
const { hasPermission } = usePermission();
</script>

<template>
  <button v-if="hasPermission('user:edit')">编辑</button>
</template>
```

{{< /details >}}

{{< details "**如何实现一个实时数据更新的聊天应用？**" "场景题" >}}

**技术方案**：
- WebSocket 实时通信
- Pinia 状态管理
- 虚拟滚动处理大量消息
- 消息分页加载

**实现代码**：

```javascript
// composables/useWebSocket.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useWebSocket(url) {
  const ws = ref(null);
  const connected = ref(false);
  const messages = ref([]);
  
  const connect = () => {
    ws.value = new WebSocket(url);
    
    ws.value.onopen = () => {
      connected.value = true;
      console.log('WebSocket connected');
    };
    
    ws.value.onmessage = (event) => {
      const data = JSON.parse(event.data);
      messages.value.push(data);
    };
    
    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.value.onclose = () => {
      connected.value = false;
      console.log('WebSocket disconnected');
      // 重连逻辑
      setTimeout(connect, 3000);
    };
  };
  
  const send = (data) => {
    if (ws.value && connected.value) {
      ws.value.send(JSON.stringify(data));
    }
  };
  
  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
    }
  };
  
  onMounted(() => {
    connect();
  });
  
  onUnmounted(() => {
    disconnect();
  });
  
  return {
    connected,
    messages,
    send,
    disconnect
  };
}
```

```vue
<!-- ChatRoom.vue -->
<template>
  <div class="chat-room">
    <div class="chat-header">
      <h2>{{ roomName }}</h2>
      <span :class="{ online: connected }">
        {{ connected ? '在线' : '离线' }}
      </span>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" ref="messageList">
      <virtual-scroller
        :items="messages"
        :item-height="80"
        class="scroller"
      >
        <template #default="{ item }">
          <div :class="['message', item.isMine ? 'mine' : 'other']">
            <div class="avatar">
              <img :src="item.user.avatar" />
            </div>
            <div class="content">
              <div class="user-info">
                <span class="username">{{ item.user.name }}</span>
                <span class="time">{{ formatTime(item.timestamp) }}</span>
              </div>
              <div class="text">{{ item.content }}</div>
            </div>
          </div>
        </template>
      </virtual-scroller>
    </div>

    <!-- 输入框 -->
    <div class="input-area">
      <el-input
        v-model="inputMessage"
        type="textarea"
        :rows="3"
        placeholder="输入消息..."
        @keydown.enter.prevent="sendMessage"
      />
      <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';
import { useChatStore } from '@/stores/chat';

const props = defineProps({
  roomId: String
});

const chatStore = useChatStore();
const { connected, messages, send } = useWebSocket(`ws://localhost:3000/chat/${props.roomId}`);

const inputMessage = ref('');
const messageList = ref(null);

const roomName = computed(() => chatStore.getRoomName(props.roomId));

const sendMessage = () => {
  if (!inputMessage.value.trim()) return;
  
  const message = {
    type: 'message',
    roomId: props.roomId,
    content: inputMessage.value,
    timestamp: Date.now()
  };
  
  send(message);
  inputMessage.value = '';
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

// 自动滚动到底部
watch(messages, async () => {
  await nextTick();
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
});
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.message.mine {
  flex-direction: row-reverse;
}

.input-area {
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}
</style>
```

**Store 管理**：

```javascript
// stores/chat.js
export const useChatStore = defineStore('chat', {
  state: () => ({
    rooms: {},
    currentRoom: null,
    onlineUsers: []
  }),
  
  actions: {
    addMessage(roomId, message) {
      if (!this.rooms[roomId]) {
        this.rooms[roomId] = { messages: [] };
      }
      this.rooms[roomId].messages.push(message);
    },
    
    loadHistory(roomId, page = 1) {
      return api.getChatHistory(roomId, page);
    }
  }
});
```

{{< /details >}}

# 其他重要问题

{{< details "**nextTick 的作用和原理？**" >}}

**作用**：
在下次 DOM 更新循环结束之后执行延迟回调，用于获取更新后的 DOM。

**原理**：
- Vue 的 DOM 更新是异步的
- nextTick 将回调推迟到下一个 DOM 更新周期
- 内部使用微任务（Promise.then、MutationObserver）或宏任务（setImmediate、setTimeout）

**使用场景**：
```javascript
// 修改数据后立即操作 DOM
this.message = 'Updated';
this.$nextTick(() => {
  // DOM 已更新
  console.log(this.$el.textContent); // 'Updated'
});

// Composition API
import { nextTick } from 'vue';

message.value = 'Updated';
await nextTick();
console.log(document.getElementById('message').textContent);
```

{{< /details >}}

{{< details "**Vue 的 diff 算法原理？**" >}}

**核心思想**：
- 同层比较，不跨层级
- 通过 key 识别节点
- 最小化 DOM 操作

**比较流程**：
1. 比较新旧节点是否相同（tag、key、isComment 等）
2. 相同则复用，不同则创建新节点
3. 比较子节点（双端比较算法）

**优化策略**：
- 使用唯一 key 帮助识别节点
- 静态标记（PatchFlag）
- 静态提升（hoistStatic）
- 缓存事件处理函数

```javascript
// 双端比较
function updateChildren(oldCh, newCh) {
  let oldStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newCh.length - 1;
  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 四种快速比较
    if (sameVnode(oldStart, newStart)) {
      // 头头比较
    } else if (sameVnode(oldEnd, newEnd)) {
      // 尾尾比较
    } else if (sameVnode(oldStart, newEnd)) {
      // 头尾比较
    } else if (sameVnode(oldEnd, newStart)) {
      // 尾头比较
    } else {
      // 乱序比较（使用 key）
    }
  }
}
```

{{< /details >}}

{{< details "**Vue 3 的 Teleport 组件有什么用？**" >}}

**作用**：
将组件的 HTML 渲染到 DOM 中的任意位置，而不是当前组件的 DOM 树中。

**使用场景**：
- 模态对话框
- 通知/提示
- 下拉菜单
- 全屏组件

```vue
<template>
  <button @click="open = true">打开对话框</button>
  
  <teleport to="body">
    <div v-if="open" class="modal">
      <h2>模态对话框</h2>
      <button @click="open = false">关闭</button>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>
```

**多个 Teleport 到同一目标**：
```vue
<teleport to="#modals">
  <div>Modal 1</div>
</teleport>

<teleport to="#modals">
  <div>Modal 2</div>
</teleport>

<!-- 渲染结果 -->
<div id="modals">
  <div>Modal 1</div>
  <div>Modal 2</div>
</div>
```

{{< /details >}}

{{< details "**如何在 Vue 中使用 TypeScript？有什么最佳实践？**" >}}

**1. 项目配置**：
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

**2. 组件类型定义**：
```vue
<script setup lang="ts">
import { ref, computed, PropType } from 'vue';

// Props 类型
interface Props {
  title: string;
  count?: number;
  items: string[];
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

// Emit 类型
const emit = defineEmits<{
  (e: 'update', value: string): void;
  (e: 'delete', id: number): void;
}>();

// Ref 类型
const message = ref<string>('');
const numbers = ref<number[]>([]);

// Computed 类型
const doubleCount = computed<number>(() => props.count * 2);

// 自定义类型
interface User {
  id: number;
  name: string;
  email: string;
}

const user = ref<User>({
  id: 1,
  name: 'John',
  email: 'john@example.com'
});
</script>
```

**3. 组合函数类型**：
```typescript
// composables/useCounter.ts
import { ref, Ref } from 'vue';

export function useCounter(initialValue = 0): {
  count: Ref<number>;
  increment: () => void;
  decrement: () => void;
} {
  const count = ref(initialValue);
  
  const increment = () => {
    count.value++;
  };
  
  const decrement = () => {
    count.value--;
  };
  
  return {
    count,
    increment,
    decrement
  };
}
```

**4. Pinia Store 类型**：
```typescript
// stores/user.ts
import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  token: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: null
  }),
  
  getters: {
    isAuthenticated(): boolean {
      return this.token !== null;
    }
  },
  
  actions: {
    async login(email: string, password: string): Promise<void> {
      // ...
    }
  }
});
```

{{< /details >}}

{{< details "**如何测试 Vue 组件？**" >}}

**使用 Vitest + Vue Test Utils**：

```typescript
// MyComponent.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MyComponent from './MyComponent.vue';

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent, {
      props: {
        title: 'Hello Vitest'
      }
    });
    expect(wrapper.text()).toContain('Hello Vitest');
  });
  
  it('increments count when button is clicked', async () => {
    const wrapper = mount(MyComponent);
    const button = wrapper.find('button');
    
    await button.trigger('click');
    expect(wrapper.vm.count).toBe(1);
    expect(wrapper.text()).toContain('Count: 1');
  });
  
  it('emits custom event', async () => {
    const wrapper = mount(MyComponent);
    await wrapper.vm.someMethod();
    
    expect(wrapper.emitted()).toHaveProperty('custom-event');
    expect(wrapper.emitted('custom-event')?.[0]).toEqual(['data']);
  });
});
```

**测试组合函数**：
```typescript
// useCounter.spec.ts
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('increments count', () => {
    const { count, increment } = useCounter(0);
    expect(count.value).toBe(0);
    
    increment();
    expect(count.value).toBe(1);
  });
});
```

**测试 Pinia Store**：
```typescript
// userStore.spec.ts
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from './user';

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  
  it('logs in user', async () => {
    const store = useUserStore();
    await store.login('test@example.com', 'password');
    
    expect(store.isAuthenticated).toBe(true);
    expect(store.user).toBeDefined();
  });
});
```

{{< /details >}}

{{< details "**Vue的响应式原理是什么？Vue 2和Vue 3有什么区别？**" "Vue" >}}

Vue的响应式系统是Vue的核心特性，它能够自动追踪依赖并在数据变化时更新视图。

**Vue 2的响应式原理（Object.defineProperty）**：

```javascript
// Vue 2使用Object.defineProperty实现响应式
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      console.log(`访问了 ${key}`);
      return val;
    },
    set(newVal) {
      // 触发更新
      console.log(`${key} 从 ${val} 变为 ${newVal}`);
      val = newVal;
      // 通知所有依赖更新
    }
  });
}

// 示例
const data = {};
defineReactive(data, 'count', 0);
data.count; // 访问了 count
data.count = 1; // count 从 0 变为 1
```

**Vue 2的局限性**：

1. **无法检测对象属性的添加或删除**：
```javascript
const vm = new Vue({
  data: {
    user: {
      name: 'Alice'
    }
  }
});

// 这个不是响应式的❌
vm.user.age = 25;

// 需要使用Vue.set✅
Vue.set(vm.user, 'age', 25);
// 或
vm.$set(vm.user, 'age', 25);
```

2. **数组问题**：
```javascript
// 通过索引设置项不是响应式的❌
vm.items[0] = 'new item';

// 需要使用Vue.set或数组方法✅
Vue.set(vm.items, 0, 'new item');
vm.items.splice(0, 1, 'new item');
```

**Vue 3的响应式原理（Proxy）**：

```javascript
// Vue 3使用Proxy实现响应式
function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      // 依赖收集
      console.log(`访问了 ${key}`);
      const result = Reflect.get(target, key);
      // 如果是对象，递归代理
      if (typeof result === 'object' && result !== null) {
        return reactive(result);
      }
      return result;
    },
    set(target, key, value) {
      // 触发更新
      console.log(`${key} 设置为 ${value}`);
      const result = Reflect.set(target, key, value);
      // 通知所有依赖更新
      return result;
    },
    deleteProperty(target, key) {
      // 删除属性也能检测到
      console.log(`删除了 ${key}`);
      return Reflect.deleteProperty(target, key);
    }
  });
}

// 示例
const data = reactive({ count: 0 });
data.count; // 访问了 count
data.count = 1; // count 设置为 1
data.newProp = 'test'; // 可以检测到新属性
delete data.count; // 可以检测到删除
```

**Vue 3的优势**：

1. **可以检测属性的添加和删除**：
```javascript
const state = reactive({
  user: { name: 'Alice' }
});

// 直接添加属性，完全响应式✅
state.user.age = 25;

// 删除属性也是响应式的✅
delete state.user.name;
```

2. **可以监听数组索引和length的变化**：
```javascript
const state = reactive({
  items: ['a', 'b', 'c']
});

// 通过索引设置，完全响应式✅
state.items[0] = 'x';

// 修改length，完全响应式✅
state.items.length = 1;
```

3. **更好的性能**：
- Vue 2需要递归遍历所有属性添加getter/setter
- Vue 3使用Proxy代理整个对象，惰性递归

**响应式API对比**：

**Vue 2**：
```javascript
export default {
  data() {
    return {
      count: 0,
      user: { name: 'Alice' }
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    addAge() {
      // 需要$set
      this.$set(this.user, 'age', 25);
    }
  }
};
```

**Vue 3 Composition API**：
```javascript
import { reactive, ref } from 'vue';

export default {
  setup() {
    // reactive用于对象
    const state = reactive({
      count: 0,
      user: { name: 'Alice' }
    });

    // ref用于基本类型
    const count = ref(0);

    function increment() {
      count.value++;
    }

    function addAge() {
      // 直接添加，无需特殊处理✅
      state.user.age = 25;
    }

    return {
      state,
      count,
      increment,
      addAge
    };
  }
};
```

**ref vs reactive**：

```javascript
// ref：适合基本类型和单个值
const count = ref(0);
count.value++; // 需要.value访问

// reactive：适合对象和复杂数据结构
const state = reactive({
  count: 0,
  user: { name: 'Alice' }
});
state.count++; // 直接访问，无需.value

// 注意：reactive的解构会失去响应式❌
const { count } = state;
count++; // 不会触发更新

// 解决方案1：使用toRefs✅
const { count } = toRefs(state);
count.value++; // 响应式

// 解决方案2：使用computed✅
const count = computed(() => state.count);
```

**性能对比**：

| 特性 | Vue 2 | Vue 3 |
|------|------|------|
| 初始化性能 | 慢（递归遍历） | 快（惰性代理） |
| 内存占用 | 高（每个属性都有getter/setter） | 低（只代理对象本身） |
| 添加属性 | 不响应（需要$set） | 响应 |
| 删除属性 | 不响应（需要$delete） | 响应 |
| 数组索引 | 不响应 | 响应 |
| 深层对象 | 初始化时全部转换 | 访问时才转换（惰性） |

**实战建议**：

- Vue 2项目：使用`Vue.set`和`Vue.delete`处理动态属性
- Vue 3项目：优先使用Composition API和`reactive`/`ref`
- 基本类型用`ref`，对象用`reactive`
- 需要解构时使用`toRefs`
- 复杂逻辑封装为composables

{{< /details >}}

{{< details "**Vue的虚拟DOM和diff算法是如何工作的？**" "Vue" >}}

虚拟DOM（Virtual DOM）是Vue实现高效渲染的核心机制。

**什么是虚拟DOM**：

虚拟DOM是用JavaScript对象来描述真实DOM的树形结构。

```javascript
// 真实DOM
<div class="container">
  <h1>Hello</h1>
  <p>World</p>
</div>

// 虚拟DOM（简化版）
{
  tag: 'div',
  props: { class: 'container' },
  children: [
    {
      tag: 'h1',
      children: 'Hello'
    },
    {
      tag: 'p',
      children: 'World'
    }
  ]
}
```

**为什么需要虚拟DOM**：

1. **性能优化**：批量更新，减少DOM操作
2. **跨平台**：可以渲染到不同平台（Web、Native、SSR）
3. **方便追踪变化**：diff算法找出最小变化

**Vue的diff算法**：

Vue使用**双端比较算法**（双指针），比React的diff更高效。

**核心原理**：

```javascript
// 简化的diff算法
function patch(oldVNode, newVNode) {
  // 1. 新旧节点类型不同，直接替换
  if (oldVNode.tag !== newVNode.tag) {
    return replaceNode(oldVNode, newVNode);
  }

  // 2. 文本节点
  if (typeof newVNode.children === 'string') {
    if (oldVNode.children !== newVNode.children) {
      updateText(oldVNode, newVNode.children);
    }
    return;
  }

  // 3. 子节点diff
  updateChildren(oldVNode.children, newVNode.children);
}
```

**双端比较算法**：

```javascript
// 四个指针：旧前、旧后、新前、新后
function updateChildren(oldChildren, newChildren) {
  let oldStartIdx = 0;
  let oldEndIdx = oldChildren.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newChildren.length - 1;

  let oldStartVNode = oldChildren[0];
  let oldEndVNode = oldChildren[oldEndIdx];
  let newStartVNode = newChildren[0];
  let newEndVNode = newChildren[newEndIdx];

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (sameVNode(oldStartVNode, newStartVNode)) {
      // 情况1：新旧头节点相同
      patch(oldStartVNode, newStartVNode);
      oldStartVNode = oldChildren[++oldStartIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else if (sameVNode(oldEndVNode, newEndVNode)) {
      // 情况2：新旧尾节点相同
      patch(oldEndVNode, newEndVNode);
      oldEndVNode = oldChildren[--oldEndIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (sameVNode(oldStartVNode, newEndVNode)) {
      // 情况3：旧头与新尾相同（节点右移）
      patch(oldStartVNode, newEndVNode);
      moveNode(oldStartVNode, oldEndVNode.nextSibling);
      oldStartVNode = oldChildren[++oldStartIdx];
      newEndVNode = newChildren[--newEndIdx];
    } else if (sameVNode(oldEndVNode, newStartVNode)) {
      // 情况4：旧尾与新头相同（节点左移）
      patch(oldEndVNode, newStartVNode);
      moveNode(oldEndVNode, oldStartVNode);
      oldEndVNode = oldChildren[--oldEndIdx];
      newStartVNode = newChildren[++newStartIdx];
    } else {
      // 情况5：都不相同，使用key查找
      const idxInOld = findIdxInOld(newStartVNode, oldChildren);
      if (idxInOld) {
        const vnodeToMove = oldChildren[idxInOld];
        patch(vnodeToMove, newStartVNode);
        moveNode(vnodeToMove, oldStartVNode);
        oldChildren[idxInOld] = undefined;
      } else {
        // 新节点，创建
        createNode(newStartVNode, oldStartVNode);
      }
      newStartVNode = newChildren[++newStartIdx];
    }
  }

  // 处理剩余节点
  if (oldStartIdx > oldEndIdx) {
    // 新节点有剩余，添加
    addNodes(newChildren, newStartIdx, newEndIdx);
  } else if (newStartIdx > newEndIdx) {
    // 旧节点有剩余，删除
    removeNodes(oldChildren, oldStartIdx, oldEndIdx);
  }
}
```

**key的重要性**：

```javascript
// 没有key - 错误的diff❌
<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>

// 在最前面插入D
<ul>
  <li>D</li>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>

// Vue会认为：
// A→D (更新文本)
// B→A (更新文本)
// C→B (更新文本)
// 新建C
// 效率很低！

// 有key - 正确的diff✅
<ul>
  <li key="a">A</li>
  <li key="b">B</li>
  <li key="c">C</li>
</ul>

<ul>
  <li key="d">D</li>
  <li key="a">A</li>
  <li key="b">B</li>
  <li key="c">C</li>
</ul>

// Vue会认为：
// 新建D，A、B、C都不变
// 只需要一次DOM插入操作！
```

**不要使用index作为key**：

```javascript
// 错误示例❌
<li v-for="(item, index) in items" :key="index">
  {{ item }}
</li>

// 问题：删除第一项时，所有index都变了
// items = ['A', 'B', 'C']
// 删除'A'后 items = ['B', 'C']
// B的key从1变为0，C的key从2变为1
// Vue会误以为内容发生了变化

// 正确示例✅
<li v-for="item in items" :key="item.id">
  {{ item.name }}
</li>
```

**Vue 2 vs Vue 3的diff优化**：

**Vue 2**：
- 双端比较算法
- 每次都全量diff所有子节点

**Vue 3**：
- 静态标记（PatchFlag）
- 静态提升（hoisting）
- 事件监听缓存
- Block Tree（减少diff范围）

```javascript
// Vue 3的优化
// 编译前
<div>
  <h1>静态内容</h1>
  <p>{{ dynamic }}</p>
</div>

// 编译后（简化）
const _hoisted_1 = /*#__PURE__*/ _createElementVNode("h1", null, "静态内容", -1);

function render() {
  return _createElementBlock("div", null, [
    _hoisted_1, // 静态节点提升，不参与diff
    _createElementVNode("p", null, _toDisplayString(dynamic), 1 /* TEXT */)
    // PatchFlag标记：1表示只有文本内容是动态的
  ]);
}
```

**性能对比**：

| 操作 | 真实DOM | 虚拟DOM |
|------|--------|--------|
| 创建节点 | 慢 | 快（JavaScript对象） |
| 更新节点 | 慢（重排重绘） | 快（批量更新） |
| 查找节点 | 慢 | 快（内存操作） |
| 大量更新 | 很慢 | 快（diff+批量） |

**最佳实践**：

✅ 列表渲染必须使用唯一的key
✅ key使用稳定的唯一标识（如id），不要使用index
✅ 避免在key中使用随机值或Date.now()
✅ 静态内容提取到组件外部
✅ 合理使用v-once和v-memo优化

{{< /details >}}

{{< details "**Vue的生命周期钩子执行顺序是怎样的？父子组件呢？**" "Vue" >}}

Vue组件的生命周期是Vue实例从创建到销毁的完整过程。

**Vue 2生命周期**：

```javascript
export default {
  // 1. 创建阶段
  beforeCreate() {
    // 实例初始化之后，数据观测和事件配置之前
    // 访问不到data、computed、methods
    console.log('1. beforeCreate');
  },
  
  created() {
    // 实例创建完成，数据观测、属性和方法已配置
    // 可以访问data、computed、methods
    // 还未挂载DOM，无法访问$el
    console.log('2. created');
    // 常用：发起API请求
  },
  
  // 2. 挂载阶段
  beforeMount() {
    // 挂载开始之前，render函数首次被调用
    // 模板编译完成，虚拟DOM已创建
    console.log('3. beforeMount');
  },
  
  mounted() {
    // 实例挂载完成，真实DOM已创建
    // 可以访问this.$el和DOM元素
    console.log('4. mounted');
    // 常用：DOM操作、初始化第三方库、开启定时器
  },
  
  // 3. 更新阶段
  beforeUpdate() {
    // 数据更新时调用，发生在虚拟DOM重新渲染之前
    // 可以在这里访问更新前的DOM
    console.log('5. beforeUpdate');
  },
  
  updated() {
    // 数据更新后，虚拟DOM重新渲染和patch之后
    // DOM已经更新完成
    console.log('6. updated');
    // 注意：避免在这里修改数据，可能导致无限循环
  },
  
  // 4. 销毁阶段
  beforeDestroy() {
    // 实例销毁之前调用，实例仍然完全可用
    console.log('7. beforeDestroy');
    // 常用：清理定时器、取消订阅、解绑事件监听
  },
  
  destroyed() {
    // 实例销毁后调用
    // 所有指令解绑、事件监听器移除、子实例销毁
    console.log('8. destroyed');
  }
};
```

**Vue 3生命周期（Composition API）**：

```javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

export default {
  setup() {
    // setup()在beforeCreate之前执行
    console.log('setup');

    onBeforeMount(() => {
      console.log('onBeforeMount');
    });

    onMounted(() => {
      console.log('onMounted');
      // 常用：DOM操作、API请求
    });

    onBeforeUpdate(() => {
      console.log('onBeforeUpdate');
    });

    onUpdated(() => {
      console.log('onUpdated');
    });

    onBeforeUnmount(() => {
      console.log('onBeforeUnmount');
      // 常用：清理工作
    });

    onUnmount(() => {
      console.log('onUnmounted');
    });

    return {};
  }
};
```

**Options API vs Composition API对照**：

| Options API | Composition API | 说明 |
|-------------|----------------|------|
| beforeCreate | setup() | Composition API中setup在beforeCreate之前 |
| created | setup() | 在setup中可以直接写逻辑 |
| beforeMount | onBeforeMount | 挂载前 |
| mounted | onMounted | 挂载后 |
| beforeUpdate | onBeforeUpdate | 更新前 |
| updated | onUpdated | 更新后 |
| beforeDestroy | onBeforeUnmount | 卸载前（Vue 3改名） |
| destroyed | onUnmounted | 卸载后（Vue 3改名） |

**父子组件生命周期执行顺序**：

```javascript
// Parent.vue
export default {
  name: 'Parent',
  beforeCreate() { console.log('1. Parent beforeCreate'); },
  created() { console.log('2. Parent created'); },
  beforeMount() { console.log('3. Parent beforeMount'); },
  mounted() { console.log('7. Parent mounted'); },
  beforeUpdate() { console.log('Parent beforeUpdate'); },
  updated() { console.log('Parent updated'); },
  beforeDestroy() { console.log('Parent beforeDestroy'); },
  destroyed() { console.log('Parent destroyed'); }
};

// Child.vue
export default {
  name: 'Child',
  beforeCreate() { console.log('  4. Child beforeCreate'); },
  created() { console.log('  5. Child created'); },
  beforeMount() { console.log('  6. Child beforeMount'); },
  mounted() { console.log('  7. Child mounted'); },
  beforeUpdate() { console.log('  Child beforeUpdate'); },
  updated() { console.log('  Child updated'); },
  beforeDestroy() { console.log('  Child beforeDestroy'); },
  destroyed() { console.log('  Child destroyed'); }
};
```

**加载渲染过程**：
```
1. Parent beforeCreate
2. Parent created
3. Parent beforeMount
4.   Child beforeCreate
5.   Child created
6.   Child beforeMount
7.   Child mounted
8. Parent mounted
```

**子组件更新过程**：
```
Parent beforeUpdate
  Child beforeUpdate
  Child updated
Parent updated
```

**父组件更新过程**：
```
Parent beforeUpdate
Parent updated
```

**销毁过程**：
```
Parent beforeDestroy
  Child beforeDestroy
  Child destroyed
Parent destroyed
```

**记忆口诀**：
- 加载渲染：**父before→父create→父beforeMount→子全部→父mounted**
- 子组件更新：**父before→子before→子update→父update**
- 父组件更新：**父before→父update**
- 销毁：**父before→子before→子destroy→父destroy**

**常见应用场景**：

```javascript
export default {
  created() {
    // ✅ 发起API请求（不依赖DOM）
    this.fetchData();
  },

  mounted() {
    // ✅ DOM操作
    this.$refs.input.focus();
    
    // ✅ 初始化第三方库（需要DOM）
    new Chart(this.$refs.chart, {...});
    
    // ✅ 开启定时器
    this.timer = setInterval(() => {
      this.fetchData();
    }, 5000);
    
    // ✅ 添加事件监听
    window.addEventListener('resize', this.handleResize);
  },

  beforeDestroy() {
    // ✅ 清理定时器
    clearInterval(this.timer);
    
    // ✅ 移除事件监听
    window.removeEventListener('resize', this.handleResize);
    
    // ✅ 取消未完成的请求
    this.cancelToken.cancel();
  }
};
```

**最佳实践**：

✅ API请求优先放在`created`（更早）
✅ 需要DOM操作必须在`mounted`之后
✅ 定时器、事件监听记得在`beforeDestroy`清理
✅ 避免在`updated`中修改数据
✅ 父子组件通信要考虑生命周期顺序

{{< /details >}}

{{< details "**Vue Router的导航守卫有哪些？执行顺序是什么？**" "Vue Router" >}}

导航守卫是Vue Router提供的路由跳转过程中的钩子函数，用于控制路由的访问权限。

**导航守卫类型**：

**1. 全局守卫**：

```javascript
// router/index.js
const router = createRouter({...});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('全局beforeEach');
  // 权限验证
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login'); // 重定向到登录页
  } else {
    next(); // 继续导航
  }
});

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  console.log('全局beforeResolve');
  next();
});

// 全局后置钩子
router.afterEach((to, from) => {
  console.log('全局afterEach');
  // 修改页面标题
  document.title = to.meta.title || '默认标题';
  // 发送页面浏览统计
});
```

**2. 路由独享守卫**：

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      console.log('路由独享beforeEnter');
      // 只对进入该路由时触发
      if (hasAdminPermission()) {
        next();
      } else {
        next('/403');
      }
    }
  }
];
```

**3. 组件内守卫**：

```javascript
export default {
  // 进入组件前
  beforeRouteEnter(to, from, next) {
    console.log('组件beforeRouteEnter');
    // 此时组件实例还未创建，无法访问this
    next(vm => {
      // 通过vm访问组件实例
      vm.fetchData();
    });
  },

  // 路由更新时（同一组件，参数变化）
  beforeRouteUpdate(to, from, next) {
    console.log('组件beforeRouteUpdate');
    // 可以访问this
    this.fetchData(to.params.id);
    next();
  },

  // 离开组件时
  beforeRouteLeave(to, from, next) {
    console.log('组件beforeRouteLeave');
    // 表单未保存提示
    if (this.hasUnsavedChanges) {
      const answer = window.confirm('有未保存的更改，确定离开？');
      if (answer) {
        next();
      } else {
        next(false); // 取消导航
      }
    } else {
      next();
    }
  }
};
```

**完整导航解析流程**：

```javascript
// 从 /home 导航到 /about

1. 导航被触发
2. 在失活的组件里调用 beforeRouteLeave 守卫
   → Home组件的beforeRouteLeave

3. 调用全局的 beforeEach 守卫
   → router.beforeEach

4. 在重用的组件里调用 beforeRouteUpdate 守卫
   → 如果是参数变化但组件复用

5. 在路由配置里调用 beforeEnter
   → About路由的beforeEnter

6. 解析异步路由组件
   → 如果About是懒加载的

7. 在被激活的组件里调用 beforeRouteEnter
   → About组件的beforeRouteEnter

8. 调用全局的 beforeResolve 守卫
   → router.beforeResolve

9. 导航被确认

10. 调用全局的 afterEach 钩子
    → router.afterEach

11. 触发 DOM 更新

12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数
    → next(vm => { ... })
```

**实际案例：权限验证**：

```javascript
// router/index.js
import { createRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  routes: [
    {
      path: '/',
      component: Home,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { 
        requiresAuth: true,
        roles: ['admin', 'user']
      }
    },
    {
      path: '/admin',
      component: Admin,
      meta: { 
        requiresAuth: true,
        roles: ['admin']
      }
    }
  ]
});

// 全局前置守卫：权限验证
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // 页面加载进度条
  NProgress.start();
  
  // 1. 检查是否需要登录
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 未登录，跳转登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 登录后跳回
      });
      return;
    }
    
    // 2. 检查角色权限
    if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
      // 无权限，跳转403页面
      next('/403');
      return;
    }
  }
  
  next(); // 允许导航
});

// 全局后置钩子：完成进度条
router.afterEach(() => {
  NProgress.done();
});
```

**实际案例：表单离开提示**：

```javascript
// components/EditForm.vue
export default {
  data() {
    return {
      formData: {},
      originalData: {},
      isDirty: false
    };
  },
  
  watch: {
    formData: {
      deep: true,
      handler() {
        // 检测表单是否被修改
        this.isDirty = JSON.stringify(this.formData) !== JSON.stringify(this.originalData);
      }
    }
  },
  
  beforeRouteLeave(to, from, next) {
    if (this.isDirty) {
      const answer = window.confirm('表单有未保存的更改，确定离开吗？');
      if (answer) {
        next();
      } else {
        next(false); // 取消导航
      }
    } else {
      next();
    }
  },
  
  methods: {
    async save() {
      await this.saveData();
      this.isDirty = false;
      this.originalData = JSON.parse(JSON.stringify(this.formData));
    }
  }
};
```

**Composition API中使用导航守卫**：

```javascript
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';

export default {
  setup() {
    const isDirty = ref(false);
    
    // 组件内守卫
    onBeforeRouteLeave((to, from) => {
      if (isDirty.value) {
        const answer = window.confirm('有未保存的更改，确定离开？');
        if (!answer) return false; // 取消导航
      }
    });
    
    onBeforeRouteUpdate((to, from) => {
      // 路由参数变化时
      fetchData(to.params.id);
    });
    
    return { isDirty };
  }
};
```

**常见应用场景**：

✅ **beforeEach**：登录验证、权限检查、页面访问统计
✅ **beforeResolve**：获取数据（所有守卫都解析完）
✅ **afterEach**：修改页面标题、发送统计、关闭加载动画
✅ **beforeEnter**：特定路由的权限验证
✅ **beforeRouteLeave**：表单离开提示、清理定时器
✅ **beforeRouteUpdate**：同组件路由参数变化时更新数据

**最佳实践**：

✅ 守卫中必须调用`next()`，否则导航会卡住
✅ 异步操作使用`async/await`
✅ 避免在`afterEach`中做耗时操作
✅ 合理使用守卫级别（全局 vs 路由 vs 组件）
✅ 权限验证放在全局守卫，具体逻辑放在路由独享守卫

{{< /details >}}

{{< details "**Vue组件通信有哪些方式？各自的应用场景是什么？**" "Vue" >}}

Vue组件间通信是Vue开发中的核心问题，根据组件关系有不同的解决方案。

**1. Props / Emit（父子组件）**：

```javascript
// 父组件 Parent.vue
<template>
  <Child 
    :message="parentMsg" 
    :count="count"
    @update="handleUpdate"
    @increment="count++"
  />
</template>

<script>
export default {
  data() {
    return {
      parentMsg: 'Hello from parent',
      count: 0
    };
  },
  methods: {
    handleUpdate(newValue) {
      this.parentMsg = newValue;
    }
  }
};
</script>

// 子组件 Child.vue
<template>
  <div>
    <p>{{ message }}</p>
    <p>Count: {{ count }}</p>
    <button @click="updateParent">Update Parent</button>
    <button @click="$emit('increment')">Increment</button>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  methods: {
    updateParent() {
      this.$emit('update', 'New message from child');
    }
  }
};
</script>
```

**应用场景**：
- ✅ 父→子传递数据
- ✅ 子→父传递事件
- ✅ 简单的双向绑定（v-model）

**2. v-model（双向绑定）**：

```javascript
// Vue 2
// 父组件
<CustomInput v-model="searchText" />
// 等价于
<CustomInput 
  :value="searchText" 
  @input="searchText = $event"
/>

// 子组件
export default {
  props: ['value'],
  methods: {
    updateValue(e) {
      this.$emit('input', e.target.value);
    }
  }
};

// Vue 3
// 父组件
<CustomInput v-model="searchText" />
// 等价于
<CustomInput 
  :modelValue="searchText" 
  @update:modelValue="searchText = $event"
/>

// 子组件
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const updateValue = (e) => {
      emit('update:modelValue', e.target.value);
    };
    return { updateValue };
  }
};

// Vue 3支持多个v-model
<UserForm 
  v-model:name="userName"
  v-model:email="userEmail"
/>
```

**应用场景**：
- ✅ 表单输入组件
- ✅ 需要双向绑定的自定义组件

**3. Ref（父访问子）**：

```javascript
// 父组件
<template>
  <Child ref="childRef" />
  <button @click="callChildMethod">Call Child Method</button>
</template>

<script>
export default {
  methods: {
    callChildMethod() {
      // 直接调用子组件的方法
      this.$refs.childRef.someMethod();
      
      // 访问子组件的数据
      console.log(this.$refs.childRef.someData);
    }
  },
  mounted() {
    // 可以在mounted中访问ref
    this.$refs.childRef.init();
  }
};
</script>

// 子组件
export default {
  data() {
    return {
      someData: 'Child data'
    };
  },
  methods: {
    someMethod() {
      console.log('Child method called');
    },
    init() {
      console.log('Child initialized');
    }
  }
};
```

**Composition API**：

```javascript
// 父组件
import { ref, onMounted } from 'vue';

const childRef = ref(null);

onMounted(() => {
  childRef.value.someMethod();
});

// 子组件需要使用defineExpose暴露
import { defineExpose } from 'vue';

const someMethod = () => {
  console.log('Called');
};

defineExpose({
  someMethod
});
```

**应用场景**：
- ✅ 父组件调用子组件方法
- ✅ 父组件访问子组件数据
- ⚠️ 避免过度使用，破坏组件封装性

**4. Provide / Inject（祖先→后代）**：

```javascript
// 祖先组件
export default {
  provide() {
    return {
      theme: 'dark',
      user: this.currentUser,
      // 响应式数据（Vue 2需要包装成对象）
      userData: () => this.currentUser
    };
  },
  data() {
    return {
      currentUser: { name: 'Alice' }
    };
  }
};

// Vue 3 Composition API
import { provide, ref, readonly } from 'vue';

export default {
  setup() {
    const theme = ref('dark');
    const user = ref({ name: 'Alice' });
    
    // 提供响应式数据
    provide('theme', readonly(theme));
    provide('user', user);
    
    // 提供方法
    provide('updateTheme', (newTheme) => {
      theme.value = newTheme;
    });
    
    return { theme, user };
  }
};

// 后代组件（任意层级）
export default {
  inject: ['theme', 'user', 'updateTheme'],
  mounted() {
    console.log(this.theme); // 'dark'
    this.updateTheme('light');
  }
};

// Composition API
import { inject } from 'vue';

export default {
  setup() {
    const theme = inject('theme');
    const user = inject('user');
    const updateTheme = inject('updateTheme');
    
    return { theme, user, updateTheme };
  }
};
```

**应用场景**：
- ✅ 跨多层级组件通信
- ✅ 主题、国际化等全局配置
- ✅ 插件系统

**5. EventBus（兄弟组件/跨级）**：

```javascript
// Vue 2
// eventBus.js
import Vue from 'vue';
export const EventBus = new Vue();

// 组件A：发送事件
import { EventBus } from './eventBus';
EventBus.$emit('customEvent', { data: 'some data' });

// 组件B：接收事件
import { EventBus } from './eventBus';
export default {
  mounted() {
    EventBus.$on('customEvent', (payload) => {
      console.log(payload);
    });
  },
  beforeDestroy() {
    // 记得移除监听
    EventBus.$off('customEvent');
  }
};

// Vue 3（推荐使用mitt库）
// npm install mitt
import mitt from 'mitt';

// eventBus.js
export const emitter = mitt();

// 组件A
import { emitter } from './eventBus';
emitter.emit('custom-event', { data: 'some data' });

// 组件B
import { onMounted, onUnmounted } from 'vue';
import { emitter } from './eventBus';

const handler = (payload) => {
  console.log(payload);
};

onMounted(() => {
  emitter.on('custom-event', handler);
});

onUnmounted(() => {
  emitter.off('custom-event', handler);
});
```

**应用场景**：
- ✅ 兄弟组件通信
- ✅ 跨层级组件通信（简单场景）
- ⚠️ 复杂场景建议使用Vuex/Pinia

**6. Vuex/Pinia（全局状态管理）**：

```javascript
// Pinia store
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Alice',
    age: 25,
    isLoggedIn: false
  }),
  
  getters: {
    fullInfo: (state) => `${state.name}, ${state.age}`,
    isAdult: (state) => state.age >= 18
  },
  
  actions: {
    login(username) {
      this.name = username;
      this.isLoggedIn = true;
    },
    logout() {
      this.name = '';
      this.isLoggedIn = false;
    }
  }
});

// 组件中使用
import { useUserStore } from '@/stores/user';

export default {
  setup() {
    const userStore = useUserStore();
    
    // 访问state
    console.log(userStore.name);
    
    // 访问getters
    console.log(userStore.fullInfo);
    
    // 调用actions
    userStore.login('Bob');
    
    return { userStore };
  }
};
```

**应用场景**：
- ✅ 全局共享状态
- ✅ 复杂的状态逻辑
- ✅ 需要持久化的数据
- ✅ 多个组件共享同一数据

**通信方式对比**：

| 方式 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| Props/Emit | 父子组件 | 简单直观 | 只能父子通信 |
| v-model | 双向绑定 | 语法简洁 | 仅适合表单类组件 |
| Ref | 父访问子 | 直接调用子组件 | 破坏封装性 |
| Provide/Inject | 祖先后代 | 跨层级传递 | 不易追踪数据流 |
| EventBus | 任意组件 | 灵活 | 难以维护 |
| Vuex/Pinia | 全局状态 | 集中管理 | 小项目过重 |

**选择建议**：

✅ **父子组件**：优先使用 Props/Emit
✅ **表单组件**：使用 v-model
✅ **跨层级**：少量数据用 Provide/Inject，复杂状态用 Pinia
✅ **兄弟组件**：简单场景用 EventBus，复杂场景用 Pinia
✅ **全局状态**：使用 Pinia（Vue 3）或 Vuex（Vue 2）
✅ **避免使用 Ref**：除非确实需要直接操作子组件

{{< /details >}}

