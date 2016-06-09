## Data

Data 分 posts 和 globals 两种类型，分别位于 `src/posts` 和 `src/globals` 目录下。数据文件格式支持 `.html` 和 `.md` 两种格式。`.md` 格式的数据会被 markdown 解析。

- posts 文章数据，文件会对应生成相应的 html 文件。
- globals 全局数据，文件不会生成 html 文件。

## Posts

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

  # index.md 文件为目录索引，可以通过 index 文件的 sortBy 字段设置集合的排序情况
  |- folder-2
    |- index.md
    |- file-5.md
    |- file-6.md

  # file 和 folder 同名时，同名 file 文件为集合的索引文件
  |- folder-3.md
  |- folder-3
    |- file-7.md
    |- file-8.md

  # 多级子文件夹情况同上
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
    "folder-4": [
      { /* file-9.md */ },
      { /* file-10.md */ }
    ],
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

## Globals

文件结构

```python
|- globals
  |- options.yml
  |- blog
    |- options.yml
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
