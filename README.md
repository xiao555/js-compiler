## 简单的绘图语言编译器

### 使用说明

#### 运行

```bash
npm install
npm start
```

#### 操作

在上方编器区域内输入要运行的绘图语言代码，点击下方DRAW，下方会输出绘图结果
点击CLEAR，会清空绘图区


### 绘图语言说明

#### Example

```
rot is 0;
origin is (200,400);
//
--
scale is (2,1);
for T from 0 to 300 step 1 draw (t,0);
for T from 0 to 300 step 1 draw (0,-t);
for T from 0 to 120 step 1 draw (t,-t);
scale is (2,0.1);
for T from 0 to 55 step 1 draw (t,-(t*t));
scale is (10,5);
for T from 0 to 60 step 1 draw (t,-sqrt(t));
scale is (20,0.1);
for T from 0 to 8 step 0.1 draw (t,-exp(t));
scale is (20,20);
// for T from 0 to 300 step 1 draw (t,-log(t)); -- 这句log运行不了
FOR T FROM 0 TO 2*PI STEP 0.1 DRAW (cos(T), sin(T));
```

#### 符号表

```js

// Type Identifiers Value
var TokenTable =
[
   ['CONST_ID',"PI",3],
   ['CONST_ID',"E",2],
   ['T',"T",0.0],
   ['FUNC',"SIN",0.0],
   ['FUNC',"COS",0.0],
   ['FUNC',"TAN",0.0],
   ['FUNC',"LOG",0.0],
   ['FUNC',"EXP",0.0],
   ['FUNC',"SQRT",0.0],
   ['ORIGIN',"ORIGIN",0.0],
   ['SCALE',"SCALE",0.0],
   ['ROT',"ROT",0.0],
   ['IS',"IS",0.0],
   ['FOR',"FOR",0.0],
   ['FROM',"FROM",0.0],
   ['TO',"TO",0.0],
   ['STEP',"STEP",0.0],
   ['DRAW',"DRAW",0.0]
];
```

#### 注释

```js
// 此处是注释
-- 此处是注释
```

#### 报错格式

`Error Type` + `Error code` + `line`


#### Other

1. 代码大小写不敏感，自动转换成大写
2. 支持结尾不带分号，但是要换行 


### 总结

还有很多地方待完善，比如：

1. 代码复用率可以提高，很多逻辑上差不多的地方都可以分离出来。
2. 语法分析器逻辑很乱，待整理
3. log函数的输出绘制还有问题

有时间填坑
