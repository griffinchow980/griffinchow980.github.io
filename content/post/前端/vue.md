---
title: "Vue.js 全面教程"
date: 2024-11-05
tags: ["Vue", "前端", "JavaScript"]
categories: ["前端"]
---

# Vue 简介与安装

Vue.js 是一个渐进式 JavaScript 框架，用于构建用户界面。它被设计为自底向上逐层应用，核心库只关注视图层。

## 什么是 Vue

Vue (读音 /vjuː/，类似于 view) 是一套用于构建用户界面的渐进式框架。与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。

**特点**：
- 易学易用
- 渐进式框架
- 响应式数据绑定
- 组件化开发
- 虚拟 DOM
- 轻量高效

## 安装方式

### 1. CDN 引入

```html
<!-- 开发环境版本 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>

<!-- 生产环境版本 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
```

### 2. NPM 安装

```bash
# 使用 npm
npm install vue@next

# 使用 yarn
yarn add vue@next

# 使用 pnpm
pnpm add vue
```

### 3. Vue CLI 创建项目

```bash
# 安装 Vue CLI
npm install -g @vue/cli

# 创建项目
vue create my-project

# 启动项目
cd my-project
npm run serve
```

### 4. Vite 创建项目（推荐）

```bash
# 使用 npm
npm create vite@latest my-vue-app -- --template vue

# 使用 yarn
yarn create vite my-vue-app --template vue

# 使用 pnpm
pnpm create vite my-vue-app --template vue

# 进入项目并安装依赖
cd my-vue-app
npm install
npm run dev
```

## 第一个 Vue 应用

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vue App</title>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
</head>
<body>
  <div id="app">
    <h1>{{ message }}</h1>
    <p>{{ description }}</p>
  </div>

  <script>
    const { createApp } = Vue;
    
    createApp({
      data() {
        return {
          message: 'Hello Vue 3!',
          description: '这是我的第一个 Vue 应用'
        }
      }
    }).mount('#app');
  </script>
