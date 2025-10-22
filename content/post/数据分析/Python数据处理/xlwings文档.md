---
title: "xlwings 操作手册"
date: 2024-03-04
categories: ["数据分析"]
tags: ["数据分析","python","xlwings"]
summary: "xlwings 是一个让 Python 与本地 Excel 双向高效交互的库"
---
  
> - 读写单元格/区域/结构化表/图表/图片  
> - 与 pandas、numpy 无缝数据类型来回转换  
> - 在 Excel 中直接调用 Python 函数（UDF）  
> - 自动生成报表、批量处理工作簿、模板填充、PDF 导出  
> - 利用 Excel 原生能力（公式、透视表、条件格式、图表美化）并用 Python 统一编排  
  

# 1. 核心对象与架构
层次关系：  
App → Book → Sheet → Range → (Chart / Table / Pivot / Picture / Shape / Name / Macro)

对象职责简述：
- App: Excel 进程实例控制（可多开、隐藏、性能参数）
- Book: 工作簿文件（打开、保存、宏、命名范围、Sheets 集合）
- Sheet: 工作簿内部工作表（激活、增删、图表/形状容器）
- Range: 单元格区域（读写值、公式、格式、扩展、与 pandas/numpy 转换）
- Chart: 图表封装（数据源、类型、轴、标题、系列格式）
- Table(ListObject): Excel 结构化表（筛选、排序、列头）
- PivotTable: 透视分析（基于缓存，字段分布）
- Picture/Shape: 图像与形状元素（布局、大小）
- Macro: 调用现有 VBA

# 2. 安装与运行模式
安装：
```bash
pip install xlwings
```
安装 Add-in（可选）：
```bash
xlwings addin install  # 安装 Excel 插件，启用 RunPython/UDF 功能
```
快速项目结构（可选）：
```bash
xlwings quickstart myproj
```
运行模式：
1. 脚本驱动 Excel  
2. Excel 公式 `=RunPython("import script; script.main()")`  
3. UDF 自定义函数  
4. UDF Server（提升性能）

# 3. 核心对象详解（属性、方法、参数、返回值）

## 3.1 xw.App
```python
import xlwings as xw

# 创建一个 Excel 应用实例；visible=True 方便调试，add_book=True 默认新建空工作簿
app = xw.App(visible=True, add_book=True)

# 关闭屏幕更新提高写入速度（大量批处理时使用）
app.screen_updating = False

# 设置为手动计算，避免每次写单元格都触发公式链重新计算
app.calculation = 'manual'

# 修改状态栏，给用户反馈长时间任务进度
app.status_bar = "正在导入数据..."

# 获取当前应用中所有已打开工作簿集合
print(app.books)

# 手动触发公式重新计算（在手动模式下需要）
app.calculate()

# 释放 Excel 进程（非常重要，避免残留后台任务）
app.quit()
```

## 3.2 xw.Book
```python
import xlwings as xw

# 新建一个工作簿（未保存）
wb = xw.Book()

# 打开现有文件，若路径为相对路径则基于当前工作目录
wb2 = xw.Book("文件.xlsx")

# 从已打开的集合中获取同名工作簿（不会重新打开）
wb3 = xw.books["文件.xlsx"]

# 保存当前工作簿（不传路径则保存到原路径；首次创建建议传新路径）
wb.save("输出文件.xlsx")

# 获取文件完整路径
print(wb.fullname)

# 调用已存在的 VBA 宏（宏需事先存在于该工作簿中）
format_macro = wb.macro("FormatReport")
format_macro()  # 执行宏

# 选取用户当前激活的单元格区域（例如用户在 Excel 中点选某区域）
selection_rng = wb.selection

# 关闭工作簿（关闭后对象失效，需重新打开）
wb.close()
```

## 3.3 xw.Sheet
```python
import xlwings as xw
wb = xw.Book()

# 获取第一个工作表
sh = wb.sheets[0]

# 根据名称获取工作表
data_sheet = wb.sheets["Sheet1"]

# 新增工作表；before/after 控制插入位置
sh_new = wb.sheets.add(name="数据", before=wb.sheets[0])

# 激活工作表（将其显示为当前选中）
sh_new.activate()

# 读取单元格 A1 的值（value 属性自动进行类型转换：数字/日期/字符串）
val = sh.range("A1").value

# 写入数值到单元格 A1
sh["A1"].value = 123  # 简写形式，等价于 sh.range("A1").value = 123

# 获取已用区域（Excel 认定的有内容或格式痕迹的区域）
used = sh.used_range

# 删除工作表（Excel 若仅剩一个工作表可能弹警告，建议 display_alerts=False）
sh_new.delete()
```

