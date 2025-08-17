---
title: "Go 基础操作手册"
date: 2020-09-23
categories: ["开发手册"]
tags: ["go"]
draft: false
description: "这份手册涵盖了 Go 开发关键内容。"
summary: "这份手册涵盖了 Go 开发关键内容。"

---

# Go 开发参考手册

## 代码格式规范



```go
// 标准代码格式示例

package main

import (

    "fmt"

    "time" // 导入顺序：标准库→第三方库→本地库（不同类别间空行分隔）

)

// 函数定义（公共函数首字母大写）

func Add(a, b int) int {

    return a + b

}

// 包内私有函数（首字母小写）

func printResult(result int) {

    fmt.Printf("计算结果：%d\n", result)

}

func main() {

    // 变量声明（短变量声明仅用于函数内）

    num1, num2 := 10, 20

    sum := Add(num1, num2)

    

    // 条件语句（左大括号紧跟条件）

    if sum > 20 {

        printResult(sum)

    } else {

        fmt.Println("结果未超过20")

    }

    

    // 循环语句

    for i := 0; i < 3; i++ {

        fmt.Printf("循环次数：%d\n", i)

    }

}
```

### 注意事项



1.  必须使用 `gofmt` 或 `goimports` 工具自动格式化代码（IDE 可配置保存时自动执行）

2.  缩进严格使用 4 个空格，禁止使用制表符（tab）

3.  单行代码长度建议不超过 80 字符，过长时在运算符后换行

4.  函数间保留一个空行，逻辑相关的代码块可紧凑排列

### 易错示例



1.  错误的括号位置



```go
// 错误：左大括号单独换行

func wrongFormat()

{

    fmt.Println("错误格式")

}
```



1.  错误的导入顺序



```go
// 错误：导入顺序混乱

import (

    "myproject/utils"

    "fmt"

    "github.com/thirdparty/lib"

)
```

## String（字符串）操作

### 基本操作



1.  字符串定义



```go
// 单行字符串

str1 := "hello world"

// 多行字符串（保留换行和格式）

str2 := `第一行

第二行

第三行`
```



1.  字符串拼接



```go
// 直接拼接（适合少量字符串）

str3 := "hello" + " " + "go"

// 格式化拼接（适合复杂场景）

name := "Go"

version := "1.21"

str4 := fmt.Sprintf("语言：%s，版本：%s", name, version)
```



1.  字符串长度计算



```go
// 字节长度（ASCII字符占1字节，中文占3字节）

enStr := "hello"

enLen := len(enStr) // 结果：5

// 字符数量（需使用unicode/utf8包）

import "unicode/utf8"

cnStr := "你好世界"

cnLen := utf8.RuneCountInString(cnStr) // 结果：4
```



1.  字符串截取



```go
// 截取ASCII字符串（按字节索引）

sub1 := enStr[0:3] // 结果："hel"

// 截取包含中文的字符串（需先转换为rune切片）

cnRunes := []rune(cnStr)

sub2 := string(cnRunes[0:2]) // 结果："你好"
```



1.  字符串查找



```go
import "strings"

// 查找子串位置（返回首次出现索引，无则返回-1）

index := strings.Index(enStr, "ll") // 结果：2

// 查找最后出现的位置

lastIndex := strings.LastIndex("ababa", "aba") // 结果：2
```



1.  字符串替换



```
// 替换指定次数（-1表示全部替换）

newStr := strings.Replace("hello", "l", "x", 1) // 结果："hexlo"

allReplace := strings.Replace("hello", "l", "x", -1) // 结果："hexxo"
```

### 注意事项



1.  Go 字符串是不可变的，任何修改操作都会创建新字符串

2.  直接使用索引访问中文字符会得到乱码（需通过 rune 转换）

3.  `len()` 函数返回字节数，非字符数，处理多字节字符需用 `utf8` 包

4.  大量字符串拼接时，推荐使用 `strings.Builder` 提升性能

### 易错示例



1.  尝试修改字符串



```
str := "hello"

// 错误：字符串不可修改

str\[0] = 'H' // 编译错误：cannot assign to str\[0]
```



1.  错误截取含中文的字符串



```
cnStr := "你好世界"

// 错误：按字节截取中文导致乱码

wrongSub := cnStr\[0:2] // 结果：乱码（实际截取了第一个汉字的前2字节）
```



1.  错误计算字符串长度



