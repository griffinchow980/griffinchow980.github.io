---
title: "Go 基础 test"
# categories: ["编程语言"]
# tags: ["go"]
date: 2020-07-14
summary: "Go 基本概念与基础操作"
---

{{< admonition type="abstract" title="go 简介" collapse="false" >}}

Go 语言是一种静态类型、编译型的编程语言。

Go 最大的特点是内置并发机制，通过 goroutine 和 channel 实现高效并发编程。

Go 拥有丰富的标准库，包管理简单，常用命令包括编译（go build）、运行（go run）、测试（go test）和格式化（go fmt）。

Go 适合开发高性能后端服务和云原生应用。

{{< /admonition >}}


# 初始化


# 基本数据类型

下面是一个简单的 Go 程序：

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```
# 复合数据类型


# 运算符

- **静态类型**：编译时类型检查，减少运行时错误。
- **并发支持**：通过 goroutine 和 channel 实现高效并发。
- **丰富标准库**：内置大量实用包，涵盖网络、加密、文本处理等。
- **跨平台**：支持主流操作系统和架构。

# 流程控制

## `if else` 语句
- 由条件表达式控制，条件表达式为 `true` 执行，为 `false` 不执行或执行 `else` 

`if` 格式
```go
if 条件表达式 {

}
```
`if - else` 格式
```go
if 条件表达式1 {

} else if 条件表达式2 {

} else {

} //可继续叠加条件
```

{{< admonition type="warning" title="条件表达式中初始化语句作用域 & 变量遮蔽" collapse="true" >}}
`if 初始化; 条件` 中的变量仅在 `if else` 链内部可见，不能在外部继续使用
```go
if x := 10; x > 5 {
    fmt.Println(x)         // 10
} else if x := 3; x < 5 {  // 这里的 x 与上面的 x 不是同一个
    fmt.Println(x)         // 3
}
fmt.Println(x)             // 编译错误：x 未定义
```
{{< /admonition >}}

## `switch case default fallthrough` 语句
- `switch` 语句通过不同的 `case` 分支的条件表达式从上到下进行匹配，直到匹配或 `default` 为止
- 变量表达式可以是任何类型，而条件表达式必须是变量表达式的同类型（任意值）
- Go 的 `switch` 自带 `break`，只有 `fallthrough` 才会继续

```go
switch 变量表达式 {
    case 条件表达式1:
        
    case 条件表达式2, 条件表达式3:  //可以同时测试多个可能符合条件的值
        
    default:
        
}
```

{{< admonition type="warning" title="无表达式 `switch` & `fallthrough` 只跳一层" collapse="true" >}}
- `switch` 后面没有变量表达式，则相当于 `switch true`
- `fallthrough` 只会把控制权交给紧接的下一个 `case` 块，不会再判断条件且只能跳一次
```go
x := 7
switch {                 // 无表达式，相当于 switch true
    case x%2 == 0:
        fmt.Println("even")
        fallthrough          // 跳过下一个判断条件强制继续检查下一个 case 的语句块
    case x < 10:
        fmt.Println("<10")   // 会执行
        // fallthrough 不可再接表达式；只能跳一个
    default:
        fmt.Println("other")
}
```
{{< /admonition >}}

{{< admonition type="example" title="`type-switch` 语句" collapse="true" >}}
`switch` 语句还可以用于通过 `type-switch` 来判断某个 `interface` 变量中实际存储的类型。

```go
package main

import "fmt"

func demo() { fmt.Println("demo func") }  // 用于 func 分支的示例函数

func main() {
    var x interface{}

    // 尝试把不同值写到 x，看看命中哪个分支：
    // x = nil          // nil
    // x = 42           // int
    // x = demo         // func
    // x = true         // bool

    switch v := x.(type) {
        case nil:
        fmt.Println("x 是 nil")
        case int:
        fmt.Printf("x 是 int，值=%d\n", v)
        case func():
        fmt.Printf("x 是 func，调用结果：")
        v()
        case bool:
        fmt.Printf("x 是 bool，值=%v\n", v)
        default:
        fmt.Printf("x 类型未知")  
    }
}      
```
{{< admonition type="warning" title="接口值为 `nil` 的双重 `nil` 陷阱" collapse="true" >}}
`type switch` 中 `case nil` 只在 `interface` 本身为 `nil` 才成立。若接口里包含着一个「typed nil」，会命中相应的具体类型分支，所以务必在判断之前做 `type switch` 或显式比较 `reflect.ValueOf(w).IsNil()`（限指针/chan/map/slice/func 接口）。

```go
var w io.Writer              // 接口变量本身为 nil
switch v := w.(type) {
    case nil:
        fmt.Println("w is nil")  // 进入这里
    case *os.File:
        _ = v
}