## 3.4 xw.Range
```python
import xlwings as xw
wb = xw.Book()
sh = wb.sheets[0]

# 获取单元格区域 A1:B10
rng = sh.range("A1:B10")

# 获取一个连续的表格区域（从 A1 开始向右向下扩展，遇到空白则停止）
table_rng = sh["A1"].expand("table")

# 写入二维数组（批量写入性能远高于逐单元格循环）
rng.value = [
    ["产品", "销量"],
    ["A", 10],
    ["B", 20]
]

# 读取值：二维列表（xlwings 自动转换为 Python 类型）
print(rng.value)

# 读取原始二维列表，不做进一步智能处理（values 不会对日期等做转换）
print(rng.values)

# 写入公式（公式字符串不含 "=" 时自动补全；建议显式带 "=" 以清晰）
sh.range("C2").formula = "=A2*B2"

# 设置单元格背景色（RGB，每个 0-255）
rng.color = (255, 255, 200)

# 加粗字体
rng.font.bold = True

# 设置数字格式为两位小数
rng.number_format = "0.00"

# 向下“Ctrl+方向”的逻辑：找到连续数据的最后一行
last_cell_down = sh.range("A1").end("down")  # 若 A1 为空，将跳到工作表底部

# 向右扩展
last_cell_right = sh.range("A1").end("right")

# 偏移（向下 2 行，向右 1 列）
offset_rng = rng.offset(2, 1)  # 不改变原范围大小，仅移动左上角参照位置

# 合并单元格（谨慎使用：合并后无法逐行迭代处理；建议数据区域避免合并）
sh.range("E1:F1").merge()

# 取消合并
sh.range("E1:F1").unmerge()

# 清除内容与格式（彻底复位）
rng.clear()

# 仅清除内容（保留格式）
rng.clear_contents()

# 扩展到完整数据块（遇到空行或空列终止，是数据填充常用操作）
full_block = sh.range("A1").expand("table")

# 访问底层 COM 对象（可以调用 Excel 原生 API，不跨平台）
com_obj = rng.api
```

## 3.5 xw.Chart
```python
import xlwings as xw
import pandas as pd

wb = xw.Book()
sh = wb.sheets[0]

# 准备数据写入（图表一般需要列头：第一列类别，后续列为系列）
sh["A1"].value = [
    ["月份", "产品A", "产品B"],
    ["1月", 100, 120],
    ["2月", 130, 150],
    ["3月", 160, 180],
]

# 创建图表对象：left/top 指定坐标（基于工作表坐标系统）
chart = sh.charts.add(left=sh.range("E2").left, top=sh.range("E2").top, name="销量图")

# 设置图表数据源（需包含列头；expand("table") 保证动态扩展）
chart.set_source_data(sh.range("A1").expand("table"))

# 修改图表类型（line_markers 带点折线）
chart.chart_type = "line_markers"

# 使用 COM 修改标题（HasTitle 必须启用）
chart.api.HasTitle = True
chart.api.ChartTitle.Text = "月度销量趋势"

# 获取第一个系列并设置数据标签（ApplyDataLabels 是 COM 方法）
series1 = chart.api.SeriesCollection(1)
series1.ApplyDataLabels()  # 显示每个点数值

# 修改系列填充色（Format.Fill.ForeColor.RGB 设置 RGB）
series1.Format.Fill.ForeColor.RGB = xw.utils.rgb_to_int(0, 128, 255)

# 切换第二系列到次坐标轴（适合比值与总量混合）
if chart.api.SeriesCollection().Count >= 2:
    chart.api.SeriesCollection(2).AxisGroup = 2  # 2 = 次坐标轴
```

## 3.6 结构化表（ListObject）
```python
import xlwings as xw

wb = xw.Book()
sh = wb.sheets[0]

# 写入基础数据
sh["A1"].value = [
    ["产品", "销量"],
    ["A", 10],
    ["B", 20],
    ["C", 30],
]

# 创建结构化表：SourceType=1 表示来源于工作表区域；XlListObjectHasHeaders=1 表示包含表头
list_obj = sh.api.ListObjects.Add(
    SourceType=1,
    Source=sh.range("A1").expand("table").api,
    XlListObjectHasHeaders=1
)

# 重命名表（用于后续引用）
list_obj.Name = "SalesTable"

# 获取数据主体（不含表头行），可用于进一步处理
body_rng = sh.api.ListObjects("SalesTable").DataBodyRange
print(body_rng.Address)
```

