---
title: "Python自动化办公脚本"
date: 2024-10-22
categories: ["Python","自动化","Office"]
tags: ["Excel","Word","PDF","OCR"]
summary: "26 个常用办公自动化脚本，加入大量关键步骤中文注释，路径占位语义化，可直接改路径运行。"
pin: true
---

## 1. 从 PDF 导出的旧版 XLS 抽取列写入模板并格式化

```python
import xlrd                                   # 读取旧版 .xls（注意不支持 .xlsx）
from openpyxl import load_workbook            # 处理目标模板（.xlsx）
from openpyxl.styles import Border, Side, Font, Alignment

# --------- 路径占位（需替换）---------
source_xls_path = "excel_input_path/原表.xls"          # PDF 导出产生的原始 .xls
template_xlsx_path = "excel_input_path/统计表模板.xlsx"  # 预先准备好的样式模板
output_xlsx_path = "excel_output_path/统计表.xlsx"       # 输出目标路径

# --------- 读取源 .xls 文件 ----------
wb_xls = xlrd.open_workbook(source_xls_path)  # 打开工作簿；失败会抛异常（可加 try/except）
ws_xls = wb_xls.sheets()[0]                   # 取第一个工作表；可根据名称/索引调整

# 列字段说明：
# col 1: 科室名称（目标抽取）
# col 2: 总计
# col 3: 计
# col 20: 平均每日人次
# 起始行：第 7 行开始（依据原始文件结构）
rows_to_write = []                             # 存放清洗后的行

for r in range(7, ws_xls.nrows):               # 遍历有效数据区
    dept = str(ws_xls.cell(r, 1).value).strip()  # 科室名称空格清理
    if not dept:                                # 跳过空部门行
        continue
    total1 = ws_xls.cell(r, 2).value            # 总计
    total2 = ws_xls.cell(r, 3).value            # 计
    daily_avg = ws_xls.cell(r, 20).value        # 平均每日人次
    rows_to_write.append([dept, total1, total2, daily_avg])

# --------- 打开模板并写入数据 ----------
wb_new = load_workbook(template_xlsx_path)      # 模板需已存在；若缺失可用 Workbook() 创建
ws_new = wb_new.active                          # 默认活动工作表；若多 Sheet 可指定名称

# 追加所有行到模板表尾
for row in rows_to_write:
    ws_new.append(row)

# --------- 样式设置（逐单元格写入，行多时较慢） ----------
thin = Side(border_style="thin", color="000000")  # 定义细边框对象
for rr in range(3, ws_new.max_row + 1):           # 假设前两行是标题（按实际调整）
    ws_new.row_dimensions[rr].height = 25         # 设置行高
    for cc in range(1, 5):                        # 前 4 列格式化
        cell = ws_new.cell(rr, cc)
        cell.font = Font(size=11, bold=True)      # 加粗 + 字号
        cell.border = Border(top=thin, left=thin, right=thin, bottom=thin)
        cell.alignment = Alignment(horizontal="center", vertical="center")  # 居中对齐

# --------- 保存输出 ----------
wb_new.save(output_xlsx_path)                    # 覆盖保存；可用 wb_new.save(...) + wb_new.close()
```

## 2. pandas 筛选数量 > 500 并追加写入新工作表后格式化

```python
import pandas as pd
from openpyxl import load_workbook
from openpyxl.styles import Side, Border, Font, Alignment

source_path = "excel_input_path/物料表.xlsx"     # 原始 Excel 文件（含多个列）
# header=2 表示使用第三行作为列名（前两行为说明/标题）；视文件结构调整
df = pd.read_excel(source_path, header=2)

# --------- 条件筛选 ----------
df_filtered = df[df["数量"] > 500]               # 数量列过滤；若列名不同需调整

# --------- 追加写入：mode='a' 保留原工作表 ----------
with pd.ExcelWriter(source_path, mode="a", engine="openpyxl") as writer:
    df_filtered.to_excel(writer, sheet_name="数量大于500", index=False)

# --------- 用 openpyxl 调整样式 ----------
wb = load_workbook(source_path)
ws = wb["数量大于500"]                           # 新增工作表名称即写入时定义

# 列宽调整（实际列名和展示需要自行增加或循环）
ws.column_dimensions['A'].width = 12
ws.column_dimensions['C'].width = 15.5
ws.column_dimensions['G'].width = 10

thin = Side(border_style="thin", color="000000")
# 遍历所有数据行（跳过表头第 1 行）
for r in range(2, ws.max_row + 1):
    for c in range(1, ws.max_column + 1):
        cell = ws.cell(r, c)
        cell.font = Font(size=10)                          # 设置字体大小
        cell.border = Border(top=thin, left=thin, right=thin, bottom=thin)  # 加边框
        cell.alignment = Alignment(horizontal="left", vertical="center")    # 左对齐

wb.save(source_path)
wb.close()
```

