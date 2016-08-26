---
# 两个 `---` 中间的文本为 yaml front matter，文件头部信息
#
# "#" 是 YAML 的注释符，从这个字符一直到行尾，都会被解析器忽略
#
# 语法
#
# - 大小写敏感
# - 使用缩进表示层级关系（一般使用两个空格）
# - 缩进时不允许使用 Tab 键，只允许使用空格
# - 缩进的空格数目不重要，只要相同层级的元素左侧对齐即可

# 保留关键字 #####################################################################
################################################################################

# layout 为保留字段，可以通过 layout 关联模板，模板文件的相对位置是在 views 目录下
layout: boilerplate/index.html

# Scalar #######################################################################
################################################################################

# 数字类型
number: 12

# 布尔型，值可以是 true/false/True/Flase/TRUE/FALSE
bool: True

#字符串
str1: abcdefg hijklmn

# 如果含有 "#", ":" 等特殊字符时，需要把整个文本用引号引上
str2: "test string: string"

# "\n" 不会被转义
str3: "内容\n字符串"
#str3: "#anchor"

# 使用单引号，特殊字符会被转义
str4: '内容\n字符串'

# 多行文本，通过 ">" 定义的文本，特殊字符不会被转义，相邻行换行符会被过滤。
str5: >
  Sammy Sosa completed another
  fine season with great stats.

    63 Home Runs
    0.288 Batting Average

  What a year!

# 多行文本，通过 "|" 定义的文本，特殊字符不会被转义，文本会原方不动输出。
# 输出 HTML，通常采用这种方式
str6: |
  \//||\/||
  // ||  ||__

# Collection ###################################################################
################################################################################

# 键值对集合，也可以称之为对象
#
# 通过 key 获取对应值，key 不能重复
#
# 下列例子 json 对象：
# {
#   "map": {
#     "name": "Mark McGwire",
#     "hr": 65,
#     "avg": 0.278
#   }
# }
map: 
  name: Mark McGwire
  hr:   65
  avg:  0.278

# map 集合
#
# 元素为 map 类型的序列
#
# 下列例子 json 对象：
# {
#   "omap": [
#     {
#       "name": "Mark McGwire",
#       "hr": 65,
#       "avg": 0.278
#     },
#     {
#       "name": "Sammy Sosa",
#       "hr": 63,
#       "avg": 0.288
#     }
#   ] 
# }
omap:
  -
    name: Mark McGwire
    hr:   65
    avg:  0.278
  -
    name: Sammy Sosa
    hr:   63
    avg:  0.288

# scalar 集合
#
# 元素为 scalar 类型的序列
#
# 下列例子 json 对象：
# {
#   "seq": ["Mark McGwire", "Sammy Sosa", "Ken Griffey"]
# }
seq:
  - Mark McGwire
  - Sammy Sosa
  - Ken Griffey

# Custom Types #################################################################
################################################################################

# 用 !!md 进行数据转换，markdown 文本会被解析成 html
markdown: !!md |
  ### headline 1
  #### headline 2

# 用 !!view 进行数据转换，view 为 html 文本
# 
# 如下例子等同于 
#
# view: |
#   <form action="?">
#     <input type="text">
#     <button>Submit</button>
#   </form>
view: !!view boilerplate/view.html

# 用 !!post 进行数据转换，post 对象为 map 类型，引用 page-1.md 数据
# 
# 如下例子等同于 
#
# post: 
#   title: Page Title
#   contents: 
# 
# json 对象：
# {
#   "post": {
#     "title": "Page Title",
#     "contents": ""
#   }
# }
post: !!post boilerplate/page-1.md

# 用 !!posts 进行数据转换，posts 对象为 omap 类型，为 boilerplate/blog 下所有文件数据的集合
# 
# 如下例子等同于 
#
# posts:
#   - title:    Blog Title1
#     contents: ""
#   - title:    Blog Title2
#     contents: ""
#
# json 对象：
# {
#   "posts": [
#     {
#       "title": "Blog Title1",
#       "contents": ""
#     },
#     {
#       "title": "Blog Title2",
#       "contents": ""
#     }
#   ]
# }
posts: !!posts boilerplate/blog

# Markdown Extended ############################################################
################################################################################

md:
  # <span class="wp-button">
  #   <a href="#">button text</a>
  # </span>
  button: !!md |
    ~[button text](#)

  # <div class="embed-responsive video-iframe">
  #   <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/1Y7Mr_RJpmU"></iframe>
  # </div>
  video: !!md |
    ![](https://www.youtube.com/watch?v=1Y7Mr_RJpmU)

  # <figure class="wp-caption">
  #   <img src="http://dummyimage.com/100x50/00598c/fff">
  #   <figcaption class="wp-caption-text">caption text</figcaption>
  # </figure>
  figure: !!md |
    ![atl|caption text](http://dummyimage.com/100x50/00598c/fff)

  # <div class="row">
  #   <div class="col-3"></div>
  #   <div class="col-6"></div>
  #   <div class="col-3"></div>
  # </div>
  grid: !!md |
    ```first-col-3
    ## first column
    ## first column
    ```
    ```col-6
    column
    ```
    ```last-col-3
    last column
    ```
---