## 3.7 命名范围
```python
import xlwings as xw
wb = xw.Book()
sh = wb.sheets[0]

sh["A1"].value = [
    ["产品", "销量"],
    ["A", 10],
    ["B", 12],
]

# 添加命名范围：refers_to 指定 Range 对象
wb.names.add("产品销售区", refers_to=sh.range("A1").expand("table"))

# 通过名称获取 Range（refers_to_range 返回 Range 包装）
named_rng = wb.names["产品销售区"].refers_to_range
print(named_rng.value)

# 删除命名范围（清理不再使用的引用）
wb.names["产品销售区"].delete()
```

## 3.8 宏
```python
import xlwings as xw

wb = xw.Book("含宏工作簿.xlsm")
# 获取宏对象（宏需 VBA 项目中存在且名称正确）
macro = wb.macro("FormatReport")
macro()  # 执行宏（可返回值；若宏为函数则返回值直接成为 Python 对象）
```

## 3.9 UDF
```python
import xlwings as xw
import pandas as pd

# 基础 UDF：在 Excel 单元格使用 =add(1,2)
@xw.func
def add(a, b):
    return a + b  # 简单逻辑不必过度注释

# 高级 UDF：读取传入区域为 DataFrame（header=1 表示第一行是列头；index=False 不保留行索引）
@xw.func
@xw.arg("df", pd.DataFrame, header=1, index=False)
@xw.ret(expand="table")  # 返回值展开为二维表（适用于 DataFrame 或列表列表）
def top_n(df, n):
    # 使用 pandas 的 nlargest 获取销量最高的前 n 行
    return df.nlargest(n, "销量")
```

## 3.10 常量与工具
```python
from xlwings import constants, utils

# 对齐方式常量（COM 调用时需要使用这些内置枚举）
center = constants.HAlignCenter

# 将 RGB 转为 Excel 内部整型（COM 属性常用）
color_int = utils.rgb_to_int(255, 120, 80)
```

# 4. Range.options
```python
import xlwings as xw
import pandas as pd
import numpy as np

wb = xw.Book()
sh = wb.sheets[0]

# 写入示例数据
sh["A1"].value = [
    ["产品", "销量", "日期"],
    ["A", 10, "2024-01-01"],
    ["B", 20, "2024-01-02"]
]

rng = sh.range("A1").expand("table")

# 将区域转换为 pandas DataFrame：header=1 使用第一行作为列头，index=False 不将第一列当索引
df = rng.options(pd.DataFrame, header=1, index=False, empty="NA").value

# 转 numpy 数组；numbers=float 强制所有数字为 float 类型（避免混合类型导致 object 数组）
arr = rng.options(np.array, numbers=float).value

# 读取为一维列表（假设只需要第一列产品列表）；ndim=1 将扁平化
products = sh.range("A2:A3").options(list, ndim=1).value

# 写入一维列表为竖列：transpose=True 将列表视为列而非行
sh.range("E1").options(transpose=True).value = [1, 2, 3]

# raw=True 禁止智能转换（保留原始格式与空值表现）
raw_data = rng.options(raw=True).value

# 分块读取（大数据量时可迭代返回多个 DataFrame，提高内存效率）
for chunk in rng.options(pd.DataFrame, header=1, chunksize=1).value:
    # 每次 chunk 是一个行分块 DataFrame
    print(chunk)
```

# 5. pandas / numpy
```python
import xlwings as xw
import pandas as pd

# 创建示例 DataFrame
df = pd.DataFrame({
    "产品": ["A", "B", "C"],
    "销量": [100, 150, 90]
})

wb = xw.Book()
sh = wb.sheets[0]

# 写入 DataFrame：xlwings 自动包含列头，不包含行索引（除非 index=True）
sh["A1"].value = df

# 多级表头 DataFrame 写入示例
multi_df = pd.DataFrame(
    {
        ("区域", "华北"): [10, 20, 30],
        ("区域", "华东"): [15, 25, 35]
    },
    index=["产品A", "产品B", "产品C"]
)
# header=2 指定有两层列头；index=True 保留索引
sh["E1"].options(pd.DataFrame, header=2, index=True).value = multi_df

# 读取回 DataFrame；index=False 避免第一列被视为索引
read_df = sh.range("A1").expand("table").options(pd.DataFrame, header=1, index=False).value

# 追加写入：定位末行（end("down") 寻找连续区域最后一个非空单元格）
last_row = sh.range("A1").end("down").row
sh.range(f"A{last_row+1}").value = [["D", 120]]  # 追加一行（保持结构）
```

# 6. 快捷操作大全

## 6.1 导航
```python
last_row = sh.range("A1").end("down").row      # 快速定位 A 列连续数据末行
last_col = sh.range("A1").end("right").column  # 快速定位第一行连续数据末列
```

## 6.2 自动列宽/行高
```python
# 对当前表格区域所有列自适应列宽（便于生成报表时视觉整洁）
sh.range("A1").expand("table").columns.autofit()

# 行高自动适应（如有文本换行时保持完整显示）
sh.range("A1").expand("table").rows.autofit()
```

