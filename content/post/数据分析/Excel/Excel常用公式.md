---
title: "Excel常用公式"
date: 2025-03-27
categories: ["数据分析","Office"]
tags: ["数据分析","Excel"]
summary: "Excel常用公式"
math: true
pin: true
---
```markmap
# 公式
## WHY
- 各工作簿之间无关系
- 各工作表之间无关系
- 单元格数据直接无关系

## WHAT
### $=PI()*1.2^2*A10$
- "=" 开头
- **公式**：`pi()` 返回值 3.141593
- **引用**：A10 返回A10单元格的数据
- **常量**：直接输入公式中的文本值或数值
- **运算符**: ^表示为乘方,"*"表示为乘号

## HOW
- 单元格直接输入，编辑栏输入（适合长公式）
- 依靠业务建立逻辑
- 单元格地址的引用
- 注意算术的优先级（算术运算符 > 文本运算符 > 关系运算符）
- 使用括号（改变优先级）

## 特点
- 计算准确，速度快捷
- 修改联动，自动更新
- 区别手动与自动效果

## 分类
- 普通公式
- 数据公式
- 命令公式(定义为名称的公式)

## 运算符
- 算术运算符：+，-，*，/，%，^
- 关系运算符：=，<，>，<>（不等于）
- 文本运算符：&

## 注意
### 单元格地址引用（<kbd>F4</kbd> 切换（相对→绝对→混合行→混合列））
- 相对引用：A4,C5:F8
- 绝对引用：\$A\$4,\$C\$5:\$F\$8
- 混合引用：A\$4,\$C5
### 查帮助
### <kbd>F9</kbd> 或公式求值
```

# 单元格地址引用

win：选中引用公式后按 <kbd>F4</kbd> 

mac：选中引用公式后按 <kbd>⌘Command</kbd>+<kbd>T</kbd>

引用类型：

- 相对引用：直接写行列标（如A1），公式拖动时行列同步变化
- 绝对引用：行列前加 $（如\$A\$1），公式拖动时固定引用位置
- 混合引用：
  - 锁定行（如A$1）：列变化行固定
  - 锁定列（如$A1）：行变化列固定
- 切换技巧：选中引用公式后按 <kbd>F4</kbd> 键可循环切换引用类型（相对→绝对→混合行→混合列）


# 公式错误

## 常见错误类型

除零错误( `#DIV/0!` )：

- "0" 作除数
- 对文本数据求平均

名称错误( `#NAME?` )：使用了未定义的名称，Excel无法识别公式中的文本标识符

值错误( `#VALUE!` )：函数参数类型不匹配（如用 `SQRT` 函数对文本"A5"开平方）

引用错误( `#REF!` )：公式引用了不存在的单元格

数字错误( `#NUM!` )：计算结果超出Excel处理范围

空值错误( `#NULL!` )：引用不存在的交集区域（如 =SUM(A7:A8 B7:B8) 两个区域无交集）

无效值错误( `#N/A` )：查找函数未找到匹配项（如 VLOOKUP 未查到结果）

## 错误值的应用

示例：统计养老金 ≥1000 元的年份数量

公式原理：=COUNT(0/(A1:A5>=1000))

- 逻辑判断 J2:J14>=1000 返回 TRUE(1)/FALSE(0)
- 0/TRUE=1(可计数)，0/FALSE=#DIV/0!(不计入)

应用原理：错误值数量反映不符合条件的记录数

注意事项：

- 单元格为 0 尝试键入 <kbd>Ctrl</kbd>+<kbd>⇧Shift</kbd>+<kbd>↵Enter</kbd>
- 一般使用条件统计 `COUNTIF` 函数：=COUNTIF(A1:A5, ">=1000")

# 跨工作表公式计算

引用语法：使用 "工作表名!单元格地址" 的格式引用其他工作表数据，如 "一班!B2" 表示引用 "一班" 工作表的 B2 单元格

叹号作用：叹号前是工作表名称，叹号后是具体引用的单元格地址，这是跨表引用的关键标识符

计算示例：计算四个班级语文平均分的公式为 =(一班!B2+二班!B2+三班!B2+四班!B2)/4 

