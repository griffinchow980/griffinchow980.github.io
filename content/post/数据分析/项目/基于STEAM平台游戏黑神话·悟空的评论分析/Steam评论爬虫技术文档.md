---
title: "Steam《黑神话·悟空》评论爬虫技术文档"
date: 2024-09-10
categories: ["项目"]
tags: ["爬虫", "数据分析", "游戏分析"]
summary: "使用Selenium自动化工具爬取Steam平台《黑神话·悟空》3626条简体中文评论数据；详细介绍技术架构、数据采集流程、数据清洗方法、性能优化策略及隐私保护措施，提供完整的爬虫实现代码和最佳实践"
math: true
---

# Steam 黑神话·悟空游戏评论爬虫技术文档

## 1. 项目概述

本项目使用 Selenium 自动化工具爬取 Steam 平台上《黑神话·悟空》游戏的用户评论数据，并将数据保存为 Excel 文件供后续分析使用。

### 1.1 目标数据

- **数据来源**: Steam Community 评论页面
- **游戏 App ID**: 2358720（黑神话·悟空）
- **目标语言**: 简体中文
- **输出文件**: `steam_reviews.xlsx`

### 1.2 采集字段

| 字段名 | 说明 |
|--------|------|
| `publish_date` | 评论发布日期（标准化为 YYYY-MM-DD 格式） |
| `content` | 评论正文内容 |
| `recommendation` | 推荐状态（推荐/不推荐） |
| `hours` | 游戏总时长 |

## 2. 技术架构

### 2.1 技术栈

- **Python**: 编程语言
- **Selenium**: 浏览器自动化工具
- **ChromeDriver**: Chrome 浏览器驱动
- **Parsel**: HTML 解析库
- **Pandas**: 数据处理和存储
- **tqdm**: 进度条显示

### 2.2 依赖安装

```bash
# 安装所需的 Python 库
pip install selenium parsel pandas openpyxl tqdm

# 安装 ChromeDriver 管理工具（可选）
pip install webdriver-manager
```

## 3. 核心功能实现

### 3.1 日期标准化函数

由于 Steam 评论的日期格式不统一（包括中文和英文格式），需要统一转换为标准格式。


```python
from datetime import datetime

def standardize_date(date_str):
    """
    将不同格式的日期字符串统一转换为 YYYY-MM-DD 格式
    
    支持格式：
    2024年8月20日
    8月20日
    August 20, 2024
    August 20
    """
    # 去除日期字符串中的前缀和多余的空白字符
    if "发布于：" in date_str:
        date_str = date_str.replace("发布于：", "").strip()
    
    # 去除多余的空白字符
    date_str = ''.join(date_str.split())

    current_year = datetime.now().year
    
    # 处理"年月日"格式（中文）
    if "年" in date_str and "月" in date_str and "日" in date_str:
        try:
            date = datetime.strptime(date_str, "%Y年%m月%d日")
        except ValueError:
            raise ValueError(f"{date_str} format not recognized")
    
    # 处理"月日"格式（中文，无年份）
    elif "月" in date_str and "日" in date_str:
        date_str = date_str.replace("月", "-").replace("日", "")
        try:
            date = datetime.strptime(date_str, "%m-%d")
            date = date.replace(year=current_year)
        except ValueError:
            raise ValueError(f"{date_str} format not recognized")
    
    # 处理其他可能的日期格式（英文）
    else:
        date_formats = [
            "%d %B, %Y",  # 20 August, 2024
            "%B %d, %Y",  # August 20, 2024
            "%d %B",      # 20 August
            "%B %d"       # August 20
        ]
        for date_format in date_formats:
            try:
                date = datetime.strptime(date_str, date_format)
                if 'Y' not in date_format:
                    date = date.replace(year=current_year)
                return date.strftime("%Y-%m-%d")
            except ValueError:
                continue
        raise ValueError(f"{date_str} format not recognized")
    
    return date.strftime("%Y-%m-%d")
```

### 3.2 语言筛选函数

Steam 评论页面需要手动选择语言过滤器，使用 Selenium 模拟点击操作。

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