## 6.3 显示格式
```python
rng.number_format = "0.00"        # 数字两位小数
rng.number_format = "yyyy-mm-dd"  # 日期标准格式
rng.number_format = "0.00%"       # 百分比格式（值需为 0-1）
rng.number_format = "#,##0"       # 千分位整数
```

## 6.4 复制
```python
src = sh.range("A1:B10")
dst = sh.range("D1")

# 完全复制（值 + 格式 + 公式）；底层调用 Excel Copy/Paste
src.copy(dst)

# 仅复制值（避免公式扩散或跨表引用错误）
dst.value = src.value
```

## 6.5 合并
```python
sh.range("A1:B1").merge()    # 合并标题区域（谨慎：数据分析区最好避免）
sh.range("A1:B1").unmerge()  # 取消合并
```

## 6.6 清除
```python
rng.clear()             # 清除值与格式（重置区域）
rng.clear_contents()    # 仅清除值（保留颜色与边框等）
rng.clear_formats()     # 仅清除格式（保留原数据）
```

## 6.7 筛选
```python
data_rng = sh.range("A1").expand("table")
# AutoFilter：Field=2 代表第二列；Criteria1=">100" 使用数值筛选
data_rng.api.AutoFilter(Field=2, Criteria1=">100")
```

## 6.8 排序
```python
# 按 B 列（假设为“销量”）降序排序；Order1=2 表示降序（1=升序）
data_rng.api.Sort(Key1=sh.range("B2").api, Order1=2)
```

## 6.9 查找替换
```python
# 使用 Excel 原生 Find 功能（区分大小写行为可通过参数控制）
found = sh.api.Cells.Find(What="目标值")
if found:  # 若找到则替换
    found.Value = "新值"
```

## 6.10 结构化表
```python
# 结构化表具备自动扩展、筛选按钮、公式继承
lo = sh.api.ListObjects.Add(
    SourceType=1,
    Source=sh.range("A1").expand("table").api,
    XlListObjectHasHeaders=1
)
lo.TableStyle = "TableStyleMedium9"  # 套用预设样式（美观 + 交互）
```

## 6.11 冻结窗格
```python
# 取消已有冻结（若有）
wb.api.ActiveWindow.FreezePanes = False

# 选中要作为冻结参照的单元格（冻结时以上与左侧区域锁定）
sh.range("B2").select()

# 启用冻结（效果等同于手动操作“冻结窗格”）
wb.api.ActiveWindow.FreezePanes = True
```

## 6.12 边框
```python
# 通过 COM 设置四边边框；edge 值分别为 Left/Top/Bottom/Right
for edge in [7, 8, 9, 10]:  # 常量对应 xlEdgeLeft=7 等
    bd = rng.api.Borders(edge)
    bd.LineStyle = 1  # 1=连续线
    bd.Weight = 2     # 2=中等粗细，提升视觉层次
```

## 6.13 模板样式
```python
def apply_style(r):
    # 统一字体（中文环境常用微软雅黑）
    r.font.name = "微软雅黑"
    r.font.size = 11
    # 背景色淡灰增强表格对比
    r.color = (242, 242, 242)
    # 默认数值格式
    r.number_format = "0.00"

apply_style(sh.range("A1").expand("table"))
```

# 7. 数据清洗与预处理案例
## 7.1 去空与重复
```python
# 删除全空行 + 删除完全重复行（提高数据质量）
df = df.dropna(how="all").drop_duplicates()
```
## 7.2 类型与标准化
```python
# 列名清洗：去空格 + 替换空格为下划线
df.columns = [c.strip().replace(" ", "_") for c in df.columns]

# 日期字段解析；errors="coerce" 将无法解析的值变为 NaT 便于后续过滤
df["日期"] = pd.to_datetime(df["日期"], errors="coerce")

# 数值字段转换；无效值变 NaN 后填充为 0
df["数量"] = pd.to_numeric(df["数量"], errors="coerce").fillna(0)
```
## 7.3 映射
```python
# 城市到区域分类映射；未匹配到的填充为“其他”
mapping = {"北京": "华北", "上海": "华东"}
df["区域大类"] = df["城市"].map(mapping).fillna("其他")
```
## 7.4 异常箱线
```python
# IQR 法检测异常值（适合销量、金额等有长尾特征但需剔除极端噪声）
q1, q3 = df["销量"].quantile([0.25, 0.75])
iqr = q3 - q1
df = df[(df["销量"] >= q1 - 1.5 * iqr) & (df["销量"] <= q3 + 1.5 * iqr)]
```
## 7.5 组内填充
```python
# 对每个产品组内的缺失销量用该组均值填补（保持总体分布合理）
df["销量"] = df.groupby("产品")["销量"].transform(lambda s: s.fillna(s.mean()))
```
## 7.6 合并
```python
# 左连接保证 df1 主体不丢失；适合补充维度表信息
merged = pd.merge(df1, df2, on="产品", how="left")
```
## 7.7 透视 + 总计
```python
# 多聚合统计：sum/mean；最后新增总计行（sum 结果只对数值列有效）
pivot = pd.pivot_table(df, index="产品", values="销量", aggfunc=["sum", "mean"])
pivot.loc["总计"] = pivot.sum(numeric_only=True)
```