</body>
</html>
```

# Vue 基础语法

## 模板语法

### 文本插值

使用双大括号 `{{ }}` 进行文本插值：

```vue
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ firstName + ' ' + lastName }}</p>
    <p>{{ number + 1 }}</p>
    <p>{{ ok ? 'YES' : 'NO' }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!',
      firstName: 'Zhang',
      lastName: 'San',
      number: 10,
      ok: true
    }
  }
}
</script>
```

### 原始 HTML

使用 `v-html` 指令：

```vue
<template>
  <div>
    <p>文本插值: {{ rawHtml }}</p>
    <p>v-html 指令: <span v-html="rawHtml"></span></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">红色文本</span>'
    }
  }
}
</script>
```

### 属性绑定

使用 `v-bind` 或简写 `:`：

```vue
<template>
  <div>
    <!-- 完整语法 -->
    <img v-bind:src="imageSrc" v-bind:alt="imageAlt">
    
    <!-- 简写 -->
    <img :src="imageSrc" :alt="imageAlt">
    
    <!-- 动态属性名 -->
    <button :[attributeName]="value">按钮</button>
    
    <!-- 绑定对象 -->
    <div v-bind="objectOfAttrs"></div>
    
    <!-- Class 绑定 -->
    <div :class="{ active: isActive, 'text-danger': hasError }"></div>
    <div :class="[activeClass, errorClass]"></div>
    
    <!-- Style 绑定 -->
    <div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
    <div :style="[baseStyles, overridingStyles]"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageSrc: 'https://example.com/image.jpg',
      imageAlt: '示例图片',
      attributeName: 'disabled',
      value: true,
      objectOfAttrs: {
        id: 'container',
        class: 'wrapper'
      },
      isActive: true,
      hasError: false,
      activeClass: 'active',
      errorClass: 'text-danger',
      activeColor: 'red',
      fontSize: 14,
      baseStyles: { padding: '10px' },
      overridingStyles: { margin: '5px' }
    }
  }
}
</script>
```

## 指令

### v-if / v-else-if / v-else

条件渲染：

```vue
<template>
  <div>
    <h1 v-if="type === 'A'">A</h1>
    <h1 v-else-if="type === 'B'">B</h1>
    <h1 v-else-if="type === 'C'">C</h1>
    <h1 v-else>Not A/B/C</h1>

    <template v-if="loginStatus">
      <h1>欢迎回来！</h1>
      <p>用户名: {{ username }}</p>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'B',
      loginStatus: true,
      username: 'admin'
    }
  }
}
</script>
```

### v-show

切换元素的显示状态：

```vue
<template>
  <div>
    <button @click="show = !show">切换显示</button>
    <p v-show="show">这段文本可以被切换</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true
    }
  }
}
</script>
```

**v-if vs v-show**：
- `v-if` 是"真正"的条件渲染，会销毁和重建 DOM 元素
- `v-show` 只是简单地切换元素的 CSS `display` 属性
- `v-if` 有更高的切换开销，`v-show` 有更高的初始渲染开销
- 如果需要频繁切换，使用 `v-show`；如果条件很少改变，使用 `v-if`

### v-for

列表渲染：

```vue
<template>
  <div>
    <!-- 遍历数组 -->
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        {{ index }} - {{ item.text }}
      </li>
    </ul>

    <!-- 遍历对象 -->
    <ul>
      <li v-for="(value, key, index) in object" :key="key">
        {{ index }}. {{ key }}: {{ value }}
      </li>
    </ul>

    <!-- 整数范围 -->
    <span v-for="n in 10" :key="n">{{ n }} </span>

    <!-- 结合 template -->
    <ul>
      <template v-for="item in items" :key="item.id">
        <li>{{ item.text }}</li>
        <li class="divider"></li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { id: 1, text: '学习 JavaScript' },
        { id: 2, text: '学习 Vue' },
        { id: 3, text: '构建项目' }
      ],
      object: {
        title: 'Vue.js',
        author: 'Evan You',
        year: 2014
      }
    }
  }
}
</script>
```

### v-on 事件监听

使用 `v-on` 或简写 `@`：

```vue
<template>
  <div>
    <!-- 完整语法 -->
    <button v-on:click="handleClick">点击我</button>
    
    <!-- 简写 -->
    <button @click="handleClick">点击我</button>
    
    <!-- 内联语句 -->
    <button @click="count++">增加</button>
    
    <!-- 传递参数 -->
    <button @click="say('hello')">Say hello</button>
    
    <!-- 访问原始 DOM 事件 -->
    <button @click="warn('Form cannot be submitted yet.', $event)">
      提交
    </button>
    
    <!-- 事件修饰符 -->
    <form @submit.prevent="onSubmit">...</form>
    <a @click.stop="doThis">链接</a>
    <div @click.self="doThat">...</div>
    <button @click.once="doThis">只触发一次</button>
    
    <!-- 按键修饰符 -->
    <input @keyup.enter="submit">
    <input @keyup.page-down="onPageDown">
    
    <!-- 系统修饰键 -->
    <input @keyup.alt.enter="clear">
    <div @click.ctrl="doSomething">...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    handleClick() {
      alert('Button clicked!');
    },
    say(message) {
      alert(message);
    },
    warn(message, event) {
      if (event) {
        event.preventDefault();
      }
      alert(message);
    },
    onSubmit() {
      console.log('Form submitted');
    },
    doThis() {
      console.log('This');
    },
    doThat() {
      console.log('That');
    },
    submit() {
      console.log('Submitted');
    },
    onPageDown() {
      console.log('Page down');
    },
    clear() {
      console.log('Clear');
    },
    doSomething() {
      console.log('Ctrl + Click');
    }
  }
}
</script>
```

### v-model 双向绑定

表单输入绑定：

```vue
<template>
  <div>
    <!-- 文本输入 -->
    <input v-model="message" placeholder="请输入">
    <p>消息是: {{ message }}</p>

    <!-- 多行文本 -->
    <textarea v-model="text" placeholder="多行文本"></textarea>
    <p style="white-space: pre-line">{{ text }}</p>

    <!-- 复选框 -->
    <input type="checkbox" id="checkbox" v-model="checked">
    <label for="checkbox">{{ checked }}</label>

    <!-- 多个复选框 -->
    <div>
      <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
      <label for="jack">Jack</label>
      <input type="checkbox" id="john" value="John" v-model="checkedNames">
      <label for="john">John</label>
      <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
      <label for="mike">Mike</label>
      <br>
      <span>选中的名字: {{ checkedNames }}</span>
    </div>

    <!-- 单选按钮 -->
    <div>
      <input type="radio" id="one" value="One" v-model="picked">
      <label for="one">One</label>
      <input type="radio" id="two" value="Two" v-model="picked">
      <label for="two">Two</label>
      <br>
      <span>选中: {{ picked }}</span>
    </div>

    <!-- 选择框 -->
    <select v-model="selected">
      <option disabled value="">请选择</option>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
    <span>选中: {{ selected }}</span>

    <!-- 多选 -->
    <select v-model="multiSelected" multiple>
      <option>A</option>
      <option>B</option>
      <option>C</option>
    </select>
    <span>选中: {{ multiSelected }}</span>

    <!-- 修饰符 -->
    <input v-model.lazy="msg"><!-- 在 change 事件后同步 -->
    <input v-model.number="age" type="number"><!-- 自动转为数字 -->
    <input v-model.trim="msg"><!-- 自动过滤首尾空白字符 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      text: '',
      checked: false,
      checkedNames: [],
      picked: '',
      selected: '',
      multiSelected: [],
      msg: '',
      age: 0
    }
  }
}
</script>
```

## 计算属性与侦听器

### 计算属性 computed

```vue
<template>
  <div>
    <p>原始消息: {{ message }}</p>
    <p>反转消息: {{ reversedMessage }}</p>
    
    <p>全名: {{ fullName }}</p>
    
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }} - {{ item.price }}
      </li>
    </ul>
    <p>总价: {{ totalPrice }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello',
      firstName: 'Zhang',
      lastName: 'San',
      items: [
        { id: 1, name: '苹果', price: 5, active: true },
        { id: 2, name: '香蕉', price: 3, active: false },
        { id: 3, name: '橙子', price: 4, active: true }
      ]
    }
  },
  computed: {
    // 简单的计算属性
    reversedMessage() {
      return this.message.split('').reverse().join('');
    },
    
    // 组合多个数据源
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
    
    // 可写计算属性
    fullNameWritable: {
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      set(newValue) {
        [this.firstName, this.lastName] = newValue.split(' ');
      }
    },
    
    // 过滤列表
    filteredItems() {
      return this.items.filter(item => item.active);
    },
    
    // 计算总和
    totalPrice() {
      return this.filteredItems.reduce((sum, item) => sum + item.price, 0);
    }
  }
}
</script>
```

### 侦听器 watch

```vue
<template>
  <div>
    <input v-model="question" placeholder="输入问题">
    <p>{{ answer }}</p>
    
    <input v-model="searchText" placeholder="搜索">
    <p>搜索结果: {{ searchResults.length }} 条</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: '',
      answer: '问题通常包含问号。',
      searchText: '',
      searchResults: [],
      user: {
        name: 'John',
        age: 25,
        profile: {
          bio: 'Developer'
        }
      }
    }
  },
  watch: {
    // 基本侦听
    question(newQuestion, oldQuestion) {
      if (newQuestion.includes('?')) {
        this.answer = '正在思考...';
        this.getAnswer();
      }
    },
    
    // 深度侦听对象
    user: {
      handler(newVal, oldVal) {
        console.log('用户信息改变了');
      },
      deep: true,
      immediate: true // 立即执行一次
    },
    
    // 侦听对象的特定属性
    'user.name'(newVal, oldVal) {
      console.log(`名字从 ${oldVal} 改为 ${newVal}`);
    },
    
    // 多个回调
    searchText: [
      'handleSearchTextChange',
      function(val) {
        console.log('搜索文本:', val);
      }
    ]
  },
  methods: {
    getAnswer() {
      setTimeout(() => {
        this.answer = '答案是 42';
      }, 1000);
    },
    handleSearchTextChange(val) {
      // 模拟搜索
      this.searchResults = [val + '1', val + '2', val + '3'];
    }
  }
}
</script>
```

## 生命周期钩子

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '生命周期演示',
      message: ''
    }
  },
  
  // 创建前
  beforeCreate() {
    console.log('beforeCreate: 实例初始化之后，数据观测和事件配置之前');
    // 此时 data、methods 还未初始化
  },
  
  // 创建后
  created() {
    console.log('created: 实例创建完成');
    // 可以访问 data、methods
    // 常用于：初始化数据、调用 API 获取数据
    this.message = '组件已创建';
    this.fetchData();
  },
  
  // 挂载前
  beforeMount() {
    console.log('beforeMount: 挂载开始之前');
    // 模板编译完成，但还未挂载到页面
  },
  
  // 挂载后
  mounted() {
    console.log('mounted: 实例挂载到 DOM');
    // 可以访问 DOM 元素
    // 常用于：操作 DOM、初始化第三方库、启动定时器
    console.log('DOM 元素:', this.$el);
  },
  
  // 更新前
  beforeUpdate() {
    console.log('beforeUpdate: 数据更新，DOM 更新前');
    // 可以在此时访问现有的 DOM
  },
  
  // 更新后
  updated() {
    console.log('updated: DOM 更新完成');
    // 注意：避免在此更新数据，可能导致无限循环
  },
  
  // 卸载前
  beforeUnmount() {
    console.log('beforeUnmount: 实例卸载之前');
    // 常用于：清理定时器、取消网络请求、移除事件监听
  },
  
  // 卸载后
  unmounted() {
    console.log('unmounted: 实例已卸载');
    // 清理工作
  },
  
  methods: {
    fetchData() {
      // 模拟 API 调用
      console.log('获取数据...');
    }
  }
}
</script>
```

