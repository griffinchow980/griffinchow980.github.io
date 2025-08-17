---
title: "Go 基础操作手册"
date: 2020-09-10
categories: ["语言基础"]
tags: ["go","go基础"]
draft: false
description: "这份手册涵盖了 Go 开发基础内容。"
summary: "这份手册涵盖了 Go 开发基础内容。"
---

# 程序结构
1. **包声明（package）**
   -  每个 Go 文件必须以 `package` 声明开头，且主程序入口包为 `main`，库文件可用其他包名
   -  包导入顺序：标准库 → 第三方库 → 本地库（不同类别间空行分隔）
   -  文件名（文件夹名）与包名没有直接关系，命名无需一致
   -  同一个文件夹下的文件只能有一个包名，否则编译报错
2. **导入包（import）**
   -  使用 `import` 导入标准库或第三方包，多个包可用括号分组
   -  只导入需要的包，未使用的包编译会报错
3. **标识符（函数名、变量、常量、类型、结构体字段等）**
   -  首字母大写的命名可导出，首字母小写的命名对包外不可见
4. **函数（func）**
   -  `main` 包必须有 `main()` 函数作为程序入口
   -  启动后若没有 `init()` 函数，则是第一个执行的函数
5. **语句与表达式**
   -  注意左大括号紧跟标识符一行
   -  非全局变量多用短变量声明 `:=`
6. **注释**
   -  单行 `//`，多行 `/* */`


{{< admonition type="example" title="参考示例 `basic_structure.go`" collapse="true" >}}
```go
package main

import (
    "fmt"      // 标准库
    "math/rand"

    // "yourpkg" // 本地或第三方库（示例）
)

// 全局常量与变量
const Version = "1.0"
var globalCount int

/* 
类型定义
首字母大写可导出
*/
type User struct {
    Name string  
    age  int    
}

// init 函数，main 前自动执行
func init() {
    fmt.Println("程序初始化")
}

// 主入口函数
func main() {
    // 局部变量推荐用 :=
    user := User{Name: "Tom", age: 18}
    fmt.Printf("Hello, %s!\n", user.Name)

    // 流程控制示例
    for i := 0; i < 3; i++ { //左大括号紧跟标识符一行
        fmt.Println("循环次数：", i)
    }

    // 错误处理示例
    if err := doSomething(); err != nil { //左大括号紧跟标识符一行
        fmt.Println("发生错误：", err)
    }
}

/* 
普通函数
首字母小写仅包内可见
*/
func doSomething() error {
    // 这里可以写具体逻辑
    return nil
}
```
在终端执行文件使用 `go run` 
```bash
$ go run basic_structure.go
程序初始化
Hello, Tom!
循环次数： 0
循环次数： 1
循环次数： 2
```
将程序构建成二进制文件通过 `go biuld` 来实现
```bash
$ go build basic_structure.go
$ ls
basic_structure basic_structure.go

$ ./basic_structure
程序初始化
Hello, Tom!
循环次数： 0
循环次数： 1
循环次数： 2
```

{{< /admonition >}}

# 变量
**显式初始化**
```go
var a int 
var b int = 10
```
**隐式初始化（自动推断类型）**
```go
var c = 20        // 推断为 int
var flag = true   // 推断为 bool
```
**短变量初始化**
```go
x := 100
msg := "hello"
```
**多变量声明** 
```go
var m, n int
var s, t = "foo", "bar"
a, b := 1, 2

var (
    name, gender  string  = "Tom", "man"
    age           int     = 18
    score         float64 // 默认零值 0
)
```
**匿名变量（用于占位，丢弃值）**
```go
_, result := someFunc()
```


# 常量

**常量初始化**
```go
const s string = "constant" 
```
**多常量初始化**
```go
const (
    Pi = 3.14
    Name = "Go"
)
```
**常量枚举 `iota`**
```go
const (
    A = iota // 0
    B        // 1
    C        // 2
)
```

- 常量表达式以任意精度执行算术运算
- 数字常量没有类型，除非通过显式转换等方式赋予类型

# `if else` 语句

**`if` 格式**
```go
if 条件表达式 {

}
```
**`if - else` 格式**
```go
if 条件表达式1 {

} else if 条件表达式2 {

} else {

} //可继续叠加条件
```
**`if` 短变量声明（作用域仅限于 `if` 语句块内）**
```go
if num := 19; num < 18 {

} else {

}
```

{{< admonition type="example" title="参考示例 `if_else.go`" collapse="true" >}}
```go
package main

import "fmt"      

func main() {
    // 判断闰年
    if year := 2020; (year%4 == 0 && year%100 != 0) || year%400 == 0 {
        fmt.Printf("%d 是闰年\n", year)
    } else {
        fmt.Printf("%d 不是闰年\n", year)
    }
}
```

```bash
$ go run if_else.go
2020 是闰年
```
{{< /admonition >}}

# `switch case default fallthrough` 语句
```go
switch 变量表达式 {
    case 条件表达式1:
        
    case 条件表达式2, 条件表达式3:  //可以同时测试多个可能符合条件的值
        
    default:
        
}
```
{{< admonition type="example" title="参考示例 `switch.go`" collapse="true" >}}
```go
package main

import "fmt"

func main() {
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
}
```