# 公式追踪

追踪引用：

- 可以显示当前单元格引用的所有源数据单元格
- 点击 <button>公式</button> → 点击 <button>追踪引用单元格</button>

从属追踪：

- 可以查看哪些单元格引用了当前单元格的值
- 点击 <button>公式</button> → 点击 <button>追踪从属单元格</button>

取消追踪：删除箭头即删除所有追踪箭头

- 点击 <button>公式</button> → 点击 <button>删除箭头</button> （选择 <button>删除引用单元格追踪箭头</button>）
- 点击 <button>公式</button> → 点击 <button>删除箭头</button> （选择 <button>删除从属单元格追踪箭头</button>）

# 公式求值

功能描述：用于调试复杂公式，可单独计算公式的各个组成部分

操作步骤：点击 <button>公式</button> → 点击 <button>公式求值</button> → 逐步点击  <button>求值</button> 



## 单独查看部分公式结果

操作步骤：选中公式中需要查看的部分，按 <kbd>F9</kbd> 直接显示计算结果

注意事项：操作后需及时按 <kbd>Esc</kbd>，避免意外修改公式引用关系



# 常用函数

## 数学函数

| 功能                             | 函数名                                                       | 参数含义                                                     |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 将数字向下舍入到最接近的整数     | `INT(number)`                                                | `number`：要向下取整的数字                                   |
| 返回两数相除的余数               | `MOD(number, divisor)`                                       | `number`：被除数<br />`divisor`：除数                        |
| 将数字四舍五入到指定的位数       | `ROUND(number, num_digits)`                                  | `number`：要四舍五入的数字<br />`num_digits`：要保留的小数位数 |
| 向上舍入数字                     | `ROUNDUP(number, num_digits)`                                | `number`：要向上取整的数字<br />`num_digits`：要保留的小数位数 |
| 向下舍入数字                     | `ROUNDDOWN(number, num_digits)`                              | `number`：要向下取整的数字<br />`num_digits`：要保留的小数位数 |
| 返回 0 到 1 之间的随机数         | `RAND()`                                                     | 无参数                                                       |
| 返回指定范围之间的随机整数       | `RANDBETWEEN(bottom, top)`                                   | `bottom`：随机数范围的最小值<br />`top`：随机数范围的最大值  |
| 计算参数的总和                   | `SUM(number1, [number2], ...)`                               | `number1, number2, ...`：要求和的一个或多个数字              |
| 对满足条件的单元格求和           | `SUMIF(range, criteria, [sum_range])`                        | `range`：要应用条件的单元格区域<br />`criteria`：求和条件<br />`[sum_range]`：实际求和的单元格区域 |
| 对满足多个条件的单元格求和       | `SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)` | `sum_range`：实际求和的单元格区域<br />`criteria_range1`：第一个条件区域<br />`criteria1`：第一个条件<br />`[criteria_range2, criteria2]`：更多条件区域和条件 |
| 计算参数的乘积                   | `PRODUCT(number1, [number2], ...)`                           | `number1, number2, ...`：要相乘的一个或多个数字              |
| 返回数字的乘幂                   | `POWER(number, power)`                                       | `number`：底数<br />`power`：指数                            |
| 返回数字的平方根                 | `SQRT(number)`                                               | `number`：要计算平方根的数字                                 |
| 返回参数列表中的最大值           | `MAX(number1, [number2], ...)`                               | `number1, number2, ...`：要比较的一个或多个数字              |
| 返回参数列表中的最小值           | `MIN(number1, [number2], ...)`                               | `number1, number2, ...`：要比较的一个或多个数字              |
| 返回参数的平均值                 | `AVERAGE(number1, [number2], ...)`                           | `number1, number2, ...`：要计算平均值的一个或多个数字        |
| 返回满足条件的单元格的平均值     | `AVERAGEIF(range, criteria, [average_range])`                | `range`：要应用条件的单元格区域<br />`criteria`：平均条件<br />`[average_range]`：实际计算平均值的区域 |
| 返回满足多个条件的单元格的平均值 | `AVERAGEIFS(average_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)` | `average_range`：实际计算平均值的区域<br />`criteria_range1`：第一个条件区域<br />`criteria1`：第一个条件<br />`[criteria_range2, criteria2]`：更多条件区域和条件 |

