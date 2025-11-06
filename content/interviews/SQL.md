---
title: "SQL"
date: 2023-10-20
---

# SQL查询基础

{{< details "**如何查询每个部门的平均薪资？**" "SQL" >}}

这是典型的分组聚合问题，考察GROUP BY和聚合函数的使用。

**场景**：有员工表`employees(id, name, department, salary)`，需要统计每个部门的平均薪资。

```sql
-- 基础查询
SELECT 
    department,
    AVG(salary) as avg_salary
FROM employees
GROUP BY department;

-- 进阶：筛选平均薪资大于8000的部门
SELECT 
    department,
    AVG(salary) as avg_salary,
    COUNT(*) as emp_count
FROM employees
GROUP BY department
HAVING AVG(salary) > 8000
ORDER BY avg_salary DESC;

-- 高级：包含部门人数和薪资范围
SELECT 
    department,
    COUNT(*) as emp_count,
    ROUND(AVG(salary), 2) as avg_salary,
    MIN(salary) as min_salary,
    MAX(salary) as max_salary,
    MAX(salary) - MIN(salary) as salary_range
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;
```

**关键点**：
- `GROUP BY`后面的列必须在SELECT中出现（或使用聚合函数）
- `HAVING`用于筛选聚合后的结果，`WHERE`用于筛选原始数据
- 聚合函数：`COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()`

{{< admonition type="tip" title="执行顺序" >}}
SQL执行顺序：FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
{{< /admonition >}}

{{< /details >}}

{{< details "**如何找出每个部门薪资最高的员工？**" "SQL" >}}

这是经典的"分组取Top N"问题，有多种解决方案。

**场景**：员工表`employees(id, name, department, salary)`，找出每个部门薪资最高的员工。

{{< tabs "子查询,窗口函数,自连接" >}}

**方法1：相关子查询**

```sql
-- 思路：对每个员工，检查是否是本部门最高薪资
SELECT e1.department, e1.name, e1.salary
FROM employees e1
WHERE e1.salary = (
    SELECT MAX(e2.salary)
    FROM employees e2
    WHERE e2.department = e1.department
);
```

优点：逻辑清晰，易理解
缺点：性能较差（每行都要执行子查询）

|||

**方法2：窗口函数（推荐）**

```sql
-- 使用ROW_NUMBER排名
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rn
    FROM employees
) t
WHERE rn = 1;

-- 使用RANK（可能有并列第一）
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rk
    FROM employees
) t
WHERE rk = 1;

-- 使用DENSE_RANK
SELECT department, name, salary
FROM (
    SELECT 
        department,
        name,
        salary,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as drk
    FROM employees
) t
WHERE drk = 1;
```

**三种排名函数的区别**：

| 薪资 | ROW_NUMBER | RANK | DENSE_RANK |
|------|------------|------|------------|
| 9000 | 1 | 1 | 1 |
| 9000 | 2 | 1 | 1 |
| 8000 | 3 | 3 | 2 |
| 8000 | 4 | 3 | 2 |
| 7000 | 5 | 5 | 3 |

**特点对比**：
- `ROW_NUMBER`：连续递增，每行唯一编号
- `RANK`：相同值并列排名，后续排名跳号
- `DENSE_RANK`：相同值并列排名，后续排名不跳号

|||

**方法3：自连接**

```sql
SELECT e1.department, e1.name, e1.salary
FROM employees e1
LEFT JOIN employees e2
    ON e1.department = e2.department 
    AND e1.salary < e2.salary
WHERE e2.id IS NULL;
```

思路：左连接找比自己薪资高的同部门员工，如果没有（IS NULL），说明自己最高

{{< /tabs >}}

**扩展：取前N名**

```sql
-- 每个部门薪资前3的员工
SELECT department, name, salary, rn
FROM (
    SELECT 
        department,
        name,
        salary,
        ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as rn
    FROM employees
) t
WHERE rn <= 3
ORDER BY department, rn;
```

{{< /details >}}

{{< details "**如何计算用户的连续登录天数？**" "SQL" >}}

这是典型的连续问题，考察日期处理和分组技巧。

**场景**：用户登录表`user_login(user_id, login_date)`，计算每个用户的最长连续登录天数。

{{< tabs "差值分组,窗口函数,递归CTE" >}}

**方法1：日期差值分组法**

核心思想：连续日期减去行号，结果相同的为一组连续日期。

```sql
-- Step 1: 去重并排序
WITH login_data AS (
    SELECT DISTINCT user_id, login_date
    FROM user_login
),
-- Step 2: 添加行号
ranked_data AS (
    SELECT 
        user_id,
        login_date,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) as rn
    FROM login_data
),
-- Step 3: 计算日期差（相同差值=连续）
grouped_data AS (
    SELECT 
        user_id,
        login_date,
        DATE_SUB(login_date, INTERVAL rn DAY) as group_date
    FROM ranked_data
)
-- Step 4: 统计每组的连续天数
SELECT 
    user_id,
    MAX(consecutive_days) as max_consecutive_days
FROM (
    SELECT 
        user_id,
        group_date,
        COUNT(*) as consecutive_days
    FROM grouped_data
    GROUP BY user_id, group_date
) t
GROUP BY user_id;
```

**原理示例**：
```
user_id  login_date   rn   login_date - rn
1        2024-01-01   1    2023-12-31  (组A)
1        2024-01-02   2    2023-12-31  (组A)
1        2024-01-03   3    2023-12-31  (组A)
1        2024-01-05   4    2024-01-01  (组B)
1        2024-01-06   5    2024-01-01  (组B)
```

组A有3天连续，组B有2天连续。

|||

**方法2：窗口函数LAG**

```sql
WITH lag_data AS (
    SELECT 
        user_id,
        login_date,
        LAG(login_date, 1) OVER (PARTITION BY user_id ORDER BY login_date) as prev_date
    FROM (SELECT DISTINCT user_id, login_date FROM user_login) t
),
-- 标记是否连续
flag_data AS (
    SELECT 
        user_id,
        login_date,
        CASE 
            WHEN DATEDIFF(login_date, prev_date) = 1 THEN 0
            ELSE 1
        END as is_new_streak
    FROM lag_data
),
-- 累计标记，生成分组ID
streak_groups AS (
    SELECT 
        user_id,
        login_date,
        SUM(is_new_streak) OVER (PARTITION BY user_id ORDER BY login_date) as streak_id
    FROM flag_data
)
-- 统计每组天数
SELECT 
    user_id,
    MAX(consecutive_days) as max_consecutive_days
FROM (
    SELECT 
        user_id,
        streak_id,
        COUNT(*) as consecutive_days
    FROM streak_groups
    GROUP BY user_id, streak_id
) t
GROUP BY user_id;
```

|||

**方法3：变量法（MySQL特定）**

```sql
SET @prev_user = NULL;
SET @prev_date = NULL;
SET @streak_id = 0;

SELECT 
    user_id,
    MAX(consecutive_days) as max_consecutive_days
FROM (
    SELECT 
        user_id,
        streak_id,
        COUNT(*) as consecutive_days
    FROM (
        SELECT 
            user_id,
            login_date,
            @streak_id := CASE
                WHEN @prev_user = user_id AND DATEDIFF(login_date, @prev_date) = 1 
                    THEN @streak_id
                ELSE @streak_id + 1
            END as streak_id,
            @prev_user := user_id,
            @prev_date := login_date
        FROM (
            SELECT DISTINCT user_id, login_date 
            FROM user_login 
            ORDER BY user_id, login_date
        ) t
    ) t2
    GROUP BY user_id, streak_id
) t3
GROUP BY user_id;
```

{{< /tabs >}}

**实际应用场景**：
- 用户活跃度分析
- 连续签到统计
- 留存率计算
- 游戏连胜记录

{{< /details >}}

{{< details "**如何进行多表关联查询？**" "SQL" >}}

多表JOIN是SQL的核心，需要理解不同JOIN类型的差异。

**场景**：
- `users(user_id, name)`
- `orders(order_id, user_id, amount, order_date)`
- `products(product_id, product_name, price)`
- `order_items(order_id, product_id, quantity)`

**JOIN类型对比**：

| JOIN类型 | 说明 | 返回结果 | 使用场景 | 示例 |
|---------|------|---------|---------|------|
| **INNER JOIN** | 内连接 | 只返回两表都匹配的记录 | 查询有订单的用户 | 用户-订单（只看下过单的） |
| **LEFT JOIN** | 左连接 | 返回左表所有记录<br/>右表无匹配显示NULL | 查询所有用户及其订单<br/>（包括未下单用户） | 用户列表-订单（可能无订单） |
| **RIGHT JOIN** | 右连接 | 返回右表所有记录<br/>左表无匹配显示NULL | 查询所有订单及其用户<br/>（包括无用户的订单） | 用户-订单列表（重点看订单） |
| **FULL OUTER JOIN** | 全外连接 | 返回两表所有记录<br/>无匹配的显示NULL | 查询所有用户和订单<br/>（MySQL需用UNION模拟） | 完整的用户-订单关系 |
| **CROSS JOIN** | 交叉连接 | 笛卡尔积（所有组合） | 生成所有可能的组合 | 日期表×产品表（生成排期） |
| **SELF JOIN** | 自连接 | 表与自身连接 | 查询层级关系、对比 | 员工-上级、同部门员工对比 |

