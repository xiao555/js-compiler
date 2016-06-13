## Developer Guide

```
npm install
npm start
```

## 文件结构

```py
|- build          # 生成的预览目录
|- src            # 源文件
  |- assets       # 静态资源
  |- globals      # 全局数据
  |- posts        # 文件数据
  |- scripts      # js 脚本
  |- styles       # css 样式
|- tools          # 前端构建核心
|- views          # 模板页面
```

## Data

Data 分 posts 和 globals 两种类型，分别位于 `src/posts` 和 `src/globals` 目录下。数据文件格式支持 `.html` 和 `.md` 两种格式。`.md` 格式的数据会被 markdown 解析。

- posts 文章数据，文件会对应生成相应的 html 文件。
- globals 全局数据，文件不会生成 html 文件。

### Posts

文件结构

```python
|- posts
  # 首页
  |- index.md
  |- file-1.md
  |- file-2.md

  # 同一目录下的文件数据为一组集合
  |- folder-1           
    |- file-3.md
    |- file-4.md

  # 集合会排除 index 文件，index 文件为集合索引，可以通过 index 文件的 sortBy 字段设置集合的排序情况
  |- folder-2
    |- index.md
    |- file-5.md
    |- file-6.md

  # file 和 folder 同名时，同名 file 文件为集合的索引。
  |- folder-3.md
  |- folder-3
    |- file-7.md
    |- file-8.md

  # 多级目录，子目录为独立集合
  |- folder-4
    |- index.md
    |- file-9.md
    |- file-10.md
    |- folder-5
      |- index.md
      |- file-11.md
      |- file-12.md
```

对应的全局 posts 对象

```js
{
  "posts": {
    "index": { // 所有 index 页面的集合
      "index": { /* posts/index.md */ },
      "folder-2": { /* posts/folder-2/index.md */ },
      "folder-3": { /* posts/folder-3.md */ },
      "folder-4": { /* posts/folder-4/index.md */ },
      "folder-4/folder-5": { /* posts/folder-4/folder-5/index.md */ },
    },
    "file-1": { /* file-1.md */ },
    "file-2": { /* file-2.md */ },
    "folder-1": [
      { /* file-3.md */ },
      { /* file-4.md */ }
    ],
    "folder-2": [
      { /* file-5.md */ },
      { /* file-6.md */ }
    ],
    "folder-3": [
      { /* file-7.md */ },
      { /* file-8.md */ }
    ],
    // 多级目录，集合为一级目录文件
    "folder-4": [
      { /* file-9.md */ },
      { /* file-10.md */ }
    ],
    // 多级目录，子目录为独立集合
    "folder-4/folder-5": [
      { /* file-11.md */ },
      { /* file-12.md */ }
    ]
  }
}
```

build

```html
index.html
file-1.html
file-2.html
folder-1/file-3.html
folder-1/file-4.html
folder-2/index.html
folder-2/file-5.html
folder-2/file-6.html
folder-3.html
folder-3/file-7.html
folder-3/file-8.html
folder-4/file-9.html
folder-4/file-10.html
folder-4/folder-5/index.html
folder-4/folder-5/file-11.html
folder-4/folder-5/file-12.html
```

### Globals

文件结构

```python
|- globals
  |- options.md
  |- blog
    |- options.md
```

数据结构

```js
{
  "globals": {
    "options": {},
    "blog": {
      "options": {}
    }
  }
}
```

globals 的数据不会生成文件

## YAML

具体的 YAML 语法见[官网](http://yaml.org/spec/1.2/spec.html#Preview)

额外说明

```yml
# layout 为关键字段，可以通过 layout 关联模板
# 模板文件的相对位置是在 views 目录下
layout: example/view-7.html 

# 数字类型
number: 12

# 字符串类型
string: test string

# 多行文本 1
# 用引号引用的多行文本，可以不需要保持缩进
# 换行符会被过滤
textarea: "
line 1
line 2"

# 多行文本 2，
# 需要保持缩进
# 多行文本 "#" 后是注释文本，不会输出
textarea1: 
  line 1
  line 2 # 不会输出

# 多行文本 3
# 需要保持缩进
# 用 "|" 的多行文本，换行符会被过滤
# "#" 注释无效，"#" 后文本照样输出
# 可以添加一些多行但不想被换行的文本
textarea2: >
  line 1
  line 2，
  line 3 # 注释无效，会输出

# 多行文本 4
# 需要保持缩进
# 用 "|" 的多行文本，换行符会保留下来
# "#" 注释无效，"#" 后文本照样输出
# markdown 的多行文本可以用这种方式添加
textarea3: |
  line 1 
  line 2 
  line 3 # 注释无效，会输出

# 开头带 "#" 的文本需要用引号引上 
hash: "#contact"

# 注释符号 "#" 前需要空格才表示注释
# 以下文本 "#" 后的文本也会输出
link: http://url#contact

# 最简单的数组
arr1: [1,2,3,4]

# 带 key 的数组
arr2:
  - text: text 1
    title: title 1
  - text: text 2
    title: title 2
  - text: text 3
    title: title 3
  - text: text 4
    title: title 4

# 对象类型
object:
  name: xiao li
  age: 18
```

例子见

https://github.com/chenos/site-stone/blob/master/src/posts/example/test-7.md

https://github.com/chenos/site-stone/blob/master/views/example/view-7.html
