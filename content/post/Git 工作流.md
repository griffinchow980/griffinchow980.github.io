---
title: "Git 工作流全面解析"
date: 2025-07-13T10:00:00+08:00
categories: ["版本控制"]
tags: ["git", "工作流"]
draft: false
description: "介绍主流 Git 工作流，包括 Git flow、Github flow、Gitlab flow，并对比其适用场景和操作流程。"
summary: "介绍主流 Git 工作流，包括 Git flow、Github flow、Gitlab flow，并对比其适用场景和操作流程。"
---


# Git 工作流全面解析

本文参考 [hifreud](https://www.hifreud.com/2019/02/25/git-workflow/) 和 [阮一峰](https://www.ruanyifeng.com/blog/2015/12/git-workflow.html) 的内容，系统梳理主流的 Git 工作流方案，帮助你选择最适合团队协作和项目管理的版本控制流程。

---

## 为什么需要工作流？

合理的工作流可以：
- 明确分支职责，减少冲突
- 规范开发、测试、发布流程
- 提高协作效率和代码质量

---

## 主流 Git 工作流对比

{{< tabs "Git flow,Github flow,Gitlab flow" >}}

### Git flow

Git flow 是最经典的分支管理模型，适合有明确发布周期的项目。

```
master
  |
  |--------------------|
  |                    |
develop             hotfix
  |
  |--------------------|
  |                    |
feature             release
```

**分支类型与操作：**

- `master`：生产环境分支，只保存已发布版本
- `develop`：开发主分支，集成所有功能
- `feature/*`：新功能开发分支
- `release/*`：发布准备分支
- `hotfix/*`：紧急修复分支

**常用 Git 命令：**

新建功能分支并开发：
```shell
git checkout develop
git checkout -b feature/awesome-feature
# 开发并提交
git add .
git commit -m "feat: add awesome feature"
git checkout develop
git merge feature/awesome-feature
git branch -d feature/awesome-feature
```

准备发布：
```shell
git checkout develop
git checkout -b release/v1.0.0
# 修复bug、准备发布
git add .
git commit -m "fix: release bugfix"
git checkout master
git merge release/v1.0.0
git tag v1.0.0
git checkout develop
git merge release/v1.0.0
git branch -d release/v1.0.0
```

紧急修复：
```shell
git checkout master
git checkout -b hotfix/urgent-fix
# 修复并提交
git add .
git commit -m "fix: urgent bug"
git checkout master
git merge hotfix/urgent-fix
git tag v1.0.1
git checkout develop
git merge hotfix/urgent-fix
git branch -d hotfix/urgent-fix
```

**优缺点：**
- 优点：适合大型项目和多版本维护，流程规范
- 缺点：分支较多，操作复杂，不适合持续交付

|||

### Github flow

Github flow 更加简单，适合持续交付和小型项目，主分支始终可部署。

```
main
 |
 |-- feature-1
 |      |
 |      |-- Pull Request
 |      |
 |-- feature-2
        |
        |-- Pull Request
```

**流程步骤与操作：**

新建功能分支并开发：
```shell
git checkout main
git checkout -b feature/short-desc
# 开发并提交
git add .
git commit -m "feat: short description"
git push origin feature/short-desc
```

发起 Pull Request，代码评审、自动测试通过后合并到 main：
```shell
# 在 GitHub 网页发起 PR，合并后本地同步
git checkout main
git pull origin main
git branch -d feature/short-desc
```

**优缺点：**
- 优点：流程简单，易于理解和执行，适合持续集成和持续部署（CI/CD）
- 缺点：不适合多版本并行开发，发布流程不够细致

|||

### Gitlab flow

Gitlab flow 结合了 Git flow 和 Github flow，支持多环境和多版本发布，适合企业级项目。

```
production
    |
pre-production
    |
   main
    |
 |------|
feature bugfix
    |
release
```

**分支类型与环境：**
- `production`：生产环境分支
- `pre-production`：预发布环境分支
- `main`：开发主分支
- `feature/*`、`bugfix/*`、`release/*`：功能、修复、发布分支

**典型流程与操作：**

开发分支：
```shell
git checkout main
git checkout -b feature/new-feature
# 开发并提交
git add .
git commit -m "feat: new feature"
git push origin feature/new-feature
# 合并到 main
git checkout main
git merge feature/new-feature
git branch -d feature/new-feature
```

发布到预生产环境：
```shell
git checkout pre-production
git merge main
# 测试通过后
git checkout production
git merge pre-production
```

**优缺点：**
- 优点：灵活支持多环境和多版本，适合复杂项目和企业团队
- 缺点：流程较为复杂，需要团队协作规范

{{< /tabs >}}

---

## 总结

- **Git flow**：适合有发布周期、版本维护需求的项目
- **Github flow**：适合持续交付、快速迭代的小型项目
- **Gitlab flow**：适合多环境、多版本、企业级项目

选择合适的工作流，能让你的团队协作更高效，代码管理更规范。

---

> 参考资料：
> - [hifreud：Git 工作流](https://www.hifreud.com/2019/02/25/git-workflow/)
> - [阮一峰：Git 工作流](https://www.ruanyifeng.com/blog/2015/12/git-workflow.html)