**代码示例**：

```sql
-- 1. INNER JOIN（内连接）：只返回两表都有的记录
SELECT u.name, o.order_id, o.amount
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id;

-- 2. LEFT JOIN（左连接）：返回左表所有记录
SELECT u.name, o.order_id, o.amount
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;

-- 3. RIGHT JOIN（右连接）：返回右表所有记录
SELECT u.name, o.order_id, o.amount
FROM users u
RIGHT JOIN orders o ON u.user_id = o.user_id;

-- 4. FULL OUTER JOIN（全外连接）：MySQL需要UNION模拟
SELECT u.name, o.order_id, o.amount
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
UNION
SELECT u.name, o.order_id, o.amount
FROM users u
RIGHT JOIN orders o ON u.user_id = o.user_id;
```

**复杂关联示例**：

```sql
-- 查询每个用户的订单数、总消费、购买的商品数
SELECT 
    u.user_id,
    u.name,
    COUNT(DISTINCT o.order_id) as order_count,
    COALESCE(SUM(o.amount), 0) as total_amount,
    COUNT(DISTINCT oi.product_id) as product_count
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY u.user_id, u.name;

-- 查询购买了特定商品的用户
SELECT DISTINCT u.name
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
WHERE p.product_name = 'iPhone 15';

-- 查询从未下单的用户
SELECT u.user_id, u.name
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

**性能优化建议**：

1. **JOIN顺序**：小表在前，大表在后
2. **索引优化**：关联字段建立索引
3. **避免笛卡尔积**：确保有JOIN条件
4. **提前过滤**：WHERE条件尽早使用

```sql
-- 不好的写法（先JOIN再过滤）
SELECT *
FROM large_table1 t1
INNER JOIN large_table2 t2 ON t1.id = t2.id
WHERE t1.date >= '2024-01-01';

-- 好的写法（先过滤再JOIN）
SELECT *
FROM (
    SELECT * FROM large_table1 
    WHERE date >= '2024-01-01'
) t1
INNER JOIN large_table2 t2 ON t1.id = t2.id;
```

{{< /details >}}

# SQL进阶技巧

{{< details "**如何使用窗口函数计算移动平均？**" "SQL" >}}

窗口函数可以在不分组的情况下进行聚合计算，非常适合时间序列分析。

**场景**：销售表`sales(date, revenue)`，计算每日收入的7天移动平均。

```sql
-- 7天移动平均
SELECT 
    date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as ma_7d
FROM sales;

-- 包含更多统计指标
SELECT 
    date,
    revenue,
    -- 7天移动平均
    ROUND(AVG(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 2) as ma_7d,
    -- 累计收入
    SUM(revenue) OVER (
        ORDER BY date
    ) as cumulative_revenue,
    -- 环比增长率
    ROUND(
        (revenue - LAG(revenue, 1) OVER (ORDER BY date)) / 
        LAG(revenue, 1) OVER (ORDER BY date) * 100, 
        2
    ) as day_over_day_growth_pct,
    -- 同比（7天前）
    ROUND(
        (revenue - LAG(revenue, 7) OVER (ORDER BY date)) / 
        LAG(revenue, 7) OVER (ORDER BY date) * 100,
        2
    ) as week_over_week_growth_pct
FROM sales
ORDER BY date;
```

**窗口函数框架（Frame）说明**：

```sql
-- ROWS vs RANGE
-- ROWS: 按行数计算
AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
-- 当前行和前2行，共3行

-- RANGE: 按值范围计算（日期）
AVG(revenue) OVER (
    ORDER BY date 
    RANGE BETWEEN INTERVAL 7 DAY PRECEDING AND CURRENT ROW
)
-- 当前日期往前7天范围内的所有行

-- 常用框架
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW  -- 从开始到当前
ROWS BETWEEN 6 PRECEDING AND CURRENT ROW          -- 前6行到当前（7天窗口）
ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING  -- 当前到结束
ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING          -- 前1行+当前+后1行
```

**实战案例：股票技术指标**

```sql
-- 计算股票的移动平均线和MACD
WITH price_data AS (
    SELECT 
        date,
        close_price,
        -- MA5: 5日均线
        AVG(close_price) OVER (
            ORDER BY date 
            ROWS BETWEEN 4 PRECEDING AND CURRENT ROW
        ) as ma5,
        -- MA10: 10日均线
        AVG(close_price) OVER (
            ORDER BY date 
            ROWS BETWEEN 9 PRECEDING AND CURRENT ROW
        ) as ma10,
        -- MA20: 20日均线
        AVG(close_price) OVER (
            ORDER BY date 
            ROWS BETWEEN 19 PRECEDING AND CURRENT ROW
        ) as ma20
    FROM stock_prices
    WHERE stock_code = '000001'
)
SELECT 
    date,
    close_price,
    ROUND(ma5, 2) as ma5,
    ROUND(ma10, 2) as ma10,
    ROUND(ma20, 2) as ma20,
    -- 金叉/死叉信号
    CASE 
        WHEN ma5 > ma10 AND LAG(ma5) OVER (ORDER BY date) <= LAG(ma10) OVER (ORDER BY date) 
            THEN '金叉'
        WHEN ma5 < ma10 AND LAG(ma5) OVER (ORDER BY date) >= LAG(ma10) OVER (ORDER BY date)
            THEN '死叉'
    END as signal
FROM price_data
ORDER BY date DESC
LIMIT 30;
```

{{< /details >}}

{{< details "**如何优化慢查询？**" "SQL" >}}

SQL性能优化是数据分析师必备技能，涉及索引、查询改写、表设计等多个方面。

**场景**：有一个慢查询需要优化。

**优化步骤**：

**1. 使用EXPLAIN分析执行计划**

```sql
EXPLAIN SELECT * 
FROM orders o
INNER JOIN users u ON o.user_id = u.user_id
WHERE o.order_date >= '2024-01-01'
AND u.city = 'Shanghai';
```

关注指标：
- `type`: 访问类型（ALL=全表扫描最差，const/eq_ref最好）
- `rows`: 扫描行数（越少越好）
- `Extra`: 额外信息（Using filesort/Using temporary需要优化）

**2. 添加合适的索引**

```sql
-- 问题：WHERE条件没有索引，导致全表扫描
-- 慢查询
SELECT * FROM orders 
WHERE order_date >= '2024-01-01' 
AND status = 'completed';

-- 解决：创建复合索引
CREATE INDEX idx_orders_date_status 
ON orders(order_date, status);

-- 优化后查询
-- 现在可以使用索引快速定位
```

**索引使用原则**：
- WHERE、JOIN、ORDER BY的列考虑加索引
- 复合索引遵循最左前缀原则
- 区分度高的列放在前面
- 不要过度索引（影响写入性能）

**3. 避免SELECT ***

```sql
-- 慢查询
SELECT * FROM orders WHERE user_id = 123;

-- 优化：只查询需要的列
SELECT order_id, order_date, amount 
FROM orders 
WHERE user_id = 123;
```

减少数据传输量，提升查询速度。

**4. 优化JOIN**

```sql
-- 慢查询：先JOIN大表，再过滤
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.user_id = o.user_id
WHERE o.order_date >= '2024-01-01';

-- 优化：先过滤，再JOIN
SELECT u.name, o.amount
FROM users u
INNER JOIN (
    SELECT user_id, amount
    FROM orders
    WHERE order_date >= '2024-01-01'
) o ON u.user_id = o.user_id;
```

**5. 使用EXISTS代替IN（大数据集）**

```sql
-- 慢查询：IN子查询
SELECT * FROM users
WHERE user_id IN (
    SELECT user_id FROM orders WHERE amount > 1000
);

-- 优化：使用EXISTS
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o 
    WHERE o.user_id = u.user_id AND o.amount > 1000
);
```

EXISTS在找到第一个匹配后就停止，IN需要完整结果集。

**6. 避免函数操作索引列**

```sql
-- 慢查询：函数导致索引失效
SELECT * FROM orders
WHERE YEAR(order_date) = 2024;

-- 优化：直接比较
SELECT * FROM orders
WHERE order_date >= '2024-01-01' 
AND order_date < '2025-01-01';
```

**7. 分页优化（深度分页）**

```sql
-- 慢查询：深度分页
SELECT * FROM orders
ORDER BY order_id
LIMIT 100000, 20;  -- 需要扫描100020行

-- 优化：使用WHERE代替OFFSET
SELECT * FROM orders
WHERE order_id > 100000  -- 上次查询的最后一个ID
ORDER BY order_id
LIMIT 20;
```

**8. 批量操作代替循环**

```sql
-- 慢：循环插入
-- for each row: INSERT INTO table VALUES (...)