**生命周期图示**：
1. `beforeCreate` → `created`：实例初始化
2. `beforeMount` → `mounted`：DOM 挂载
3. `beforeUpdate` → `updated`：数据更新（可多次触发）
4. `beforeUnmount` → `unmounted`：实例卸载

# 组件系统

## 组件基础

### 定义组件

```vue
<!-- ButtonCounter.vue -->
<template>
  <button @click="count++">
    点击了 {{ count }} 次
  </button>
</template>

<script>
export default {
  name: 'ButtonCounter',
  data() {
    return {
      count: 0
    }
  }
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

### 使用组件

```vue
<!-- App.vue -->
<template>
  <div>
    <h1>计数器示例</h1>
    <ButtonCounter />
    <ButtonCounter />
    <ButtonCounter />
  </div>
</template>

<script>
import ButtonCounter from './components/ButtonCounter.vue';

export default {
  components: {
    ButtonCounter
  }
}
</script>
```

## Props 传递数据

### 父组件向子组件传递数据

```vue
<!-- BlogPost.vue -->
<template>
  <div class="blog-post">
    <h3>{{ title }}</h3>
    <p>作者: {{ author }}</p>
    <p>{{ content }}</p>
    <span>点赞: {{ likes }}</span>
  </div>
</template>

<script>
export default {
  name: 'BlogPost',
  props: {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: '匿名'
    },
    content: String,
    likes: {
      type: Number,
      default: 0
    },
    tags: {
      type: Array,
      default: () => []
    },
    metadata: {
      type: Object,
      default: () => ({})
    },
    published: {
      type: Boolean,
      default: false
    }
  }
}
</script>
```

### 父组件使用

```vue
<template>
  <div>
    <BlogPost
      v-for="post in posts"
      :key="post.id"
      :title="post.title"
      :author="post.author"
      :content="post.content"
      :likes="post.likes"
      :tags="post.tags"
      :published="post.published"
    />
  </div>
</template>

<script>
import BlogPost from './components/BlogPost.vue';

export default {
  components: {
    BlogPost
  },
  data() {
    return {
      posts: [
        {
          id: 1,
          title: '学习 Vue 3',
          author: 'Zhang San',
          content: 'Vue 3 带来了许多新特性...',
          likes: 42,
          tags: ['Vue', '前端'],
          published: true
        },
        {
          id: 2,
          title: '组件化开发',
          author: 'Li Si',
          content: '组件是 Vue 最强大的功能之一...',
          likes: 35,
          tags: ['Vue', '组件'],
          published: true
        }
      ]
    }
  }
}
</script>
```

## 自定义事件

### 子组件触发事件

```vue
<!-- CustomButton.vue -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'CustomButton',
  emits: ['click', 'custom-event'],
  methods: {
    handleClick() {
      // 触发事件
      this.$emit('click');
      this.$emit('custom-event', { data: 'some data' });
    }
  }
}
</script>
```

### 父组件监听事件

```vue
<template>
  <div>
    <CustomButton @click="handleButtonClick" @custom-event="handleCustomEvent">
      点击我
    </CustomButton>
    
    <p>点击次数: {{ clickCount }}</p>
  </div>
</template>

<script>
import CustomButton from './components/CustomButton.vue';

export default {
  components: {
    CustomButton
  },
  data() {
    return {
      clickCount: 0
    }
  },
  methods: {
    handleButtonClick() {
      this.clickCount++;
    },
    handleCustomEvent(payload) {
      console.log('收到自定义事件:', payload);
    }
  }
}
</script>
```

### v-model 组件

```vue
<!-- CustomInput.vue -->
<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
  />
</template>

<script>
export default {
  name: 'CustomInput',
  props: {
    modelValue: String,
    placeholder: String
  },
  emits: ['update:modelValue']
}
</script>
```

```vue
<!-- 父组件 -->
<template>
  <div>
    <CustomInput v-model="searchText" placeholder="搜索..." />
    <p>搜索内容: {{ searchText }}</p>
  </div>
</template>

<script>
import CustomInput from './components/CustomInput.vue';

export default {
  components: {
    CustomInput
  },
  data() {
    return {
      searchText: ''
    }
  }
}
</script>
```

## 插槽 Slots

### 默认插槽

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <h3>卡片标题</h3>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>
```

```vue
<!-- 使用 -->
<template>
  <Card>
    <p>这是卡片的内容</p>
    <button>操作按钮</button>
  </Card>
</template>
```

### 具名插槽

```vue
<!-- Layout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

```vue
<!-- 使用 -->
<template>
  <Layout>
    <template #header>
      <h1>页面标题</h1>
    </template>
    
    <p>主要内容区域</p>
    <p>默认插槽内容</p>
    
    <template #footer>
      <p>页脚信息</p>
    </template>
  </Layout>