```
cnStr := "你好世界"

// 错误：使用len()获取中文字符数量

wrongLen := len(cnStr) // 结果：12（4个汉字×3字节），非4
```

## Array（数组）操作

### 基本操作



1.  数组定义与初始化



```
// 声明数组（初始值为类型零值）

var arr1 \[3]int // \[0 0 0]

// 初始化指定元素

arr2 := \[3]int{10, 20} // \[10 20 0]（未指定元素为0）

// 自动推断长度

arr3 := \[...]int{1, 2, 3, 4} // 长度为4的数组
```



1.  访问与修改元素



```
arr := \[3]int{1, 2, 3}

// 访问元素

fmt.Println(arr\[1]) // 输出：2

// 修改元素

arr\[0] = 100

fmt.Println(arr) // 输出：\[100 2 3]
```



1.  数组遍历



```
// 普通for循环

for i := 0; i < len(arr); i++ {

    fmt.Printf("索引：%d，值：%d\n", i, arr\[i])

}

// for-range遍历

for index, value := range arr {

    fmt.Printf("索引：%d，值：%d\n", index, value)

}
```



1.  数组拷贝



```
arrA := \[3]int{1, 2, 3}

arrB := arrA // 完全拷贝（值传递）

arrB\[0] = 100

fmt.Println(arrA) // 输出：\[1 2 3]（原数组不受影响）
```

### 注意事项



1.  数组长度是类型的一部分，`[3]int` 和 `[4]int` 是不同类型，不能相互赋值

2.  数组是值类型，作为函数参数时会复制整个数组，大数组传递影响性能

3.  数组长度在编译时确定，运行时无法修改或扩容

4.  可通过 `len()` 函数获取数组长度，长度不能超过声明时的定义

### 易错示例



1.  数组类型不匹配



```
var a \[3]int

b := \[4]int{1, 2, 3, 4}

// 错误：长度不同的数组类型不兼容

a = b // 编译错误：cannot assign \[4]int to \[3]int
```



1.  数组访问越界



```
arr := \[3]int{1, 2, 3}

// 错误：索引超出数组长度

fmt.Println(arr\[3]) // 运行时错误：index out of range \[3] with length 3
```



1.  错误传递大数组



```
// 错误：传递大数组导致性能损耗

func process(arr \[100000]int) {

    // 处理逻辑

}

// 正确：传递数组指针

func processPtr(arr \*\[100000]int) {

    // 处理逻辑

}
```

## Slice（切片）操作

### 基本操作



1.  切片定义与初始化



```
// 声明nil切片（长度0，容量0）

var s1 \[]int

// 直接初始化

s2 := \[]int{1, 2, 3}

// 使用make创建（长度3，容量3）

s3 := make(\[]int, 3)

// 使用make创建（长度2，容量5）

s4 := make(\[]int, 2, 5)
```



1.  切片元素操作



```
// 添加元素（返回新切片）

s := \[]int{1, 2}

s = append(s, 3) // \[1 2 3]

// 添加多个元素

s = append(s, 4, 5) // \[1 2 3 4 5]

// 修改元素

s\[0] = 100 // \[100 2 3 4 5]
```



1.  切片截取（基于现有切片或数组）



```
arr := \[5]int{1, 2, 3, 4, 5}

// 从数组创建切片（左闭右开）

s1 := arr\[1:3] // \[2 3]（长度2，容量4）

// 从切片创建切片

s2 := s1\[0:1] // \[2]（长度1，容量4）
```



1.  切片拷贝



```
src := \[]int{1, 2, 3}

// 创建目标切片（长度需足够）

dst := make(\[]int, len(src))

// 拷贝元素（返回实际拷贝数量）

copy(dst, src) // dst变为\[1 2 3]
```



1.  切片遍历



```
// for-range遍历

for i, v := range s {

    fmt.Printf("索引：%d，值：%d\n", i, v)

}
```

### 注意事项



1.  切片是引用类型，底层指向数组，多个切片可能共享同一底层数组

2.  切片的容量是从起始索引到底层数组末尾的长度，`cap(s)` 获取容量

3.  `append()` 函数在容量不足时会创建新底层数组（通常扩容为原容量 2 倍）

4.  nil 切片可以安全使用 `len()` 和 `cap()`（均返回 0），也可直接 `append()`

5.  切片截取不会复制元素，仅创建新的切片结构（指向原底层数组）

### 易错示例



1.  nil 切片错误操作