# 8. 数据透视表（pandas 与原生）
## 8.1 pandas 透视
```python
pivot = pd.pivot_table(
    df,
    index=["区域", "产品"],  # 行多层索引：区域 → 产品
    columns="月份",          # 列字段：月份
    values="销量",           # 聚合数值字段
    aggfunc="sum",           # 聚合函数：合计
    fill_value=0,            # 缺失填充为 0（避免 NaN）
    margins=True,            # 增加总计行列
    margins_name="总计"      # 总计标签
)
sh_pivot["A1"].value = pivot
```
## 8.2 原生 PivotTable
```python
# data_rng 是原始数据区域；expand("table") 确保动态范围
data_rng = sh_data.range("A1").expand("table")

# 创建透视缓存（PivotCache）：SourceType=1 表示数据库类型（工作表）
pivot_cache = wb.api.PivotCaches().Create(
    SourceType=1,
    SourceData=data_rng.api
)

# 创建透视表：TableDestination 指定插入位置；TableName 唯一名称
pivot_table = pivot_cache.CreatePivotTable(
    TableDestination=sh_pivot.range("A3").api,
    TableName="PT_Sales"
)

# 设置字段布局：Orientation = 1 行字段 / 2 列字段 / 3 筛选字段 / 4 数据字段
pivot_table.PivotFields("区域").Orientation = 1
pivot_table.PivotFields("产品").Orientation = 1
pivot_table.PivotFields("月份").Orientation = 2
pivot_table.PivotFields("销量").Orientation = 4

# 修改第一个数据字段聚合函数（Function=-4157 = Sum）
pivot_table.DataFields(1).Function = -4157

# 设置数值格式为千分位
pivot_table.PivotFields("销量").NumberFormat = "#,##0"

# 刷新缓存使透视表应用最新源数据
pivot_table.PivotCache().Refresh()

# 隐藏特定产品项（PivotItems 获取具体成员）
pivot_table.PivotFields("产品").PivotItems("废弃产品").Visible = False
```

# 9. 条件格式
## 9.1 数值条件
```python
# Type=1 (xlCellValue)，Operator=1 (xlGreater)；Formula1 以字符串传递比较值
fc = rng.api.FormatConditions.Add(Type=1, Operator=1, Formula1="100")
# 设置填充色用于高亮
fc.Interior.Color = xw.utils.rgb_to_int(255, 230, 200)
```
## 9.2 公式
```python
# Type=2 (xlExpression) 自定义公式；=$A2="重点" 行内判断基于第一列内容
fc = rng.api.FormatConditions.Add(Type=2, Formula1="=$A2=\"重点\"")
fc.Interior.Color = xw.utils.rgb_to_int(198, 239, 206)
```
## 9.3 色阶
```python
# 三色渐变；ColorScaleType=3 表示 3 段
fc = rng.api.FormatConditions.AddColorScale(ColorScaleType=3)
sc = fc.ColorScaleCriteria
# 最低值：Type=1 (LowestValue)
sc(1).Type = 1
sc(1).FormatColor.Color = xw.utils.rgb_to_int(255, 0, 0)
# 中位点：Type=3 (Percentile) Value=50 表示第 50 百分位
sc(2).Type = 3
sc(2).Value = 50
sc(2).FormatColor.Color = xw.utils.rgb_to_int(255, 255, 0)
# 最高值：Type=2 (HighestValue)
sc(3).Type = 2
sc(3).FormatColor.Color = xw.utils.rgb_to_int(0, 255, 0)
```
## 9.4 数据条
```python
# 数据条表示相对大小；自动计算最小最大
fc = rng.api.FormatConditions.AddDatabar()
fc.BarColor.Color = xw.utils.rgb_to_int(0, 120, 215)
```
## 9.5 图标集
```python
# IconSets(3) 选择三色箭头；不同值区间显示不同图标
fc = rng.api.FormatConditions.AddIconSetCondition()
fc.IconSet = wb.app.api.IconSets(3)
```
## 9.6 清除
```python
# 删除当前范围所有条件格式规则
rng.api.FormatConditions.Delete()
```