-- 快：批量插入
INSERT INTO table (col1, col2, col3) VALUES
(val1, val2, val3),
(val4, val5, val6),
(val7, val8, val9);
-- 一次插入多行
```

**性能优化检查清单**：

✅ 索引优化
- WHERE、JOIN、ORDER BY字段有索引
- 复合索引顺序合理
- 定期清理无用索引

✅ 查询改写
- 避免SELECT *
- 子查询改JOIN
- 提前过滤减少数据量

✅ 表设计
- 合理的数据类型
- 避免过度范式化
- 考虑分区表

✅ 配置优化
- 增加缓存大小
- 调整连接数
- 启用查询缓存

{{< /details >}}

{{< details "**如何处理NULL值？**" "SQL" >}}

NULL处理是SQL中的常见陷阱，需要特别注意。

**NULL的特性**：
- NULL表示"未知"或"不存在"
- NULL参与的任何运算结果都是NULL
- NULL不等于任何值，包括NULL本身

**常见问题**：

**1. 比较陷阱**

```sql
-- 错误：无法用 = 比较NULL
SELECT * FROM users WHERE age = NULL;     -- 返回空（错误）
SELECT * FROM users WHERE age != NULL;    -- 返回空（错误）

-- 正确：使用IS NULL / IS NOT NULL
SELECT * FROM users WHERE age IS NULL;
SELECT * FROM users WHERE age IS NOT NULL;

-- 判断两个可能为NULL的列是否相等
SELECT * FROM users 
WHERE (col1 = col2) OR (col1 IS NULL AND col2 IS NULL);
```

**2. 聚合函数与NULL**

```sql
-- COUNT(*) vs COUNT(column)
SELECT 
    COUNT(*) as total_rows,        -- 10行
    COUNT(age) as age_count,       -- 8行（忽略NULL）
    COUNT(DISTINCT age) as unique_ages  -- 7个（去重且忽略NULL）
FROM users;

-- SUM、AVG忽略NULL
SELECT 
    SUM(amount) as total,          -- NULL不参与计算
    AVG(amount) as average         -- NULL不计入分母
FROM orders;

-- 区别：计算平均值时的NULL影响
SELECT 
    AVG(score) as avg1,                    -- 假设= 85（忽略NULL）
    SUM(score) / COUNT(*) as avg2          -- 包含NULL行，可能= 75
FROM students;
```

**3. NULL值替换**

```sql
-- COALESCE：返回第一个非NULL值
SELECT 
    name,
    COALESCE(phone, email, '无联系方式') as contact
FROM users;

-- IFNULL / ISNULL（MySQL）
SELECT 
    name,
    IFNULL(age, 0) as age,
    IFNULL(salary, 0) as salary
FROM employees;

-- CASE WHEN
SELECT 
    name,
    CASE 
        WHEN age IS NULL THEN '未填写'
        WHEN age < 18 THEN '未成年'
        WHEN age >= 18 AND age < 60 THEN '成年'
        ELSE '老年'
    END as age_group
FROM users;
```

**4. JOIN中的NULL**

```sql
-- 左连接产生NULL
SELECT u.name, o.order_id
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id;
-- 没有订单的用户，order_id为NULL

-- 过滤没有订单的用户
SELECT u.name
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;
```

**5. ORDER BY中的NULL**

```sql
-- 默认行为（不同数据库可能不同）
SELECT * FROM users ORDER BY age;  -- NULL在最前或最后

-- 控制NULL位置（MySQL）
SELECT * FROM users ORDER BY age IS NULL, age;  -- NULL在最后
SELECT * FROM users ORDER BY age IS NOT NULL, age;  -- NULL在最前

-- PostgreSQL
SELECT * FROM users ORDER BY age NULLS FIRST;   -- NULL在前
SELECT * FROM users ORDER BY age NULLS LAST;    -- NULL在后
```

**6. 实战案例：用户活跃度分析**

```sql
-- 计算用户最近活跃天数，未活跃显示为0
SELECT 
    user_id,
    name,
    COALESCE(
        DATEDIFF(CURRENT_DATE, MAX(login_date)),
        999
    ) as days_since_last_login,
    CASE 
        WHEN MAX(login_date) IS NULL THEN '从未登录'
        WHEN DATEDIFF(CURRENT_DATE, MAX(login_date)) <= 7 THEN '活跃'
        WHEN DATEDIFF(CURRENT_DATE, MAX(login_date)) <= 30 THEN '一般'
        ELSE '沉睡'
    END as user_status
FROM users u
LEFT JOIN user_logins l ON u.user_id = l.user_id
GROUP BY u.user_id, u.name;
```

**最佳实践**：

1. **数据库设计时明确NULL语义**
   - 能用NOT NULL就用NOT NULL
   - NULL应该表示"未知"而非"空字符串"或"0"

2. **查询时显式处理NULL**
   - 使用COALESCE提供默认值
   - WHERE条件考虑NULL情况

3. **测试边界情况**
   - 测试全部为NULL的列
   - 测试NULL与非NULL混合

{{< /details >}}

# SQL实战场景

{{< details "**如何计算用户留存率？**" "SQL" >}}

留存率是衡量用户粘性的关键指标，SQL实现需要巧妙的日期处理。

**场景**：用户行为表`user_actions(user_id, action_date)`，计算次日、7日、30日留存率。

**留存率定义**：
- 次日留存率 = 第N天注册的用户中，第N+1天还活跃的用户数 / 第N天注册的用户数
- 7日留存率 = 第N天注册的用户中，第N+7天还活跃的用户数 / 第N天注册的用户数

**完整实现**：

```sql
-- Step 1: 找出每个用户的首次行为日期（注册日期）
WITH first_action AS (
    SELECT 
        user_id,
        MIN(action_date) as first_date
    FROM user_actions
    GROUP BY user_id
),
-- Step 2: 关联用户的所有行为
user_retention AS (
    SELECT 
        f.first_date,
        f.user_id,
        a.action_date,
        DATEDIFF(a.action_date, f.first_date) as day_diff
    FROM first_action f
    INNER JOIN user_actions a ON f.user_id = a.user_id
),
-- Step 3: 计算留存
retention_stats AS (
    SELECT 
        first_date,
        COUNT(DISTINCT user_id) as new_users,
        COUNT(DISTINCT CASE WHEN day_diff = 1 THEN user_id END) as day1_retained,
        COUNT(DISTINCT CASE WHEN day_diff = 7 THEN user_id END) as day7_retained,
        COUNT(DISTINCT CASE WHEN day_diff = 30 THEN user_id END) as day30_retained
    FROM user_retention
    GROUP BY first_date
)
-- Step 4: 计算留存率
SELECT 
    first_date,
    new_users,
    day1_retained,
    ROUND(day1_retained * 100.0 / new_users, 2) as day1_retention_rate,
    day7_retained,
    ROUND(day7_retained * 100.0 / new_users, 2) as day7_retention_rate,
    day30_retained,
    ROUND(day30_retained * 100.0 / new_users, 2) as day30_retention_rate
FROM retention_stats
WHERE new_users >= 10  -- 过滤样本量过小的日期
ORDER BY first_date DESC;
```

**方法2：使用自连接**

```sql
-- 计算次日留存
SELECT 
    d1.first_date as cohort_date,
    COUNT(DISTINCT d1.user_id) as new_users,
    COUNT(DISTINCT d2.user_id) as retained_users,
    ROUND(COUNT(DISTINCT d2.user_id) * 100.0 / COUNT(DISTINCT d1.user_id), 2) as retention_rate
FROM (
    SELECT user_id, MIN(action_date) as first_date
    FROM user_actions
    GROUP BY user_id
) d1
LEFT JOIN user_actions d2 
    ON d1.user_id = d2.user_id 
    AND d2.action_date = DATE_ADD(d1.first_date, INTERVAL 1 DAY)
GROUP BY d1.first_date
ORDER BY d1.first_date DESC;
```

**留存矩阵（Cohort Analysis）**：

```sql
-- 生成留存矩阵：每个注册日期的用户在后续每天的留存情况
WITH cohorts AS (
    SELECT 
        user_id,
        DATE(MIN(action_date)) as cohort_date
    FROM user_actions
    GROUP BY user_id
),
user_activities AS (
    SELECT 
        c.cohort_date,
        c.user_id,
        DATE(a.action_date) as activity_date,
        DATEDIFF(a.action_date, c.cohort_date) as days_since_cohort
    FROM cohorts c
    INNER JOIN user_actions a ON c.user_id = a.user_id
)
SELECT 
    cohort_date,
    COUNT(DISTINCT CASE WHEN days_since_cohort = 0 THEN user_id END) as day0,
    COUNT(DISTINCT CASE WHEN days_since_cohort = 1 THEN user_id END) as day1,
    COUNT(DISTINCT CASE WHEN days_since_cohort = 2 THEN user_id END) as day2,
    COUNT(DISTINCT CASE WHEN days_since_cohort = 3 THEN user_id END) as day3,
    COUNT(DISTINCT CASE WHEN days_since_cohort = 7 THEN user_id END) as day7,
    COUNT(DISTINCT CASE WHEN days_since_cohort = 14 THEN user_id END) as day14,
    COUNT(DISTINCT CASE WHEN days_since_cohort = 30 THEN user_id END) as day30,
    -- 计算留存率
    ROUND(COUNT(DISTINCT CASE WHEN days_since_cohort = 1 THEN user_id END) * 100.0 / 
          COUNT(DISTINCT CASE WHEN days_since_cohort = 0 THEN user_id END), 2) as day1_rate,
    ROUND(COUNT(DISTINCT CASE WHEN days_since_cohort = 7 THEN user_id END) * 100.0 / 
          COUNT(DISTINCT CASE WHEN days_since_cohort = 0 THEN user_id END), 2) as day7_rate