## 3. 多文件批量筛选 “数量 > 500” 追加写入（框架版）

```python
import pandas as pd
import os
from openpyxl import load_workbook

folder = "excel_input_path/批处理物料"           # 存放要处理的多个文件
for fname in os.listdir(folder):
    if not fname.lower().endswith((".xls", ".xlsx")):
        continue
    fpath = os.path.join(folder, fname)
    try:
        df = pd.read_excel(fpath, header=2)      # 统一 header；不同文件可能需 try 不同 header
        df_filtered = df[df["数量"] > 500]
        with pd.ExcelWriter(fpath, mode="a", engine="openpyxl") as w:
            df_filtered.to_excel(w, sheet_name="数量大于500", index=False)
        print("完成：", fname)
    except Exception as e:
        # 捕获错误（如列名不存在 / 文件损坏）
        print("失败：", fname, e)
```

## 4. 使用 Excel COM 保留原格式复制多个工作簿的活动工作表

```python
import os
import win32com.client  # 需安装 pywin32

src_dir = "excel_input_path/文件"
# 收集所有 Excel 文件
files = [os.path.join(src_dir, f) for f in os.listdir(src_dir)
         if f.lower().endswith((".xls", ".xlsx"))]

# 启动 Excel 后台（COM）
excel = win32com.client.Dispatch("Excel.Application")
excel.Visible = False               # 隐藏窗口
excel.DisplayAlerts = False         # 阻止保存/覆盖弹窗

# 创建汇总工作簿
summary = excel.Workbooks.Add()
summary.SaveAs(os.path.join("excel_output_path", "汇总.xlsx"))

# 第一个工作表作为目录
catalog = summary.Worksheets(1)
catalog.Name = "目录"

for idx, path in enumerate(files):
    name = os.path.splitext(os.path.basename(path))[0]
    catalog.Range(f"A{idx+1}").Value = name       # 写目录行
    wb_sub = excel.Workbooks.Open(path)           # 打开子工作簿
    wb_sub.ActiveSheet.Copy(After=summary.Worksheets(summary.Worksheets.Count))  # 复制活动表
    summary.ActiveSheet.Name = name               # 重命名复制后的活动表
    wb_sub.Close()
    print("已复制：", name)

# 将目录工作表移到最前（Before 调用时特别注意目标引用）
summary.Worksheets("目录").Move(Before=summary.Worksheets(1))

summary.Save()
summary.Close()
excel.Quit()                                      # 释放 COM 资源
```

## 5. 汇总多工作表按物料编号聚合批号批数量

```python
import pandas as pd

source = "excel_input_path/日领料单.xlsx"
output = "excel_output_path/汇总.xlsx"

# 读取全部工作表为 dict：{sheet_name: DataFrame}
sheets = pd.read_excel(source, header=2, sheet_name=None)

partial_results = []
for sheet_name, df_sheet in sheets.items():
    # groupby + sum 聚合（reset_index 还原结构）
    grouped = df_sheet.groupby(['物料编号', '物料描述'])['批号批数量'].sum().reset_index()
    partial_results.append(grouped)

# 合并所有中间结果
merged = pd.concat(partial_results, ignore_index=True)

# 再次按同字段聚合得到最终合并结果
final = (merged.groupby(['物料编号', '物料描述'])['批号批数量']
               .sum()
               .reset_index()
               .sort_values('批号批数量', ascending=False))

final.to_excel(output, index=False)
```

## 6. xlwings 行列转置另存（保留公式值）

```python
import xlwings as xw

src = "excel_input_path/aaa.xlsx"
dst = "excel_output_path/bbb.xlsx"

app = xw.App(visible=False, add_book=False)
wb = app.books.open(src)
ws = wb.sheets[0]

# expand('table') 可自动从 A1 扩展到连续区域
data = ws.range("A1").expand("table").value  # 返回二维列表
# zip(*) 行列转置；需把 tuple 转为 list
transposed = list(map(list, zip(*data)))

# 清空原工作表并写入新布局
ws.clear()
ws.range("A1").value = transposed

wb.save(dst)
wb.close()
app.quit()
```

