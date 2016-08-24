# 开发指南

## 运行脚本

```bash
npm install  # 按照 package 依赖
npm start # 运行
```

## 文件结构

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

src

```bash
|- posts
  |- index.md
  |- file-1.md
  |- file-2.md
  |- folder-1
    |- file-3.md
    |- file-4.md
```

uri

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
  |- index.md
  |- options.md
```

```js
{
  "globals": {
    "key": "val", // => index.md
    "options": {} // => options.md
  }
}
```

## YAML

### 语法

- "#" 是 YAML 的注释符，从这个字符一直到行尾，都会被解析器忽略。
- 大小写敏感
- 使用缩进表示层级关系（一般使用两个空格）
- 缩进时不允许使用 Tab 键，只允许使用空格
- 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可

#### 模板

layout 为保留字段，可以通过 layout 关联模板
模板文件的相对位置是在 views 目录下

```yaml
layout: index.html
```

#### 数字类型

```yaml
number: 12
```

#### 布尔型

```yaml
boolean: true
```

#### 字符串类型

```yaml
string1: test string
```

如果含有 "#", ":" 等特殊字符时，需要用引号引上。

```yaml
string2: "test string: string"
```

多行文本

```yaml
# 可以使用 ">" 折叠换行
string3: >
  Foo
  Bar

# 可以使用 "|" 保留换行符
string4: |
  Foo
  Bar
```

```js
{
  string3: "Foo Bar",
  string4: "Foo\nBar"
}
```

#### 对象

```yaml
object:
  name: Steve
  foo: bar
```

```js
{
  object: {
    name: "Steve",
    foo: "bar"
  }
}
```

#### 集合

```yaml
# 集合元素为纯量
collection1:
  - Cat
  - Dog
  - Goldfish

# 集合元素为对象类型
collection2:
  - item    : Super Hoop
    quantity: 1
  - item    : Basketball
    quantity: 4
  - item    : Big Shoes
    quantity: 1
```

```js
{
  collection1: ["Cat", "Dog", "Goldfish"],
  collection2: [
    {item: "Super Hoop", quantity: 1},
    {item: "Basketball", quantity: 4},
    {item: "Big Shoes", quantity: 1}
  ]
}
```

#### 自定义类型转换

非标准 YAML 语法

markdown 解析

```yaml
markdown: !!md |
  # headline 1
  ## headline 2
```

```js
{
  markdown: "<h1>headline 1</h1>\n<h2>headline 2</h2>"
}
```

关联 post 数据，数据为对象类型，options 选填

```yaml
post: !!post file.md options
```

`file.md`

```md
---
title: Title
text: Text
---
```

```js
{
  post: {
    title: "Title",
    text: "Text",
    contents: ""
  }
}
```

关联 posts 数据，数据为集合类型

```yaml
posts: !!posts dir options
```

`posts/dir`

```bash
|- posts
  |- dir
    |- post-1.md
    |- post-2.md
```
`post-1.md`
```md
---
title: Title1
text: Text1
---
```
`post-2.md`
```md
---
title: Title2
text: Text2
---
```

```js
{
  posts: [
    {
      title: "Title1",
      text: "Text1",
      contents: ""
    },
    {
      title: "Title2",
      text: "Text2",
      contents: ""
    }
  ]
}
```

关联模板

```yaml
view: !!view includes/view.html
```
`view.html`
```html
<h1>Title</h1>
<p>Content</p>
```

```js
{
  view: "<h1>Title</h1>\n<p>Content</p>"
}
```

## Markdown Extended

按钮

```md
~[button text](link)
```

```html
<span class="wp-button"><a href="link">button text</a></span>
```

视频

```md
![](https://www.youtube.com/watch?v=1Y7Mr_RJpmU)
```

```html
<div class="embed-responsive video-iframe">
  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/1Y7Mr_RJpmU"></iframe>
</div>
```

图片

```md
![atl|caption](src)
```

```html
<div class="wp-caption">
  <img atl="atl" src="src">
  <p class="wp-caption-text">caption</p>
</div>
```

分栏

<pre data-lang="md">
```first-col-3
## 第一列
```

```col-6
中间列
```

```last-col-3
最后一列
```
</pre>

```html
<div class="row">
  <div class="col-3">
    <h2>第一列</h2>
  </div>
  <div class="col-6">
    <p>中间列</p>
  </div>
  <div class="col-3">
    <p>最后一列</p>
  </div>
</div>
```