def select_language(driver, language="简体中文"):
    """
    在 Steam 评论页面选择语言过滤器
    
    参数:
        driver: Selenium WebDriver 实例
        language: 目标语言（默认：简体中文）
    """
    try:
        # 点击语言过滤器下拉菜单
        language_filter = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.ID, "filterlanguage"))
        )
        language_filter.click()
        time.sleep(1)
        
        # 选择指定语言选项
        language_option = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, f"//div[@id='filterlanguage_options']//div[contains(text(), '{language}')]"))
        )
        language_option.click()
        time.sleep(1)
    except Exception as e:
        print(f"语言选择失败: {e}")
```

### 3.3 评论爬取主函数

```python
import time
from parsel import Selector
from tqdm import tqdm

def get_reviews(driver, app_id, language="简体中文", max_scroll=50, save_interval=200):
    """
    爬取 Steam 游戏评论
    
    参数:
        driver: Selenium WebDriver 实例
        app_id: Steam 游戏的 App ID
        language: 评论语言（默认：简体中文）
        max_scroll: 最大滚动次数
        save_interval: 每爬取多少条评论保存一次
    
    返回:
        list: 评论数据列表
    """
    all_reviews = []
    seen_reviews = set()  # 用于去重
    
    # 访问评论页面
    url = f"https://steamcommunity.com/app/{app_id}/reviews/?filterLanguage=all"
    driver.get(url)

    # 选择语言
    select_language(driver, language)
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    
    # 使用进度条显示爬取进度
    with tqdm(total=max_scroll, desc="爬取进度") as pbar:
        for i in range(max_scroll):
            # 滚动到页面底部以触发加载更多评论
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
            
            # 等待评论元素加载
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[@class='apphub_CardTextContent']"))
            )
            time.sleep(5)  # 等待数据加载
            
            # 解析页面内容
            r = driver.page_source
            s = Selector(text=r)
            reviews = s.xpath("//div[@class='apphub_CardTextContent']")
            
            if not reviews:
                break
            
            # 提取评论数据
            if len(reviews) > len(all_reviews):
                for review in reviews:
                    # 提取发布日期
                    publish_date = review.xpath(".//div[@class='date_posted']/text()").get()
                    
                    # 提取评论内容
                    content = review.xpath(".//text()").extract()
                    content = "".join(content).replace("\t", "").replace("\n", "")
                    
                    # 检查是否已爬取过（去重）
                    if content in seen_reviews:
                        continue
                    seen_reviews.add(content)
                    
                    # 提取推荐状态和游戏时长
                    review_info = review.xpath(".//div[@class='reviewInfo']")
                    recommendation = review_info.xpath(".//div[@class='title']/text()").get(default="").strip()
                    hours = review_info.xpath(".//div[@class='hours']/text()").get(default="").strip()
                    
                    # 构建评论数据字典
                    c = {
                        "publish_date": standardize_date(publish_date) if publish_date else "未知",
                        "content": content,
                        "recommendation": recommendation,
                        "hours": hours
                    }
                    all_reviews.append(c)

                    # 实时显示爬取进度
                    print(f"已爬取 {len(all_reviews)} 条评论")

                    # 定期保存数据
                    if len(all_reviews) % save_interval == 0:
                        save_to_excel(all_reviews)

            # 检查是否已滚动到底部
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

            # 更新进度条
            pbar.update(1)

    return all_reviews
```

### 3.4 数据保存函数

```python
import os
import pandas as pd

def save_to_excel(reviews, output_path='./steam_reviews.xlsx'):
    """
    将评论数据保存为 Excel 文件
    
    参数:
        reviews: 评论数据列表
        output_path: 输出文件路径（相对路径）
    """
    try:
        if not os.path.exists(output_path):
            # 文件不存在，创建新文件
            df = pd.DataFrame(reviews)
            df.to_excel(output_path, index=False)
            print(f"数据已保存到 {output_path}")
        else:
            # 文件已存在，追加数据并去重
            existing_df = pd.read_excel(output_path)
            new_df = pd.DataFrame(reviews)
            
            # 合并数据并移除重复的评论内容
            combined_df = pd.concat([existing_df, new_df]).drop_duplicates(subset=['content'])
            combined_df.to_excel(output_path, index=False)
            print(f"数据已追加并保存到 {output_path}")
    except PermissionError:
        print(f"无法访问文件 {output_path}，请确保文件没有被其他程序占用")
    except Exception as e:
        print(f"保存文件时发生错误: {e}")
```

## 4. 完整使用示例

```python
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from datetime import datetime
from parsel import Selector
import pandas as pd
import os
from tqdm import tqdm