```bash
$ go run switch.go
<10
```

{{< /admonition >}}

{{< admonition type="example" title="参考示例 `type_switch.go`" collapse="true" >}}
**`type-switch` 比较的是类型而不是值**

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
```bash
$ go run type_switch.go
x 是 nil
```

**接口值为 `nil` 的双重 `nil` 陷阱**

`type switch` 中 `case nil` 只在 `interface` 本身为 `nil` 才成立。若接口里包含着一个「typed nil」，会命中相应的具体类型分支，所以务必在判断之前做 `type switch` 或显式比较 `reflect.ValueOf(w).IsNil()`（限指针/chan/map/slice/func 接口）

```go
package main

import (
	"bytes"
	"fmt"
	"io"
	"os"
)
func main() {
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
}
```

```bash
$ go run type_switch.go
w is nil
false
typed nil still matches *bytes.Buffer
```
{{< /admonition >}}

# `for range` 语句
**三段式**
```go
for 初始化; 条件表达式; 循环操作 { 

}
```

**条件式（相当于 while）**
```go
for 条件表达式 {

}
```

**无限循环**
```go
for { }
```

**`range` 格式（可以对 `string`、 `array`、 `slice`、`map` 等进行迭代循环）**
```go
for 下标/键, 值 := range 遍历对象 { 

}
```



# `array` 数组
- 数组是 **值类型**，赋值/传参会 **复制整个数组**

- 不同长度的数组是 **不同的类型**（不能直接赋值）

- 通常用数组做底层结构，业务开发更多使用切片（`[]T`）


{{< admonition type="example" title="参考示例 `arrays.go`" collapse="true" >}}
```go
package main

import "fmt"

// 数组是值类型，在赋值、作为函数参数时会复制整个数组：
func modify(arr [3]int) {
	arr[0] = 99
}

// 修改原始数据，传指针或切片：
func modify_pointer(arr *[3]int) {
	arr[0] = 99
}

func main() {
	var s [3]string // 声明数组并初始化
	s = [3]string{"h", "e", "l"} // 定义数组
	fmt.Println("s:", s)

	a := [3]int{0, 1, 2}        // 初始化
	arr := [5]int{0: 10, 3: 20} // 只初始化第0和第3个
	c := [...]int{1, 2, 3}      // 编译器自动推断长度

	fmt.Println("a:", a)
	fmt.Println("arr:", arr)
	fmt.Println("c:", c)

	// 声明并初始化二维数组
	var grid [2][3]int // 2行3列 的二维数组
	for i := 0; i < 2; i++ {
		for j := 0; j < 3; j++ {
			grid[i][j] = i + j
		}
	}
	fmt.Println("grid:", grid)

	// 遍历
	fmt.Println("普通 for 遍历 a:")
	for i := 0; i < len(a); i++ {
		fmt.Println(a[i])
	}

	fmt.Println("range 遍历 a:")
	for i, v := range a {
		fmt.Printf("Index %d: Value %d\n", i, v)
	}

	// 验证值传递（原数组不变）
	modify(a)
	fmt.Println("after modify(a):", a[0]) // 输出 0

	// 传指针，修改原数组
	modify_pointer(&a)
	fmt.Println("after modify_pointer(&a):", a[0]) // 输出 99
}
```

```
$ go run arrays.go
s: [h e l]
a: [0 1 2]
arr: [10 0 0 20 0]
c: [1 2 3]
grid: [[0 1 2] [1 2 3]]
普通 for 遍历 a:
0
1
2
range 遍历 a:
Index 0: Value 0
Index 1: Value 1
Index 2: Value 2
after modify(a): 0
after modify_pointer(&a): 99
```
{{< /admonition >}}

# `slice` 切片

- 切片是引用类型，修改会影响原数据，不想影响原数据，请使用 `copy()`


{{< admonition type="example" title="参考示例 `arrays.go`" collapse="true" >}}
```go
package main

import "fmt"

func main() {
	s := []int{1, 2, 3}
	fmt.Println("初始：", s)

	s = append(s, 4, 5)
	fmt.Println("追加：", s)

	sub := s[1:4]
	fmt.Println("截取：", sub)

	sub[0] = 100
	fmt.Println("修改sub：", sub)
	fmt.Println("影响s：", s)

	// 删除第2个元素
	s = append(s[:2], s[3:]...)
	fmt.Println("删除第2个元素后：", s)

	// 拷贝
	copySlice := make([]int, len(s))
	copy(copySlice, s)
	copySlice[0] = 999
	fmt.Println("原始切片：", s)
	fmt.Println("拷贝切片：", copySlice)
}
```

```
$ go run arrays.go
s: [h e l]
a: [0 1 2]
arr: [10 0 0 20 0]
c: [1 2 3]
grid: [[0 1 2] [1 2 3]]
普通 for 遍历 a:
0
1
2
range 遍历 a:
Index 0: Value 0
Index 1: Value 1
Index 2: Value 2
after modify(a): 0
after modify_pointer(&a): 99
```
{{< /admonition >}}


