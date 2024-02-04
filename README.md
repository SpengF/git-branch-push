## 概述

`epmgit`快速提交代码到各个分支,减少手动切换 develop,daily,hotfix 等分支。实现一键提交功能。

### epmgit 功能特性

1. 提供多个分支存档记录,可切换使用哪套分支
2. 快速 push
3. 快速 cherry-pick

## 开始使用

### 安装

> 请确认你在本地全局安装了`Node.js`，然后使用`npm`将`epmgit`全局安装：

```
$ npm install epmgit -g
```

> 请确保 epmgit add 的所有分支与远程分支进行关联

```
$ git checkout -b develop origin/develop
```

## 基础命令

### 示例

```
$ epmgit ls

* develop-daily ----------  develop,daily
  useBranchs   ----------   develop,release
```

### Commands

```
Commands:
   add <name> <branch>        add branch,use ',' split。such as: epmgit add useBranchs develop,release
  del <name>                 del branch
  use <name>                 use branch
  update <name> <newBranch>  update branch
  ls                         show all branch list
  cherry-pick <hash>         cherry-pick commit
  push                       push Code to branchs
  help [command]             display help for command
```

### 提示:

> `epmgit push` 和 `epmgit cherry-pick`会将已经提交过的分支过滤，如果某些分支存在冲突等问题，可解决后重复进行命令操作。