</template>
```

### 作用域插槽

```vue
<!-- TodoList.vue -->
<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <slot name="todo" :todo="todo"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    todos: Array
  }
}
</script>
```

```vue
<!-- 使用 -->
<template>
  <TodoList :todos="todoList">
    <template #todo="{ todo }">
      <span :class="{ completed: todo.completed }">
        {{ todo.text }}
      </span>
      <button @click="deleteTodo(todo.id)">删除</button>
    </template>
  </TodoList>
</template>

<script>
import TodoList from './components/TodoList.vue';

export default {
  components: {
    TodoList
  },
  data() {
    return {
      todoList: [
        { id: 1, text: '学习 Vue', completed: false },
        { id: 2, text: '写项目', completed: false }
      ]
    }
  },
  methods: {
    deleteTodo(id) {
      this.todoList = this.todoList.filter(todo => todo.id !== id);
    }
  }
}
</script>
```

## 组件通信方式

### 1. Props / Emit（父子通信）

```vue
<!-- Parent.vue -->
<template>
  <Child :message="parentMessage" @response="handleResponse" />
</template>

<script>
import Child from './Child.vue';

export default {
  components: { Child },
  data() {
    return {
      parentMessage: 'Hello from parent'
    }
  },
  methods: {
    handleResponse(data) {
      console.log('Child response:', data);
    }
  }
}
</script>
```

### 2. Provide / Inject（祖先后代通信）

```vue
<!-- Grandparent.vue -->
<template>
  <Parent />
</template>

<script>
import Parent from './Parent.vue';

export default {
  components: { Parent },
  provide() {
    return {
      theme: 'dark',
      user: this.user
    }
  },
  data() {
    return {
      user: {
        name: 'John',
        role: 'admin'
      }
    }
  }
}
</script>
```

```vue
<!-- Child.vue (深层子组件) -->
<template>
  <div :class="theme">
    用户: {{ user.name }}
  </div>
</template>

<script>
export default {
  inject: ['theme', 'user'],
  created() {
    console.log(this.theme); // 'dark'
    console.log(this.user);  // { name: 'John', role: 'admin' }
  }
}
</script>
```

### 3. Event Bus（任意组件通信）

```javascript
// eventBus.js
import { createApp } from 'vue';

export const eventBus = createApp({}).config.globalProperties.$bus = createApp({});
```

```vue
<!-- ComponentA.vue -->
<script>
import { eventBus } from './eventBus';

export default {
  methods: {
    sendMessage() {
      eventBus.$emit('custom-event', { message: 'Hello' });
    }
  }
}
</script>
```

```vue
<!-- ComponentB.vue -->
<script>
import { eventBus } from './eventBus';

export default {
  mounted() {
    eventBus.$on('custom-event', (data) => {
      console.log('Received:', data.message);
    });
  },
  beforeUnmount() {
    eventBus.$off('custom-event');
  }
}
</script>
```

# 响应式原理

## Vue 2 响应式原理

Vue 2 使用 `Object.defineProperty` 实现响应式：

```javascript
// 简化的 Vue 2 响应式实现
function defineReactive(obj, key, val) {
  // 依赖收集器
  const dep = new Dep();
  
  Object.defineProperty(obj, key, {
    get() {
      // 收集依赖
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      // 通知更新
      dep.notify();
    }
  });
}

// 依赖收集器
class Dep {
  constructor() {
    this.subs = [];
  }
  
  addSub(sub) {
    this.subs.push(sub);
  }
  
  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

// Watcher
class Watcher {
  constructor(fn) {
    this.fn = fn;
    Dep.target = this;
    this.fn(); // 触发 getter，收集依赖
    Dep.target = null;
  }
  
  update() {
    this.fn();
  }
}

// 使用示例
const data = {};
defineReactive(data, 'count', 0);

new Watcher(() => {
  console.log('Count is:', data.count);
});

data.count = 1; // 输出: Count is: 1
data.count = 2; // 输出: Count is: 2
```

## Vue 3 响应式原理

Vue 3 使用 `Proxy` 实现响应式：

```javascript
// Vue 3 reactive 简化实现
function reactive(target) {
  return new Proxy(target, {
    get(obj, key) {
      // 依赖收集
      track(obj, key);
      return obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      // 触发更新
      trigger(obj, key);
      return true;
    }
  });
}

// 依赖追踪
const targetMap = new WeakMap();
let activeEffect = null;

function track(target, key) {
  if (!activeEffect) return;
  
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  
  dep.add(activeEffect);
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach(effect => effect());
  }
}

// Effect 函数
function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

// 使用示例
const state = reactive({
  count: 0,
  message: 'Hello'
});

effect(() => {
  console.log('Count:', state.count);
});

state.count++; // 输出: Count: 1
state.count = 5; // 输出: Count: 5
```

## ref 和 reactive

```vue
<template>
  <div>
    <h2>ref 示例</h2>
    <p>Count: {{ count }}</p>
    <button @click="count++">增加</button>
    
    <h2>reactive 示例</h2>
    <p>姓名: {{ user.name }}</p>
    <p>年龄: {{ user.age }}</p>
    <button @click="user.age++">增加年龄</button>
    
    <h2>toRefs 示例</h2>
    <p>标题: {{ title }}</p>
    <p>内容: {{ content }}</p>
  </div>
</template>

<script>
import { ref, reactive, toRefs } from 'vue';

export default {
  setup() {
    // ref: 用于基本类型
    const count = ref(0);
    
    // reactive: 用于对象/数组
    const user = reactive({
      name: 'John',
      age: 25
    });
    
    // toRefs: 将 reactive 对象转换为 ref
    const state = reactive({
      title: '文章标题',
      content: '文章内容'
    });
    
    return {
      count,
      user,
      ...toRefs(state)
    }
  }
}
</script>
```

## computed 和 watch

```vue
<script>
import { ref, reactive, computed, watch, watchEffect } from 'vue';