## 7. 遍历 .xls 修改首列值 < 12 → 0（使用 xlrd + xlutils）

```python
from xlrd import open_workbook
from xlutils.copy import copy
import os

input_dir = "excel_input_path/xls源"
output_dir = "excel_output_path/xls处理后"
os.makedirs(output_dir, exist_ok=True)

for fname in os.listdir(input_dir):
    if not fname.lower().endswith(".xls"):
        continue
    full = os.path.join(input_dir, fname)
    wb = open_workbook(full)
    sheets = wb.sheets()
    new_wb = copy(wb)                # 得到可写副本
    for idx, sh in enumerate(sheets):
        new_sh = new_wb.get_sheet(idx)
        for row_idx, row in enumerate(sh.get_rows()):
            if row and row[0].value is not None and isinstance(row[0].value, (int, float)):
                if row[0].value < 12:
                    new_sh.write(row_idx, 0, 0)
    new_wb.save(os.path.join(output_dir, fname))
    print("处理：", fname)
```

## 8. 合并多个 .xlsx（保留第一个表头）

```python
from openpyxl import load_workbook, Workbook
import glob
import os

src_dir = "excel_input_path/批量合并"
out_file = "excel_output_path/合并结果.xlsx"

new_wb = Workbook()
ws_out = new_wb.active
ws_out.title = "合并"

header_written = False

for path in glob.glob(os.path.join(src_dir, "*.xlsx")):
    wb = load_workbook(path, data_only=True)   # data_only=True 获取值（忽略公式表达式）
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        continue
    if not header_written:
        ws_out.append(rows[0])
        header_written = True
    for row in rows[1:]:
        ws_out.append(row)
    wb.close()

new_wb.save(out_file)
```

## 9. 合并单文件中所有工作表并标记来源工作表

```python
import pandas as pd

src = "excel_input_path/源文件.xlsx"
out = "excel_output_path/多Sheet合并.xlsx"

excel = pd.ExcelFile(src)             # 预解析工作簿
merged = pd.DataFrame()

for sheet in excel.sheet_names:
    df = excel.parse(sheet_name=sheet, dtype=str)  # dtype=str 防止长数值科学计数
    df["来源工作表"] = sheet
    merged = pd.concat([merged, df], ignore_index=True)

merged.to_excel(out, index=False)
```

## 10. 查找每工作表 A 列出现指定值所在行并汇总

```python
from openpyxl import load_workbook, Workbook

src = "excel_input_path/总表.xlsx"
dst = "excel_output_path/匹配结果.xlsx"
keyword = "c"                     # 目标匹配值

wb_src = load_workbook(src)
wb_dst = Workbook()
ws_dst = wb_dst.active
ws_dst.title = "匹配行"
ws_dst.append(["工作表", "匹配行内容"])

for name in wb_src.sheetnames:
    ws = wb_src[name]
    match_row = None
    # 遍历第一列 A 查找匹配
    for cell in ws["A"]:
        if cell.value == keyword:
            match_row = cell.row
            break
    if match_row:
        row_values = [c.value for c in ws[match_row]]
        ws_dst.append([name, " | ".join(map(lambda v: str(v) if v is not None else "", row_values))])

wb_dst.save(dst)
wb_src.close()
wb_dst.close()
```

## 11. 批量打印指定工作表（COM API PrintOut）

```python
import os
import xlwings as xw

folder = "excel_input_path/需打印"
sheet_to_print = "Sheet1"      # 指定要打印的工作表名称

app = xw.App(visible=False, add_book=False)
for fname in os.listdir(folder):
    if fname.startswith("~$") or not fname.lower().endswith((".xls", ".xlsx")):
        continue
    full = os.path.join(folder, fname)
    wb = app.books.open(full)
    for sh in wb.sheets:
        if sh.name == sheet_to_print:
            sh.api.PrintOut()   # 调用 COM 打印
            print("打印：", fname)
            break
    wb.close()
app.quit()
```

## 12. 批量打开目录内所有 .xlsx（可人工查看）

```python
import os
import xlwings as xw

folder = "excel_input_path/待打开"

app = xw.App(visible=True, add_book=False)
for fname in os.listdir(folder):
    if fname.lower().endswith(".xlsx"):
        app.books.open(os.path.join(folder, fname))

# 手动关闭 Excel 即结束
```