```
var s \[]int

// 错误：直接赋值（nil切片无底层数组）

s\[0] = 1 // 运行时错误：index out of range \[0] with length 0

// 正确：使用append添加

s = append(s, 1) // 正确
```



1.  共享底层数组导致的意外修改



```
arr := \[5]int{1, 2, 3, 4, 5}

s1 := arr\[1:3] // \[2 3]

s2 := arr\[2:4] // \[3 4]

// 修改s1影响s2（共享底层数组）

s1\[1] = 100

fmt.Println(s2\[0]) // 输出：100（非预期的3）
```



1.  错误判断切片是否为空



```
s := make(\[]int, 0)

// 错误：通过nil判断是否为空

if s == nil {

    // 不会执行（s非nil但长度为0）

}

// 正确：通过长度判断

if len(s) == 0 {

    // 正确执行

}
```

## Map（映射）操作

### 基本操作



1.  Map 定义与初始化



```
// 声明nil map（不能直接使用）

var m1 map\[string]int

// 直接初始化

m2 := map\[string]int{"a": 1, "b": 2}

// 使用make创建

m3 := make(map\[int]string)

// 指定初始容量（减少扩容次数）

m4 := make(map\[string]float64, 10)
```



1.  添加与修改元素



```
m := make(map\[string]int)

// 添加元素

m\["one"] = 1

m\["two"] = 2

// 修改元素

m\["one"] = 100
```



1.  获取元素



```
// 基本获取（不存在返回零值）

v1 := m\["one"] // 100

// 判断键是否存在

v2, exists := m\["three"]

if exists {

    fmt.Println("three的值：", v2)

} else {

    fmt.Println("three不存在")

}
```



1.  删除元素



```
// 删除存在的键

delete(m, "two")

// 删除不存在的键（无副作用）

delete(m, "four")
```



1.  Map 遍历



```
// 遍历键值对

for k, v := range m {

    fmt.Printf("键：%s，值：%d\n", k, v)

}

// 仅遍历键

for k := range m {

    fmt.Println("键：", k)

}
```

### 注意事项



1.  map 是引用类型，传递时仅复制引用，修改会影响原 map

2.  nil map 不能添加元素（必须使用 make 初始化后才能使用）

3.  map 的遍历顺序是随机的，每次遍历可能不同

4.  map 的长度是动态变化的，`len(m)` 返回当前键值对数量

5.  map 不能直接比较（除了与 nil 比较），需手动实现比较逻辑

### 易错示例



1.  操作 nil map



```
var m map\[string]int

// 错误：向nil map添加元素

m\["a"] = 1 // 运行时错误：assignment to entry in nil map

// 正确：初始化后使用

m = make(map\[string]int)

m\["a"] = 1 // 正确
```



1.  错误判断键是否存在



```
m := map\[string]int{"a": 0, "b": 1}

// 错误：通过值判断是否存在

if m\["a"] == 0 {

    fmt.Println("a不存在") // 错误执行（a存在但值为0）

}

// 正确：使用第二个返回值

if \_, exists := m\["a"]; exists {

    fmt.Println("a存在") // 正确执行

}
```



1.  map 并发访问



```
m := make(map\[string]int)

// 错误：并发读写map

go func() {

    m\["a"] = 1

}()

go func() {

    fmt.Println(m\["a"])

}()

// 运行时错误：concurrent map read and map write

// 正确：使用sync.Map或加锁
```

## 函数（Function）操作

### 基本操作



1.  普通函数定义与调用



```
// 定义函数

func add(a, b int) int {

    return a + b

}

// 调用函数

result := add(2, 3) // 5
```



1.  多返回值函数



```
// 返回结果和错误

func divide(a, b float64) (float64, error) {

    if b == 0 {

        return 0, fmt.Errorf("除数不能为0")

    }

    return a / b, nil

}

// 调用多返回值函数

res, err := divide(10, 2)

if err != nil {

    fmt.Println("错误：", err)

} else {

    fmt.Println("结果：", res) // 5

}
```



1.  命名返回值函数



```
// 定义命名返回值

func calculate(a, b int) (sum, product int) {

    sum = a + b       // 直接使用返回值变量

    product = a \* b

    return            // 无需指定返回值

}

// 调用

s, p := calculate(3, 4) // s=7, p=12
```



1.  可变参数函数