# 10. 图表可视化全谱系
```python
# 创建数据并生成多类型图表示例
sh["A1"].value = [
    ["分类", "值1", "值2"],
    ["A", 10, 15],
    ["B", 20, 18],
    ["C", 15, 22],
]

# 基础柱状图
col_chart = sh.charts.add(left=sh.range("E2").left, top=sh.range("E2").top, name="柱状")
col_chart.set_source_data(sh.range("A1").expand("table"))
col_chart.chart_type = "column_clustered"

# 组合图：第一系列柱状，第二系列折线（通过 COM 修改系列类型）
combo_chart = sh.charts.add(left=sh.range("E20").left, top=sh.range("E20").top, name="组合")
combo_chart.set_source_data(sh.range("A1").expand("table"))
combo_chart.chart_type = "column_clustered"  # 初始设为柱状
if combo_chart.api.SeriesCollection().Count >= 2:
    combo_chart.api.SeriesCollection(2).ChartType = 4  # xlLine
    combo_chart.api.SeriesCollection(2).AxisGroup = 2  # 使用次坐标轴展示不同尺度

# 饼图：适合展示占比（仅一个系列数据适配）
pie_chart = sh.charts.add(left=sh.range("L2").left, top=sh.range("L2").top, name="饼图")
pie_chart.set_source_data(sh.range("A1:A4").expand("table"))  # 需要分类 + 单系列数值
pie_chart.chart_type = "pie"
pie_chart.api.SeriesCollection(1).ApplyDataLabels()  # 显示百分比等标签

# 雷达图：展示多指标对比（雷达适用于评分或性能分布）
radar_chart = sh.charts.add(left=sh.range("L20").left, top=sh.range("L20").top, name="雷达")
radar_chart.set_source_data(sh.range("A1").expand("table"))
radar_chart.chart_type = "radar_filled"

# 瀑布图：展示累积变化（需 Excel 2016+）
wf_chart = sh.charts.add(left=sh.range("E38").left, top=sh.range("E38").top, name="瀑布")
wf_chart.set_source_data(sh.range("A1").expand("table"))
wf_chart.chart_type = "waterfall"
# 标记最后一个点为总计（Points() 遍历数据点；IsTotal 标记瀑布终值）
pts = wf_chart.api.SeriesCollection(1).Points()
if pts.Count > 0:
    pts(pts.Count).IsTotal = True
```

# 11. 自动化办公
## 11.1 批量合并
```python
import glob
import xlwings as xw
import pandas as pd

def consolidate(folder):
    # 隐藏 Excel 提高批量处理速度
    app = xw.App(visible=False)
    all_rows = []

    # 遍历目标文件夹下所有 xlsx 文件（glob 简化文件搜集）
    for f in glob.glob(f"{folder}/*.xlsx"):
        wb = xw.Book(f)
        # 读取第一个 Sheet 数据为 DataFrame；header=1 自动识别列头
        df = wb.sheets[0].range("A1").options(pd.DataFrame, header=1, index=False).value
        df["来源文件"] = f  # 添加来源字段便于追溯
        all_rows.append(df)
        wb.close()  # 及时关闭释放句柄

    # 合并为总数据表
    merged = pd.concat(all_rows, ignore_index=True)

    # 新建结果工作簿并写入
    out = xw.Book()
    out.sheets[0]["A1"].value = merged
    out.save("合并结果.xlsx")
    out.close()
    app.quit()

# consolidate("daily_reports")
```
## 11.2 PDF 导出
```python
# ExportAsFixedFormat：Type=0 表示 PDF；Filename 目标文件路径
wb.api.ExportAsFixedFormat(0, "报告.pdf")
```
## 11.3 邮件发送（片段）
```python
import smtplib, email.message

msg = email.message.EmailMessage()
msg["Subject"] = "日报"
msg["From"] = "me@x.com"
msg["To"] = "boss@x.com"

# 附件添加：读取 PDF 二进制并附加
with open("报告.pdf", "rb") as f:
    msg.add_attachment(
        f.read(),
        maintype="application",
        subtype="pdf",
        filename="报告.pdf"
    )

smtp = smtplib.SMTP("smtp.server", 587)
smtp.starttls()
smtp.login("user","pwd")
smtp.send_message(msg)
smtp.quit()
```
## 11.4 模板变量替换
```python
import xlwings as xw

def fill_template(template_path, output_path, mapping):
    wb = xw.Book(template_path)
    sh = wb.sheets["封面"]  # 假设封面页包含占位符

    # 遍历已用区域所有单元格；占位形式 ${变量}
    for key, value in mapping.items():
        for cell in sh.used_range:
            if isinstance(cell.value, str) and f"${{{key}}}" in cell.value:
                # 用实际值替换占位符（支持多个占位符在同一单元格）
                cell.value = cell.value.replace(f"${{{key}}}", str(value))

    wb.save(output_path)
    wb.close()

fill_template("报告模板.xlsx", "生成报告.xlsx", {"日期":"2025-10-17","编制人":"张三"})
```
## 11.5 UDF 增强
```python
import xlwings as xw
import numpy as np

@xw.func
@xw.ret(expand="table")
def growth_rate(vals):
    # 将 Excel 传入的二维数据转为 numpy 数组，便于向量化计算
    arr = np.array(vals, dtype=float)
    # 计算环比增长率：当前值与前值对比；首个值无前值返回 None
    return [
        (arr[i] - arr[i - 1]) / arr[i - 1] if i > 0 and arr[i - 1] != 0 else None
        for i in range(len(arr))
    ]
```

