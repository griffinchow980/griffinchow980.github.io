---
title: "Hugo 博客功能完整测试"
date: 2019-07-12T10:00:00+08:00
categories: ["a"]
draft: false
math: true

description: "测试Hugo博客支持的所有格式、短代码和功能"


---

这是一个全面的测试文档，展示当前 Hugo 博客支持的所有格式、短代码和功能。
<!--more-->
# Hugo 博客功能完整测试

这是一个全面的测试文档，展示当前 Hugo 博客支持的所有格式、短代码和功能。

## 目录

- [基础 Markdown 语法](#基础-markdown-语法)
- [扩展 Markdown 语法](#扩展-markdown-语法)
- [HTML 支持](#html-支持)
- [代码高亮](#代码高亮)
- [数学公式](#数学公式)
- [自定义短代码](#自定义短代码)
- [表格和列表](#表格和列表)
- [媒体内容](#媒体内容)
- [~GitHub 警示块~](#github-警示块)

---

## 基础 Markdown 语法

### 标题层级

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

### 文本格式

**粗体文本** 和 *斜体文本* 以及 ***粗斜体文本***

~~删除线文本~~

`行内代码`

[链接文本](https://github.com)

### 引用

> 这是一个普通的引用块
> 
> 可以包含多行内容
> 
> > 嵌套引用
> > 
> > 支持 **格式化** 和 `代码`

---

## 扩展 Markdown 语法

### 任务列表

- [x] 完成的任务
- [ ] 未完成的任务
- [x] 另一个完成的任务
  - [ ] 嵌套未完成任务
  - [x] 嵌套完成任务

### 脚注

这是一个带脚注的文本[^1]，还有另一个脚注[^note]。

[^1]: 这是第一个脚注
[^note]: 这是一个命名脚注，支持多行内容

### 定义列表

Term 1
: Definition 1

Term 2
: Definition 2a
: Definition 2b

---

## HTML 支持

### HTML 标签

<div style="background: #f0f8ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <h4 style="color: #0066cc; margin-top: 0;">HTML 容器示例</h4>
  <p>这是一个 HTML div 容器，支持内联样式。</p>
  <ul>
    <li><strong>支持</strong> HTML 标签</li>
    <li><em>支持</em> 样式属性</li>
    <li><code>支持</code> 混合内容</li>
  </ul>
</div>

### 键盘按键

按下 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制内容

### 高亮标记

<mark>高亮显示的重要文本</mark>

### 详细信息（原生 HTML）

<details>
<summary>点击展开原生 HTML details</summary>
这是使用原生 HTML details 标签的内容。

``` javascript
console.log("支持代码高亮");
```

支持所有 Markdown 格式。
</details>

---

## 代码高亮

### 行内代码

JavaScript 中的 `console.log()` 函数用于输出信息。

### 代码块（无语言）

```
这是没有指定语言的代码块
不会进行语法高亮
但会保持等宽字体格式
```

### Python 代码

```python
# Python 示例
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 列表推导式
squares = [x**2 for x in range(10)]
print(f"前10个平方数: {squares}")

# 装饰器示例
def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} 耗时: {time.time() - start:.4f}秒")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
    return "完成"
```

### Go 代码

```go
// Go 示例
package main

import (
    "fmt"
    "sync"
    "time"
)

// 接口定义
type Speaker interface {
    Speak() string
}

// 结构体
type Person struct {
    Name string
    Age  int
}

func (p Person) Speak() string {
    return fmt.Sprintf("Hello, I'm %s", p.Name)
}

// Goroutine 和 Channel 示例
func main() {
    var wg sync.WaitGroup
    messages := make(chan string, 3)
    
    // 启动多个 goroutine
    for i := 0; i < 3; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            time.Sleep(time.Duration(id) * time.Second)
            messages <- fmt.Sprintf("Worker %d finished", id)
        }(i)
    }
    
    // 关闭 channel
    go func() {
        wg.Wait()
        close(messages)
    }()
    
    // 接收消息
    for msg := range messages {
        fmt.Println(msg)
    }
}
```

### JavaScript 代码

```javascript
// JavaScript ES6+ 示例
class DataProcessor {
    constructor(data) {
        this.data = data;
        this.processors = new Map();
    }
    
    // 异步处理
    async processData() {
        try {
            const results = await Promise.all(
                this.data.map(async (item) => {
                    const processed = await this.transform(item);
                    return this.validate(processed);
                })
            );
            return results.filter(Boolean);
        } catch (error) {
            console.error('处理数据时出错:', error);
            throw error;
        }
    }
    
    // 箭头函数和解构
    transform = async ({ id, value, ...rest }) => {
        const transformed = {
            id: id.toString(),
            processedValue: value * 2,
            timestamp: Date.now(),
            ...rest
        };
        
        return new Promise(resolve => 
            setTimeout(() => resolve(transformed), 100)
        );
    };
    
    validate(item) {
        return item.processedValue > 0 ? item : null;
    }
}

// 使用示例
const processor = new DataProcessor([
    { id: 1, value: 10 },
    { id: 2, value: -5 },
    { id: 3, value: 20 }
]);

processor.processData().then(console.log);
```

### Shell 脚本

```bash
#!/bin/bash

# Hugo 博客部署脚本
set -e

HUGO_VERSION="0.148.0"
SITE_DIR="/var/www/blog"
BACKUP_DIR="/backup/blog"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# 检查 Hugo 版本
check_hugo() {
    if ! command -v hugo &> /dev/null; then
        error "Hugo 未安装"
    fi
    
    local version=$(hugo version | grep -oP 'v\K[0-9.]+')
    if [[ "$version" != "$HUGO_VERSION" ]]; then
        warn "Hugo 版本不匹配: 期望 $HUGO_VERSION, 实际 $version"
    fi
}

# 备份现有站点
backup_site() {
    if [ -d "$SITE_DIR" ]; then
        log "备份现有站点..."
        tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$SITE_DIR" .
    fi
}

# 构建和部署
deploy() {
    log "开始构建站点..."
    hugo --minify --gc
    
    log "部署到服务器..."
    rsync -avz --delete public/ "$SITE_DIR/"
    
    log "设置权限..."
    chown -R www-data:www-data "$SITE_DIR"
    chmod -R 755 "$SITE_DIR"
}

# 主函数
main() {
    check_hugo
    backup_site
    deploy
    log "部署完成！"
}

main "$@"
```

### YAML 配置

```yaml
# Hugo 配置示例
baseURL: 'https://example.org/'
languageCode: 'zh-cn'
title: 'My Hugo Site'
theme: 'github-style'

params:
  author: "Griffin Chow"
  description: "技术博客"
  github: "griffinchow980"
  email: "griffinchow980@gmail.com"
  
  # 功能开关
  enableSearch: true
  enableGitalk: false
  enableTOC: true
  
  # 自定义资源
  custom_css:
    - "/css/custom-syntax.css"
    - "/css/tabs.css"
    - "/css/details.css"
  
  custom_js:
    - "/js/copy-code.js"
    - "/js/tabs.js"

markup:
  highlight:
    style: "github"
    lineNos: false
    codeFences: true
    guessSyntax: true
  
  goldmark:
    renderer:
      unsafe: true
```

### JSON 数据

```json
{
  "blog": {
    "name": "Hugo 技术博客",
    "version": "2.0.0",
    "features": [
      "代码高亮",
      "数学公式",
      "自定义短代码",
      "响应式设计"
    ],
    "config": {
      "theme": "github-style",
      "highlighter": "chroma",
      "mathRenderer": "katex"
    },
    "stats": {
      "posts": 42,
      "categories": 8,
      "tags": 156,
      "lastUpdate": "2025-07-12T10:00:00Z"
    }
  }
}
```

### CSS 样式

```css
/* 自定义样式示例 */
.code-block {
  background: var(--color-canvas-subtle, #f6f8fa);
  border: 1px solid var(--color-border-default, #d0d7de);
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  position: relative;
  overflow-x: auto;
}

.code-block::before {
  content: attr(data-lang);
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 12px;
  color: var(--color-fg-muted, #656d76);
  text-transform: uppercase;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .code-block {
    margin: 12px -16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}

/* 暗色主题适配 */
[data-color-mode="dark"] .code-block {
  background: var(--color-canvas-subtle, #161b22);
  border-color: var(--color-border-default, #30363d);
}
```

---

## 数学公式

### 行内公式

这是一个行内公式 $E = mc^2$，还有一个 $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$。

### 块级公式

**欧拉公式：**

$$e^{i\pi} + 1 = 0$$

**正态分布概率密度函数：**

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$$

**矩阵运算：**

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix}=
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$

**积分公式：**

$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

**求和公式：**

$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

---

## 自定义短代码

### Tabs 分页

{{< tabs "Python,Go,JavaScript,配置文件" >}}
```python
# Python 爬虫示例
import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_website(url):
    """爬取网站数据"""
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    data = []
    for item in soup.find_all('div', class_='item'):
        title = item.find('h3').text.strip()
        link = item.find('a')['href']
        data.append({'title': title, 'link': link})
    
    return pd.DataFrame(data)

# 使用示例
df = scrape_website('https://example.com')
df.to_csv('scraped_data.csv', index=False)
```
|||
```go
// Go Web 服务器示例
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"
    
    "github.com/gorilla/mux"
)

type Article struct {
    ID       int       `json:"id"`
    Title    string    `json:"title"`
    Content  string    `json:"content"`
    Created  time.Time `json:"created"`
}

type Server struct {
    articles []Article
}

func (s *Server) getArticles(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(s.articles)
}

func (s *Server) createArticle(w http.ResponseWriter, r *http.Request) {
    var article Article
    if err := json.NewDecoder(r.Body).Decode(&article); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    article.ID = len(s.articles) + 1
    article.Created = time.Now()
    s.articles = append(s.articles, article)
    
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(article)
}

func main() {
    server := &Server{articles: make([]Article, 0)}
    
    r := mux.NewRouter()
    r.HandleFunc("/articles", server.getArticles).Methods("GET")
    r.HandleFunc("/articles", server.createArticle).Methods("POST")
    
    log.Println("服务器启动在 :8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}
```
|||
```javascript
// React Hook 示例
import React, { useState, useEffect, useCallback } from 'react';

const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('获取文章失败');
      }
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const addArticle = async (article) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      
      if (response.ok) {
        await fetchArticles(); // 重新获取数据
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return { articles, loading, error, addArticle, refetch: fetchArticles };
};

// 组件使用
const ArticleList = () => {
  const { articles, loading, error, addArticle } = useArticles();

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      {articles.map(article => (
        <article key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
          <time>{new Date(article.created).toLocaleDateString()}</time>
        </article>
      ))}
    </div>
  );
};
```
|||
```nginx
# Nginx 配置文件
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL 配置
    ssl_certificate /etc/ssl/certs/example.com.crt;
    ssl_certificate_key /etc/ssl/private/example.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 根目录
    root /var/www/blog/public;
    index index.html;
    
    # 静态文件缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API 代理
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 默认路由
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 404 错误页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```
{{< /tabs >}}

### Details 折叠块

{{< details "🚀 **部署指南**：如何将 Hugo 博客部署到服务器" >}}
部署 Hugo 博客的详细步骤：

1. **构建静态文件**
   ```bash
   hugo --minify --gc
   ```

2. **上传到服务器**
   ```bash
   rsync -avz --delete public/ user@server:/var/www/blog/
   ```

3. **配置 Nginx**
   - 参考上面的 Nginx 配置示例
   - 设置 SSL 证书
   - 配置缓存策略

4. **自动化部署**
   - 使用 GitHub Actions
   - 配置 webhook
   - 设置定时构建
{{< /details >}}

{{< details "💡 **性能优化**：提升博客访问速度的技巧" >}}
优化 Hugo 博客性能的方法：

**图片优化**
- 使用 WebP 格式
- 压缩图片大小
- 启用懒加载

**资源压缩**
```toml
[minify]
  disableCSS = false
  disableHTML = false
  disableJS = false
  disableJSON = false
  disableSVG = false
  disableXML = false
```

**CDN 配置**
- 使用 Cloudflare
- 配置缓存规则
- 启用 Brotli 压缩

**代码优化**
- 减少 JavaScript 包大小
- 内联关键 CSS
- 移除未使用的样式
{{< /details >}}

{{< details "🔧 **主题定制**：修改 GitHub 风格主题" >}}
定制主题的方法：

**颜色变量**
```css
:root {
  --color-primary: #0969da;
  --color-secondary: #656d76;
  --color-accent: #1a7f37;
}

[data-color-mode="dark"] {
  --color-primary: #2f81f7;
  --color-secondary: #7d8590;
  --color-accent: #3fb950;
}
```

**布局修改**
- 修改 `layouts/partials/` 文件
- 添加自定义 CSS
- 扩展短代码功能

**响应式设计**
- 使用 CSS Grid 和 Flexbox
- 优化移动端体验
- 设置合适的断点
{{< /details >}}

---

## 表格和列表

### 简单表格

| 功能 | 支持状态 | 备注 |
|------|----------|------|
| Markdown 渲染 | ✅ 完全支持 | 标准语法 |
| 代码高亮 | ✅ 完全支持 | Chroma 引擎 |
| 数学公式 | ✅ 完全支持 | KaTeX 渲染 |
| 自定义短代码 | ✅ 完全支持 | Tabs, Details |
| HTML 标签 | ✅ 完全支持 | unsafe = true |

### 复杂表格

| 编程语言 | 类型 | 主要用途 | 流行度 | 学习难度 |
|---------|------|----------|--------|----------|
| **Python** | 解释型 | 数据科学、Web开发、自动化 | ⭐⭐⭐⭐⭐ | 🟢 简单 |
| **JavaScript** | 解释型 | Web前端、Node.js后端 | ⭐⭐⭐⭐⭐ | 🟡 中等 |
| **Go** | 编译型 | 微服务、云原生、系统编程 | ⭐⭐⭐⭐ | 🟡 中等 |
| **Rust** | 编译型 | 系统编程、WebAssembly | ⭐⭐⭐ | 🔴 困难 |
| **TypeScript** | 编译型 | 大型前端项目、类型安全 | ⭐⭐⭐⭐ | 🟡 中等 |

### 无序列表

- **前端技术栈**
  - HTML/CSS/JavaScript
  - React/Vue/Angular
  - Webpack/Vite 构建工具
  - Sass/Less CSS 预处理器
  
- **后端技术栈**
  - Node.js/Express
  - Python/Django/FastAPI
  - Go/Gin/Echo
  - 数据库：MySQL/PostgreSQL/MongoDB
  
- **DevOps 工具**
  - Docker 容器化
  - Kubernetes 容器编排
  - CI/CD：GitHub Actions/GitLab CI
  - 监控：Prometheus/Grafana

### 有序列表

1. **项目规划阶段**
   1. 需求分析
   2. 技术选型
   3. 架构设计
   4. 时间规划

2. **开发阶段**
   1. 环境搭建
   2. 功能开发
   3. 单元测试
   4. 集成测试

3. **部署阶段**
   1. 构建打包
   2. 服务器配置
   3. 部署上线
   4. 性能监控

### 混合列表

- **数据库类型**
  1. **关系型数据库**
     - MySQL
     - PostgreSQL
     - SQLite
  
  2. **NoSQL 数据库**
     - MongoDB (文档型)
     - Redis (键值型)
     - Cassandra (列族型)
     - Neo4j (图形型)

- **缓存策略**
  1. **浏览器缓存**
     - HTTP 缓存头
     - Service Worker
     - LocalStorage
  
  2. **服务器缓存**
     - Redis 缓存
     - Memcached
     - CDN 缓存

---

## 媒体内容

### 图片

![Hugo Logo](https://d33wubrfki0l68.cloudfront.net/c38c7334cc3f23585738e40334284fddcaf03d5e/2e17c/images/hugo-logo-wide.svg)

*Hugo 静态站点生成器 Logo*

### 带链接的图片

[![GitHub](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)](https://github.com)

### HTML 图片（支持更多属性）

<img src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="GitHub Octocat" width="100" height="100" style="border-radius: 50%; margin: 16px;">

### 视频嵌入

由于是静态博客，可以嵌入 YouTube 视频：

<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

## ~GitHub 警示块~ TODO

> [!NOTE]
> 这是一个普通的提示信息，用于提供额外的说明或背景信息。支持 **粗体**、*斜体* 和 `代码` 格式。

> [!TIP]
> 💡 这是一个有用的小贴士！
> 
> 可以包含多行内容和列表：
> - 功能特性说明
> - 使用建议
> - 最佳实践

> [!IMPORTANT]
> ⚠️ 这是重要信息！
> 
> 请确保在配置时注意以下几点：
> 1. 检查依赖项版本
> 2. 验证配置文件语法
> 3. 测试功能是否正常工作

> [!WARNING]
> ⚠️ 警告：此操作可能会影响系统稳定性！
> 
> 在执行前请：
> - 备份重要数据
> - 确认操作权限
> - 准备回滚方案

> [!CAUTION]
> 🚨 注意：不当使用可能导致数据丢失！
> 
> ```bash
> # 危险操作示例 - 请勿在生产环境执行
> rm -rf /important/data/*
> sudo dd if=/dev/zero of=/dev/sda
> ```

---

## 特殊格式测试

### 键盘快捷键

- <kbd>Ctrl</kbd> + <kbd>C</kbd> - 复制
- <kbd>Ctrl</kbd> + <kbd>V</kbd> - 粘贴
- <kbd>Ctrl</kbd> + <kbd>Z</kbd> - 撤销
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> - 命令面板

### 进度条

<progress value="32" max="100">32%</progress> 完成度：32%

<progress value="70" max="100">70%</progress> 学习进度：70%

<progress value="95" max="100">95%</progress> 项目进度：95%

### 颜色样例

<div style="display: flex; gap: 16px; margin: 16px 0;">
  <div style="width: 50px; height: 50px; background: #ff6b6b; border-radius: 4px;" title="红色"></div>
  <div style="width: 50px; height: 50px; background: #4ecdc4; border-radius: 4px;" title="青色"></div>
  <div style="width: 50px; height: 50px; background: #45b7d1; border-radius: 4px;" title="蓝色"></div>
  <div style="width: 50px; height: 50px; background: #96ceb4; border-radius: 4px;" title="绿色"></div>
  <div style="width: 50px; height: 50px; background: #feca57; border-radius: 4px;" title="黄色"></div>
</div>

### 图标字体

📚 📖 📝 ✏️ 🖊️ 📄 📃 📑 📊 📈 📉 💻 🖥️ 📱 ⌚ 🔧 🔨 ⚙️ 🛠️ 🔍 🔎 💡 🌟 ⭐ 🚀 🎯 🏆 🎉 🎊

---

## 性能测试数据

### 构建统计

```text
                   | EN  
-------------------+-----
  Pages            | 15  
  Paginator pages  |  0  
  Non-page files   |  0  
  Static files     | 23  
  Processed images |  0  
  Aliases          |  1  
  Sitemaps         |  1  
  Cleaned          |  0  

Total in 42 ms
```

### 文件大小统计

| 文件类型 | 数量 | 总大小 | 平均大小 |
|---------|------|--------|----------|
| HTML 文件 | 15 | 234 KB | 15.6 KB |
| CSS 文件 | 4 | 45 KB | 11.25 KB |
| JavaScript 文件 | 3 | 28 KB | 9.33 KB |
| 图片文件 | 8 | 156 KB | 19.5 KB |
| 字体文件 | 2 | 67 KB | 33.5 KB |

---

## 总结

这个测试文档展示了当前 Hugo 博客支持的所有功能：

### ✅ 完全支持的功能

1. **Markdown 语法**
   - 基础语法：标题、段落、列表、链接、图片
   - 扩展语法：表格、任务列表、脚注、定义列表
   - GitHub 风格：删除线、代码块、~警示块~

2. **代码高亮**
   - 支持 100+ 种编程语言
   - GitHub 风格的语法高亮
   - 行号显示（可配置）

3. **数学公式**
   - KaTeX 渲染引擎
   - 行内和块级公式
   - 完整的 LaTeX 语法支持

4. **HTML 支持**
   - 内联 HTML 标签
   - 自定义样式属性
   - 响应式媒体嵌入

5. **自定义短代码**
   - Tabs 分页功能
   - Details 折叠块
   - 支持 Markdown 嵌套

6. **主题适配**
   - 明暗主题自动切换
   - 响应式设计
   - GitHub 风格样式

### 🔧 技术特性

- **构建速度**: < 50ms
- **文件大小**: 优化压缩
- **SEO 优化**: 语义化 HTML
- **无障碍访问**: ARIA 属性支持
- **现代浏览器**: ES6+ 语法支持


---

## TODO

- [ ] **GitHub**: 警示块
- [ ] ...

*文档生成时间：2025-07-12 10:00:00*  
*Hugo 版本：0.148.0*  
*主题：github-style*