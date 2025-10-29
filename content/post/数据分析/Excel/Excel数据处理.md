---
title: "Excel数据处理"
date: 2025-03-20
categories: ["数据分析","Office"]
tags: ["数据分析","Excel"]
summary: "Excel数据处理"
math: true
---
# 定位条件

> 对空值、错误、可见单元格进行批量填充、替换、删除

## 批量对空值填充

win： <kbd>Shift</kbd>+<kbd>F8</kbd> 

mac：<kbd>Shift</kbd>+<kbd>Fn</kbd>+<kbd>F8</kbd>

填充方法：

- 选中目标区域
- 点击 <button>查找和选择</button> → 点击 <button>定位条件</button> → 选择 <button>空值</button>

- 定位空值后输入填充值
- 按 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 组合键实现批量填充

win： <kbd>Ctrl</kbd>+<kbd>Enter</kbd> 

mac： <kbd>⌘Command</kbd>+<kbd>↩Return</kbd> 

## 仅可见单元格复制

> 适用于分级显示数据的部分复制，避免隐藏数据被连带复制

复制方法：

- 选中目标区域
- 点击 <button>查找和选择</button> → 点击 <button>定位条件</button> → 选择 <button>可见单元格</button>
- <kbd>Ctrl</kbd>+<kbd>C</kbd> 复制后粘贴，即可仅保留可见行数据

### 设置分组

创建组方法：

- 菜单操作：<button>数据</button> → <button>组合</button>  
- 快捷键：<kbd>⌥Alt</kbd>+<kbd>⇧Shift</kbd>+<kbd>→</kbd>

取消组合方法：

- 菜单操作：<button>数据</button> → <button>取消组合</button>  
- 快捷键：<kbd>⌥Alt</kbd>+<kbd>⇧Shift</kbd>+<kbd>←</kbd>

注意事项：必须连续选择行/列才能创建有效分组，适用于分级汇总计算场景

## 错误值批量处理

常见错误：`#VALUE!` 错误通常由数据类型不匹配或公式错误导致

处理方式：

- 选中目标区域
- 点击 <button>查找和选择</button> → 点击 <button>定位条件</button> → 选择 <button>公式</button>→ 只勾选 <button>错误</button>
- 批量删除：点击 <kbd>Delete</kbd>

# 选择性粘贴

## 运算功能

示例：实现对一列金额进行25%的增长

操作步骤：

- 在空白单元格输入计算系数（如1.25），复制该系数单元格
- 选中目标数据区域
- 点击 <button>粘贴</button> → 点击 <button>选择性粘贴</button> → 运算/操作栏选择 <button>乘</button>

## 文本型数值转换

操作步骤：

- 在空白单元格输入数字1，复制该单元格
- 选中文本型数值区域
- 点击 <button>粘贴</button> → 点击 <button>选择性粘贴</button> → 运算/操作栏选择 <button>乘</button> ，进行强制转换类型

## 辅助列的应用

### 两列数据穿插合并

示例：实现某两列数据进行穿插合并成一列

操作步骤：

- 构建辅助列：
  - 新建辅助列并填充 1-N 的序号
  - N 号的下个单元格设置中间值（如1.2）：点击 <button>填充</button> → 点击 <button>系列</button> → 系列产生：勾选 <button>列</button> → 步长值：1 ，终止值：N
- 对辅助列排序：点击 <button>排序和筛选</button> → 点击 <button>升序</button>  （出现排序警告 Alter，勾选 <button>扩展选定区域</button>→ 主要关键字：选择 <button>辅助列</button> ）
- 穿插合并：（两列数据随辅助列每列一空值间隔进行扩展）
  - 对某两列的后一列进行复制
  - 从某两列的前一列的第一个空值单元格起选定区域
  - 点击 <button>粘贴</button> → 点击 <button>选择性粘贴</button> → 运算/操作栏勾选 <button>跳过空单元</button>

### 隔行插入空行

示例：为每个车次信息上方添加表头行

操作步骤：

- 构建辅助列：

  - 新建辅助列并填充 1-N 的序号

  - N 号的下个单元格设置中间值：点击 <button>填充</button> → 点击 <button>系列</button> → 系列产生：勾选 <button>列</button> → 步长值：1 ，终止值：N

- 对辅助列排序：点击 <button>排序和筛选</button> → 点击 <button>升序</button>  （出现排序警告 Alter，勾选 <button>扩展选定区域</button>→ 主要关键字：选择 <button>辅助列</button> ）

- 填充表头：

  - 复制原表头
  - 选中目标区域
  - 点击 <button>查找和选择</button> → 点击 <button>定位条件</button> → 选择 <button>空值</button>
  - 粘贴表头，设置加粗格式（直接在字体点击  <button>**B**</button>）

# 查找和替换

示例：实现成绩为 "0" 的考生成绩替换成 "补考" （直接替换 "0" 会导致 "60" 等含 "0" 数值被误替换）

