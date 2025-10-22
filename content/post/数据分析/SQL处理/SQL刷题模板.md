---
title: "SQL刷题模板"
date: 2025-06-01
categories: ["数据库"]
tags: ["数据分析","数据库","SQL","刷题模板"]
summary: "SQL 常见题目刷题模板"
---

# 类型一：时间间隔类问题

## 通用思路

1. **处理日期格式后进行排序**：
    ```sql
    ROW_NUMBER() OVER (
        PARTITION BY 用户编号
        ORDER BY 时间
    ) AS 日期排序
    ```
2. **求出相邻时间的差值**:
   
   a. 序号错位相减：
    ```sql
    SELECT
        b.日期 - a.日期 AS 时间差
    FROM a
    LEFT JOIN b ON (
        a.日期排序 = b.日期排序 - 1
    )
    ```

   b. 窗口函数 `LAG()`：
    ```sql
    DATEDIFF(
        日期,
        LAG(日期,1) OVER (
            PARTITION BY 用户
            ORDER BY 日期
        )
    )
    ```
3. **根据题目要求，求出相应数据指标**

## 模板题：浏览时间之差
**求每个用户相邻两次浏览时间间隔小于 1500 分钟的次数**

**数据原表**：
<table>
  <thead>
    <tr>
      <th>user_id</th>
      <th>sign_date</th>
      <th>continues_time</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1001</td><td>2023-08-01</td><td>09:00:00</td></tr>
    <tr><td>1002</td><td>2023-08-01</td><td>10:30:00</td></tr>
    <tr><td>1003</td><td>2023-08-01</td><td>11:45:00</td></tr>
    <tr><td>1004</td><td>2023-08-01</td><td>14:20:00</td></tr>
    <tr><td>1001</td><td>2023-08-02</td><td>08:39:00</td></tr>
    <tr><td>1002</td><td>2023-08-02</td><td>11:15:00</td></tr>
    <tr><td>1003</td><td>2023-08-02</td><td>13:49:00</td></tr>
    <tr><td>1004</td><td>2023-08-02</td><td>15:50:00</td></tr>
    <tr><td>1001</td><td>2023-08-03</td><td>10:00:00</td></tr>
    <tr><td>1002</td><td>2023-08-03</td><td>12:30:00</td></tr>
    <tr><td>1003</td><td>2023-08-03</td><td>14:10:00</td></tr>
    <tr><td>1004</td><td>2023-08-03</td><td>16:45:00</td></tr>
    <tr><td>1001</td><td>2023-08-04</td><td>09:45:00</td></tr>
    <tr><td>1002</td><td>2023-08-04</td><td>12:15:00</td></tr>
    <tr><td>1003</td><td>2023-08-04</td><td>14:30:00</td></tr>
    <tr><td>1004</td><td>2023-08-04</td><td>16:20:00</td></tr>
    <tr><td>1001</td><td>2023-08-05</td><td>18:00:00</td></tr>
    <tr><td>1002</td><td>2023-08-05</td><td>12:40:00</td></tr>
  </tbody>
</table>

**建表语句**：
```sql
CREATE TABLE continues_time (
    sign_date DATE,
    user_id INT,
    continues_time TIME
);
INSERT INTO continues_time (sign_date, user_id, continues_time)
VALUES
('2023-08-01', 1001, '09:00:00.0'),
('2023-08-01', 1002, '10:30:00.0'),
('2023-08-01', 1003, '11:45:00.0'),
('2023-08-01', 1004, '14:20:00.0'),
('2023-08-02', 1001, '08:39:00.0'),
('2023-08-02', 1002, '11:15:00.0'),
('2023-08-02', 1003, '13:49:00.0'),
('2023-08-02', 1004, '15:50:00.0'),
('2023-08-03', 1001, '10:00:00.0'),
('2023-08-03', 1002, '12:30:00.0'),
('2023-08-03', 1003, '14:10:00.0'),
('2023-08-03', 1004, '16:45:00.0'),
('2023-08-04', 1001, '09:45:00.0'),
('2023-08-04', 1002, '12:15:00.0'),
('2023-08-04', 1003, '14:30:00.0'),
('2023-08-04', 1004, '16:20:00.0'),
('2023-08-05', 1001, '18:00:00.0'),
('2023-08-05', 1002, '12:40:00.0');
```

**参考结果**：
<table>
  <thead>
    <tr>
      <th>user_id</th>
      <th>cnt</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1001</td><td>2</td></tr>
    <tr><td>1002</td><td>3</td></tr>
    <tr><td>1003</td><td>2</td></tr>
    <tr><td>1004</td><td>2</td></tr>
  </tbody>
</table>