```
// 可变参数（本质是切片）

func sum(nums ...int) int {

    total := 0

    for \_, n := range nums {

        total += n

    }

    return total

}

// 调用

total1 := sum(1, 2, 3)     // 6

total2 := sum(4, 5, 6, 7)  // 22

// 传递切片（需加...）

nums := \[]int{10, 20, 30}

total3 := sum(nums...)     // 60
```



1.  函数作为参数



```
// 定义接收函数参数的函数

func apply(op func(int, int) int, a, b int) int {

    return op(a, b)

}

// 调用（传递add函数）

result := apply(add, 5, 6) // 11
```



1.  匿名函数与闭包



```
// 定义返回函数的函数（闭包）

func makeAdder(base int) func(int) int {

    // 匿名函数捕获base变量

    return func(n int) int {

        return base + n

    }

}

// 使用闭包

adder5 := makeAdder(5)

fmt.Println(adder5(3)) // 8

fmt.Println(adder5(4)) // 9
```

### 注意事项



1.  函数是一等公民，可作为参数、返回值，也可赋值给变量

2.  多返回值通常用于返回结果和错误（最后一个返回值为 error 类型）

3.  可变参数必须是函数的最后一个参数，且只能有一个可变参数

4.  闭包会捕获外部变量，需注意变量生命周期（可能导致内存泄漏）

5.  函数名首字母大写表示可导出（跨包访问），小写表示包内私有

### 易错示例



1.  忽略错误返回值



```
// 错误：忽略错误可能导致后续逻辑异常

result, \_ := divide(10, 0) // 隐藏了"除数不能为0"的错误

fmt.Println(result) // 0（非预期结果）
```



1.  可变参数使用错误



```
// 错误：可变参数位置错误

func wrong(a ...int, b int) {} // 编译错误：cannot use ... with last parameter

// 正确：可变参数作为最后一个参数

func correct(a int, b ...int) {}
```



1.  闭包捕获循环变量



```
// 错误：所有闭包共享同一循环变量

funcs := \[]func(){}

for i := 0; i < 3; i++ {

    funcs = append(funcs, func() {

        fmt.Println(i) // 全部输出3（非预期的0,1,2）

    })

}

// 正确：每次循环创建新变量

for i := 0; i < 3; i++ {

    j := i // 新变量

    funcs = append(funcs, func() {

        fmt.Println(j) // 正确输出0,1,2

    })

}
```

## 方法（Method）操作

### 基本操作



1.  定义结构体与方法



```
// 定义结构体

type Rectangle struct {

    Width  float64

    Height float64

}

// 值接收者方法（操作副本）

func (r Rectangle) Area() float64 {

    return r.Width \* r.Height

}
```



1.  指针接收者方法



```
// 指针接收者方法（操作原对象）

func (r \*Rectangle) Scale(factor float64) {

    r.Width \*= factor

    r.Height \*= factor

}
```



1.  方法调用



```
// 创建结构体实例

rect := Rectangle{Width: 10, Height: 5}

// 调用值接收者方法

area := rect.Area() // 50

// 调用指针接收者方法（自动转换为指针）

rect.Scale(2)

newArea := rect.Area() // 200（宽高已缩放）
```



1.  为非结构体类型定义方法



```
// 定义类型别名（不能直接为int定义方法）

type MyInt int

// 为自定义类型定义方法

func (m MyInt) Add(n MyInt) MyInt {

    return m + n

}

// 使用

num1 := MyInt(5)

num2 := MyInt(3)

sum := num1.Add(num2) // 8
```

### 注意事项



1.  方法与函数的区别：方法有接收者，函数没有

2.  值接收者：方法内操作的是接收者副本，不会影响原对象

3.  指针接收者：方法内操作的是原对象，修改会影响调用者

4.  调用指针接收者方法时，值类型会自动转换为指针，反之亦然

5.  可给任何自定义类型添加方法，但不能直接给基本类型（如 int、string）添加

### 易错示例



1.  值接收者修改无效



```
// 错误：值接收者无法修改原对象

func (r Rectangle) WrongScale(factor float64) {

    r.Width \*= factor // 仅修改副本

}

rect := Rectangle{10, 5}

rect.WrongScale(2)

fmt.Println(rect.Width) // 仍为10（未改变）
```



1.  方法与函数调用混淆



```
// 错误：将方法当作函数调用

area := Rectangle.Area(rect) // 编译错误（需指定接收者）

// 正确：方法调用

area := rect.Area()

// 正确：通过类型调用（需显式传递接收者）

area := (\*Rectangle).Scale(\&rect, 2)
```

