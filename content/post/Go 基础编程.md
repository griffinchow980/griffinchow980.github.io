---
title: "Go 基础"
categories: ["编程语言"]
tags: ["go"]
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

## 条件语句

### `if` 语句
- `if` 格式
  ```go
  if 布尔表达式 {
      /* 布尔表达式为 true 时执行 */
  }
  ```
- `if - else` 格式
  ```go
  if 布尔表达式 {
    /* 在布尔表达式为 true 时执行 */
  } else {
    /* 在布尔表达式为 false 时执行 */
  }
  ```

{{< admonition type="example" title="go 简介" collapse="true" >}}

Go 语言是一种静态类型、编译型的编程语言。

Go 最大的特点是内置并发机制，通过 goroutine 和 channel 实现高效并发编程。

Go 拥有丰富的标准库，包管理简单，常用命令包括编译（go build）、运行（go run）、测试（go test）和格式化（go fmt）。

Go 适合开发高性能后端服务和云原生应用。

{{< /admonition >}}


Go 的并发通过 goroutine 和 channel 实现：

```go
go func() {
    fmt.Println("并发执行")
}()
```

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