## 统计函数

| 功能                                           | 函数名                                                       | 参数含义                                                     |
| ---------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 计算包含数字的单元格个数                       | `COUNT(value1, [value2], ...)`                               | `value1, value2, ...`：要计数的一个或多个值                  |
| 计算非空单元格的个数                           | `COUNTA(value1, [value2], ...)`                              | `value1, value2, ...`：要计数的一个或多个值                  |
| 计算指定区域中空白单元格的个数                 | `COUNTBLANK(range)`                                          | `range`：要检查空白单元格的区域                              |
| 计算满足条件的单元格个数                       | `COUNTIF(range, criteria)`                                   | `range`：要计数的单元格区域<br />`criteria`：计数条件        |
| 计算满足多个条件的单元格个数                   | `COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)` | `criteria_range1`：第一个条件区域<br />`criteria1`：第一个条件<br />`[criteria_range2, criteria2]`：更多条件区域和条件 |
| 以一列垂直数组返回一组数据的频率分布           | `FREQUENCY(data_array, bins_array)`                          | `data_array`：要计算频率的数据数组<br />`bins_array`：区间数组 |
| 返回某数字在一列数字中相对于其他数值的大小排名 | `RANK(number, ref, [order])`                                 | `number`：要排位的数字<br />`ref`：数字列表的引用<br />`[order]`：排位方式（0降序，1升序） |
| 返回数据集中第 k 个最大值                      | `LARGE(array, k)`                                            | `array`：数据数组<br />`k`：要返回的第k大值的位置            |
| 返回数据集中第 k 个最小值                      | `SMALL(array, k)`                                            | `array`：数据数组<br />`k`：要返回的第k小值的位置            |
| 返回给定数字的中位数                           | `MEDIAN(number1, [number2], ...)`                            | `number1, number2, ...`：要计算中位数的一个或多个数字        |
| 返回在某一数组或数据区域中出现频率最多的数值   | `MODE(number1, [number2], ...)`                              | `number1, number2, ...`：要计算众数的一个或多个数字          |
| 基于样本估算标准偏差                           | `STDEV(number1, [number2], ...)`                             | `number1, number2, ...`：要计算标准偏差的一个或多个数字      |
| 基于整个样本总体计算标准偏差                   | `STDEVP(number1, [number2], ...)`                            | `number1, number2, ...`：要计算标准偏差的一个或多个数字      |
| 基于样本计算方差                               | `VAR(number1, [number2], ...)`                               | `number1, number2, ...`：要计算方差的一个或多个数字          |
| 基于整个样本总体计算方差                       | `VARP(number1, [number2], ...)`                              | `number1, number2, ...`：要计算方差的一个或多个数字          |

## 日期和时间函数