## 13. 批量新建空工作簿并保存

```python
import xlwings as xw
import os

out_dir = "excel_output_path/批量新建"
os.makedirs(out_dir, exist_ok=True)

app = xw.App(visible=False, add_book=False)
for i in range(6):                                # 新建 6 个
    wb = app.books.add()
    wb.save(os.path.join(out_dir, f"test_{i}.xlsx"))
    wb.close()
app.quit()
```

## 14. 修改工作簿中所有工作表的 A4 单元格内容

```python
from openpyxl import load_workbook

src = "excel_input_path/领料单（每日）.xlsx"
dst = "excel_output_path/领料单（每日）-更改后.xlsx"

wb = load_workbook(src)
for name in wb.sheetnames:
    ws = wb[name]
    ws["A4"].value = "零件测试领料单"   # 直接覆盖
wb.save(dst)
wb.close()
```

## 15. 批量修改多个工作簿日期列格式（m/d）

```python
import os
import xlwings as xw

folder = "excel_input_path/日期格式调整"
target_col = "A"                                 # 仅处理 A 列

app = xw.App(visible=False, add_book=False)
for fname in os.listdir(folder):
    if fname.startswith("~$") or not fname.lower().endswith((".xls", ".xlsx")):
        continue
    wb = app.books.open(os.path.join(folder, fname))
    for sh in wb.sheets:
        # current_region：从 A1 起连续区域；可能包含其他列，注意数据布局
        last_row = sh.range("A1").current_region.last_cell.row
        # 跳过表头第 1 行，从第 2 行到最后一行：统一日期格式
        sh.range(f"{target_col}2:{target_col}{last_row}").number_format = "m/d"
    wb.save()
    wb.close()
app.quit()
```

## 16. 重命名单个工作簿所有工作表（Sheet → 表）

```python
import xlwings as xw
import os

src = "excel_input_path/test.xlsx"
dst = "excel_output_path/test_重命名.xlsx"

app = xw.App(visible=False, add_book=False)
wb = app.books.open(src)
for sh in wb.sheets:
    if "Sheet" in sh.name:
        sh.name = sh.name.replace("Sheet", "表")
wb.save(dst)
wb.close()
app.quit()
```

## 17. 批量重命名文件名（示例：字符 a → “表”）

```python
from pathlib import Path

folder = Path("excel_input_path/批量重命名")
for fp in folder.glob("*.xlsx"):
    new_name = fp.name.replace("a", "表")   # 可正则替换
    fp.rename(fp.with_name(new_name))
    print(fp.name, "→", new_name)
```

## 18. 词频 Excel 生成词云（带背景形状）

```python
import os
import numpy as np
from PIL import Image
from openpyxl import load_workbook
import wordcloud
import matplotlib.pyplot as plt

freq_dir = "excel_input_path/词频"
mask_path = "images_dir/background.png"
output_dir = "images_dir/词云图"
os.makedirs(output_dir, exist_ok=True)

mask = np.array(Image.open(mask_path))          # 背景图矩阵化
excel_files = [f for f in os.listdir(freq_dir) if f.lower().endswith((".xls", ".xlsx"))]

for fname in excel_files:
    wb = load_workbook(os.path.join(freq_dir, fname))
    ws = wb.active
    freq_map = {}
    # 从第 2 行开始（第 1 行为表头）
    for r in range(2, ws.max_row + 1):
        word = ws[f"A{r}"].value
        val = ws[f"B{r}"].value
        if word and val:
            freq_map[str(word)] = int(val)

    wc = wordcloud.WordCloud(
        font_path="C:/Windows/Fonts/simhei.ttf",
        mask=mask,
        max_words=500,
        max_font_size=100,
        background_color="white"
    ).generate_from_frequencies(freq_map)

    out_name = os.path.splitext(fname)[0][:20] + ".png"
    wc.to_file(os.path.join(output_dir, out_name))
    plt.imshow(wc)
    plt.axis("off")
    plt.show()
```

## 19. 成绩 Excel 批量渲染 Word 通知书（docxtpl）