# 12. 性能优化与最佳实践
```python
import xlwings as xw

# 性能优化模板：批处理场景统一管理 Excel 状态
app = xw.App(visible=False)
app.screen_updating = False       # 禁止界面刷新
app.display_alerts = False        # 禁止弹窗（覆盖保存等场景）
app.calculation = 'manual'        # 手动模式避免频繁公式计算

wb = xw.Book("源数据.xlsx")
sh = wb.sheets[0]

# 示例：批量写入（准备二维列表而非循环）
data = [["产品", "销量"]] + [[f"P{i}", i * 10] for i in range(1, 101)]
sh["A1"].value = data  # 一次性写入，性能较高

# 手动触发公式重算（如果有公式依赖）
app.calculate()

# 保存与关闭
wb.save("结果.xlsx")
wb.close()
app.quit()
```
分块读取：
```python
# 分块读取适合超大范围（例如数万行），避免一次性转 DataFrame 造成内存峰值
rng = sh.range("A1").expand("table")
for chunk in rng.options(pd.DataFrame, header=1, chunksize=5000).value:
    # 在每个块上执行计算逻辑（如聚合或过滤）
    result = chunk.groupby("产品")["销量"].sum()
    # 可逐块写入或先缓存再汇总
```

# 13. 错误与调试
```python
import xlwings as xw

wb = xw.Book()
sh = wb.sheets[0]

# 调试读取类型：确认 xlwings 自动转换后的 Python 类型
val = sh["A1"].value
print(type(val))  # 可能是 int/float/str/datetime/None

try:
    # 某些 COM 调用可能在 Mac 不支持，做好异常捕获
    sh.api.Cells.Find(What="Test")
except Exception as e:
    print("COM 调用失败：", e)

# 中间结果保存：复杂流程建议阶段性保存便于回滚
wb.save("阶段结果.xlsx")
```

# 14. Cheat Sheet❤️
```python
import xlwings as xw
import pandas as pd

app = xw.App(visible=False)
wb = xw.Book("源.xlsx")
sh = wb.sheets["Sheet1"]

# 获取完整数据表（包括表头）为 DataFrame
rng = sh.range("A1").expand("table")
df = rng.options(pd.DataFrame, header=1, index=False).value

# 写回（覆盖原区域）
sh["A1"].value = df

# 末行定位（追加数据用）
last_row = sh.range("A1").end("down").row

# 创建图表（折线）
chart = sh.charts.add()
chart.set_source_data(sh.range("A1").expand("table"))
chart.chart_type = "line"

# pandas 透视简化统计
pivot = pd.pivot_table(df, index="产品", values="销量", aggfunc="sum")
sh["H1"].value = pivot

# 删除条件格式
rng.api.FormatConditions.Delete()

# 保存关闭
wb.save("输出.xlsx")
wb.close()
app.quit()
```