操作步骤：

- 选中目标单元格区域
- 点击 <button>查找和选择</button> → 点击 <button>替换</button> → 点击 <button>选项</button> → 勾选 <button>单元格匹配</button>
- 填查找内容和替换内容，点击 <button>全部替换</button> 

# 数据验证

示例：建立多行多列下拉列表

操作步骤：

- 初始设置：
  - 先选择单列数据（比如 A1:A11）
  - 定义名称：（点击 <button>公式</button> → 点击 <button>名称管理器</button> → 点击 <button>定义名称</button>）
- 创建验证：点击 <button>数据</button> → 点击 <button>数据验证</button> → 选择 <button>序列</button> → 来源输入"=姓名" （范围仅为单列）
- 扩展数据源：编辑 <button>名称管理器</button>，将引用范围改为多行多列（比如 A1:G11）

# 快速填充（<kbd>Ctrl</kbd>+<kbd>E</kbd>）

## 从字符串中提取特定部分

示例：提取市名/省名

操作步骤：

- 在首行目标单元格手动输入示例（比如"沈阳"）
- 下拉填充柄后，点击 <button>自动填充</button> → 选择 <button>快速填充</button>

注意事项：名字较长的字符串可能会识别错误，需手动修改（比如黑龙江省齐齐哈尔市 → 江省齐齐哈尔/黑龙）



示例：从汉字中提取数字

操作步骤：

- 在首行目标单元格手动输入示例（比如"赛博朋克2077" → 输入"2077"）
- 下拉填充柄后，点击 <button>自动填充</button> → 选择 <button>快速填充</button>

## 合并多列数据

示例：合并省市（已有市名和省名列）

操作步骤：

- 在首行目标单元格手动输入示例（比如"沈阳辽宁"）
- 选中当前目标方单元格按  <kbd>Ctrl</kbd>+<kbd>E</kbd> 进行快速填充（mac：<kbd>⌃Control</kbd>+<kbd>E</kbd>）

## 日期处理

示例：提取年份

方法一：快速填充

- 在首行目标单元格手动输入示例（比如从"2015/11/17"中提取，输入"2015"）
- 选中当前目标方单元格按  <kbd>Ctrl</kbd>+<kbd>E</kbd> 进行快速填充（mac：<kbd>⌃Control</kbd>+<kbd>E</kbd>）

方法二：公式操作

- 在首行目标单元格手动输入 =YEAR(A1)
- 选中当前目标方单元格按  <kbd>Ctrl</kbd>+<kbd>E</kbd> 进行快速填充（mac：<kbd>⌃Control</kbd>+<kbd>E</kbd>）

# 数据整理

## 去重

### 数据分列

示例：提取不重复的参赛国家名（比如中国VS阿尔及利亚）

操作步骤：

- 将 "VS" 替换为单一符号：点击 <button>查找和选择</button> → 选择  <button>替换</button> → 查找内容："VS"，替换："," → 点击  <button>替换</button> （由于是模糊匹配，取消勾选 <button>单元格匹配</button>）
- 数据分列：点击 <button>分列</button> → 选择 <button>分隔符号</button> → 选择 <button>逗号</button> （此处为英文逗号 ","，如果是中文逗号需勾选其他并填入 "，"）→ 点击 <button>完成</button>
- 合并数据：将两列数据上下复制粘贴为一列
- 去重：点击 <button>删除重复项</button> → 选择 <button> 以当前选定区域</button> → 勾选 目标列 → 点击 <button>确定</button>

注意事项：分列前需确保旁边有空白列，避免覆盖原有数据

### 转置操作

示例：网页长数据复制处理

操作步骤：

- 选择分列符号（多符号先批量替换或删除转成单一符号，比如数字后的 "."）
- 数据分列：点击 <button>分列</button> → 选择 <button>分隔符号</button> → 选择 <button>其他</button> 填入 "." → 点击 <button>完成</button>
- 转置操作：需先复制数据，再点击 <button>选择性粘贴</button> → 勾选 <button>转置</button> → 点击 <button>确定</button>
- 快速填充：在相邻列输入示例后，使用快速填充功能自动提取文本（比如 ”四大02”→ 输入 ”四大”）
- 特殊字符处理：通过查找替换进行批量处理（比如 “（藏语” → 替换成 “（藏语）”）

## 合并

示例：合并上半年下半年销售数据（多表和合并表格式相同）

操作步骤：

- 选择目标区域（需合计的空表）
- 点击 <button>数据</button> → 选择 <button>合并计算</button>
- 添加引用位置（比如 分别选择上半年和下半年数据区域）
- 函数选择 <button>求和</button> → 勾选 <button>首行</button> 和 <button>最左列</button> 选项 → 点击 <button>确定</button> （比如 按照首行最左列对齐求和数据）

注意事项：

- 自动对齐标签，即使行列顺序不一致也能正确合并
- 可同时合并多个数据区域
- 必须包含行列标签才能正确合并