## 接口（Interface）操作

### 基本操作



1.  定义接口



```
// 定义形状接口

type Shape interface {

    Area() float64      // 计算面积

    Perimeter() float64 // 计算周长

}
```



1.  实现接口（隐式）



```
// 圆形结构体

type Circle struct {

    Radius float64

}

// 实现Area方法（隐式实现Shape接口）

func (c Circle) Area() float64 {

    return 3.14 \* c.Radius \* c.Radius

}

// 实现Perimeter方法（隐式实现Shape接口）

func (c Circle) Perimeter() float64 {

    return 2 \* 3.14 \* c.Radius

}
```



1.  使用接口（多态）



```
// 接收Shape接口的函数

func PrintShapeInfo(s Shape) {

    fmt.Printf("面积：%.2f，周长：%.2f\n", s.Area(), s.Perimeter())

}

// 使用

circle := Circle{Radius: 5}

PrintShapeInfo(circle) // 多态：Circle作为Shape传入
```



1.  空接口使用



```
// 空接口可接收任何类型

func PrintAny(v interface{}) {

    fmt.Println(v)

}

// 使用

PrintAny(123)      // 整数

PrintAny("hello")  // 字符串

PrintAny(3.14)     // 浮点数

PrintAny(circle)   // 结构体
```



1.  类型断言与类型转换



```
// 类型断言（判断实际类型）

func CheckType(v interface{}) {

    // 判断是否为string类型

    if s, ok := v.(string); ok {

        fmt.Println("字符串：", s)

    } 

    // 判断是否为int类型

    else if i, ok := v.(int); ok {

        fmt.Println("整数：", i)

    }

    // 其他类型

    else {

        fmt.Println("未知类型")

    }

}
```



1.  类型分支（type switch）



```
func TypeSwitch(v interface{}) {

    switch t := v.(type) {

    case string:

        fmt.Println("字符串类型，长度：", len(t))

    case int:

        fmt.Println("整数类型，值：", t)

    default:

        fmt.Println("未知类型：", t)

    }

}
```

### 注意事项



1.  Go 接口采用隐式实现，无需显式声明（实现所有方法即视为实现接口）

2.  接口变量存储两部分信息：实际类型（Type）和实际值（Value）

3.  空接口（interface {}）没有任何方法，可表示任意类型

4.  类型断言失败会触发运行时错误，必须使用 "comma ok" 模式检查

5.  接口可以嵌套，组合多个接口形成新接口

### 易错示例



1.  未完全实现接口



```
// 错误：未实现接口所有方法

type Square struct {

    Side float64

}

// 只实现了Area，未实现Perimeter

func (s Square) Area() float64 {

    return s.Side \* s.Side

}

// 错误：不能赋值给Shape接口（缺少Perimeter方法）

var shape Shape = Square{5} // 编译错误
```



1.  类型断言未检查



```
var v interface{} = "hello"

// 错误：未检查断言结果

num := v.(int) // 运行时错误：type string cannot be converted to type int

// 正确：使用comma ok模式

if num, ok := v.(int); ok {

    fmt.Println("整数：", num)

} else {

    fmt.Println("不是整数")

}
```



1.  空接口的类型判断



```
var v interface{} = nil

// 错误：判断空接口是否为nil

if v == nil {

    // 正确执行（v确实是nil）

}

// 注意：非nil接口变量可能包含nil值

var ptr \*int = nil

v = ptr

if v == nil {

    // 不会执行（v的类型是\*int，值是nil）

}
```

## 反射（Reflection）操作

### 基本操作



1.  获取类型和值信息



```
import "reflect"

type User struct {

    Name string \`json:"name"\`

    Age  int    \`json:"age"\`

}

user := User{Name: "Alice", Age: 30}

// 获取类型信息

t := reflect.TypeOf(user)

fmt.Println("类型名：", t.Name())       // User

fmt.Println("类型种类：", t.Kind())    // struct

// 获取值信息

v := reflect.ValueOf(user)

fmt.Println("值：", v)                // {Alice 30}
```



1.  访问结构体字段



```
// 获取字段数量

fieldCount := t.NumField()

fmt.Println("字段数量：", fieldCount) // 2

// 遍历字段

for i := 0; i < fieldCount; i++ {

    field := t.Field(i)

    fieldValue := v.Field(i)

    fmt.Printf("字段名：%s，类型：%s，值：%v，标签：%s\n",

        field.Name,          // 字段名

        field.Type,          // 字段类型

        fieldValue.Interface(), // 字段值

        field.Tag.Get("json")) // 字段标签

}
```