**解题思路**：
1. 按照用户分组，对浏览时间进行排序，再用 `left join` 连接两表，利用排序差值，形成错位相减形式
<table>
  <thead>
    <tr>
      <th>user_id</th>
      <th>DATETIME</th>
      <th>num</th>
      <th>DATETIME(1)</th>
      <th>num(1)</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1001</td><td>2023-08-01 09:00:00</td><td>1</td><td>2023-08-02 08:39:00</td><td>2</td></tr>
    <tr><td>1001</td><td>2023-08-02 08:39:00</td><td>2</td><td>2023-08-03 10:00:00</td><td>3</td></tr>
    <tr><td>1001</td><td>2023-08-03 10:00:00</td><td>3</td><td>2023-08-04 09:45:00</td><td>4</td></tr>
    <tr><td>1001</td><td>2023-08-04 09:45:00</td><td>4</td><td>2023-08-05 18:00:00</td><td>5</td></tr>
    <tr><td>1001</td><td>2023-08-05 18:00:00</td><td>5</td><td>(Null)</td><td>(Null)</td></tr>
    <tr><td>1002</td><td>2023-08-01 10:30:00</td><td>1</td><td>2023-08-02 11:15:00</td><td>2</td></tr>
    <tr><td>1002</td><td>2023-08-02 11:15:00</td><td>2</td><td>2023-08-03 12:30:00</td><td>3</td></tr>
  </tbody>
</table>

2. 利用错位相减计算出时间间隔分钟数，并筛选出小于 1500 min 的数据
3. 最后用 `COUNT()` 函数计数输出结果

**参考代码**：

a. 序号错位相减：
```sql
-- 目标：统计在同一用户内，相邻两次打点（日期+时间）差值 < 1500 分钟的记录数量（步聚 3 所需指标）
-- 步骤 1：日期排序 —— 为每个用户的时间记录按时间顺序分配行号 ROW_NUMBER()
WITH a AS (
    SELECT
        user_id,
        UNIX_TIMESTAMP(CONCAT(sign_date, ' ', continues_time)) AS unix_timestamp,  -- 将日期与时间合并为时间戳，便于差值计算
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY CONCAT(sign_date, ' ', continues_time)
        ) AS num  -- 步骤 1：日期排序生成的序号
    FROM continues_time
),
b AS (
    -- 与 CTE a 相同：用于实现 “序号错位” 自连接（步骤 2a）
    SELECT
        user_id,
        UNIX_TIMESTAMP(CONCAT(sign_date, ' ', continues_time)) AS unix_timestamp,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY CONCAT(sign_date, ' ', continues_time)
        ) AS num
    FROM continues_time
)
SELECT
    a.user_id,
    COUNT(a.user_id) AS cnt  -- 步骤 3：根据题目要求统计满足条件的次数
FROM a
LEFT JOIN b ON a.user_id = b.user_id
    AND a.num = b.num - 1      -- 步骤 2a：序号错位相减：将当前行与“下一行”配对
WHERE
    (b.unix_timestamp - a.unix_timestamp)/60 < 1500  -- 步骤 2：计算相邻时间差（单位：分钟）并筛选
GROUP BY a.user_id;
```

b. 窗口函数 `LAG()`：
```sql
-- 目标相同：统计同一用户内，相邻两次时间差 < 1500 分钟的记录数量
WITH base AS (
    SELECT
        user_id,
        UNIX_TIMESTAMP(CONCAT(sign_date, ' ', continues_time)) AS unix_timestamp,
        LAG(UNIX_TIMESTAMP(CONCAT(sign_date, ' ', continues_time)), 1) OVER (
            PARTITION BY user_id
            ORDER BY CONCAT(sign_date, ' ', continues_time)
        ) AS prev_unix_timestamp  -- 步骤 2b：窗口函数 LAG() 获取“上一条”时间戳
    FROM continues_time
)
SELECT
    user_id,
    COUNT(*) AS cnt  -- 步骤 3：统计满足相邻差值条件的次数
FROM base
WHERE
    prev_datetime IS NOT NULL
    AND (unix_timestamp - prev_unix_timestamp)/60 < 1500  -- 步骤 2b：计算与上一条的时间差（分钟）
GROUP BY user_id;
```

## 难题：最大间隔连续登录
**计算每个用户最大的连续登录天数，（间隔一天也算连续）**

解释：如果一个用户在 1,3,5,6 登录游戏，则视为连续 6 天登录

**数据原表**：
<table>
  <thead>
    <tr>
      <th>user_id</th>
      <th>login_datetime</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>100</td><td>2021-12-01 19:00:00</td></tr>
    <tr><td>100</td><td>2021-12-01 19:30:00</td></tr>
    <tr><td>100</td><td>2021-12-02 21:01:00</td></tr>
    <tr><td>100</td><td>2021-12-03 11:01:00</td></tr>
    <tr><td>101</td><td>2021-12-01 19:05:00</td></tr>
    <tr><td>101</td><td>2021-12-01 21:05:00</td></tr>
  </tbody>
</table>

**参考结果**：
<table>
  <thead>
    <tr>
      <th>user_id</th>
      <th>start_login_date</th>
      <th>day_count</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>100</td><td>2021-12-01</td><td>7</td></tr>
    <tr><td>100</td><td>2021-12-10</td><td>2</td></tr>
    <tr><td>101</td><td>2021-12-01</td><td>6</td></tr>
    <tr><td>102</td><td>2021-12-01</td><td>3</td></tr>
    <tr><td>104</td><td>2021-12-02</td><td>3</td></tr>
    <tr><td>105</td><td>2021-12-01</td><td>1</td></tr>
    <tr><td>105</td><td>2021-12-09</td><td>4</td></tr>
  </tbody>