// 如果 w != nil 但其内部具体值等于 nil：
var buf *bytes.Buffer       // buf == nil
w = buf                     // 接口变量 w 内部存储了「类型 = bytes.Buffer，值 = nil」二元组
fmt.Println(w == nil)       // false
switch w.(type) {           // 这里不会匹配 nil case
    case *bytes.Buffer:
    fmt.Println("typed nil still matches *bytes.Buffer")
}
```
{{< /admonition >}}

{{< /admonition >}}

## `select` 语句
- 随机执行一个可运行的 `case`，如果没有 `case` 可运行或没有 `default` 则会**阻塞**，直到任一 `case` 可运行
- 除 `default` 外，每个 `case` 操作一个 `channel` （要么读要么写），读操作要判断是否成功读取，关闭的 `channel` 也可以读取
- `select` 会在执行前先计算出所有相关表达式（**通道表达式**和**向通道发送数据的表达式**即 `case ch <- 表达式` ）的值，再判断 `case` 的就绪状态

```go
select {
    case 通道表达式1:
        
    case 通道表达式2:
        
    default:
    
}
```
{{< admonition type="warning" title="`select` 空语句 & `nil` 通道动态屏蔽" collapse="true" >}}

- 如果 `select` 空语句，当前协程被阻塞，程序会 `panic`
- `nil` 通道会让对应 `case` 永远阻塞，可用来**开关**分支

```go
// 程序会被阻塞
select {
}

var ch chan int  // nil
select {
case ch <- 1:    // 被屏蔽
case <-time.After(time.Millisecond):
    fmt.Println("timeout")
}
```
{{< /admonition >}}


## `for range` 语句
三段式
```go
for 初始化; 条件表达式; 循环操作 { }
```

条件式，相当于 while
```go
for 条件表达式 { }
```

无限循环
```go
for { }
```
`range` 格式可以对 `string`、 `array`、 `slice`、`map` 等进行迭代循环
```go
for 下标, 值 := range 遍历对象{ }
```

{{< admonition type="warning" title="指针/地址陷阱 & `map` 遍历无序" collapse="true" >}}

由于每次遍历的值的地址相同，可以在循环内重新取切片元素地址，如 `&nums[i]`

```go
nums := []int{10, 20, 30}
ptrs := []*int{}
for _, v := range nums {
    ptrs = append(ptrs, &v)  // v 每次循环地址相同
}
fmt.Println(*ptrs[0], *ptrs[1], *ptrs[2])   // 30 30 30

// map 遍历顺序随机，不依赖顺序
m := map[int]string{1: "A", 2: "B", 3: "C"}
for k, v := range m { fmt.Printf("%d:%s ", k, v) }  // 每次运行顺序可能不同
```
{{< /admonition >}}

{{< admonition type="warning" title="闭包陷阱" collapse="true" >}}

闭包捕获循环变量

```go
fns := []func(){}
for i := 0; i < 3; i++ {
    i := i  // 重新声明，避免捕获同一个 i
    fns = append(fns, func() { fmt.Print(i) })
}
fns[0](); fns[1](); fns[2]();
```
{{< /admonition >}}


## `break continue goto` 语句
- break：跳出循环体
- continue：跳出一次循环（不执行当前循环）
- goto：无条件地跳到过程中指定的标签处
```go
标签:
    // 标签内语句
// 其他语句
break 标签  // 也适continue、goto
```

{{< admonition type="warning" title="只能在当前作用域跳转" collapse="true" >}}

- 不能跳过某个变量的声明，然后在目标位置使用该变量
- 不能跳转到不同作用域后，再访问被跳过的局部变量

```go
// 编译错误：跳过了 x 的声明
goto L1       
x := 1
L1:
fmt.Println(x)

i := 0           
{
    // 编译错误：跳转到不同作用域
    LOOP_START:
    i = 1
}

for i < 3 {
    fmt.Print(i)
    i++
    if i == 2 { goto LOOP_START }
}
```
{{< /admonition >}}

## `defer` 语句
- 延迟语句可以多句，且按照后进先出（LIFO）顺序执行

{{< admonition type="warning" title="参数在注册时求值 & defer 修改具名返回值" collapse="true" >}}

- 若想在 defer 中使用循环变量，宜把它作为参数传入
- defer 能操作具名返回值，实现“最后时刻修改”

```go
func tricky() (n int) {
    for i := 0; i < 3; i++ {
        defer func(i int) {
            n += i
        }(i)            // 传值，立即捕获 i
    }
    return 100
}
fmt.Println(tricky())      // 100 + 2 + 1 + 0 = 103

// defer 修改具名返回值
func foo() (err error) {
    defer func() { err = fmt.Errorf("overwritten") }()
    return nil
}
fmt.Println(foo())         // "overwritten"
```
{{< /admonition >}}


# 指针

Go 使用 `go mod` 进行包管理：

```shell
go mod init 项目名
go get 包名
```

# 函数

- 编译：`go build`
- 运行：`go run 文件.go`
- 测试：`go test`
- 格式化：`go fmt`

# 方法

- [Go 官方文档](https://go.dev/doc/)
- [Go 语言圣经（中文版）](https://docs.kilvn.com/gopl-zh/)
- [Go 入门指南](https://docs.kilvn.com/the-way-to-go_ZH_CN/)
- [Go 标准库](https://docs.kilvn.com/go-library/)

# 接口 `interface`

# 反射

# 错误处理