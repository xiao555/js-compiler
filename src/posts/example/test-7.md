---
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
---

## Heading 2

<h1>Heading 2</h1>

content 5.1

<p>content 5.2</p>