</table>

**解题思路**：
1. 对数据原表进行数据清洗，去重和日期格式转换
2. 按照用户 id 维度，对日期进行分组排序，并用 `lag()` 函数求出时间间隔
3. 判断时间间隔是否 >2 天，用 `sum()` 函数累计求和，为间隔天数分组
4. 最后根据用户 id + part_id，统计每部分连续登录日期的天数。因为是含有间隔，
故使用 `max(time) - min(time) + 1` 来计算分组内的连续登录天数

**参考代码**：
```sql
-- 关键步骤：
--   步骤 1：提取“去重后的登录日期”（按天）；
--   步骤 2：计算与上一登录日期的差值 diffdate（单位：天）；
--   步骤 3：根据 diffdate > 2 标记新的分段 part_id（累积求和实现分段编号）；
--   步骤 4：按用户与分段聚合得到开始日期、结束日期并计算连续跨度 day_count（含缺失天的跨距 = MAX - MIN + 1）。

WITH distinct_login_dates AS (  -- 步骤 1：规范化为日期粒度并去重
    SELECT
        user_id,
        DATE_FORMAT(login_datetime, '%Y-%m-%d') AS login_date
    FROM login_events
    GROUP BY
        user_id,
        DATE_FORMAT(login_datetime, '%Y-%m-%d')
),
diff_calc AS (  -- 步骤 2：计算与上一条日期的间隔（天）
    SELECT
        user_id,
        login_date,
        DATEDIFF(
            login_date,
            LAG(login_date, 1) OVER (
                PARTITION BY user_id
                ORDER BY login_date
            )
        ) AS diffdate
    FROM distinct_login_dates
),
partitions AS (  -- 步骤 3：累积分段编号（间隔 > 2 天则开启新分段）
    SELECT
        user_id,
        login_date AS login_datetime,  -- 保留原字段命名风格（原代码后续称为 login_datetime）
        SUM(
            IF(diffdate > 2, 1, 0)
        ) OVER (
            PARTITION BY user_id
            ORDER BY login_date
        ) AS part_id,
        diffdate
    FROM diff_calc
),
aggregated AS (  -- 步骤 4：对每个分段做聚合
    SELECT
        user_id,
        part_id,
        MIN(login_datetime) AS start_login_date,
        MAX(login_datetime) AS end_login_date,
        DATEDIFF(MAX(login_datetime), MIN(login_datetime)) + 1 AS day_count
    FROM partitions
    GROUP BY
        user_id,
        part_id
)
SELECT
    user_id,
    start_login_date,
    day_count
FROM aggregated;
```

# 类型二：连续类问题

## 解题思路
1. **处理区间（比如时间去重、格式化等操作）并进行区间范围选定/条件**：方便转化成连续登录问题的操作
2. 对**计算区间连续锚点（anchor/dense）**：在严格连续的整数序列中，值与其行号的差是常量；用该常量（anchor/dense）作为分段键，再聚合得到每段的起止与长度
3. **分组统计**：分组统计区间数，筛选出长度最大（或指定长度）的片段
4. 注意每道题的**区间条件**和**特殊处理**

## 模板题：连续登录问题
**求每个用户近一周内最大连续活跃天数**

**数据原表**：
<table>
  <thead>
    <tr>
      <th>continues_time.event_date</th>
      <th>continues_time.user_id</th>
      <th>continues_time.time</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>2023-08-01</td><td>1001</td><td>2023-08-01 09:00:00.0</td></tr>
    <tr><td>2023-08-01</td><td>1002</td><td>2023-08-01 10:30:00.0</td></tr>
    <tr><td>2023-08-01</td><td>1003</td><td>2023-08-01 11:45:00.0</td></tr>
    <tr><td>2023-08-01</td><td>1004</td><td>2023-08-01 14:20:00.0</td></tr>
    <tr><td>2023-08-02</td><td>1001</td><td>2023-08-02 08:30:00.0</td></tr>
    <tr><td>2023-08-02</td><td>1002</td><td>2023-08-02 11:15:00.0</td></tr>
    <tr><td>2023-08-02</td><td>1003</td><td>2023-08-02 13:40:00.0</td></tr>
    <tr><td>2023-08-02</td><td>1004</td><td>2023-08-02 15:50:00.0</td></tr>
    <tr><td>2023-08-03</td><td>1001</td><td>2023-08-03 10:00:00.0</td></tr>
    <tr><td>2023-08-03</td><td>1002</td><td>2023-08-03 12:30:00.0</td></tr>
  </tbody>
</table>

**参考结果**：

**解题思路**：
1. 对当日重复登录的用户去重，并通过 DATEDIFF(CURRENT_DATE(), event_date) <= 7 计算 “近一周” 这个范围
2. 计算`dense_date`：`DATE_SUB(event_date, rn)`，若不是相同常量则出现分段
3. 分组统计连续登录天数，筛选出最大登录天数