FROM user_activities
GROUP BY cohort_date
ORDER BY cohort_date DESC;
```

**输出示例**：
```
cohort_date   day0   day1   day1_rate   day7   day7_rate   day30
2024-01-01    1000   720    72.00%      580    58.00%      420
2024-01-02    1050   756    72.00%      609    58.00%      441
2024-01-03    980    706    72.04%      568    57.96%      412
```

{{< /details >}}

{{< details "**如何实现复杂的数据透视？**" "SQL" >}}

数据透视是将行数据转换为列数据，常用于报表展示。

**场景**：销售表`sales(date, product, region, amount)`，需要按地区和产品展示销售额。

**方法1：CASE WHEN实现**

```sql
-- 将产品类别从行转为列
SELECT 
    region,
    SUM(CASE WHEN product = 'iPhone' THEN amount ELSE 0 END) as iPhone_sales,
    SUM(CASE WHEN product = 'iPad' THEN amount ELSE 0 END) as iPad_sales,
    SUM(CASE WHEN product = 'MacBook' THEN amount ELSE 0 END) as MacBook_sales,
    SUM(amount) as total_sales
FROM sales
WHERE date >= '2024-01-01'
GROUP BY region;
```

**方法2：动态列（MySQL 8.0+）**

```sql
-- 使用JSON聚合
SELECT 
    region,
    JSON_OBJECTAGG(product, amount) as sales_by_product
FROM (
    SELECT region, product, SUM(amount) as amount
    FROM sales
    GROUP BY region, product
) t
GROUP BY region;
```

**方法3：行列互换（完整透视）**

```sql
-- 透视示例：按月份和产品展示销售额
WITH monthly_sales AS (
    SELECT 
        DATE_FORMAT(date, '%Y-%m') as month,
        product,
        SUM(amount) as amount
    FROM sales
    WHERE date >= '2024-01-01'
    GROUP BY DATE_FORMAT(date, '%Y-%m'), product
)
SELECT 
    month,
    SUM(CASE WHEN product = 'iPhone' THEN amount END) as iPhone,
    SUM(CASE WHEN product = 'iPad' THEN amount END) as iPad,
    SUM(CASE WHEN product = 'MacBook' THEN amount END) as MacBook,
    SUM(CASE WHEN product = 'AirPods' THEN amount END) as AirPods,
    SUM(amount) as total
FROM monthly_sales
GROUP BY month
ORDER BY month;
```

**逆透视（列转行）**：

```sql
-- 将多列数据转换为行
-- 原表：region, q1_sales, q2_sales, q3_sales, q4_sales
-- 目标：region, quarter, sales

SELECT region, 'Q1' as quarter, q1_sales as sales FROM quarterly_sales
UNION ALL
SELECT region, 'Q2' as quarter, q2_sales as sales FROM quarterly_sales
UNION ALL
SELECT region, 'Q3' as quarter, q3_sales as sales FROM quarterly_sales
UNION ALL
SELECT region, 'Q4' as quarter, q4_sales as sales FROM quarterly_sales
ORDER BY region, quarter;
```

**动态透视表生成**：

```sql
-- 生成动态SQL进行透视（需要存储过程）
SET @sql = NULL;

