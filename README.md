# 开发指南

## 脚本

```bash
npm install  # 安装 package 依赖
npm start # 运行
```

## 结构

```bash
|- build          # 生成的预览目录
|- src            # 源文件
  |- assets       # 静态资源
  |- globals      # 全局数据
  |- posts        # 页面数据
  |- scripts      # js 脚本
  |- styles       # css 样式
|- tools          # 前端构建核心
|- views          # 模板页面
```

## Data

Data 分 posts 和 globals 两种类型，分别位于 src/posts 和 src/globals 目录下。数据文件格式支持 .html 和 .md 两种格式。.md 格式的数据会被 markdown 解析。

- posts 页面数据，文件会对应生成相应的 html 文件。
- globals 全局数据，文件不会生成 html 文件。

### Posts

`src/posts` 目录

```bash
|- posts
  |- index.md
  |- file-1.md
  |- file-2.md
  |- folder-1
    |- file-3.md
    |- file-4.md
```

对应的 URI

```bash
index.html
file-1.html
file-2.html
folder-1/file-3.html
folder-1/file-4.html
```

### Globals

```bash
|- globals
  |- index.md     # => key1: val1 
  |- options.md   # => key2: val2 
```

```js
{
  "globals": {
    "key1": "val1",   // => index.md
    "options": {      // => options.md
      "key2": "val2"
    }
  }
}
```


## 例子

- YAML/Markdown 见 [src/posts/boilerplate/index.md](src/posts/boilerplate/index.md)
- nunjucks 见 [views/boilerplate/index.html](views/boilerplate/index.html)