**参考代码**：
```sql
WITH recent AS (  -- 去重 + 近 7 天
    SELECT DISTINCT
        user_id,
        event_date
    FROM continues_time
    WHERE DATEDIFF(CURRENT_DATE(), event_date) <= 7
),
seq AS (  -- 计算锚点 + 段内长度
    SELECT
        user_id,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY event_date
        ) AS rn,
        DATE_SUB(event_date, rn) AS dense_date
    FROM recent
),
seg AS (
    SELECT
        user_id,
        dense_date,
        COUNT(*) AS seg_len
    FROM seq
    GROUP BY
        user_id,
        dense_date
)
SELECT
    user_id,
    MAX(seg_len) AS result
FROM seg
GROUP BY user_id;
```
**注意问题**：
- MySQL 需要 `DATE_SUB(date, INTERVAL 'n DAY')` ：比如，DATE_SUB(CURRENT_DATE(), INTERVAL '7 DAY')

# 类型三：top N 问题

## 解题思路
1. 对题目条件进行分组聚合排序：聚合排序因题目条件不同而不同
   - 只要唯一第 N 行（编号唯一，且可能丢弃与第 N 名并列的行）：`ROW_NUMBER`
   - 保留并列（编号不唯一，跳号无所谓）：`RANK`
   - 保留并列且不跳号（编号不唯一，不丢弃与第 N 名并列的行）：`DENSE_RANK`
   - 需要百分比/比例：`PERCENT_RANK`（当前行数-1 / 窗口分区总行数-1） 或 `CUME_DIST`（当前行数 / 窗口分区总行数）
2. 选出符合条件的前 N 项记录

```sql
WITH ranked AS (
  SELECT
    user_id,
    score,
    ROW_NUMBER() OVER (
        PARTITION BY user_id 
        ORDER BY score 
        DESC
    ) AS rn
  FROM score_table
)
SELECT *
FROM ranked
WHERE rn <= N;
```

# 类型四：累计类问题

## 解题思路

全部转换成窗口问题 + 设定窗口范围（注意窗口帧的应用）

1. 窗口帧定义两种形式（SQL Standard）：
   - 简写（只有起点）：`ROWS 起点`
   - BETWEEN AND 形式（给出起点与终点）：`ROWS BETWEEN 起点 AND 终点`
2. 起点/终点 可取值（起点不能在终点后面）：
   - `UNBOUNDED PRECEDING`（从分区第一行）（默认）
   - `n PRECEDING`（往前 n 行）
   - `CURRENT ROW`（当前行）
   - `n FOLLOWING`（往后 n 行）
   - `UNBOUNDED FOLLOWING`（到分区最后一行）

## 模板题：统计截止到每个月份的营业总额

**数据原表**：
<table>
  <thead>
    <tr>
      <th>count_money.time</th>
      <th>count_money.money</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>2022-01-01</td><td>1000</td></tr>
    <tr><td>2022-02-01</td><td>1500</td></tr>
    <tr><td>2022-03-01</td><td>2000</td></tr>
    <tr><td>2022-04-01</td><td>1200</td></tr>
    <tr><td>2022-05-01</td><td>1800</td></tr>
    <tr><td>2022-06-01</td><td>2200</td></tr>
    <tr><td>2022-07-01</td><td>1700</td></tr>
    <tr><td>2022-08-01</td><td>1900</td></tr>
    <tr><td>2022-09-01</td><td>2300</td></tr>
    <tr><td>2022-10-01</td><td>2500</td></tr>
  </tbody>
</table>

**建表语句**：
```sql
-- 建表
CREATE TABLE event_log (
    event        BIGINT,
    event_type   VARCHAR(50),
    event_time   TIMESTAMP
);

-- 插入示例数据
INSERT INTO event_log (event, event_type, event_time) VALUES
(1037176,'首次','2024-04-27 22:10:00'),
(1037176,'催催','2024-04-28 10:20:00'),
(1037176,'砸开','2024-04-28 18:42:00'),
(1037176,'催催','2024-04-28 18:49:00'),
(1037176,'首次','2024-04-29 10:20:00'),
(1037177,'首次','2024-04-29 10:20:00'),
(1037176,'催催','2024-05-01 10:20:00'),
(1037177,'砸开','2024-04-30 10:20:00'),
(1037176,'催催','2024-05-01 17:20:00'),
(1037176,'首次','2024-05-02 10:20:00'),
(1037177,'催催','2024-05-01 10:20:00');
```

**参考结果**：
<table>
  <thead>
    <tr>
      <th>time</th>
      <th>sum_window</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>2022-01-01</td><td>1000</td></tr>
    <tr><td>2022-02-01</td><td>2500</td></tr>
    <tr><td>2022-03-01</td><td>4500</td></tr>
    <tr><td>2022-04-01</td><td>5700</td></tr>
    <tr><td>2022-05-01</td><td>7500</td></tr>
    <tr><td>2022-06-01</td><td>9700</td></tr>
    <tr><td>2022-07-01</td><td>11400</td></tr>
    <tr><td>2022-08-01</td><td>13300</td></tr>
    <tr><td>2022-09-01</td><td>15600</td></tr>
    <tr><td>2022-10-01</td><td>18100</td></tr>
  </tbody>