export default {
  setup() {
    const firstName = ref('Zhang');
    const lastName = ref('San');
    
    // computed
    const fullName = computed(() => {
      return `${firstName.value} ${lastName.value}`;
    });
    
    // 可写 computed
    const fullNameWritable = computed({
      get: () => `${firstName.value} ${lastName.value}`,
      set: (value) => {
        [firstName.value, lastName.value] = value.split(' ');
      }
    });
    
    const state = reactive({
      count: 0,
      nested: {
        value: 0
      }
    });
    
    // watch 单个源
    watch(() => state.count, (newVal, oldVal) => {
      console.log(`Count changed from ${oldVal} to ${newVal}`);
    });
    
    // watch 多个源
    watch(
      [() => state.count, firstName],
      ([newCount, newFirstName], [oldCount, oldFirstName]) => {
        console.log('Multiple sources changed');
      }
    );
    
    // watch 对象 (深度监听)
    watch(
      () => state.nested,
      (newVal) => {
        console.log('Nested changed:', newVal);
      },
      { deep: true }
    );
    
    // watchEffect (自动收集依赖)
    watchEffect(() => {
      console.log('Count is:', state.count);
      console.log('First name is:', firstName.value);
    });
    
    return {
      firstName,
      lastName,
      fullName,
      fullNameWritable,
      state
    }
  }
}
</script>
```

# Vue Router 路由

## 安装和配置

```bash
npm install vue-router@4
```

### 基本配置

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
    props: true
  },
  {
    path: '/dashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: '',
        component: () => import('../views/DashboardHome.vue')
      },
      {
        path: 'profile',
        component: () => import('../views/Profile.vue')
      },
      {
        path: 'settings',
        component: () => import('../views/Settings.vue')
      }
    ]
  },
  {
    // 404 页面
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

```javascript
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
```

## 路由使用

### router-link 和 router-view

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
      <router-link :to="{ name: 'User', params: { id: 123 }}">用户</router-link>
      <router-link to="/dashboard">仪表板</router-link>
    </nav>
    
    <router-view></router-view>
  </div>
</template>

<style>
.router-link-active {
  color: #42b983;
  font-weight: bold;
}
</style>
```

### 编程式导航

```vue
<template>
  <div>
    <button @click="goToHome">回到首页</button>
    <button @click="goToUser">查看用户</button>
    <button @click="goBack">返回</button>
    <button @click="goForward">前进</button>
  </div>
</template>

<script>
export default {
  methods: {
    goToHome() {
      this.$router.push('/');
      // 或
      this.$router.push({ name: 'Home' });
    },
    goToUser() {
      this.$router.push({
        name: 'User',
        params: { id: 456 },
        query: { tab: 'profile' }
      });
    },
    goBack() {
      this.$router.go(-1);
      // 或
      this.$router.back();
    },
    goForward() {
      this.$router.go(1);
      // 或
      this.$router.forward();
    }
  }
}
</script>
```

### 在 Composition API 中使用

```vue
<script>
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // 访问路由参数
    console.log(route.params.id);
    console.log(route.query.tab);
    
    // 编程式导航
    const navigateToUser = () => {
      router.push({
        name: 'User',
        params: { id: 789 }
      });
    };
    
    return {
      navigateToUser
    }
  }
}
</script>
```

## 路由守卫

### 全局守卫

```javascript
// router/index.js
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('导航到:', to.path);
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

// 全局解析守卫
router.beforeResolve((to, from, next) => {
  // 在所有组件内守卫和异步路由组件被解析之后调用
  next();
});

// 全局后置钩子
router.afterEach((to, from) => {
  // 设置页面标题
  document.title = to.meta.title || '默认标题';
});

function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}
```

### 路由独享守卫

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (isAdmin()) {
        next();
      } else {
        next({ name: 'Forbidden' });
      }
    }
  }
];
```

### 组件内守卫

```vue
<script>
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能访问组件实例 this
    next(vm => {
      // 通过 vm 访问组件实例
    });
  },
  
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但该组件被复用时调用
    // 可以访问组件实例 this
    next();
  },
  
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 this
    const answer = window.confirm('确定要离开吗？未保存的更改将丢失。');
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
}
</script>
```

# Pinia 状态管理

## 安装和配置

```bash
npm install pinia
```

```javascript
// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');
```

## 定义 Store

```javascript
// stores/counter.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  // State
  state: () => ({
    count: 0,
    name: 'Counter Store'
  }),
  
  // Getters (相当于 computed)
  getters: {
    doubleCount: (state) => state.count * 2,
    
    doubleCountPlusOne() {
      return this.doubleCount + 1;
    }
  },
  
  // Actions (相当于 methods)
  actions: {
    increment() {
      this.count++;
    },
    
    decrement() {
      this.count--;
    },
    
    incrementBy(amount) {
      this.count += amount;
    },
    
    async fetchCount() {
      try {
        const response = await fetch('/api/count');
        const data = await response.json();
        this.count = data.count;
      } catch (error) {
        console.error('Failed to fetch count:', error);
      }
    }
  }
});
```

## 使用 Store

### 选项式 API

```vue
<template>
  <div>
    <p>Count: {{ counterStore.count }}</p>
    <p>Double: {{ counterStore.doubleCount }}</p>
    <button @click="counterStore.increment()">增加</button>
    <button @click="counterStore.decrement()">减少</button>
    <button @click="counterStore.incrementBy(10)">增加 10</button>
  </div>
</template>

<script>
import { useCounterStore } from '@/stores/counter';

export default {
  setup() {
    const counterStore = useCounterStore();
    
    return {
      counterStore
    }
  }
}
</script>
```

### 组合式 API

```vue
<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

const counterStore = useCounterStore();

// 使用 storeToRefs 解构保持响应性
const { count, doubleCount } = storeToRefs(counterStore);

// Actions 可以直接解构
const { increment, decrement, incrementBy } = counterStore;
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
    <button @click="decrement">减少</button>
    <button @click="incrementBy(10)">增加 10</button>
  </div>
