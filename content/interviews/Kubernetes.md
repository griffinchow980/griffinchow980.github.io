---
title: "Kubernetes"
date: 2023-08-20
---

{{< details "Kubernetes 是什么？" >}}
Kubernetes 是一个开源的容器编排平台，用于自动化部署、扩展和管理容器化应用程序。
{{< /details >}}

{{< details "Kubernetes 的核心组件有哪些？" >}}
- Master 组件：kube-apiserver, kube-scheduler, kube-controller-manager, etcd.
- Node 组件：kubelet, kube-proxy, container runtime.
{{< /details >}}

{{< details "Kubernetes 的 Pod 是什么？" >}}
Pod 是 Kubernetes 中最小的部署单元。它可以包含一个或多个容器，这些容器共享网络和存储资源。
{{< /details >}}

{{< details "Kubernetes 的 Service 是什么？" >}}
Service 是对一组 Pod 的抽象，它定义了访问这些 Pod 的方式。Service 可以提供负载均衡和服务发现的功能。
{{< /details >}}

{{< details "Kubernetes 的 Deployment 是什么？" >}}
Deployment 用于管理 Pod 的部署和更新。它可以确保指定数量的 Pod 正在运行，并在 Pod 发生故障时自动替换它们。
{{< /details >}}

{{< details "Kubernetes 的 Ingress 是什么？" >}}
Ingress 用于将外部流量路由到集群内部的 Service。它可以提供基于 HTTP/HTTPS 的路由规则。
{{< /details >}}

{{< details "Kubernetes 的 ConfigMap 和 Secret 有什么区别？" >}}
- ConfigMap 用于存储非敏感的配置数据。
- Secret 用于存储敏感数据，例如密码、API 密钥等。Secret 中的数据是经过 base64 编码的。
{{< /details >}}

{{< details "Kubernetes 的 livenessProbe 和 readinessProbe 有什么区别？" >}}
- livenessProbe 用于检测容器是否还存活。如果检测失败，kubelet 会杀死该容器，并根据重启策略来决定是否重启它。
- readinessProbe 用于检测容器是否已经准备好接收请求。如果检测失败，端点控制器会从 Service 的端点中移除该 Pod 的 IP 地址。
{{< /details >}}

{{< details "Kubernetes 的 Helm 是什么？" >}}
Helm 是 Kubernetes 的包管理器。它允许你定义、安装和升级复杂的 Kubernetes 应用程序。
{{< /details >}}

{{< details "Kubernetes 的亲和性和反亲和性是什么？" >}}
- 亲和性：用于将 Pod 调度到满足特定条件的节点上。
- 反亲和性：用于避免将 Pod 调度到满足特定条件的节点上。
{{< /details >}} 