</table>

**解题思路**：
统计从 2022.01 月份到 2023.08 月份，截止到窗口当前行月份的营业总额

**参考代码**：
```sql
SELECT
    count_money.time,
    SUM(count_money.money) OVER (
        ORDER BY count_money.time
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cum_money
FROM count_money
ORDER BY time;
```

# 类型五：排序类问题

## 解题思路
TODO
## 模板题：当出现首次则重新从 1 开始排序

**数据原表**：
<table>
  <thead>
    <tr>
      <th>event</th>
      <th>event_type</th>
      <th>event_time</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1037176</td><td>首次</td><td>2024-04-27 22:10:00</td></tr>
    <tr><td>1037176</td><td>催催</td><td>2024-04-28 10:20:00</td></tr>
    <tr><td>1037176</td><td>砸开</td><td>2024-04-28 18:42:00</td></tr>
    <tr><td>1037176</td><td>催催</td><td>2024-04-28 18:49:00</td></tr>
    <tr><td>1037176</td><td>首次</td><td>2024-04-29 10:20:00</td></tr>
    <tr><td>1037177</td><td>首次</td><td>2024-04-29 10:20:00</td></tr>
    <tr><td>1037176</td><td>催催</td><td>2024-05-01 10:20:00</td></tr>
    <tr><td>1037177</td><td>砸开</td><td>2024-04-30 10:20:00</td></tr>
    <tr><td>1037176</td><td>催催</td><td>2024-05-01 17:20:00</td></tr>
    <tr><td>1037176</td><td>首次</td><td>2024-05-02 10:20:00</td></tr>
    <tr><td>1037177</td><td>催催</td><td>2024-05-01 10:20:00</td></tr>
  </tbody>
</table>

**参考结果**：
<table>
  <thead>
    <tr>
      <th>event</th>
      <th>event_time</th>
      <th>event_type</th>
      <th>rn</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1037176</td><td>2024-04-27 22:10:00</td><td>首次</td><td>1</td></tr>
    <tr><td>1037176</td><td>2024-04-28 10:20:00</td><td>催催</td><td>2</td></tr>
    <tr><td>1037176</td><td>2024-04-28 18:42:00</td><td>砸开</td><td>3</td></tr>
    <tr><td>1037176</td><td>2024-04-28 18:49:00</td><td>催催</td><td>4</td></tr>
    <tr><td>1037176</td><td>2024-04-29 10:20:00</td><td>首次</td><td>1</td></tr>
    <tr><td>1037176</td><td>2024-05-01 10:20:00</td><td>催催</td><td>2</td></tr>
    <tr><td>1037176</td><td>2024-05-01 17:20:00</td><td>催催</td><td>3</td></tr>
    <tr><td>1037176</td><td>2024-05-02 10:20:00</td><td>首次</td><td>1</td></tr>
    <tr><td>1037177</td><td>2024-04-29 10:20:00</td><td>首次</td><td>1</td></tr>
    <tr><td>1037177</td><td>2024-04-30 10:20:00</td><td>砸开</td><td>2</td></tr>
    <tr><td>1037177</td><td>2024-05-01 10:20:00</td><td>催催</td><td>3</td></tr>
  </tbody>
</table>

**解题思路**：
1. 按照 event 分组，按时间排序，类型是遇到首次就重新从 1 开始排
序，需要对首次进行数字分组，利用 `SUM()` 函数，遇到首次就会+1；
2. 再用 `ROW_NUMBER()` 函数，按照 event, part_id 分组，event_time 排序；

**参考代码**：
```sql
WITH part AS (
    SELECT
        event,
        event_type,
        event_time,
        -- 分段编号：每遇到 '首次' 累加
        SUM(CASE WHEN event_type = '首次' THEN 1 ELSE 0 END)
            OVER (PARTITION BY event ORDER BY event_time) AS part_id
    FROM event_log
)
SELECT
    event,
    event_time,
    event_type,
    ROW_NUMBER() OVER (PARTITION BY event, part_id ORDER BY event_time) AS rn
FROM part
ORDER BY event, event_time;
```

# 类型六：同时类问题
## 解题思路

将每个用户的**登录时间**和**退出时间**变成两个不同的时间点，按照时间从小到大的顺序有序排列，**登录的时候就给在线人数+1**，**退出的时候在线人数-1**，每个时间点都有一个在线人数，如图所示：
<table>
  <thead>
    <tr>
      <th>时间</th>
      <th>登录用户</th>
      <th>同时在线人数</th>
      <th>计算过程（登录+1，退出-1）</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>19:00:00</td>
      <td>AE</td>
      <td>2</td>
      <td>A、E登录，累计值为2</td>
    </tr>
    <tr>
      <td>19:06:00</td>
      <td>ABCE</td>
      <td>4</td>
      <td>B、C登录，且A、E未退出，累计值为4</td>
    </tr>
    <tr>
      <td>19:12:00</td>
      <td>ABC</td>
      <td>3</td>
      <td>E退出，A、B、C未退出，累计值为3</td>
    </tr>
    <tr>
      <td>19:18:00</td>
      <td>BD</td>
      <td>2</td>
      <td>A、C退出，原有累计值减2，D登录+1</td>
    </tr>
    <tr>
      <td>19:24:00</td>
      <td>D</td>
      <td>1</td>
      <td>B退出，原有累计值减1</td>
    </tr>
  </tbody>