</template>
```

## 复杂 Store 示例

```javascript
// stores/user.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  
  getters: {
    username: (state) => state.user?.name || 'Guest',
    isAdmin: (state) => state.user?.role === 'admin',
    userInitials: (state) => {
      if (!state.user?.name) return '';
      return state.user.name.split(' ').map(n => n[0]).join('');
    }
  },
  
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post('/api/login', credentials);
        const { token, user } = response.data;
        
        this.token = token;
        this.user = user;
        this.isAuthenticated = true;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        this.error = error.response?.data?.message || '登录失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUserProfile() {
      if (!this.token) return;
      
      try {
        const response = await axios.get('/api/user/profile');
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        this.logout();
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    
    updateProfile(profileData) {
      if (this.user) {
        this.user = { ...this.user, ...profileData };
      }
    }
  }
});
```

# 组合式 API (Composition API)

## setup 函数

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(props, context) {
    // props: 组件接收的 props
    // context: { attrs, slots, emit, expose }
    
    const title = ref('Composition API');
    const count = ref(0);
    
    const increment = () => {
      count.value++;
    };
    
    // 返回给模板使用
    return {
      title,
      count,
      increment
    }
  }
}
</script>
```

## script setup (推荐)

```vue
<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 直接声明的变量、函数都会自动暴露给模板
const count = ref(0);
const message = ref('Hello');

// 计算属性
const doubleCount = computed(() => count.value * 2);

// 方法
const increment = () => {
  count.value++;
};

// 侦听器
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`);
});

// 生命周期钩子
onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>
```

## 组合式函数 (Composables)

### 创建可复用逻辑

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);
  
  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', update);
  });
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });
  
  return { x, y };
}
```

```javascript
// composables/useFetch.js
import { ref, watchEffect, toValue } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);
  
  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    data.value = null;
    
    try {
      const response = await fetch(toValue(url));
      if (!response.ok) throw new Error('Network response was not ok');
      data.value = await response.json();
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };
  
  watchEffect(() => {
    fetchData();
  });
  
  return { data, error, loading, refetch: fetchData };
}
```

```javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue';

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key);
  const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue);
  
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });
  
  return data;
}
```

### 使用 Composables

```vue
<script setup>
import { useMouse } from './composables/useMouse';
import { useFetch } from './composables/useFetch';
import { useLocalStorage } from './composables/useLocalStorage';

// 使用鼠标位置
const { x, y } = useMouse();

// 使用数据获取
const { data, error, loading } = useFetch('https://api.example.com/data');

// 使用本地存储
const settings = useLocalStorage('app-settings', {
  theme: 'light',
  language: 'zh-CN'
});
</script>

<template>
  <div>
    <p>鼠标位置: {{ x }}, {{ y }}</p>
    
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error }}</div>
    <div v-else>{{ data }}</div>
    
    <div>
      <label>
        <input type="radio" v-model="settings.theme" value="light"> 亮色
      </label>
      <label>
        <input type="radio" v-model="settings.theme" value="dark"> 暗色
      </label>
    </div>
  </div>
</template>
```

## 生命周期钩子对比

| 选项式 API | 组合式 API |
|-----------|-----------|
| beforeCreate | - (不需要) |
| created | - (不需要) |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |
| errorCaptured | onErrorCaptured |
| renderTracked | onRenderTracked |
| renderTriggered | onRenderTriggered |
| activated | onActivated |
| deactivated | onDeactivated |

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

onBeforeMount(() => {
  console.log('Before mount');
});

onMounted(() => {
  console.log('Mounted');
});

onBeforeUpdate(() => {
  console.log('Before update');
});

onUpdated(() => {
  console.log('Updated');
});

onBeforeUnmount(() => {
  console.log('Before unmount');
});

onUnmounted(() => {
  console.log('Unmounted');
});
</script>
```

# 实战项目：数据可视化看板

## 项目概述

构建一个完整的数据可视化看板，包括：
- 数据采集（API 调用）
- 数据处理和分析
- 图表可视化（ECharts）
- 实时数据更新
- 交互式筛选

## 项目结构

```
data-dashboard/
├── src/
│   ├── api/
│   │   └── dataService.js
│   ├── components/
│   │   ├── charts/
│   │   │   ├── LineChart.vue
│   │   │   ├── BarChart.vue
│   │   │   ├── PieChart.vue
│   │   │   └── ScatterChart.vue
│   │   ├── DataTable.vue
│   │   └── FilterPanel.vue
│   ├── composables/
│   │   ├── useCharts.js
│   │   └── useDataAnalysis.js
│   ├── stores/
│   │   └── dataStore.js
│   ├── views/
│   │   └── Dashboard.vue
│   └── utils/
│       └── dataProcessor.js
```

## 1. 安装依赖

```bash
npm install echarts axios pinia vue-router
```

## 2. 数据服务封装

```javascript
// api/dataService.js
import axios from 'axios';

// 配置 axios 实例
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 数据服务 API
export const dataService = {
  // 获取销售数据
  getSalesData(params) {
    return apiClient.get('/api/sales', { params });
  },
  
  // 获取用户统计
  getUserStats(dateRange) {
    return apiClient.get('/api/users/stats', { params: dateRange });
  },
  
  // 获取产品分析
  getProductAnalysis() {
    return apiClient.get('/api/products/analysis');
  },
  
  // 获取实时数据
  getRealTimeData() {
    return apiClient.get('/api/realtime');
  },
  
  // 导出数据
  exportData(format, filters) {
    return apiClient.post('/api/export', { format, filters }, {
      responseType: 'blob'
    });
  }
};

// 模拟数据生成器（用于演示）
export const mockDataService = {
  // 生成销售数据
  generateSalesData(days = 30) {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 10000) + 5000,
        orders: Math.floor(Math.random() * 200) + 50,
        users: Math.floor(Math.random() * 1000) + 200
      });
    }
    
    return data;
  },
  
  // 生成产品数据
  generateProductData() {
    const products = ['产品A', '产品B', '产品C', '产品D', '产品E'];
    return products.map(name => ({
      name,
      value: Math.floor(Math.random() * 1000) + 100,
      growth: (Math.random() * 40 - 10).toFixed(2)
    }));
  },
  
  // 生成用户地理分布数据
  generateGeoData() {
    const cities = [
      { name: '北京', value: [116.4074, 39.9042] },
      { name: '上海', value: [121.4737, 31.2304] },
      { name: '广州', value: [113.2644, 23.1291] },
      { name: '深圳', value: [114.0579, 22.5431] },
      { name: '成都', value: [104.0668, 30.5728] },
      { name: '杭州', value: [120.1551, 30.2741] }
    ];
    
    return cities.map(city => ({
      ...city,
      count: Math.floor(Math.random() * 5000) + 1000
    }));
  }
};
```

## 3. 数据处理工具

```javascript
// utils/dataProcessor.js