1.  调用结构体方法



```
// 定义结构体方法

func (u User) SayHello() {

    fmt.Printf("Hello, I'm %s\n", u.Name)

}

// 获取方法并调用

method := v.MethodByName("SayHello")

if method.IsValid() {

    method.Call(nil) // 调用无参方法（输出：Hello, I'm Alice）

}
```



1.  修改字段值（需指针）



```
// 传递指针才能修改值

userPtr := \&user

vPtr := reflect.ValueOf(userPtr).Elem() // 获取指针指向的值

// 检查是否可设置

ageField := vPtr.FieldByName("Age")

if ageField.CanSet() {

    ageField.SetInt(31) // 修改值

    fmt.Println("修改后年龄：", user.Age) // 31

}
```

### 注意事项



1.  反射会降低程序性能（比直接操作慢 10-100 倍），避免在性能敏感场景使用

2.  反射代码可读性差，维护成本高，优先使用类型断言或类型分支

3.  修改值必须满足可设置性（CanSet ()），通常需要传递指针

4.  反射可能绕过编译期类型检查，导致运行时错误，需谨慎使用

5.  反射适用于通用框架（如 JSON 序列化），业务逻辑中尽量避免

### 易错示例



1.  尝试修改不可设置的值



```
user := User{Name: "Bob"}

// 错误：传递值而非指针

v := reflect.ValueOf(user)

// 运行时错误：cannot set field Name of unaddressable value

v.FieldByName("Name").SetString("Alice")
```



1.  错误处理方法调用



```
// 错误：调用不存在的方法

method := v.MethodByName("NonExistent")

method.Call(nil) // 运行时错误：call of reflect.Value.Call on zero Value

// 正确：检查方法是否存在

if method.IsValid() {

    method.Call(nil)

}
```



1.  错误处理不同类型的值



```
v := reflect.ValueOf(100)

// 错误：对int类型调用FieldByName

v.FieldByName("Age") // 运行时错误：reflect: call of reflect.Value.FieldByName on int Value
```

## 测试（Testing）操作

### 基本操作



1.  基础测试函数（文件名：math\_test.go）



```
package main

import "testing"

// 被测试函数

func Add(a, b int) int {

    return a + b

}

// 测试函数（命名格式：TestXxx）

func TestAdd(t \*testing.T) {

    // 测试用例

    result := Add(2, 3)

    expected := 5

    

    // 断言结果

    if result != expected {

        t.Errorf("Add(2, 3) = %d; 期望 %d", result, expected)

    }

}
```



1.  表格驱动测试



```
// 被测试函数

func Subtract(a, b int) int {

    return a - b

}

// 表格驱动测试（推荐）

func TestSubtract(t \*testing.T) {

    // 定义测试用例集合

    tests := \[]struct {

        name     string // 测试用例名称

        a, b     int    // 输入参数

        expected int    // 预期结果

    }{

        {"正数相减", 5, 3, 2},

        {"负数结果", 3, 5, -2},

        {"零值测试", 0, 0, 0},

    }

    // 遍历执行测试用例

    for \_, tt := range tests {

        // 子测试（便于定位问题）

        t.Run(tt.name, func(t \*testing.T) {

            result := Subtract(tt.a, tt.b)

            if result != tt.expected {

                t.Errorf("Subtract(%d, %d) = %d; 期望 %d",

                    tt.a, tt.b, result, tt.expected)

            }

        })

    }

}
```



1.  基准测试



```
// 基准测试（命名格式：BenchmarkXxx）

func BenchmarkAdd(b \*testing.B) {

    // 重置计时器（忽略前置准备时间）

    b.ResetTimer()

    

    // 执行b.N次（自动调整次数）

    for i := 0; i < b.N; i++ {

        Add(2, 3)

    }

}
```



1.  测试覆盖率



```
// 运行测试并生成覆盖率报告

// 命令：go test -coverprofile=coverage.out

// 查看报告：go tool cover -html=coverage.out
```

### 注意事项



1.  测试文件命名必须为 `xxx_test.go`，测试函数命名必须为 `TestXxx(t *testing.T)`

2.  基准测试函数命名为 `BenchmarkXxx(b *testing.B)`，内部需循环 `b.N` 次