</table>

这样题目就变成一个由用户的登录和退出时间组成的有序的时间序列，求对应的在线人数的累加问题，用窗口函数 `SUM()` 解决

## 模板题：直播各科目同时在线人数

某APP推出大型在线直播课，用户可以选择报名任意一场或多场直播课。请统计每个科目最大同时在线人数（按 `course_id` 排序）

**数据源表**：

课程表 course_tb：包含课程编号 course_id、课程名称 course_name、上课时间（直播开始结束时间段）course_datetime
<table>
  <caption><strong>course_tb（课程信息）</strong></caption>
  <thead>
    <tr>
      <th>course_id</th>
      <th>course_name</th>
      <th>course_datetime</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Python</td><td>2021-12-1 19:00-21:00</td></tr>
    <tr><td>2</td><td>SQL</td><td>2021-12-2 19:00-21:00</td></tr>
    <tr><td>3</td><td>R</td><td>2021-12-3 19:00-21:00</td></tr>
  </tbody>
</table>

上课情况表 attend_tb：记录用户进入与离开某课程直播间的时间；包含用户编号 user_id、课程编号 course_id、进入时间 in_datetime、离开时间 out_datetime
<table>
  <caption><strong>attend_tb（用户进入/离开直播间记录）</strong></caption>
  <thead>
    <tr>
      <th>user_id</th>
      <th>course_id</th>
      <th>in_datetime</th>
      <th>out_datetime</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>100</td><td>1</td><td>2021-12-01 19:00:22</td><td>2021-12-01 19:28:00</td></tr>
    <tr><td>101</td><td>1</td><td>2021-12-01 19:30:21</td><td>2021-12-01 19:53:00</td></tr>
    <tr><td>102</td><td>1</td><td>2021-12-01 19:50:22</td><td>2021-12-01 20:55:00</td></tr>
    <tr><td>103</td><td>1</td><td>2021-12-01 19:10:21</td><td>2021-12-01 19:50:00</td></tr>
    <tr><td>104</td><td>2</td><td>2021-12-02 19:08:55</td><td>2021-12-02 20:25:00</td></tr>
    <tr><td>105</td><td>2</td><td>2021-12-02 19:12:32</td><td>2021-12-02 20:58:00</td></tr>
    <tr><td>106</td><td>2</td><td>2021-12-02 19:05:18</td><td>2021-12-02 20:43:00</td></tr>
    <tr><td>107</td><td>3</td><td>2021-12-03 19:02:13</td><td>2021-12-03 21:08:00</td></tr>
    <tr><td>108</td><td>3</td><td>2021-12-03 19:12:03</td><td>2021-12-03 19:52:00</td></tr>
  </tbody>
</table>

**参考结果**：
<table>
  <thead>
    <tr>
      <th>course_id</th>
      <th>course_name</th>
      <th>max_num</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Python</td><td>4</td></tr>
    <tr><td>2</td><td>SQL</td><td>4</td></tr>
    <tr><td>3</td><td>R</td><td>3</td></tr>
  </tbody>
</table>

**解题思路**：
1. 取用户进入直播间，并赋值 uv 为 1；取用户离开直播间，并赋值 uv 为-1；此处用 UNION ALL 连接（不去重）
2. 使用窗口函数 `sum()` 计算直播间的同时在线用户数
3. 计算各个科目直播间的同时在线最大值并按照 course_id 排序

**参考代码**：
```sql
WITH events AS (           -- Step 1: 将区间拆成事件流
    SELECT course_id, in_datetime  AS event_time,  1  AS delta
    FROM attend_tb
    UNION ALL
    SELECT course_id, out_datetime AS event_time, -1 AS delta
    FROM attend_tb
),
ordered AS (               -- Step 2: 按课程与时间排序（控制同一时间点的处理顺序）
    SELECT
        course_id,
        event_time,
        delta
    FROM events
    -- 如果同一 event_time 既有进入(+1)又有离开(-1)，
    -- 选择 delta 排序方向决定并发瞬时的处理语义：
    ORDER BY event_time, delta DESC  -- 先加后减（并发尽量不降）
--  ORDER BY event_time, delta ASC   -- 先减后加（并发先下降再上升）
),
running AS (               -- Step 3: 前缀和 = 当前时刻并发在线人数
    SELECT
        course_id,
        event_time,
        SUM(delta) OVER (
            PARTITION BY course_id
            ORDER BY event_time, delta ASC   -- 这里采用“先处理离开(-1)”语义，可按需要改成 DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) AS concurrent_cnt
    FROM ordered
),
max_concurrent AS (        -- Step 4: 每门课程的最大并发
    SELECT
        course_id,
        MAX(concurrent_cnt) AS max_num
    FROM running
    GROUP BY course_id
)
SELECT                      -- Step 5: 关联课程名称输出结果
    c.course_id,
    c.course_name,
    m.max_num
FROM max_concurrent m
JOIN course_tb c USING (course_id)
ORDER BY c.course_id;
```