/**
 * 数据聚合
 */
export function aggregateData(data, groupBy, aggregateFn) {
  const grouped = data.reduce((acc, item) => {
    const key = item[groupBy];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
  
  return Object.entries(grouped).map(([key, values]) => ({
    [groupBy]: key,
    value: aggregateFn(values)
  }));
}

/**
 * 计算统计指标
 */
export function calculateStats(data, field) {
  const values = data.map(item => item[field]).filter(v => typeof v === 'number');
  
  if (values.length === 0) return null;
  
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    count: values.length,
    sum,
    mean,
    median,
    min: Math.min(...values),
    max: Math.max(...values),
    stdDev
  };
}

/**
 * 数据过滤
 */
export function filterData(data, filters) {
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true;
      
      if (Array.isArray(value)) {
        return value.includes(item[key]);
      }
      
      if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
        return item[key] >= value.min && item[key] <= value.max;
      }
      
      return item[key] === value;
    });
  });
}

/**
 * 数据排序
 */
export function sortData(data, sortBy, order = 'asc') {
  return [...data].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * 计算增长率
 */
export function calculateGrowthRate(current, previous) {
  if (previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(2);
}

/**
 * 数据分组
 */
export function groupByDateRange(data, dateField, interval = 'day') {
  const grouped = {};
  
  data.forEach(item => {
    const date = new Date(item[dateField]);
    let key;
    
    switch (interval) {
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        break;
      case 'year':
        key = date.getFullYear().toString();
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  
  return grouped;
}

/**
 * 移动平均
 */
export function movingAverage(data, field, window = 7) {
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const end = i + 1;
    const slice = data.slice(start, end);
    const avg = slice.reduce((sum, item) => sum + item[field], 0) / slice.length;
    
    result.push({
      ...data[i],
      [`${field}_ma${window}`]: avg.toFixed(2)
    });
  }
  
  return result;
}
```

## 4. Pinia Store

```javascript
// stores/dataStore.js
import { defineStore } from 'pinia';
import { mockDataService } from '@/api/dataService';
import { calculateStats, filterData, sortData } from '@/utils/dataProcessor';

export const useDataStore = defineStore('data', {
  state: () => ({
    // 原始数据
    salesData: [],
    productData: [],
    userData: [],
    
    // 筛选条件
    filters: {
      dateRange: {
        start: null,
        end: null
      },
      category: null,
      status: null
    },
    
    // 加载状态
    loading: false,
    error: null,
    
    // 更新时间
    lastUpdated: null
  }),
  
  getters: {
    // 过滤后的销售数据
    filteredSalesData: (state) => {
      let data = [...state.salesData];
      
      if (state.filters.dateRange.start && state.filters.dateRange.end) {
        data = data.filter(item => {
          const date = new Date(item.date);
          return date >= new Date(state.filters.dateRange.start) &&
                 date <= new Date(state.filters.dateRange.end);
        });
      }
      
      return data;
    },
    
    // 销售统计
    salesStats: (state) => {
      if (state.salesData.length === 0) return null;
      return {
        totalSales: calculateStats(state.salesData, 'sales'),
        totalOrders: calculateStats(state.salesData, 'orders'),
        avgOrderValue: state.salesData.reduce((sum, item) => sum + item.sales, 0) /
                       state.salesData.reduce((sum, item) => sum + item.orders, 0)
      };
    },
    
    // Top 产品
    topProducts: (state) => {
      return sortData(state.productData, 'value', 'desc').slice(0, 10);
    },
    
    // 总销售额
    totalRevenue: (state) => {
      return state.salesData.reduce((sum, item) => sum + item.sales, 0);
    },
    
    // 日期范围
    dateRange: (state) => {
      if (state.salesData.length === 0) return null;
      
      const dates = state.salesData.map(item => new Date(item.date));
      return {
        start: new Date(Math.min(...dates)),
        end: new Date(Math.max(...dates))
      };
    }
  },
  
  actions: {
    // 加载所有数据
    async fetchAllData() {
      this.loading = true;
      this.error = null;
      
      try {
        // 使用模拟数据（实际项目中替换为真实 API）
        this.salesData = mockDataService.generateSalesData(30);
        this.productData = mockDataService.generateProductData();
        
        this.lastUpdated = new Date();
      } catch (error) {
        this.error = error.message;
        console.error('Failed to fetch data:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // 更新筛选条件
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters };
    },
    
    // 清除筛选条件
    clearFilters() {
      this.filters = {
        dateRange: { start: null, end: null },
        category: null,
        status: null
      };
    },
    
    // 刷新数据
    async refreshData() {
      await this.fetchAllData();
    }
  }
});
```

## 5. ECharts 图表组件

### 折线图组件

```vue
<!-- components/charts/LineChart.vue -->
<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  xField: {
    type: String,
    default: 'date'
  },
  yField: {
    type: String,
    default: 'value'
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  },
  smooth: {
    type: Boolean,
    default: true
  }
});

const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  if (!chartInstance) return;
  
  const xData = props.data.map(item => item[props.xField]);
  const yData = props.data.map(item => item[props.yField]);
  
  const option = {
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      type: 'line',
      data: yData,
      smooth: props.smooth,
      areaStyle: {
        opacity: 0.3
      },
      itemStyle: {
        color: '#5470c6'
      }
    }]
  };
  
  chartInstance.setOption(option);
};

// 响应式调整
const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

// 监听数据变化
watch(() => props.data, () => {
  updateChart();
}, { deep: true });
</script>
```

### 柱状图组件

```vue
<!-- components/charts/BarChart.vue -->
<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  xField: {
    type: String,
    default: 'name'
  },
  yField: {
    type: String,
    default: 'value'
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  },
  horizontal: {
    type: Boolean,
    default: false
  }
});