| 功能                                 | 函数名                                          | 参数含义                                                     |
| ------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| 返回表示特定日期的连续序列号         | `DATE(year, month, day)`                        | `year`：年份<br />`month`：月份<br />`day`：日期             |
| 返回特定时间的序列号                 | `TIME(hour, minute, second)`                    | `hour`：小时<br />`minute`：分钟<br />`second`：秒           |
| 返回当前日期的序列号                 | `TODAY()`                                       | 无参数                                                       |
| 返回当前日期和时间的序列号           | `NOW()`                                         | 无参数                                                       |
| 返回日期中的年份                     | `YEAR(serial_number)`                           | `serial_number`：日期序列号                                  |
| 返回日期中的月份                     | `MONTH(serial_number)`                          | `serial_number`：日期序列号                                  |
| 返回日期中的天数                     | `DAY(serial_number)`                            | `serial_number`：日期序列号                                  |
| 返回时间中的小时数                   | `HOUR(serial_number)`                           | `serial_number`：时间序列号                                  |
| 返回时间中的分钟数                   | `MINUTE(serial_number)`                         | `serial_number`：时间序列号                                  |
| 返回时间中的秒数                     | `SECOND(serial_number)`                         | `serial_number`：时间序列号                                  |
| 返回某日期为星期几                   | `WEEKDAY(serial_number, [return_type])`         | `serial_number`：日期序列号<br />`[return_type]`：确定返回值类型的数字 |
| 返回一年中的周数                     | `WEEKNUM(serial_number, [return_type])`         | `serial_number`：日期序列号<br />`[return_type]`：确定星期从哪一天开始的数字 |
| 返回指定月数之前或之后的日期         | `EDATE(start_date, months)`                     | `start_date`：开始日期<br />`months`：月数                   |
| 返回指定月数之前或之后月份的最后一天 | `EOMONTH(start_date, months)`                   | `start_date`：开始日期<br />`months`：月数                   |
| 计算两个日期之间的天数、月数或年数   | `DATEDIF(start_date, end_date, unit)`           | `start_date`：开始日期<br />`end_date`：结束日期<br />`unit`：时间单位代码 |
| 返回指定工作日数之前或之后的日期     | `WORKDAY(start_date, days, [holidays])`         | `start_date`：开始日期<br />`days`：工作日天数<br />`[holidays]`：假日列表 |
| 返回两个日期之间的完整工作日数       | `NETWORKDAYS(start_date, end_date, [holidays])` | `start_date`：开始日期<br />`end_date`：结束日期<br />`[holidays]`：假日列表 |
| 返回两个日期之间的天数               | `DAYS(end_date, start_date)`                    | `end_date`：结束日期<br />`start_date`：开始日期             |

## 逻辑函数

| 功能                                                       | 函数名                                                       | 参数含义                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 根据条件测试返回不同的值                                   | `IF(logical_test, [value_if_true], [value_if_false])`        | `logical_test`：逻辑测试条件<br />`[value_if_true]`：条件为真时返回的值<br />`[value_if_false]`：条件为假时返回的值 |
| 检查是否满足一个或多个条件并返回与第一个 TRUE 条件对应的值 | `IFS(logical_test1, value_if_true1, [logical_test2, value_if_true2], ...)` | `logical_test1`：第一个条件<br />`value_if_true1`：第一个条件为真时返回的值<br />`[logical_test2, value_if_true2]`：更多条件和返回值 |
| 如果公式计算错误则返回指定的值，否则返回公式结果           | `IFERROR(value, value_if_error)`                             | `value`：要检查错误的公式<br />`value_if_error`：公式错误时返回的值 |
| 如果表达式解析为 #N/A，则返回指定值，否则返回表达式结果    | `IFNA(value, value_if_na)`                                   | `value`：要检查#N/A错误的公式<br />`value_if_na`：公式返回#N/A时返回的值 |
| 如果所有参数均为 TRUE，则返回 TRUE                         | `AND(logical1, [logical2], ...)`                             | `logical1, logical2, ...`：要测试的一个或多个条件            |
| 如果任一参数为 TRUE，则返回 TRUE                           | `OR(logical1, [logical2], ...)`                              | `logical1, logical2, ...`：要测试的一个或多个条件            |
| 返回所有参数的逻辑异或                                     | `XOR(logical1, [logical2], ...)`                             | `logical1, logical2, ...`：要测试的一个或多个条件            |
| 对其参数的逻辑求反                                         | `NOT(logical)`                                               | `logical`：要取反的逻辑值                                    |
| 根据值列表计算表达式并返回与第一个匹配值对应的结果         | `SWITCH(expression, value1, result1, [default_or_value2, result2], ...)` | `expression`：要比较的表达式<br />`value1`：第一个比较值<br />`result1`：第一个匹配值的结果<br />`[default_or_value2, result2]`：更多比较值和结果或默认值 |
| 返回逻辑值 TRUE                                            | `TRUE()`                                                     | 无参数                                                       |
| 返回逻辑值 FALSE                                           | `FALSE()`                                                    | 无参数                                                       |

## 文本函数

