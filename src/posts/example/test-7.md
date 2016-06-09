---
title: Test 7
layout: example/view-7.html 
number: 12
string: test string
textarea: "
\"line 1\"
line 2"
textarea1: 
  line 1
  line 2 # 正确的缩进
textarea2: >
  "line 1"
  line 2 # 注释也会被输出
textarea3: |
  line 1 
  line 2 # 注释也会被输出
hash: "#contact"
link: http://url#contact
arr1: [1,2,3,4]
arr2:
  - text: text 1
    title: title 1
  - text: text 2
    title: title 2
  - text: text 3
    title: title 3
  - text: text 4
    title: title 4
object:
  name: xiao li
  age: 18
---

## Heading 2

<h1>Heading 2</h1>

content 5.1

<p>content 5.2</p>