const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  if (!chartInstance) return;
  
  const xData = props.data.map(item => item[props.xField]);
  const yData = props.data.map(item => item[props.yField]);
  
  const option = {
    title: {
      text: props.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: props.horizontal ? 'value' : 'category',
      data: props.horizontal ? null : xData
    },
    yAxis: {
      type: props.horizontal ? 'category' : 'value',
      data: props.horizontal ? xData : null
    },
    series: [{
      type: 'bar',
      data: yData,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      }
    }]
  };
  
  chartInstance.setOption(option);
};

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

watch(() => props.data, () => {
  updateChart();
}, { deep: true });
</script>
```

### 饼图组件

```vue
<!-- components/charts/PieChart.vue -->
<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  nameField: {
    type: String,
    default: 'name'
  },
  valueField: {
    type: String,
    default: 'value'
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  },
  radius: {
    type: Array,
    default: () => ['40%', '70%']
  }
});

const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
  if (!chartRef.value) return;
  
  chartInstance = echarts.init(chartRef.value);
  updateChart();
};

const updateChart = () => {
  if (!chartInstance) return;
  
  const chartData = props.data.map(item => ({
    name: item[props.nameField],
    value: item[props.valueField]
  }));
  
  const option = {
    title: {
      text: props.title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: props.title,
      type: 'pie',
      radius: props.radius,
      data: chartData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        formatter: '{b}: {d}%'
      }
    }]
  };
  
  chartInstance.setOption(option);
};

const handleResize = () => {
  chartInstance?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chartInstance?.dispose();
});

watch(() => props.data, () => {
  updateChart();
}, { deep: true });
</script>
```

## 6. 完整数据看板

```vue
<!-- views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>数据分析看板</h1>
      <div class="header-actions">
        <button @click="refreshData" :disabled="loading">
          {{ loading ? '刷新中...' : '刷新数据' }}
        </button>
        <span v-if="lastUpdated" class="last-updated">
          最后更新: {{ formatDate(lastUpdated) }}
        </span>
      </div>
    </header>

    <!-- 关键指标卡片 -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon">💰</div>
        <div class="metric-content">
          <h3>总销售额</h3>
          <p class="metric-value">¥{{ formatNumber(totalRevenue) }}</p>
          <span class="metric-change positive">+12.5%</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">📦</div>
        <div class="metric-content">
          <h3>总订单数</h3>
          <p class="metric-value">{{ formatNumber(totalOrders) }}</p>
          <span class="metric-change positive">+8.3%</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">👥</div>
        <div class="metric-content">
          <h3>活跃用户</h3>
          <p class="metric-value">{{ formatNumber(activeUsers) }}</p>
          <span class="metric-change negative">-2.1%</span>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-icon">💵</div>
        <div class="metric-content">
          <h3>客单价</h3>
          <p class="metric-value">¥{{ avgOrderValue.toFixed(2) }}</p>
          <span class="metric-change positive">+5.7%</span>
        </div>
      </div>
    </div>

    <!-- 筛选面板 -->
    <div class="filter-panel">
      <div class="filter-group">
        <label>日期范围:</label>
        <input type="date" v-model="filters.dateRange.start">
        <span>至</span>
        <input type="date" v-model="filters.dateRange.end">
      </div>
      
      <button @click="applyFilters" class="btn-primary">应用筛选</button>
      <button @click="clearFilters" class="btn-secondary">清除筛选</button>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <div class="chart-container">
        <LineChart
          :data="filteredSalesData"
          x-field="date"
          y-field="sales"
          title="销售趋势"
        />
      </div>
      
      <div class="chart-container">
        <BarChart
          :data="topProducts"
          x-field="name"
          y-field="value"
          title="Top 10 产品"
        />
      </div>
      
      <div class="chart-container">
        <PieChart
          :data="productData"
          name-field="name"
          value-field="value"
          title="产品分布"
        />
      </div>
      
      <div class="chart-container">
        <LineChart
          :data="filteredSalesData"
          x-field="date"
          y-field="orders"
          title="订单趋势"
        />
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="data-table-container">
      <h2>详细数据</h2>
      <table class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>销售额</th>
            <th>订单数</th>
            <th>用户数</th>
            <th>客单价</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredSalesData" :key="item.date">
            <td>{{ item.date }}</td>
            <td>¥{{ formatNumber(item.sales) }}</td>
            <td>{{ item.orders }}</td>
            <td>{{ item.users }}</td>
            <td>¥{{ (item.sales / item.orders).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataStore } from '@/stores/dataStore';
import LineChart from '@/components/charts/LineChart.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';

const dataStore = useDataStore();
const {
  salesData,
  productData,
  filteredSalesData,
  topProducts,
  totalRevenue,
  loading,
  lastUpdated,
  filters
} = storeToRefs(dataStore);

// 计算指标
const totalOrders = computed(() => {
  return filteredSalesData.value.reduce((sum, item) => sum + item.orders, 0);
});

const activeUsers = computed(() => {
  return filteredSalesData.value.reduce((sum, item) => sum + item.users, 0);
});

const avgOrderValue = computed(() => {
  return totalRevenue.value / totalOrders.value || 0;
});

// 格式化函数
const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-CN').format(num);
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN');
};

// 操作函数
const refreshData = async () => {
  await dataStore.fetchAllData();
};

const applyFilters = () => {
  dataStore.updateFilters(filters.value);
};

const clearFilters = () => {
  dataStore.clearFilters();
};

// 初始化
onMounted(() => {
  dataStore.fetchAllData();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-actions button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.header-actions button:hover:not(:disabled) {
  background-color: #359268;
}

.header-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.last-updated {
  font-size: 12px;
  color: #666;
}

/* 指标卡片 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.metric-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.metric-icon {
  font-size: 40px;
}

.metric-content h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.metric-value {
  margin: 0 0 5px 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.metric-change {
  font-size: 12px;
  font-weight: bold;
}

.metric-change.positive {
  color: #52c41a;
}

.metric-change.negative {
  color: #f5222d;
}

/* 筛选面板 */
.filter-panel {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: bold;
  color: #333;
}

.filter-group input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.btn-primary, .btn-secondary {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover {
  background-color: #40a9ff;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

/* 图表网格 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 数据表格 */
.data-table-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-table-container h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #333;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background-color: #fafafa;
  font-weight: bold;
  color: #333;
}

.data-table tr:hover {
  background-color: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-panel {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
```