```python
from docxtpl import DocxTemplate
import pandas as pd
import os, time

template_dir = "template_dir"
scores_path = os.path.join(template_dir, "成绩表.xlsx")         # 成绩源数据
tpl_path = os.path.join(template_dir, "通知书模板.docx")         # Word 模板（需定义占位符）
out_dir = "word_output_dir"
os.makedirs(out_dir, exist_ok=True)

df = pd.read_excel(scores_path)
tpl = DocxTemplate(tpl_path)

for i, row in df.iterrows():
    context = {
        "name": str(row["姓名"]).strip(),
        "chinese": row["语文"],
        "math": row["数学"],
        "english": row["英语"],
        "date": time.strftime('%Y-%m-%d', time.localtime())
    }
    tpl.render(context)
    tpl.save(os.path.join(out_dir, f"{context['name']}_通知书.docx"))
    print("生成：", context['name'])
```

## 20. 百度 OCR 表格识别批量下载 Excel

```python
import os, time, requests
from aip import AipOcr

img_dir = "images_dir/待识别"
out_dir = "excel_output_path/OCR结果"
os.makedirs(out_dir, exist_ok=True)

# 替换为自己的百度智能云 OCR 账号信息
APP_ID = "你的APP_ID"
API_KEY = "你的API_KEY"
SECRET_KEY = "你的SECRET_KEY"
client = AipOcr(APP_ID, API_KEY, SECRET_KEY)

# 收集所有图片文件
images = [os.path.join(img_dir, f) for f in os.listdir(img_dir)
          if f.lower().endswith((".png", ".jpg", ".jpeg", ".bmp"))]

for path in images:
    with open(path, "rb") as f:
        img = f.read()
    res_async = client.tableRecognitionAsync(img)
    req_id = res_async['result'][0]['request_id']

    # 轮询等待识别完成
    while True:
        res = client.getTableRecognitionResult(req_id)
        if res['result']['ret_msg'] == '已完成':
            break
        time.sleep(2)

    url = res['result']['result_data']
    content = requests.get(url).content
    out_name = os.path.splitext(os.path.basename(path))[0] + ".xls"
    with open(os.path.join(out_dir, out_name), "wb") as wf:
        wf.write(content)
    print("OCR完成：", out_name)
```

## 21. 提取 Word 所有表格到 Excel（逐表一 Sheet）

```python
import os
from docx import Document
from openpyxl import Workbook

word_dir = "word_dir"
out_dir = "excel_output_path/word表格"
os.makedirs(out_dir, exist_ok=True)

files = [f for f in os.listdir(word_dir) if f.lower().endswith(".docx")]

for fname in files:
    doc = Document(os.path.join(word_dir, fname))
    wb = Workbook()
    wb.remove(wb.worksheets[0])                 # 删除默认空表
    for idx, table in enumerate(doc.tables, start=1):
        ws = wb.create_sheet(f"Sheet{idx}")
        for row in table.rows:
            ws.append([cell.text for cell in row.cells])
    out_name = os.path.splitext(fname)[0] + ".xlsx"
    wb.save(os.path.join(out_dir, out_name))
    print("提取：", fname)
```

## 22. 多工作簿批量添加指定工作表（若不存在）

```python
import os
import xlwings as xw

folder = "excel_input_path/多文件添加"
new_sheet_name = "aaa"

app = xw.App(visible=False, add_book=False)
for fname in os.listdir(folder):
    if fname.startswith("~$") or not fname.lower().endswith((".xls", ".xlsx")):
        continue
    full = os.path.join(folder, fname)
    wb = app.books.open(full)
    existing = [s.name for s in wb.sheets]
    if new_sheet_name not in existing:
        wb.sheets.add(new_sheet_name)
        wb.save()
        print("添加：", fname)
    wb.close()
app.quit()
```

## 23. TXT 内容逐行写入 Excel

```python
import xlwt

txt_path = "text_input_path/data.txt"
excel_out = "excel_output_path/文本导出.xlsx"

# 读取全部行，并过滤空行
with open(txt_path, "r", encoding="utf-8") as f:
    lines = [ln.strip() for ln in f if ln.strip()]

wb = xlwt.Workbook(encoding="utf-8")
ws = wb.add_sheet("内容")

# 每行写到第一列
for idx, line in enumerate(lines):
    ws.write(idx, 0, line)

wb.save(excel_out)
```

## 24. 批量从年报 PDF 截取区间文本（“公司业务概要”→“重大变化情况”）