# 15. 综合案例流水线
```python
import xlwings as xw
import pandas as pd
import numpy as np

def end_to_end(input_book, output_book):
    # 初始化优化：隐藏窗口、关闭刷新、关闭弹窗、手动计算
    app = xw.App(visible=False)
    app.screen_updating = False
    app.display_alerts = False
    app.calculation = 'manual'

    wb = xw.Book(input_book)

    # 1. 读取多 Sheet（约定原始数据表以“原始”开头）
    all_df = []
    for sh in wb.sheets:
        if sh.name.startswith("原始"):
            # header=1 表示第一行为列头；index=False 避免第一列误作索引
            df = sh.range("A1").options(pd.DataFrame, header=1, index=False).value
            df["来源"] = sh.name  # 溯源字段
            all_df.append(df)
    raw = pd.concat(all_df, ignore_index=True)

    # 2. 清洗逻辑：空行、去空格、填充、过滤异常值
    raw = (
        raw.dropna(how="all")  # 删除全空行
           .assign(
               产品=lambda d: d["产品"].str.strip(),      # 去除前后空格
               区域=lambda d: d["区域"].fillna("未知")    # 区域缺失填充
           )
           .pipe(lambda d: d[d["销量"] >= 0])            # 过滤负销量异常
    )
    # 类型转换：日期解析 + 数值转换（失败值变 NaN 再统一填充）
    raw["日期"] = pd.to_datetime(raw["日期"], errors="coerce")
    raw["销量"] = pd.to_numeric(raw["销量"], errors="coerce").fillna(0)

    # 3. 汇总统计：sum / mean / count
    stats = raw.groupby("产品")["销量"].agg(["sum", "mean", "count"]).reset_index()

    # 4. 透视：按产品与区域分布；margins=True 添加总计
    pivot = pd.pivot_table(
        raw,
        index="产品",
        columns="区域",
        values="销量",
        aggfunc="sum",
        fill_value=0,
        margins=True
    )

    # 5. 写入多个结果 Sheet（避免覆盖原始数据）
    sh_clean = wb.sheets.add("清洗")
    sh_stats = wb.sheets.add("统计")
    sh_pivot = wb.sheets.add("透视")
    sh_clean["A1"].value = raw
    sh_stats["A1"].value = stats
    sh_pivot["A1"].value = pivot

    # 6. 条件格式：高于平均销量高亮（抓 sum 列；假设列顺序：产品 | sum | mean | count）
    avg_val = raw["销量"].mean()
    rng_stats = sh_stats.range("A1").expand("table")
    sum_col = rng_stats.columns[1]  # 第二列为 sum
    fc = sum_col.api.FormatConditions.Add(Type=1, Operator=1, Formula1=str(avg_val))
    fc.Interior.Color = xw.utils.rgb_to_int(198, 239, 206)

    # 7. 组合图：柱 + 折线（第二系列应用次坐标轴展示均值）
    chart = sh_stats.charts.add(
        left=sh_stats.range("H2").left,
        top=sh_stats.range("H2").top,
        name="销量图"
    )
    chart.set_source_data(rng_stats)
    chart.chart_type = "column_clustered"
    if chart.api.SeriesCollection().Count >= 2:
        chart.api.SeriesCollection(2).ChartType = 4      # xlLine
        chart.api.SeriesCollection(2).AxisGroup = 2      # 次坐标轴
    chart.api.HasTitle = True
    chart.api.ChartTitle.Text = "产品销量统计"

    # 8. 雷达图：展示 sum/mean/count 多指标对比（同一个数据表区域）
    radar_chart = sh_stats.charts.add(
        left=sh_stats.range("H20").left,
        top=sh_stats.range("H20").top,
        name="雷达"
    )
    radar_chart.set_source_data(rng_stats)
    radar_chart.chart_type = "radar_filled"
    radar_chart.api.ChartTitle.Text = "产品雷达对比"

    # 9. 瀑布图：按日期累计销量变化（需要构造按日期汇总 + 累计）
    month_df = raw.groupby("日期")["销量"].sum().sort_index().reset_index()
    month_df["累计"] = month_df["销量"].cumsum()  # 累计列用于分析趋势
    sh_wf = wb.sheets.add("瀑布")
    sh_wf["A1"].value = month_df
    wf_chart = sh_wf.charts.add(
        left=sh_wf.range("F2").left,
        top=sh_wf.range("F2").top,
        name="瀑布"
    )
    wf_chart.set_source_data(sh_wf.range("A1").expand("table"))
    wf_chart.chart_type = "waterfall"

    # 10. 导出：先保存 Excel，再输出 PDF（Excel 必须保存后才能有稳定路径）
    wb.save(output_book)
    wb.api.ExportAsFixedFormat(0, output_book.replace(".xlsx", ".pdf"))

    # 资源释放：关闭工作簿 + 手动计算（若使用公式）+ 退出 App
    wb.close()
    app.calculate()
    app.quit()

if __name__ == "__main__":
    end_to_end("输入数据.xlsx", "分析结果.xlsx")
```

# 总结与建议
1. 掌握对象链 App→Book→Sheet→Range 是一切基础  
2. 优先批量读写数据结构而非单个单元格循环  
3. Range.options 精准控制数据类型与空值处理  
4. pandas 负责复杂计算/透视；Excel 负责展示与交互  
5. 图表、条件格式高级特性用 COM 封装函数复用  
6. 自动化流程：采集→清洗→聚合→可视化→导出→分发  
7. 性能优化从屏幕更新与计算模式入手  
8. UDF 适合交互；脚本适合批量与离线生成  
9. 模板驱动可降低格式重复劳动  
10. 逐步封装公共操作（边框、色彩、图表创建、条件格式）形成内部库  