| 功能                                           | 函数名                                                       | 参数含义                                                     |
| ---------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 将数值转换为按指定格式显示的文本               | `TEXT(value, format_text)`                                   | `value`：要格式化的数值<br />`format_text`：格式代码         |
| 按给定次数重复文本                             | `REPT(text, number_times)`                                   | `text`：要重复的文本<br />`number_times`：重复次数           |
| 在文本字符串中用新文本替换旧文本               | `SUBSTITUTE(text, old_text, new_text, [instance_num])`       | `text`：原文本<br />`old_text`：要替换的旧文本<br />`new_text`：新文本<br />`[instance_num]`：指定替换第几次出现的旧文本 |
| 替换文本中的字符                               | `REPLACE(old_text, start_num, num_chars, new_text)`          | `old_text`：原文本<br />`start_num`：开始位置<br />`num_chars`：要替换的字符数<br />`new_text`：新文本 |
| 返回文本字符串中的字符数                       | `LEN(text)`                                                  | `text`：要计算长度的文本                                     |
| 将多个文本项连接到一个文本项中                 | `CONCATENATE(text1, [text2], ...)`                           | `text1, text2, ...`：要连接的一个或多个文本项                |
| 将多个文本字符串连接成一个字符串               | `CONCAT(text1, [text2], ...)`                                | `text1, text2, ...`：要连接的一个或多个文本字符串            |
| 使用分隔符连接文本字符串列表                   | `TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)`     | `delimiter`：分隔符<br />`ignore_empty`：是否忽略空单元格<br />`text1, text2, ...`：要连接的文本字符串 |
| 检查两个文本值是否完全相同                     | `EXACT(text1, text2)`                                        | `text1`：第一个文本<br />`text2`：第二个文本                 |
| 在一个文本值中查找另一个文本值（区分大小写）   | `FIND(find_text, within_text, [start_num])`                  | `find_text`：要查找的文本<br />`within_text`：包含要查找文本的文本<br />`[start_num]`：开始查找的位置 |
| 在一个文本值中查找另一个文本值（不区分大小写） | `SEARCH(find_text, within_text, [start_num])`                | `find_text`：要查找的文本<br />`within_text`：包含要查找文本的文本<br />`[start_num]`：开始查找的位置 |
| 从文本字符串中的指定位置开始返回特定数目的字符 | `MID(text, start_num, num_chars)`                            | `text`：原文本<br />`start_num`：开始位置<br />`num_chars`：要提取的字符数 |
| 返回文本值中最左边的字符                       | `LEFT(text, [num_chars])`                                    | `text`：原文本<br />`[num_chars]`：要提取的字符数            |
| 返回文本值中最右边的字符                       | `RIGHT(text, [num_chars])`                                   | `text`：原文本<br />`[num_chars]`：要提取的字符数            |
| 删除文本中的空格                               | `TRIM(text)`                                                 | `text`：要删除空格的文本                                     |
| 将文本转换为小写                               | `LOWER(text)`                                                | `text`：要转换的文本                                         |
| 将文本转换为大写                               | `UPPER(text)`                                                | `text`：要转换的文本                                         |
| 将文本值的每个字的首字母大写                   | `PROPER(text)`                                               | `text`：要转换的文本                                         |
| 将文本参数转换为数字                           | `VALUE(text)`                                                | `text`：要转换为数字的文本                                   |
| 使用行和列分隔符拆分文本字符串                 | `TEXTSPLIT(text, col_delimiter, [row_delimiter], [ignore_empty], [match_mode], [pad_with])` | `text`：要拆分的文本<br />`col_delimiter`：列分隔符<br />`[row_delimiter]`：行分隔符<br />`[ignore_empty]`：是否忽略空单元格<br />`[match_mode]`：匹配模式<br />`[pad_with]`：填充值 |

## 查找与引用函数