```python
import os, time, pdfplumber

pdf_dir = "pdf_dir/年报"
out_dir = "text_output_dir/摘要"
os.makedirs(out_dir, exist_ok=True)

def extract_between(src: str, start: str, end: str):
    """在字符串 src 中截取 start 与 end 之间的内容（不含边界）。"""
    i1 = src.find(start)
    if i1 < 0:
        return None
    i1 += len(start)
    i2 = src.find(end, i1)
    if i2 < 0:
        return None
    return src[i1:i2].strip()

files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")]
t0 = time.time()

for f in files:
    full_path = os.path.join(pdf_dir, f)
    pages_text = []
    # 打开 PDF 并逐页提取
    with pdfplumber.open(full_path) as pdf:
        # 经验页码范围：第 6~25 索引（即第 7~26 页），可按实际调整
        for p in range(6, min(26, len(pdf.pages))):
            txt = pdf.pages[p].extract_text()
            if txt:
                pages_text.append(txt)
                if "重大变化情况" in txt:     # 提前终止，提高性能
                    break
    merged = "".join(pages_text)
    segment = extract_between(merged, "公司业务概要", "重大变化情况")
    if segment:
        out_name = os.path.splitext(f)[0] + ".txt"
        with open(os.path.join(out_dir, out_name), "w", encoding="utf-8") as wf:
            wf.write(segment)
        print("提取成功：", f)
    else:
        print("未找到目标段落：", f)

print("总耗时：", round(time.time() - t0, 2), "秒")
```

## 25. 合并相邻相同内容单元格（指定列 B、C）

```python
from openpyxl import load_workbook

src = "excel_input_path/产品清单.xlsx"
dst = "excel_output_path/产品清单-合并单元格.xlsx"

def merge_runs(ws, values, start_row, col_letter):
    """
    根据连续相同的 values 合并单元格：
    ws: 工作表对象
    values: 列值列表（顺序对应行）
    start_row: 工作表中第一条值对应的行号
    col_letter: 列字母（如 'B'）
    """
    if not values:
        return
    run_start = 0          # 当前连续段起始下标（values 内）
    current = values[0]
    for i in range(1, len(values) + 1):
        # 当遍历到末尾或出现新值时，执行合并逻辑
        boundary = (i == len(values)) or (values[i] != current)
        if boundary:
            # 合并区间至少 2 行才需要合并
            if i - run_start > 1:
                ws.merge_cells(f"{col_letter}{start_row + run_start}:{col_letter}{start_row + i - 1}")
            # 准备下一段
            if i < len(values):
                current = values[i]
                run_start = i

wb = load_workbook(src)
for sheet_name in wb.sheetnames:
    ws = wb[sheet_name]
    customers, products = [], []
    # 假设数据从第 6 行开始，末尾有两行汇总不处理（按原脚本）
    for r in range(6, ws.max_row - 1):
        customers.append(ws[f"B{r}"].value)
        products.append(ws[f"C{r}"].value)
    merge_runs(ws, customers, 6, "B")
    merge_runs(ws, products, 6, "C")

wb.save(dst)
wb.close()
```

## 26. 批量为多个工作簿设置访问密码并另存（COM方式）

```python
import os, time, tkinter as tk
from tkinter import filedialog
import win32com.client

def protect_excel(src_path, dst_path, password="654321"):
    """使用 COM 另存加访问密码（不设置写保护）。"""
    excel = win32com.client.Dispatch("Excel.Application")
    excel.Visible = False
    excel.DisplayAlerts = False
    wb = excel.Workbooks.Open(src_path)
    # SaveAs 第 3、4 个参数为访问和写入密码；此处仅设置访问密码
    wb.SaveAs(dst_path, None, password, '')
    wb.Close()
    excel.Quit()

def select_dir(title):
    root = tk.Tk()
    root.withdraw()
    return filedialog.askdirectory(title=title)

src_dir = select_dir("选择待加密 Excel 所在文件夹")
dst_dir = select_dir("选择加密后输出文件夹")
os.makedirs(dst_dir, exist_ok=True)

for fname in os.listdir(src_dir):
    if fname.startswith("~$") or not fname.lower().endswith((".xls", ".xlsx")):
        continue
    src = os.path.join(src_dir, fname)
    dst = os.path.join(dst_dir, fname)
    try:
        protect_excel(src, dst)
        print("加密完成：", fname)
    except Exception as e:
        print("加密失败：", fname, e)
    time.sleep(0.3)      # 避免频繁打开关闭 Excel 导致资源竞争
```