SELECT 
    GROUP_CONCAT(
        DISTINCT CONCAT(
            'SUM(CASE WHEN product = ''',
            product,
            ''' THEN amount ELSE 0 END) AS ',
            REPLACE(product, ' ', '_')
        )
    ) INTO @sql
FROM sales;

SET @sql = CONCAT('SELECT region, ', @sql, ', SUM(amount) as total
                   FROM sales 
                   GROUP BY region');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
```

**实战：构建销售仪表板数据**

```sql
-- 多维度透视：按地区、月份、产品类别
SELECT 
    region,
    DATE_FORMAT(date, '%Y-%m') as month,
    -- 按产品类别
    SUM(CASE WHEN category = 'Electronics' THEN amount END) as electronics,
    SUM(CASE WHEN category = 'Clothing' THEN amount END) as clothing,
    SUM(CASE WHEN category = 'Food' THEN amount END) as food,
    -- 总计
    SUM(amount) as total,
    -- 环比增长
    ROUND(
        (SUM(amount) - LAG(SUM(amount)) OVER (PARTITION BY region ORDER BY DATE_FORMAT(date, '%Y-%m'))) 
        / LAG(SUM(amount)) OVER (PARTITION BY region ORDER BY DATE_FORMAT(date, '%Y-%m')) * 100,
        2
    ) as mom_growth_pct
FROM sales
GROUP BY region, DATE_FORMAT(date, '%Y-%m')
ORDER BY region, month;
```

{{< /details >}}

{{< details "**如何处理重复数据？**" "SQL" >}}

数据去重是数据清洗的常见需求，不同场景有不同的处理策略。

**场景**：订单表`orders(order_id, user_id, product_id, amount, order_date)`存在重复记录。

**识别重复数据**：

```sql
-- 1. 找出完全重复的记录
SELECT 
    user_id, product_id, amount, order_date,
    COUNT(*) as duplicate_count
FROM orders
GROUP BY user_id, product_id, amount, order_date
HAVING COUNT(*) > 1;

-- 2. 找出部分字段重复（同一用户同一天多次下单同一商品）
SELECT 
    user_id, product_id, order_date,
    COUNT(*) as order_count,
    GROUP_CONCAT(order_id) as order_ids
FROM orders
GROUP BY user_id, product_id, order_date
HAVING COUNT(*) > 1;

-- 3. 统计重复率
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT user_id, product_id, order_date) as unique_records,
    COUNT(*) - COUNT(DISTINCT user_id, product_id, order_date) as duplicate_records,
    ROUND((COUNT(*) - COUNT(DISTINCT user_id, product_id, order_date)) * 100.0 / COUNT(*), 2) as duplicate_rate
FROM orders;
```

**删除重复数据**：

```sql
-- 方法1：保留最小ID的记录
DELETE FROM orders
WHERE order_id NOT IN (
    SELECT MIN(order_id)
    FROM orders
    GROUP BY user_id, product_id, order_date
);

-- 方法2：使用窗口函数（推荐，MySQL 8.0+）
DELETE FROM orders
WHERE order_id IN (
    SELECT order_id FROM (
        SELECT 
            order_id,
            ROW_NUMBER() OVER (
                PARTITION BY user_id, product_id, order_date 
                ORDER BY order_id
            ) as rn
        FROM orders
    ) t
    WHERE rn > 1
);

-- 方法3：创建新表（最安全）
CREATE TABLE orders_cleaned AS
SELECT * FROM (
    SELECT 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, product_id, order_date 
            ORDER BY order_id
        ) as rn
    FROM orders
) t
WHERE rn = 1;

-- 验证后替换原表
DROP TABLE orders;
ALTER TABLE orders_cleaned RENAME TO orders;
```

**保留特定记录**：

```sql
-- 场景：保留金额最大的订单
DELETE FROM orders
WHERE (user_id, product_id, order_date, amount) NOT IN (
    SELECT user_id, product_id, order_date, MAX(amount)
    FROM orders
    GROUP BY user_id, product_id, order_date
);

-- 使用窗口函数保留最新的记录
WITH ranked_orders AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, product_id 
            ORDER BY order_date DESC, order_id DESC
        ) as rn
    FROM orders
)
DELETE FROM orders
WHERE order_id IN (
    SELECT order_id FROM ranked_orders WHERE rn > 1
);
```

**预防重复**：

```sql
-- 1. 添加唯一索引
CREATE UNIQUE INDEX idx_unique_order 
ON orders(user_id, product_id, order_date);

-- 2. 插入时检查
INSERT INTO orders (user_id, product_id, amount, order_date)
SELECT 123, 456, 100.00, '2024-01-01'
WHERE NOT EXISTS (
    SELECT 1 FROM orders 
    WHERE user_id = 123 
    AND product_id = 456 
    AND order_date = '2024-01-01'
);

-- 3. 使用INSERT IGNORE（MySQL）
INSERT IGNORE INTO orders (user_id, product_id, amount, order_date)
VALUES (123, 456, 100.00, '2024-01-01');

-- 4. 使用ON DUPLICATE KEY UPDATE
INSERT INTO orders (user_id, product_id, amount, order_date)
VALUES (123, 456, 100.00, '2024-01-01')
ON DUPLICATE KEY UPDATE amount = VALUES(amount);
```

**大表去重优化**：

```sql
-- 分批删除，避免锁表时间过长
SET @batch_size = 10000;
SET @deleted = 1;

WHILE @deleted > 0 DO
    DELETE FROM orders
    WHERE order_id IN (
        SELECT order_id FROM (
            SELECT order_id FROM (
                SELECT 
                    order_id,
                    ROW_NUMBER() OVER (
                        PARTITION BY user_id, product_id, order_date 
                        ORDER BY order_id
                    ) as rn
                FROM orders
            ) t
            WHERE rn > 1
            LIMIT @batch_size
        ) t2
    );
    
    SET @deleted = ROW_COUNT();
    SELECT CONCAT('Deleted ', @deleted, ' rows') as status;
    
    -- 暂停，让其他事务有机会执行
    DO SLEEP(1);
END WHILE;
```

{{< /details >}}

{{< details "**如何实现行列转换（PIVOT/UNPIVOT）？**" "SQL" >}}

行列转换是报表开发中的常见需求，可以改变数据的展现形式。

**场景**：学生成绩表`scores(student, subject, score)`，需要将科目从行转为列。

**列转行（CASE WHEN实现）**：

```sql
-- 原始数据
student  subject  score
张三     语文     85
张三     数学     90
张三     英语     88
李四     语文     92
李四     数学     87
李四     英语     91

-- 目标：每个学生一行，科目作为列
SELECT 
    student,
    MAX(CASE WHEN subject = '语文' THEN score END) as 语文,
    MAX(CASE WHEN subject = '数学' THEN score END) as 数学,
    MAX(CASE WHEN subject = '英语' THEN score END) as 英语,
    ROUND(AVG(score), 2) as 平均分
FROM scores
GROUP BY student;

-- 结果
student  语文  数学  英语  平均分
张三     85    90    88    87.67
李四     92    87    91    90.00
```

**使用PIVOT（SQL Server/Oracle）**：

```sql
-- SQL Server语法
SELECT *
FROM (
    SELECT student, subject, score
    FROM scores
) AS source_table
PIVOT (
    MAX(score)
    FOR subject IN ([语文], [数学], [英语])
) AS pivot_table;

-- Oracle语法
SELECT *
FROM scores
PIVOT (
    MAX(score)
    FOR subject IN ('语文' AS 语文, '数学' AS 数学, '英语' AS 英语)
);
```

**行转列（UNPIVOT）**：

```sql
-- 原始数据（宽表）
student  语文  数学  英语
张三     85    90    88
李四     92    87    91

-- 目标：转换为长表
-- MySQL实现（UNION ALL）
SELECT student, '语文' as subject, 语文 as score FROM student_scores
UNION ALL
SELECT student, '数学' as subject, 数学 as score FROM student_scores
UNION ALL
SELECT student, '英语' as subject, 英语 as score FROM student_scores
ORDER BY student, subject;

-- SQL Server UNPIVOT
SELECT student, subject, score
FROM student_scores
UNPIVOT (
    score FOR subject IN (语文, 数学, 英语)
) AS unpivot_table;
```

**动态PIVOT（MySQL）**：

```sql
-- 动态生成科目列
SET @sql = NULL;

SELECT GROUP_CONCAT(
    DISTINCT CONCAT(
        'MAX(CASE WHEN subject = ''', subject, ''' THEN score END) AS `', subject, '`'
    )
) INTO @sql
FROM scores;

SET @sql = CONCAT('SELECT student, ', @sql, ', ROUND(AVG(score), 2) as 平均分 
                   FROM scores 
                   GROUP BY student');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
```

{{< /details >}}

{{< details "**如何实现树形结构查询（递归CTE）？**" "SQL" >}}

树形结构常用于组织架构、商品分类、评论回复等场景。

**场景**：员工表`employees(id, name, manager_id)`，查询组织架构。

**向下递归（查找所有下属）**：

```sql
-- MySQL 8.0+ / PostgreSQL / SQL Server
WITH RECURSIVE employee_tree AS (
    -- 锚点：起始节点
    SELECT id, name, manager_id, 1 as level, name as path
    FROM employees
    WHERE id = 1  -- CEO
    
    UNION ALL
    
    -- 递归部分：查找下属
    SELECT e.id, e.name, e.manager_id, et.level + 1, 
           CONCAT(et.path, ' > ', e.name) as path
    FROM employees e
    INNER JOIN employee_tree et ON e.manager_id = et.id
    WHERE et.level < 10  -- 防止无限递归
)
SELECT id, name, manager_id, level, path
FROM employee_tree
ORDER BY level, id;

-- 结果示例
id  name    manager_id  level  path
1   张总    NULL        1      张总
2   李经理  1           2      张总 > 李经理
3   王经理  1           2      张总 > 王经理
4   赵主管  2           3      张总 > 李经理 > 赵主管
5   钱主管  2           3      张总 > 李经理 > 钱主管
```

**向上递归（查找所有上级）**：

```sql
WITH RECURSIVE manager_chain AS (
    -- 锚点：当前员工
    SELECT id, name, manager_id, 1 as level
    FROM employees
    WHERE id = 5  -- 查找ID=5的员工的所有上级
    
    UNION ALL
    
    -- 递归：查找上级
    SELECT e.id, e.name, e.manager_id, mc.level + 1
    FROM employees e
    INNER JOIN manager_chain mc ON e.id = mc.manager_id
)
SELECT * FROM manager_chain
ORDER BY level DESC;  -- 从上到下展示
```

**商品分类树**：

```sql
-- 表结构：categories(id, name, parent_id)
-- 查找某分类下的所有子分类
WITH RECURSIVE category_tree AS (
    SELECT id, name, parent_id, 1 as level,
           CAST(id AS CHAR(200)) as path
    FROM categories
    WHERE id = 10  -- 起始分类
    
    UNION ALL
    
    SELECT c.id, c.name, c.parent_id, ct.level + 1,
           CONCAT(ct.path, ',', c.id) as path
    FROM categories c
    INNER JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree
ORDER BY path;
```

{{< /details >}}

{{< details "**如何实现分页查询？**" "SQL" >}}

分页是Web应用的基础功能，需要考虑性能和准确性。

**基础分页（LIMIT + OFFSET）**：

```sql
-- MySQL/PostgreSQL
SELECT * 
FROM products
ORDER BY product_id
LIMIT 20 OFFSET 40;  -- 第3页，每页20条

-- SQL Server
SELECT *
FROM products
ORDER BY product_id
OFFSET 40 ROWS
FETCH NEXT 20 ROWS ONLY;
```

**深度分页优化（游标分页）**：

```sql
-- 问题：LIMIT 100000, 20 需要扫描100020行
-- 慢查询示例
SELECT * FROM orders
ORDER BY order_id
LIMIT 100000, 20;

-- 优化方案1：使用WHERE代替OFFSET
SELECT * FROM orders
WHERE order_id > 100000  -- 上一页最后一个ID
ORDER BY order_id
LIMIT 20;

-- 优化方案2：子查询只查ID
SELECT o.*
FROM orders o
INNER JOIN (
    SELECT order_id
    FROM orders
    ORDER BY order_id
    LIMIT 20 OFFSET 100000
) t ON o.order_id = t.order_id;
```

**游标分页（推荐用于API）**：

```sql
-- 基于游标的分页（无OFFSET性能问题）
-- 首页
SELECT * FROM orders
WHERE created_at >= '2024-01-01'
ORDER BY created_at DESC, order_id DESC
LIMIT 20;

-- 下一页（传入上一页最后记录的游标）
SELECT * FROM orders
WHERE created_at >= '2024-01-01'
  AND (created_at < '2024-01-15 10:00:00' 
       OR (created_at = '2024-01-15 10:00:00' AND order_id < 12345))
ORDER BY created_at DESC, order_id DESC
LIMIT 20;
```

{{< /details >}}

{{< details "**如何进行日期时间处理与计算？**" "SQL" >}}

日期时间处理是数据分析中的高频需求，掌握常用函数和场景至关重要。

**基础日期函数（MySQL）**：

```sql
-- 当前日期时间
SELECT NOW();                    -- 2024-01-15 14:30:25
SELECT CURDATE();                -- 2024-01-15
SELECT CURTIME();                -- 14:30:25

-- 提取日期部分
SELECT DATE('2024-01-15 14:30:25');           -- 2024-01-15
SELECT YEAR('2024-01-15');                    -- 2024
SELECT MONTH('2024-01-15');                   -- 1
SELECT DAY('2024-01-15');                     -- 15
SELECT HOUR('2024-01-15 14:30:25');           -- 14
SELECT MINUTE('2024-01-15 14:30:25');         -- 30
SELECT SECOND('2024-01-15 14:30:25');         -- 25

-- 星期处理
SELECT DAYOFWEEK('2024-01-15');               -- 2 (1=周日, 7=周六)
SELECT WEEKDAY('2024-01-15');                 -- 0 (0=周一, 6=周日)
SELECT DAYNAME('2024-01-15');                 -- Monday
SELECT WEEK('2024-01-15');                    -- 3 (第几周)
```

**日期格式化**：

```sql
-- DATE_FORMAT 格式化日期
SELECT DATE_FORMAT('2024-01-15 14:30:25', '%Y-%m-%d');           -- 2024-01-15
SELECT DATE_FORMAT('2024-01-15 14:30:25', '%Y年%m月%d日');        -- 2024年01月15日
SELECT DATE_FORMAT('2024-01-15 14:30:25', '%Y-%m-%d %H:%i:%s');  -- 2024-01-15 14:30:25
SELECT DATE_FORMAT('2024-01-15 14:30:25', '%W, %M %d, %Y');      -- Monday, January 15, 2024

-- 常用格式符号：
-- %Y: 4位年份    %y: 2位年份
-- %m: 2位月份    %c: 1位月份
-- %d: 2位日期    %e: 1位日期
-- %H: 24小时     %h: 12小时
-- %i: 分钟       %s: 秒
-- %W: 星期名     %a: 星期缩写
```

**日期计算**：

{{< tabs "日期加减,时间差计算,月末处理,工作日计算" >}}

**日期加减运算**：

```sql
-- DATE_ADD / DATE_SUB
SELECT DATE_ADD('2024-01-15', INTERVAL 1 DAY);        -- 2024-01-16
SELECT DATE_ADD('2024-01-15', INTERVAL 7 DAY);        -- 2024-01-22
SELECT DATE_ADD('2024-01-15', INTERVAL 1 MONTH);      -- 2024-02-15
SELECT DATE_ADD('2024-01-15', INTERVAL 1 YEAR);       -- 2025-01-15
SELECT DATE_ADD('2024-01-15', INTERVAL -1 MONTH);     -- 2023-12-15

SELECT DATE_SUB('2024-01-15', INTERVAL 7 DAY);        -- 2024-01-08

-- 组合单位
SELECT DATE_ADD('2024-01-15 14:30:00', INTERVAL '1 2:30:00' DAY_SECOND);
-- 1天2小时30分钟后

-- 加号运算符（简写）
SELECT '2024-01-15' + INTERVAL 1 DAY;
SELECT NOW() - INTERVAL 7 DAY;                         -- 7天前
```

|||

**时间差计算**：

```sql
-- DATEDIFF：计算天数差
SELECT DATEDIFF('2024-01-20', '2024-01-15');          -- 5

-- TIMESTAMPDIFF：计算任意单位差值
SELECT TIMESTAMPDIFF(SECOND, '2024-01-15 10:00:00', '2024-01-15 11:30:00');  -- 5400
SELECT TIMESTAMPDIFF(MINUTE, '2024-01-15 10:00:00', '2024-01-15 11:30:00');  -- 90
SELECT TIMESTAMPDIFF(HOUR, '2024-01-15 10:00:00', '2024-01-15 14:00:00');    -- 4
SELECT TIMESTAMPDIFF(DAY, '2024-01-01', '2024-01-31');                        -- 30
SELECT TIMESTAMPDIFF(MONTH, '2024-01-01', '2024-06-01');                      -- 5
SELECT TIMESTAMPDIFF(YEAR, '2020-01-01', '2024-01-01');                       -- 4

-- 时间差（秒数）
SELECT UNIX_TIMESTAMP('2024-01-15 14:00:00') - UNIX_TIMESTAMP('2024-01-15 10:00:00');  -- 14400
```

|||

**月末/月初处理**：

```sql
-- 获取月初
SELECT DATE_FORMAT('2024-01-15', '%Y-%m-01');                        -- 2024-01-01

-- 获取月末
SELECT LAST_DAY('2024-01-15');                                       -- 2024-01-31
SELECT LAST_DAY('2024-02-15');                                       -- 2024-02-29 (闰年)

-- 下个月初
SELECT DATE_ADD(DATE_FORMAT('2024-01-15', '%Y-%m-01'), INTERVAL 1 MONTH);  -- 2024-02-01

-- 上个月末
SELECT LAST_DAY(DATE_SUB('2024-01-15', INTERVAL 1 MONTH));          -- 2023-12-31

-- 季度处理
SELECT QUARTER('2024-01-15');                                         -- 1
SELECT CONCAT('Q', QUARTER('2024-01-15'), '-', YEAR('2024-01-15'));  -- Q1-2024

-- 季度初
SELECT DATE_FORMAT(
    DATE_SUB('2024-04-15', INTERVAL (MONTH('2024-04-15') - 1) % 3 MONTH),
    '%Y-%m-01'
);  -- 2024-04-01
```

|||

**工作日计算（需自定义逻辑）**：

```sql
-- 判断是否工作日（排除周末）
SELECT 
    order_date,
    CASE 
        WHEN WEEKDAY(order_date) IN (5, 6) THEN '周末'
        ELSE '工作日'
    END as day_type
FROM orders;

-- 计算两日期间的工作日数量（不含节假日表）
WITH RECURSIVE date_series AS (
    SELECT '2024-01-01' AS date
    UNION ALL
    SELECT DATE_ADD(date, INTERVAL 1 DAY)
    FROM date_series
    WHERE date < '2024-01-31'
)
SELECT COUNT(*) as workdays
FROM date_series
WHERE WEEKDAY(date) NOT IN (5, 6);  -- 排除周六周日

-- 添加N个工作日后的日期（简化版，不考虑节假日）
-- 实际场景需配合节假日表
```

{{< /tabs >}}

**实战场景**：

**场景1：统计最近30天每日订单数**：

```sql
SELECT 
    DATE(order_time) as order_date,
    COUNT(*) as order_count,
    SUM(amount) as total_amount
FROM orders
WHERE order_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(order_time)
ORDER BY order_date;
```

**场景2：计算用户注册后首单时长**：

```sql
SELECT 
    u.user_id,
    u.register_time,
    MIN(o.order_time) as first_order_time,
    TIMESTAMPDIFF(HOUR, u.register_time, MIN(o.order_time)) as hours_to_first_order,
    DATEDIFF(MIN(o.order_time), u.register_time) as days_to_first_order
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.register_time;
```

**场景3：按月统计累计用户数**：

```sql
SELECT 
    DATE_FORMAT(register_time, '%Y-%m') as month,
    COUNT(*) as new_users,
    SUM(COUNT(*)) OVER (ORDER BY DATE_FORMAT(register_time, '%Y-%m')) as cumulative_users
FROM users
GROUP BY DATE_FORMAT(register_time, '%Y-%m')
ORDER BY month;
```

**场景4：计算用户年龄（从身份证或生日）**：

```sql
SELECT 
    user_id,
    birthday,
    TIMESTAMPDIFF(YEAR, birthday, CURDATE()) as age,
    -- 精确年龄（考虑当年生日是否已过）
    YEAR(CURDATE()) - YEAR(birthday) - 
    (DATE_FORMAT(CURDATE(), '%m%d') < DATE_FORMAT(birthday, '%m%d')) as exact_age
FROM users;
```

**场景5：查找连续登录天数**：

```sql
WITH login_dates AS (
    SELECT DISTINCT 
        user_id,
        DATE(login_time) as login_date
    FROM login_logs
),
date_groups AS (
    SELECT 
        user_id,
        login_date,
        DATE_SUB(login_date, INTERVAL ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) DAY) as group_date
    FROM login_dates
)
SELECT 
    user_id,
    MIN(login_date) as start_date,
    MAX(login_date) as end_date,
    COUNT(*) as consecutive_days
FROM date_groups
GROUP BY user_id, group_date
HAVING COUNT(*) >= 3  -- 至少连续3天
ORDER BY consecutive_days DESC;
```

**场景6：同比/环比计算**：

```sql
-- 月度同比（去年同期）
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') as month,
    SUM(amount) as current_amount,
    LAG(SUM(amount), 12) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) as last_year_amount,
    ROUND((SUM(amount) - LAG(SUM(amount), 12) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m'))) 
          / LAG(SUM(amount), 12) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) * 100, 2) as yoy_growth
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m');

-- 月度环比（上个月）
SELECT 
    DATE_FORMAT(order_date, '%Y-%m') as month,
    SUM(amount) as current_amount,
    LAG(SUM(amount), 1) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) as last_month_amount,
    ROUND((SUM(amount) - LAG(SUM(amount), 1) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m'))) 
          / LAG(SUM(amount), 1) OVER (ORDER BY DATE_FORMAT(order_date, '%Y-%m')) * 100, 2) as mom_growth
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m');
```

**不同数据库差异**：

| 功能 | MySQL | PostgreSQL | SQL Server |
|------|-------|------------|------------|
| 当前时间 | `NOW()` | `NOW()` / `CURRENT_TIMESTAMP` | `GETDATE()` |
| 日期加减 | `DATE_ADD()` | `date + INTERVAL '1 day'` | `DATEADD()` |
| 日期差 | `DATEDIFF()` | `date2 - date1` | `DATEDIFF()` |
| 格式化 | `DATE_FORMAT()` | `TO_CHAR()` | `FORMAT()` |
| 提取部分 | `YEAR()`, `MONTH()` | `EXTRACT(YEAR FROM date)` | `YEAR()`, `MONTH()` |

**注意事项**：

1. **时区问题**：注意服务器时区、数据库时区和应用时区的一致性
2. **索引优化**：日期范围查询时避免在WHERE中对日期列使用函数
   ```sql
   -- 差❌
   WHERE DATE(order_time) = '2024-01-15'
   
   -- 好✅
   WHERE order_time >= '2024-01-15' AND order_time < '2024-01-16'
   ```
3. **闰年处理**：2月29日、年度计算需考虑闰年
4. **夏令时**：跨夏令时的时间计算可能出现偏差
5. **性能考虑**：大数据量时间范围查询建议分区表

{{< /details >}}

{{< details "**SQL的SELECT语句执行顺序是怎样的？**" "SQL" >}}

很多人认为SQL语句是从SELECT开始执行的，但实际的执行顺序与书写顺序不同。

**标准执行顺序**：

```sql
(8) SELECT (9) DISTINCT (11) TOP
(1) FROM
(3) JOIN
(2) ON
(4) WHERE
(5) GROUP BY
(6) WITH CUBE 或 WITH ROLLUP
(7) HAVING
(10) ORDER BY
(12) LIMIT/OFFSET
```

**详细说明**：

**1. FROM**：首先确定数据来源

**2. ON**：对JOIN操作的表应用ON条件

**3. JOIN**：执行JOIN操作，合并表

**4. WHERE**：对合并后的结果集应用WHERE过滤条件

**5. GROUP BY**：按指定列分组

**6. 聚合函数**：计算每组的聚合值

**7. HAVING**：对分组后的结果进行过滤

**8. SELECT**：选择要返回的列

**9. DISTINCT**：去除重复行

**10. ORDER BY**：对结果排序

**11. LIMIT/OFFSET**：限制返回的行数

**实际案例分析**：

```sql
-- 查询每个城市总消费超过10000的用户数量
SELECT 
    city,
    COUNT(DISTINCT user_id) as user_count,
    SUM(amount) as total_amount
FROM orders o
JOIN users u ON o.user_id = u.user_id
WHERE order_date >= '2024-01-01'
GROUP BY city
HAVING SUM(amount) > 10000
ORDER BY total_amount DESC
LIMIT 5;
```

**执行过程**：
1. **FROM orders o**：扫描orders表
2. **JOIN users u**：连接users表
3. **ON o.user_id = u.user_id**：匹配连接条件
4. **WHERE order_date >= '2024-01-01'**：过滤2024年的订单
5. **GROUP BY city**：按城市分组
6. **SUM(amount)**：计算每个城市的总金额
7. **HAVING SUM(amount) > 10000**：筛选总额超过10000的城市
8. **SELECT**：选择要显示的列
9. **ORDER BY total_amount DESC**：按总金额降序
10. **LIMIT 5**：只返回前5条

**优化建议**：

基于执行顺序的优化策略：

1. **WHERE优先于HAVING**：能在WHERE中过滤的就不要在HAVING中过滤
```sql
-- 慢❌（先分组再过滤）
GROUP BY user_id
HAVING user_id > 1000

-- 快✅（先过滤再分组）
WHERE user_id > 1000
GROUP BY user_id
```

2. **JOIN前先过滤**：使用子查询先过滤再JOIN
```sql
-- 慢❌
FROM large_table t1
JOIN large_table t2 ON t1.id = t2.id
WHERE t1.date >= '2024-01-01'

-- 快✅
FROM (SELECT * FROM large_table WHERE date >= '2024-01-01') t1
JOIN large_table t2 ON t1.id = t2.id
```

3. **避免在WHERE中使用函数**：会导致索引失效
```sql
-- 慢❌
WHERE YEAR(order_date) = 2024

-- 快✅
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'
```

{{< /details >}}

{{< details "**什么是索引？索引的类型和使用场景？**" "SQL" >}}

索引是数据库表中一列或多列值的数据结构，可以加快数据检索速度。

**索引类型**：

**1. 主键索引（PRIMARY KEY）**
- 唯一且非空
- 每个表只能有一个主键
- 自动创建聚簇索引（InnoDB）

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);
```

**2. 唯一索引（UNIQUE）**
- 列值必须唯一，但可以有NULL
- 可以有多个唯一索引

```sql
-- 单列唯一索引
CREATE UNIQUE INDEX idx_email ON users(email);

-- 多列唯一索引
CREATE UNIQUE INDEX idx_username_email ON users(username, email);
```

**3. 普通索引（INDEX）**
- 最基本的索引，无唯一性限制

```sql
-- 单列索引
CREATE INDEX idx_name ON users(name);

-- 多列索引（复合索引）
CREATE INDEX idx_city_age ON users(city, age);
```

**4. 全文索引（FULLTEXT）**
- 用于全文搜索
- 只支持CHAR、VARCHAR、TEXT类型

```sql
CREATE FULLTEXT INDEX idx_content ON articles(title, content);

-- 使用
SELECT * FROM articles 
WHERE MATCH(title, content) AGAINST('数据分析');
```

**索引数据结构**：

**B+树索引**（InnoDB默认）：
- 所有数据存储在叶子节点
- 叶子节点形成有序链表
- 范围查询效率高

**哈希索引**（Memory引擎）：
- 等值查询快
- 不支持范围查询
- 不支持排序

**索引使用场景**：

**适合建索引**：
1. **WHERE条件频繁的列**
```sql
CREATE INDEX idx_user_id ON orders(user_id);
```

2. **JOIN连接的列**
```sql
CREATE INDEX idx_user_id ON orders(user_id);
```

3. **ORDER BY排序的列**
```sql
CREATE INDEX idx_order_date ON orders(order_date);
```

4. **GROUP BY分组的列**
```sql
CREATE INDEX idx_category ON products(category);
```

**不适合建索引**：
1. **数据量小的表**（<1000行）
2. **频繁更新的列**（维护索引开销大）
3. **区分度低的列**（如性别，只有男/女）
4. **长文本列**（可以对前缀建索引）

**复合索引的最左前缀原则**：

```sql
-- 创建复合索引
CREATE INDEX idx_abc ON table(a, b, c);

-- 可以使用索引的查询
WHERE a = 1                    ✅
WHERE a = 1 AND b = 2          ✅
WHERE a = 1 AND b = 2 AND c = 3 ✅
WHERE a = 1 AND c = 3          ✅ (只用到a)

-- 不能使用索引
WHERE b = 2                    ❌
WHERE c = 3                    ❌
WHERE b = 2 AND c = 3          ❌
```

**索引优化建议**：

```sql
-- 1. 覆盖索引：查询的列都在索引中
CREATE INDEX idx_user_name_age ON users(user_id, name, age);

SELECT name, age FROM users WHERE user_id = 1;
-- 不需要回表，直接从索引获取数据

-- 2. 前缀索引：对长字符串建立前缀索引
CREATE INDEX idx_email_prefix ON users(email(10));

-- 3. 查看索引使用情况
EXPLAIN SELECT * FROM users WHERE user_id = 1;

-- 4. 删除无用索引
SELECT * FROM sys.schema_unused_indexes;
```

{{< /details >}}

{{< details "**什么是事务？ACID特性如何理解？**" "SQL" >}}

事务是数据库执行的一系列操作的集合，这些操作要么全部成功，要么全部失败。

**ACID特性**：

**1. 原子性（Atomicity）**

事务中的所有操作要么全部完成，要么全部不完成。

```sql
-- 转账场景：A转给B 100元
START TRANSACTION;

-- 操作1：A账户减100
UPDATE accounts SET balance = balance - 100 WHERE user_id = 'A';

-- 操作2：B账户加100
UPDATE accounts SET balance = balance + 100 WHERE user_id = 'B';

-- 如果任何一步失败，全部回滚
COMMIT;  -- 全部成功
-- 或
ROLLBACK;  -- 全部撤销
```

**2. 一致性（Consistency）**

事务执行前后，数据库从一个一致性状态转换到另一个一致性状态。

```sql
-- 约束保证一致性
ALTER TABLE accounts ADD CONSTRAINT chk_balance CHECK (balance >= 0);

START TRANSACTION;

-- 这个操作会违反约束，事务会失败
UPDATE accounts SET balance = balance - 1000 WHERE user_id = 'A';
-- 错误：balance不能为负数

ROLLBACK;
```

**3. 隔离性（Isolation）**

并发执行的事务之间互不干扰。

**隔离级别**：

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
|---------|------|-----------|------|
| READ UNCOMMITTED | 可能 | 可能 | 可能 |
| READ COMMITTED | 不可能 | 可能 | 可能 |
| REPEATABLE READ | 不可能 | 不可能 | 可能 |
| SERIALIZABLE | 不可能 | 不可能 | 不可能 |

**脏读示例**：
```sql
-- 事务A
START TRANSACTION;
UPDATE accounts SET balance = 1000 WHERE user_id = 'A';
-- 未提交

-- 事务B（READ UNCOMMITTED）
SELECT balance FROM accounts WHERE user_id = 'A';  -- 读到1000（脏数据）

-- 事务A回滚
ROLLBACK;
-- 事务B读到的数据是无效的
```

**不可重复读示例**：
```sql
-- 事务A
START TRANSACTION;
SELECT balance FROM accounts WHERE user_id = 'A';  -- 第一次读：1000

-- 事务B修改并提交
UPDATE accounts SET balance = 2000 WHERE user_id = 'A';
COMMIT;

-- 事务A再次读取
SELECT balance FROM accounts WHERE user_id = 'A';  -- 第二次读：2000
-- 同一事务内，两次读取结果不一致
```

**幻读示例**：
```sql
-- 事务A
START TRANSACTION;
SELECT COUNT(*) FROM orders WHERE amount > 1000;  -- 第一次读：5条

-- 事务B插入新数据
INSERT INTO orders VALUES (6, 1500);
COMMIT;

-- 事务A再次统计
SELECT COUNT(*) FROM orders WHERE amount > 1000;  -- 第二次读：6条
-- 出现了"幻影"行
```

**4. 持久性（Durability）**

事务提交后，对数据的修改永久保存，即使系统崩溃也不会丢失。

```sql
START TRANSACTION;

INSERT INTO orders (user_id, amount) VALUES (123, 999);

COMMIT;  -- 一旦提交，即使服务器立即崩溃，数据也不会丢失
```

**实战案例：秒杀场景**

```sql
-- 场景：商品秒杀，防止超卖
START TRANSACTION;

-- 1. 锁定库存行（for update）
SELECT stock FROM products 
WHERE product_id = 123 
FOR UPDATE;

-- 2. 检查库存
IF stock > 0 THEN
    -- 3. 扣减库存
    UPDATE products 
    SET stock = stock - 1 
    WHERE product_id = 123;
    
    -- 4. 创建订单
    INSERT INTO orders (user_id, product_id, amount) 
    VALUES (456, 123, 99);
    
    COMMIT;
ELSE
    ROLLBACK;
END IF;
```

**性能优化建议**：

1. **事务尽可能短**：减少锁定时间
2. **避免在事务中查询大量数据**
3. **合理选择隔离级别**：根据业务需求权衡性能和一致性
4. **使用乐观锁替代悲观锁**（适合读多写少场景）

```sql
-- 乐观锁示例（使用version字段）
UPDATE products 
SET stock = stock - 1, version = version + 1
WHERE product_id = 123 
AND version = 10;  -- 只有version匹配才更新

-- 如果更新失败（affected rows = 0），说明有其他事务修改了数据
```

{{< /details >}}

{{< details "**explain执行计划怎么看？如何分析SQL性能？**" "SQL" >}}

`EXPLAIN`是分析SQL查询性能的重要工具，可以显示MySQL如何执行查询。

**基本用法**：

```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
```

**重要字段详解**：

| 字段 | 说明 | 重要性 |
|------|------|--------|
| type | 访问类型 | ⭐⭐⭐⭐⭐ |
| key | 实际使用的索引 | ⭐⭐⭐⭐⭐ |
| rows | 扫描的行数 | ⭐⭐⭐⭐⭐ |
| Extra | 额外信息 | ⭐⭐⭐⭐⭐ |

**type（访问类型）**

性能从好到差：`system > const > eq_ref > ref > range > index > ALL`

```sql
-- const：最优，主键或唯一索引的常量查询
EXPLAIN SELECT * FROM users WHERE user_id = 1;
-- type: const

-- ref：非唯一索引扫描
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
-- type: ref

-- range：范围扫描
EXPLAIN SELECT * FROM orders 
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';
-- type: range

-- ALL：全表扫描（最差）
EXPLAIN SELECT * FROM orders WHERE YEAR(order_date) = 2024;
-- type: ALL（函数导致索引失效）
```

**Extra（额外信息）**

**好的Extra**：
- `Using index`：覆盖索引，不需要回表
- `Using where`：使用WHERE过滤
- `Using index condition`：索引下推

**坏的Extra**：
- `Using filesort`：需要额外排序
- `Using temporary`：需要临时表
- `Using join buffer`：JOIN时需要缓冲区

**完整案例分析**：

```sql
-- 慢查询
EXPLAIN SELECT 
    u.name,
    COUNT(o.order_id) as order_count,
    SUM(o.amount) as total_amount
FROM orders o
JOIN users u ON o.user_id = u.user_id
WHERE o.order_date >= '2024-01-01'
AND u.city = 'Beijing'
GROUP BY u.user_id
ORDER BY total_amount DESC
LIMIT 10;
```

**可能的执行计划问题**：
```
id  select_type  table  type   key      rows    Extra
1   SIMPLE       o      ALL    NULL     100000  Using where; Using temporary; Using filesort
1   SIMPLE       u      eq_ref PRIMARY  1       Using where
```

**问题分析**：
1. `type: ALL` - orders表全表扫描
2. `key: NULL` - 没有使用索引
3. `rows: 100000` - 扫描10万行
4. `Using temporary` - 使用临时表
5. `Using filesort` - 需要排序

**优化方案**：

```sql
-- 1. 在order_date建立索引
CREATE INDEX idx_order_date ON orders(order_date);

-- 2. 在user_id建立索引
CREATE INDEX idx_user_id ON orders(user_id);

-- 3. 在city建立索引
CREATE INDEX idx_city ON users(city);

-- 4. 创建复合索引
CREATE INDEX idx_date_user ON orders(order_date, user_id);
```

**优化后的执行计划**：
```
id  select_type  table  type   key            rows   Extra
1   SIMPLE       o      range  idx_date_user  5000   Using where; Using index
1   SIMPLE       u      eq_ref PRIMARY        1      Using where
```

**改进**：
1. `type: range` - 使用范围扫描
2. `key: idx_date_user` - 使用了索引
3. `rows: 5000` - 扫描行数减少95%
4. 去除了`Using temporary`和`Using filesort`

**性能分析检查清单**：

✅ type 是否为 ALL 或 index（全表扫描）
✅ key 是否为 NULL（未使用索引）
✅ rows 是否过大
✅ Extra 是否包含 Using filesort 或 Using temporary
✅ 多表JOIN时，驱动表选择是否合理

{{< /details >}}

{{< details "**如何设计一个高效的数据库表结构？**" "数据库设计" >}}

数据库表设计直接影响系统性能和可维护性。

**设计原则**：

**1. 三大范式**

**第一范式（1NF）**：字段不可再分

```sql
-- 不符合1NF❌
CREATE TABLE users (
    address TEXT  -- "北京市朝阳区XXX街道"（混合了省、市、区）
);

-- 符合1NF✅
CREATE TABLE users (
    province VARCHAR(20),
    city VARCHAR(20),
    district VARCHAR(20),
    street VARCHAR(100)
);
```

**第二范式（2NF）**：消除部分依赖

```sql
-- 不符合2NF❌
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    product_name VARCHAR(50),    -- 只依赖product_id
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);

-- 符合2NF✅
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(50)
);
```

**第三范式（3NF）**：消除传递依赖

```sql
-- 不符合3NF❌
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    dept_id INT,
    dept_name VARCHAR(50),     -- 依赖于dept_id
    dept_location VARCHAR(100)  -- 依赖于dept_id
);

-- 符合3NF✅
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50),
    location VARCHAR(100)
);
```

**2. 反范式化（性能优化）**

在某些场景下，为了提高查询性能，可以适当违反范式。

```sql
-- 反范式化（冗余用户信息）
CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    user_id INT,
    user_name VARCHAR(50),      -- 冗余
    shipping_address TEXT,       -- 冗余（快照）
    order_amount DECIMAL(10,2)
);
```

**优势**：
- 减少JOIN，查询更快
- 保存历史快照（地址可能变化）

**劣势**：
- 数据冗余
- 更新复杂
- 可能不一致

**3. 数据类型选择**

**原则**：选择最小的数据类型

```sql
CREATE TABLE optimized_users (
    user_id INT UNSIGNED,           -- 4字节
    age TINYINT UNSIGNED,           -- 1字节，0-255
    username VARCHAR(50),           -- 变长
    gender CHAR(1),                 -- 定长
    status ENUM('active', 'inactive'),  -- 1字节
    balance DECIMAL(10,2),          -- 精确，适合金额
    created_at DATETIME,            -- 8字节
    settings JSON                   -- 灵活的配置数据
);
```

**4. 索引设计**

```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_date DATETIME NOT NULL,
    amount DECIMAL(10,2),
    status ENUM('pending','paid','shipped'),
    
    -- 索引
    INDEX idx_user_id (user_id),
    INDEX idx_date_status (order_date, status),
    UNIQUE INDEX idx_order_no (order_no)
);
```

**5. 实战案例：用户表设计**

```sql
CREATE TABLE users (
    user_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status TINYINT UNSIGNED DEFAULT 1,
    
    -- 统计信息（冗余字段，提高查询性能）
    login_count INT UNSIGNED DEFAULT 0,
    order_count INT UNSIGNED DEFAULT 0,
    
    -- 时间戳
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME COMMENT '软删除',
    
    -- 索引
    UNIQUE INDEX idx_username (username),
    UNIQUE INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_deleted (deleted_at)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

**最佳实践**：

✅ 所有表必须有主键
✅ 使用InnoDB引擎（支持事务）
✅ 使用UTF8MB4字符集（支持emoji）
✅ 重要字段添加NOT NULL和DEFAULT
✅ 合理使用索引
✅ 添加必要的注释
✅ 考虑软删除而非物理删除
✅ 预留扩展字段（JSON）

{{< /details >}}

