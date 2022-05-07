# git常用指令解析

## 描述

 Git 有三种状态，你的文件可能处于其中之一：已提交（committed）、已修改（modified）和已暂存（staged）。 已提交表示数据已经安全的
保存在本地数据库中。 已修改表示修改了文件，但还没保存到数据库中。 已暂存表示对一个已修改文件的当前
版本做了标记，使之包含在下次提交的快照中。对应git的三个工作区的核心概念Git 仓库、工作目录以及暂存区域。

## git全局设置

- 设置用户信息
  
      git config --global user.name "John Doe"
      git config --global user.email johndoe@exam"

- 查看用户设置

      git config --list
      git help config  // 获取帮助


## git拉取远程代码

- 没有远程仓库

      git init //初始化本地git仓库

- 有远程仓库

      git clone [url]                      // 默认拉取分支为master的远程代码
      git clone [url] [rename]             // 拉取远程代码到本地并重命名为rename
      git clone -b [branch] [url] [rename] // 拉取指定分之为branch的远程代码

>注意
当url为http或者https连接时拉取的仓库后期上传或者拉取代码时需要账户验证,当仓库为.git时若设置了公钥则不需要验证。

## 工作区

- 查看工作区文件状态

      git status  // 显示当前你对该仓库的修改记录
      git status -s // 显示简略版本的修改记录

- 查看工作区文件具体更改细节

      git diff // 显示新旧文件内容之间详细的差异
      git diff --cached // 仅比较暂存区的更改

- 移除git对工作区中文件进行跟踪及检查

      git rm [fileUrl]

- 提交更改文件到暂存区

      git add [fileUrl] // 暂存区为了下一步提交到

- 给暂存区的更改添加comment备注信息

      git commit -m 'fix bug'

- 提交暂存区的更改到远程仓库

      git push [remoteGitUrl] [branch]

- 查看仓库操作记录

      git log // 查看该仓库和远程交互的所有记录
      git log -p // 查看该仓库和远程交互的所有记录相关文件的更改
      git log -p -2 // 仅显示最近两次的提交记录

> 注意:
    某些修改假如你并不关注可以新建.gitignore文件用以屏蔽这些更改.例如 ```/main/``` 此时main文件下所有的文件都不会被```git status```检测出更改.

## git 回退相关操作

### 回退commit信息

常规推送本地修改操作步骤如下:

1. ```git add [fileName]```
2. ```git commit -m ['comment']```
3. ```git push ['remoteGitUrl'] [branch]```

但是所有的操作并不是按顺序进行的,包括误操作,此时就需要回退操作,以下是常用的一些回退操作的方式及场景.

- 执行完第2步之后发现露提交了部分文件(领导临时改变注意需要重新改^.^).
这时已经执行了第1步和第2步.若重新走第1步.新的更改再走第2步.再走第3步.代码是可以提交到远程仓库,但是会有两个提交的备注信息.例如:

      commit 6d844d9d5d1f128d54646791325a55963e1ceb78
      Author: John.ren <youwill@163.com>
      Date:   Fri Aug 27 11:15:09 2021 +0800

          fix bug 123

      commit 10f8887d2abb96fa2d20576a6bbe7706356f696d
      Author: John.ren <youwill@163.com>
      Date:   Fri Aug 27 11:13:29 2021 +0800

          fix bug 123

以上操作在大部分情况下都是没有问题的,但是若是远程仓库有自动捡代码的操作时有可能会漏捡,另外重复的备注信息也会令人困惑.(有严格版本控制的项目不允许对同一个bug提交两次).此时就需要合并备注信息或者回退第一次修改的回退.如下操作:

        1. git add [fileName]
        2. git commit -m ['comment']
        3. git add [newFileName]
        4. git commit --amend

### 撤销暂存区的文件(回退```git add```操作)

1. ```git add [fileNames]```
2. 回退提交暂存区的文件fileName1,执行以下命令,文件将会重新出现在工作区
   ```git reset HEAD [filePath]```

### 撤销对文件的修改

该操作将会回退你工作区的更改.将相关文件回退至最初的样子.当然你可以手动回退.以下是git的脚本撤销操作

```git checkout -- [filePath]```


## 远程仓库

### 查看编辑远程仓库信息

执行```git clone [remoteUrl]```之后远程仓库的代码就会被下载到本地.此时远程仓库的信息就可以在本地查看.

- ```git remote``` 查看本地远程仓库信息 返回两个字段 远程仓库url简略名 远程仓库详细地址,如下
```origin https://github.com/schacon/ticgit```

- ```git remote -v``` 查看所有远程仓库信息

- git remote add [urlTag] [url] 新增简略名为urlTag地址为url的远程仓库配置

- git remote remove [urlTag] 删除配置

- git remote show [urlTag] 查看urlTag仓库信息

### 从远程仓库同步信息

1. 下载

- git fetch [urlTag] [branch] 从urlTag拉取最新代码,不自动合入当前工作区,需要手动合入
- git pull [urlTag] [branch] 从urlTag拉取最新代码,自动合入当前工作区

> 注意：当pull从远程拉取下来的代码和你工作区或者暂存区的代码的修改在同一处时,pull会报错,合并文件时冲突

1. 上传

- git push [urlTag] [branch] 推送暂存区代码到远程urlTag仓库中的branch分支

> 注意： 如果你和你的同事同事修改了同一个文件,此时你执行push操作，后推送的会失败,原因是合并文件时冲突


## 打标签

给历史的某一次提交打上标记,一般以版本号作为标记,例如v1.0.
Git 使用两种主要类型的标签：轻量标签（lightweight）与附注标签（annotated）。
一个轻量标签很像一个不会改变的分支 - 它只是一个特定提交的引用。
然而，附注标签是存储在 Git 数据库中的一个完整对象。 它们是可以被校验的；其中包含打标签者的名字、电子
邮件地址、日期时间；还有一个标签信息；并且可以使用 GNU Privacy Guard （GPG）签名与验证。 通常建议
创建附注标签，这样你可以拥有以上所有信息；但是如果你只是想用一个临时的标签，或者因为某些原因不想要
保存那些信息，轻量标签也是可用的。

- ```git tag``` 查看当前所有标签

- ```git tag -a v1.2 -m [comment]``` 创建新的附注标签,附注标签会创建很多详细信息
- ```git tag v1.3-ls``` 创建轻量标签
- ```git tag -a v1.4 [commitID]``` 给过去的提交打标记
- ```git push [urlTag] [tagName]``` 推送本地标签的更改到远程仓库
- ```git push [urlTag] --tags``` 推送本地所有标签到远程


## 分支

- git branch 查看所有分支
- git branch [branch] 新建分支
- git checkout [branch] 切换
- git merge [branch] 合并branch到当前分支
- git push origin --delete [branch] 删除远程分支