| 功能                                                 | 函数名                                                       | 参数含义                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 在数组第一列中查找，然后在行之间移动以返回单元格的值 | `VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])` | `lookup_value`：要查找的值<br />`table_array`：查找表格区域<br />`col_index_num`：返回值的列索引<br />`[range_lookup]`：近似匹配或精确匹配 |
| 在数组第一行中查找，然后在列之间移动以返回单元格的值 | `HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])` | `lookup_value`：要查找的值<br />`table_array`：查找表格区域<br />`row_index_num`：返回值的行索引<br />`[range_lookup]`：近似匹配或精确匹配 |
| 返回表格或区域中的值或值的引用（已知值找位置）       | `INDEX(array, row_num, [column_num])`                        | `array`：单元格区域或数组<br />`row_num`：行号<br />`[column_num]`：列号 |
| 在引用或数组中查找值（已知位置找值）                 | `MATCH(lookup_value, lookup_array, [match_type])`            | `lookup_value`：要查找的值<br />`lookup_array`：查找区域<br />`[match_type]`：匹配类型 |
| 从给定引用中返回引用偏移量                           | `OFFSET(reference, rows, cols, [height], [width])`           | `reference`：基准单元格<br />`rows`：上下偏移行数<br />`cols`：左右偏移列数<br />`[height]`：返回引用的高度<br />`[width]`：返回引用的宽度 |
| 返回由文本字符串指定的引用                           | `INDIRECT(ref_text, [a1])`                                   | `ref_text`：文本形式的单元格引用<br />`[a1]`：引用样式       |
| 在范围或数组中搜索匹配项，并返回相应的项             | `XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])` | `lookup_value`：要查找的值<br />`lookup_array`：查找数组<br />`return_array`：返回数组<br />`[if_not_found]`：未找到时的返回值<br />`[match_mode]`：匹配模式<br />`[search_mode]`：搜索模式 |
| 返回项目在数组或单元格区域中的相对位置               | `XMATCH(lookup_value, lookup_array, [match_mode], [search_mode])` | `lookup_value`：要查找的值<br />`lookup_array`：查找数组<br />`[match_mode]`：匹配模式<br />`[search_mode]`：搜索模式 |
| 从值列表中选择值                                     | `CHOOSE(index_num, value1, [value2], ...)`                   | `index_num`：索引号<br />`value1, value2, ...`：值列表       |
| 返回引用的行号                                       | `ROW([reference])`                                           | `[reference]`：单元格引用                                    |
| 返回引用的列号                                       | `COLUMN([reference])`                                        | `[reference]`：单元格引用                                    |
| 返回引用中的行数                                     | `ROWS(array)`                                                | `array`：单元格区域或数组                                    |
| 返回引用中的列数                                     | `COLUMNS(array)`                                             | `array`：单元格区域或数组                                    |
| 返回数组的转置                                       | `TRANSPOSE(array)`                                           | `array`：要转置的数组或区域                                  |
| 基于定义的条件筛选数据区域                           | `FILTER(array, include, [if_empty])`                         | `array`：要筛选的区域或数组<br />`include`：筛选条件<br />`[if_empty]`：无结果时返回的值 |
| 对区域或数组的内容进行排序                           | `SORT(array, [sort_index], [sort_order], [by_col])`          | `array`：要排序的区域或数组<br />`[sort_index]`：排序依据的列/行索引<br />`[sort_order]`：排序顺序<br />`[by_col]`：按列排序还是按行排序 |
| 根据相应区域或数组中的值对区域或数组的内容进行排序   | `SORTBY(array, by_array1, [sort_order1], [by_array2, sort_order2],...)` | `array`：要排序的区域或数组<br />`by_array1`：第一个排序依据数组<br />`[sort_order1]`：第一个排序顺序<br />`[by_array2, sort_order2]`：更多排序依据和顺序 |
| 返回列表或区域中的唯一值列表                         | `UNIQUE(array, [by_col], [exactly_once])`                    | `array`：要提取唯一值的区域或数组<br />`[by_col]`：按列比较还是按行比较<br />`[exactly_once]`：是否只返回出现一次的值 |

# 常用函数应用

## 计算两列数据相同个数

>  =COUNT(MATCH(左列数据, 右列数据, 0))

MATCH(左列数据, 右列数据, 0) 结果为 (#N/A;4;5;#N/A;1;2) 表示左列数据在右列数据的行号，#N/A表示不匹配

## 提取姓名（学号姓名交替成行）

>  =INDEX(目标列, (ROW()-1)*2)