# 类型七：用户留存问题

## 解题思路



## 模板题：计算用户的次日留存率

- 第一天登录，第二天也登陆的为次日留存，以此类推
- 如果 in_time-进入时间 和 out_time-离开时间 跨天了，在两天里都记为该用户活跃过，结果按日期升序

**数据源表**：
<table>
  <caption><strong>tb_user_log（用户行为日志）</strong></caption>
  <thead>
    <tr>
      <th>id</th>
      <th>uid</th>
      <th>artical_id</th>
      <th>in_time</th>
      <th>out_time</th>
      <th>sign_in</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>101</td><td>9001</td><td>2021-11-01 10:00:00</td><td>2021-11-01 10:00:42</td><td>1</td></tr>
    <tr><td>2</td><td>102</td><td>9001</td><td>2021-11-01 10:00:00</td><td>2021-11-01 10:00:09</td><td>0</td></tr>
    <tr><td>3</td><td>103</td><td>9001</td><td>2021-11-01 10:00:00</td><td>2021-11-01 10:01:50</td><td>0</td></tr>
    <tr><td>4</td><td>101</td><td>9002</td><td>2021-11-02 10:00:00</td><td>2021-11-02 10:02:40</td><td>0</td></tr>
    <tr><td>5</td><td>102</td><td>9002</td><td>2021-11-02 10:00:00</td><td>2021-11-02 10:00:59</td><td>0</td></tr>
    <tr><td>6</td><td>104</td><td>9001</td><td>2021-11-02 11:00:28</td><td>2021-11-02 11:01:24</td><td>0</td></tr>
    <tr><td>7</td><td>101</td><td>9003</td><td>2021-11-03 11:00:55</td><td>2021-11-03 11:01:24</td><td>0</td></tr>
    <tr><td>8</td><td>103</td><td>9003</td><td>2021-11-03 11:00:55</td><td>2021-11-03 11:00:55</td><td>0</td></tr>
    <tr><td>9</td><td>105</td><td>9003</td><td>2021-11-03 11:00:53</td><td>2021-11-03 11:00:59</td><td>0</td></tr>
    <tr><td>10</td><td>102</td><td>9002</td><td>2021-11-04 11:00:55</td><td>2021-11-04 11:00:59</td><td>0</td></tr>
  </tbody>
</table>

**解题思路 一**：
1. 首先使用窗口函数，按照每个用户作为窗口，计算出每个用户如果是次日留存所对应的登陆时间，并对结果进行去重（每个用户每天最多只有一条记录）
2. 接着按照用户进行分组，统计出每个用户是否是次日留存用户（出现了和通过窗口函数计算出的留存时间相同的时间记录），是为1，否为0
3. 计算次日留存率

**参考代码 一**：
```sql
-- 下面代码默认 time 是日期-时间的格式，如果仅仅是日期格式，可以不用 date(time)
WITH a AS (
    SELECT DISTINCT
        user_id,
        DATE(time) AS time,
        MIN(DATE_ADD(DATE(time), 1)) OVER (PARTITION BY user_id) AS next_day_time
    FROM user_login
),
b AS (
    SELECT
        user_id,
        -- 用户不是次日留存，指标就是 0；是次日留存，指标就是 1（因为已经去重了）
        SUM(IF(time = next_day_time, 1, 0)) AS if_next_keep
    FROM a
    GROUP BY user_id
)
-- 计算次日留存率
SELECT
    ROUND(SUM(if_next_keep) / COUNT(1), 2) AS next_keep_rate
FROM b;
```

**解题思路 二**：

1. 首先计算出每个用户的首次登陆时间：first_login_time
2. 然后将源表user_log和首次登陆时间Join，按照用户进行分组，计算每个用户是否在第次日有留存记录，有的话就取1，否则就取0
3. 计算次日留存率

**参考代码 二**：

```sql
-- 计算次日留存率：用户首登次日是否再次登录
WITH a AS ( 
    SELECT
        user_id,
        MIN(time) AS first_log_time
    FROM user_login
    GROUP BY user_id
), 
b AS ( 
    SELECT
        t1.user_id,
        -- 如果用户次日登录了，那就是1，否则就是0
        -- CASE WHEN语句如果没有指定ELSE，则默认值为NULL
        -- COUNT(不会统计NULL)
        COUNT(DISTINCT CASE WHEN DATEDIFF(time, first_log_time) = 1 THEN time END) AS day1_retention
    FROM user_login AS t1
    JOIN a AS t2 ON t1.user_id = t2.user_id  
    GROUP BY t1.user_id
) 
SELECT
    ROUND(SUM(day1_retention) / COUNT(1), 2) AS next_keep_rate
FROM b;
```