3.  使用 `t.Run()` 创建子测试，便于单独运行和定位问题

4.  测试函数应保持独立，不依赖外部资源和其他测试的执行顺序

5.  好的测试应覆盖正常情况、边界条件、错误情况

### 易错示例



1.  测试函数命名错误



```
// 错误：函数名小写，不会被测试框架识别

func testAdd(t \*testing.T) {

    // 测试代码（不会执行）

}
```



1.  基准测试未使用循环



```
// 错误：未循环b.N次，无法获得准确性能数据

func BenchmarkAddWrong(b \*testing.B) {

    Add(2, 3) // 只执行一次

}
```



1.  测试依赖外部状态



```
var global int

// 错误：测试依赖全局变量，可能受其他测试影响

func TestIncrement(t \*testing.T) {

    global++

    if global != 1 {

        t.Error("测试失败")

    }

}
```

## 错误（Error）处理

### 基本操作



1.  定义自定义错误



```
import (

    "errors"

    "fmt"

)

// 定义可复用的错误变量

var (

    ErrInvalidInput  = errors.New("无效的输入")

    ErrDivisionByZero = errors.New("除数不能为零")

)
```



1.  返回错误信息



```
// 返回结果和错误

func Divide(a, b float64) (float64, error) {

    if b == 0 {

        return 0, ErrDivisionByZero // 返回预定义错误

    }

    return a / b, nil // 成功返回nil

}
```



1.  包装错误（添加上下文）



```
// 解析字符串为数字

func parseFloat(s string) (float64, error) {

    var num float64

    \_, err := fmt.Sscanf(s, "%f", \&num)

    if err != nil {

        return 0, ErrInvalidInput

    }

    return num, nil

}

// 包装错误（保留原始错误）

func Calculate(a, b string) (float64, error) {

    numA, err := parseFloat(a)

    if err != nil {

        // 使用%w包装错误，保留错误链

        return 0, fmt.Errorf("解析第一个数字失败: %w", err)

    }

    return Divide(numA, parseFloat(b))

}
```



1.  判断错误类型



```
// 检查错误类型

func main() {

    result, err := Calculate("10", "0")

    if err != nil {

        // 判断是否为特定错误

        if errors.Is(err, ErrDivisionByZero) {

            fmt.Println("计算错误:", err)

        } else if errors.Is(err, ErrInvalidInput) {

            fmt.Println("输入错误:", err)

        } else {

            fmt.Println("未知错误:", err)

        }

        return

    }

    fmt.Println("结果:", result)

}
```



1.  自定义错误类型



```
// 定义自定义错误类型

type ValidationError struct {

    Field   string

    Message string

}

// 实现Error()方法（满足error接口）

func (e \*ValidationError) Error() string {

    return fmt.Sprintf("字段%s验证失败: %s", e.Field, e.Message)

}

// 使用自定义错误

func ValidateUser(name string) error {

    if len(name) == 0 {

        return \&ValidationError{

            Field:   "Name",

            Message: "不能为空",

        }

    }

    return nil

}
```

### 注意事项



1.  优先使用 `errors.Is``()` 判断错误类型（处理包装错误），而非直接比较

2.  使用 `%w` 包装错误（Go 1.13+），保留错误链，便于追溯根源

3.  错误信息应简洁明了，说明 "什么错误" 而非 "怎么实现"

4.  不要忽略错误，至少记录日志（生产环境）

5.  自定义错误类型可携带更多上下文信息（如错误码、字段名）

### 易错示例



1.  忽略错误返回值



```
// 错误：忽略错误可能导致后续逻辑异常

result, \_ := Divide(10, 0) // 隐藏了"除数不能为零"的错误

fmt.Println(result) // 0（非预期结果）
```



1.  错误比较方式



```
err := Calculate("10", "0")

// 错误：直接比较无法处理包装错误

if err == ErrDivisionByZero {

    // 不会执行（错误已被包装）

}

// 正确：使用errors.Is()

if errors.Is(err, ErrDivisionByZero) {

    // 正确执行

}
```



1.  错误信息不明确



```
// 错误：错误信息模糊

func badError() error {

    return errors.New("发生错误") // 无法判断具体错误

}

// 正确：错误信息具体

func goodError() error {

    return errors.New("文件打开失败：权限不足") // 明确原因

}
```

> （注：文档部分内容可能由 AI 生成）