# 注意：需要先安装 ChromeDriver 或使用 webdriver-manager
# 方法1：手动指定 ChromeDriver 路径（Windows 示例）
# service = Service(r'C:\Program Files\Google\Chrome\Application\chromedriver.exe')

# 方法2：使用 webdriver-manager 自动管理（推荐）
from webdriver_manager.chrome import ChromeDriverManager
service = Service(ChromeDriverManager().install())

# 初始化 Chrome WebDriver
driver = webdriver.Chrome(service=service)

try:
    # 爬取黑神话·悟空的简体中文评论
    # App ID: 2358720
    # 最多滚动 1000 次，每 200 条保存一次
    reviews = get_reviews(
        driver, 
        app_id="2358720", 
        language="简体中文", 
        max_scroll=1000,
        save_interval=200
    )

    # 最终保存所有数据
    save_to_excel(reviews, output_path='./steam_reviews.xlsx')
    
    print(f"\n爬取完成！共获取 {len(reviews)} 条评论")

except KeyboardInterrupt:
    print("\n用户中断爬取")
except Exception as e:
    print(f"发生错误: {e}")
finally:
    # 关闭浏览器
    driver.quit()
    print("浏览器已关闭")
```

## 5. 注意事项

### 5.1 反爬虫策略应对

- **请求频率控制**: 每次滚动后等待 5 秒，避免请求过快被封禁
- **User-Agent 设置**: Selenium 会自动使用真实浏览器的 User-Agent
- **会话保持**: 使用同一个 driver 实例，保持会话连续性

### 5.2 数据质量保证

- **去重机制**: 使用集合 `seen_reviews` 存储已爬取的评论内容，避免重复
- **日期标准化**: 统一不同格式的日期为 `YYYY-MM-DD` 格式
- **异常处理**: 对日期解析、元素定位等操作进行异常捕获
- **定期保存**: 每爬取 200 条评论自动保存一次，防止数据丢失

### 5.3 性能优化建议

1. **增加等待时间**: 如果网络较慢，可适当增加 `time.sleep()` 时长
2. **调整滚动次数**: 根据需求调整 `max_scroll` 参数
3. **无头模式运行**: 可以使用 Chrome 无头模式提高效率

```python
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument('--headless')  # 无头模式
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--no-sandbox')

driver = webdriver.Chrome(service=service, options=chrome_options)
```

## 6. 常见问题

### 6.1 ChromeDriver 版本不匹配

**问题**: `SessionNotCreatedException: Message: session not created`

**解决方案**: 
```bash
# 使用 webdriver-manager 自动管理版本
pip install webdriver-manager

# 在代码中使用
from webdriver_manager.chrome import ChromeDriverManager
service = Service(ChromeDriverManager().install())
```

### 6.2 元素定位失败

**问题**: `TimeoutException: Message: element not found`

**解决方案**: 
- 增加等待时间
- 检查 XPath 是否正确
- 确认页面是否已完全加载

### 6.3 数据保存失败

**问题**: `PermissionError: [Errno 13] Permission denied`

**解决方案**: 
- 关闭正在打开的 Excel 文件
- 检查文件路径权限

## 7. 数据输出格式

最终生成的 `steam_reviews.xlsx` 文件包含以下列：

| 列名 | 数据类型 | 示例 |
|------|---------|------|
| publish_date | 字符串 | 2024-08-20 |
| content | 字符串 | 非常好玩的游戏，画面精美... |
| recommendation | 字符串 | 推荐 / 不推荐 |
| hours | 字符串 | 记录时间 42.5 小时 |

## 8. 后续优化方向

1. **分布式爬取**: 使用多个代理 IP 和浏览器实例并行爬取
2. **数据库存储**: 将数据存储到 MySQL 或 MongoDB 而非 Excel
3. **增量更新**: 只爬取新增的评论，避免重复爬取
4. **异常重试**: 增加网络请求失败的重试机制
5. **日志记录**: 详细记录爬取过程，便于问题排查

## 9. 法律与道德声明

本爬虫仅供学习和研究使用，请遵守以下原则：

1. 遵守 Steam 服务条款和 robots.txt 协议
2. 合理控制爬取频率，不对服务器造成负担
3. 不用于商业用途
4. 尊重用户隐私，不泄露个人信息
5. 仅用于数据分析和研究

---

**文档版本**: v1.0  
**最后更新**: 2024年  
**作者**: 爬虫技术团队