# 类型八：行列互转问题（PIVOT/数据透视问题）

## 【行转列】直接拆开
TODO
## 【行转列】有基准id
### 解题思路
group by+sum/max/min(case when)（聚合函数 + case when的题目）

### 模板题：原表格有基准id（product_id）进行行转列
**数据源表**：
<table>
  <caption><strong>Products</strong></caption>
  <thead>
    <tr>
      <th>product_id</th>
      <th>store</th>
      <th>price</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>store1</td><td>95</td></tr>
    <tr><td>0</td><td>store3</td><td>105</td></tr>
    <tr><td>0</td><td>store2</td><td>100</td></tr>
    <tr><td>1</td><td>store1</td><td>70</td></tr>
    <tr><td>1</td><td>store3</td><td>80</td></tr>
  </tbody>
</table>

**参考结果**：
<table>
  <caption><strong>Result</strong></caption>
  <thead>
    <tr>
      <th>product_id</th>
      <th>store1</th>
      <th>store2</th>
      <th>store3</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>0</td><td>95</td><td>100</td><td>105</td></tr>
    <tr><td>1</td><td>70</td><td>null</td><td>80</td></tr>
  </tbody>
</table>

**参考代码**：
```sql
SELECT
    product_id,
    MAX(CASE WHEN store = 'store1' THEN price END) AS store1,
    MAX(CASE WHEN store = 'store2' THEN price END) AS store2,
    MAX(CASE WHEN store = 'store3' THEN price END) AS store3
FROM Products
GROUP BY product_id
ORDER BY product_id;
```

## 【行转列】无基准id
### 解题思路
row_number() + group by + sum/max/min(case when) （聚合函数 + case when 的题目），原表格没有基准id需要自己构造（使用窗口函数，自己构造row_number）

### 模板题：原表格没有基准id进行行转列
**数据源表**：
<table>
  <caption><strong>People</strong></caption>
  <thead>
    <tr>
      <th>name</th>
      <th>continent</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Jack</td><td>America</td></tr>
    <tr><td>Pascal</td><td>Europe</td></tr>
    <tr><td>Xi</td><td>Asia</td></tr>
    <tr><td>Jane</td><td>America</td></tr>
  </tbody>
</table>

**参考结果**：
<table>
  <caption><strong>Result（按洲展开列）</strong></caption>
  <thead>
    <tr>
      <th>America</th>
      <th>Asia</th>
      <th>Europe</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Jack</td><td>Xi</td><td>Pascal</td></tr>
    <tr><td>Jane</td><td></td><td></td></tr>
  </tbody>
</table>

**参考代码**：
```sql
WITH a AS (
    SELECT
        ROW_NUMBER() OVER (PARTITION BY continent ORDER BY name) AS id,
        name,
        continent
    FROM student
)
SELECT
    MAX(CASE continent WHEN 'America' THEN name ELSE NULL END) AS America,
    MAX(CASE continent WHEN 'Europe'  THEN name ELSE NULL END) AS Europe,
    MAX(CASE continent WHEN 'Asia'    THEN name ELSE NULL END) AS Asia
FROM a
GROUP BY id;
```

## 【列转行】按新字段规则进行查询（无中生有）
### 解题思路
分别查询每一行的内容，无中生有出来bin的内容，然后使用UNION ALL进行最后的拼接

### 模板题：原表格没有基准id进行行转列
**数据源表**：
<table>
  <caption><strong>Sessions（session 时长，单位：秒）</strong></caption>
  <thead>
    <tr>
      <th>session_id</th>
      <th>duration</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>30</td></tr>
    <tr><td>2</td><td>199</td></tr>
    <tr><td>3</td><td>299</td></tr>
    <tr><td>4</td><td>580</td></tr>
    <tr><td>5</td><td>1000</td></tr>
  </tbody>
</table>

**参考结果**：
<table>
  <caption><strong>Result（会话时长分箱统计按分钟区间）</strong></caption>
  <thead>
    <tr>
      <th>bin</th>
      <th>total</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>[0-5></td><td>3</td></tr>
    <tr><td>[5-10></td><td>1</td></tr>
    <tr><td>[10-15></td><td>0</td></tr>
    <tr><td>15 or more</td><td>1</td></tr>
  </tbody>
</table>

**参考代码**：
```sql
SELECT '[0-5>' AS bin, COUNT(*) AS total 
FROM Sessions 
WHERE duration BETWEEN 0 AND 5*60 
UNION ALL 
SELECT '[5-10>' AS bin, COUNT(*) AS total 
FROM Sessions 
WHERE duration BETWEEN 5*60 AND 10*60 
UNION ALL 
SELECT '[10-15>' AS bin, COUNT(*) AS total 
FROM Sessions 
WHERE duration BETWEEN 10*60 AND 15*60 
UNION ALL 
SELECT '15 or more' AS bin, COUNT(*) AS total 
FROM Sessions 
WHERE duration >= 15*60
```
