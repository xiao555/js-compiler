// Global variables
// Recording Current Line
var line = 1;
// Reserved symbol table
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
// Recording data
var origin_x,
    origin_y,
    rot,
    scale_x,
    scale_y;

/**
* 词法分析
* output = [
*   {type: "",value: "",...},
*   {type: "",value: "",...},
*   ...
* ]
*/
function lexer(input) {
  var current = 0;
  var tokens = [];
  console.log("词法分析：");
  while(current < input.length) {
    var char = input[current];
    // 空格和注释
    if(char === " ") {
      current++;
      continue;
    }
    if((char === "/" && input[current+1] === '/' )|| (char === "-" && input[current+1] === '-')) {
      while(char != '\n') {
        current++
        char = input[current];
      }
    }
    
    // 匹配字母
    var LETTERS = /[A-Z]/i;
    if(LETTERS.test(char)) {
      var value = "";

      while(LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }// while
      var inToken = 0;
      for(var i=0;i<TokenTable.length;i++) {
        if(value == TokenTable[i][1]) {
          tokens.push({
            type: TokenTable[i][0],
            value: value
          });
          inToken = 1;
        }
      }
      if(inToken) {
        continue;
      }
    }// if letter

    // 匹配数字
    var NUMBER = /[0-9]/;
    if(NUMBER.test(char)) {
      var value = "";
      var decimal = 0;
      while(NUMBER.test(char) || char === '.') {
        if(char === '.') decimal++;
        if(decimal > 1) throw new TypeError('错误的数字类型'+ char +' on line:' + line, "compiler.js", 82);
        value += char;
        char = input[++current];
      }// while

      tokens.push({
        type: 'NUMBER',
        value: value
      });
      continue;
    }// if number

    // 匹配运算符
    var operator = ['+','-','*','/'];
    if(!!~operator.indexOf(char)) {
      tokens.push({
        type: 'operator',
        value: input[current+1] == '*' ? '**' : char
      });
      current++;
      input[current] == "*" ? current++ : "";
      continue;
    }

    // 匹配分隔符
    if(char === '(' || char === ')') {
      tokens.push({
        type: "PAREN",
        value: char
      });
      current++;
      continue;
    }
    if(char === ',') {
      tokens.push({
        type: "COMMA",
        value: ","
      });
      current++;
      continue;
    }
    if(char === ';') {
      tokens.push({
        type: "SEMIC",
        value: ";"
      });
      current++;
      continue;
    }
    if(char === '\n') {
      // console.log("\\n");
      line++;
      current++;
      continue;
    }
    throw new TypeError('未识别的标识符'+ char +' on line:' + line, "compiler.js", 137);
  }// while
  return tokens;
}

/** AST 抽象语法树
* output: = [
*   {type: 'Program', body: [
*     {type: 'statement', name: "ROT", value: 0},
*     {type: 'statement', name: "SCALE", value: [
*       0: "20",
*       1: "20"
*     ]},
*     {type: 'statement', name: "FOR", params: [
*       0: "T",
*       1: "0",
*       2: {type: "expr", name: "*", lvalue: "2", rvalue: "3.1415926"},
*       3: "0.1",
*       4: {type: "Expression", name: "COS", params: "T"},
*       5: {type: "Expression", name: "SIN", params: "T"},
*     ]}
*   ]}
* ]
* 
*/ 
function parser(tokens) {
  console.log("语法分析:");
  line = 1;
  var current = 0;
  var ast = {
    type: 'Program',
    body:[]
  };
  while (current < tokens.length) {
    ast.body.push(walk());
    // console.log(ast);
  }


  // 计算表达式
  function factor() {
    var token = tokens[current];
    // console.log(token.value);
    // paren
    if(token.type === 'PAREN' && token.value === '(') {
      current++;
      var value = expr();
      token = tokens[current];
      return value;
    } else if (token.value === 'PI'){
      current++;
      return 3.1415926;
    } else if (token.value === 'E'){
      current++;
      return 2.71828;
    } else if (token.value === 'T'){
      current++;
      return 'T';
    } else if (token.type === 'FUNC'){
      current++;
      var node = {
        type: 'Expression',
        name: token.value,
        params: []
      };
      node.params = expr();
      return node;
    } else {
      current++;
      // console.log("factor end: "+ tokens[current].value);
      return token.value;
    }
  }

  function term_tail(lvalue) {
    // console.log('term_tail start: ' + lvalue + tokens[current].value);
    var token = tokens[current];
    if(token.value === '*' || token.value === '/') {
      current++;
      var node = {
        type: 'expr',
        name: token.value,
        lvalue: lvalue,
        rvalue: ""
      }
      node.rvalue = expr();
      return node;
    } else {
      // console.log('term_tail end: '+ tokens[current].value);
      return lvalue;
    }
  }

  function term() {
    var lvalue = factor();
    return term_tail(lvalue);
  }

  function expr_tail(lvalue) {
    // console.log('expr_tail start: '+lvalue+  tokens[current].value);
    var token = tokens[current];
    if(token.value === '+' || token.value === '-') {
      current++;
      var node = {
        type: 'expr',
        name: token.value,
        lvalue: lvalue,
        rvalue: ""
      }
      node.rvalue = expr();
      return node;
    } else if (lvalue == '-') {
      var node = {
        type: 'expr',
        name: '-',
        lvalue: '0',
        rvalue: ""
      }
      node.rvalue = expr();
      return node;
    } else {
      // console.log('expr_tail end: '+lvalue+ tokens[current].value);
      return lvalue;
    }
  }
  // 计算表达式入口
  function expr() {
    // console.log("expr: " + tokens[current].value);
    var lvalue = term();
    return expr_tail(lvalue);
  }

  // 语法分析入口
  function walk() {
    var token = tokens[current];
    // console.log('walk',token.value);
    // IS
    if(token.type === 'IS') {
      current++;
      // console.log('IS:' + tokens[current].value);
      return expr();
    }
    // SEMIC
    if(token.type === 'SEMIC') {
      // console.log(";");
      current++;
      if(current >= tokens.length) {
        return;
      }
      line++;
      return walk();
    }
    // )
    if(token.value === ')') {
      // console.log(")");
      current++;
      if(current >= tokens.length) {
        return;
      }
      return walk();
    }

    if(token.type === 'ORIGIN' ||
       token.type === 'SCALE'  ||
       token.type === 'ROT'
       ) {
      // console.log(token.type);
      current++;
      var node = {
        type: 'statement',
        name: token.type,
        value: []
      };
      node.value = walk();
      // console.log('保留字：'+ node.value + ' ' + tokens[current].value);
      if(tokens[current].value === ',') {
        current++;
        var _value = node.value;
        node.value = [];
        node.value.push(_value);
        node.value.push(expr());
      }
      return node;
    }

    if(token.type === 'FOR') {
      // console.log(token.type);
      current++;
      var node = {
        type: 'statement',
        name: token.type,
        params: []
      };
      node.params.push(expr());
      token = tokens[current];
      if(token.type === 'FROM') {
        current++;
        node.params.push(expr());
        token = tokens[current];
        if(token.type === 'TO') {
          current++;
          node.params.push(expr());
          token = tokens[current];
          if(token.type === 'STEP') {
            current++;
            node.params.push(expr());
            token = tokens[current];
            if(token.type === 'DRAW') {
              current++;
              node.params.push(expr());
              token = tokens[current];
              // console.log("DRAW:"+token.value );
              while(token.value != ',') {
                current++;
                token = tokens[current];
              }
              if(token.value === ',') {
                current++;
                node.params.push(expr());
              }
            }
          }
        }
      }
      return node;
    }
    throw new TypeError('语法错误: '+ token.value +' on line:' + line, "compiler.js", 313);
  }// walk
  ast.body.pop();
  return ast;
}

// 从语法树生成代码
function codeGenerator(node) {
  if(typeof(node) == 'string' || typeof(node) == 'number') {
    return node;
  }
  switch (node.type) {

    case 'expr':
      return ("(" + codeGenerator(node.lvalue)+node.name+codeGenerator(node.rvalue)+")");
    case 'Expression':
      return (
        '(Math.' +
        node.name.toLowerCase()+"("+node.params+"))"
      );
    default:
      throw new TypeError(node.type);
  }
}

// 加法函数，浮点数相加更精确
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}


function droploop(params) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgb(200,0,0)";
  ctx.fillRect (0, 0, 1, 1);

  for (var i = params.length - 1; i >= 0; i--) {
    params[i] = codeGenerator(params[i]);
    // console.log(params[i]);
  }
  var _from = eval(params[1]);
  var _to = eval(params[2]);
  var _step = eval(params[3]);
  var _x = params[4];
  var _y = params[5];
  // console.log(_from,_to,_step,_x,_y);
  // }
  // 绘制像素
  var myImageData = ctx.getImageData(0,0,1,1);
  console.log("    FOR: T", _from, _to, _x, _y);
  for (var T = _from; T <= _to; T+=_step) {
    // 获取原始的x,y
    var x = eval(_x);
    var y = eval(_y);
    // 获取进行一系列变化后的x,y
    var dx = accAdd(accAdd(origin_x,x*scale_x*Math.cos(rot)),y*scale_y*Math.sin(rot));
    var dy = accAdd(accAdd(origin_y,y*scale_y*Math.cos(rot)),-x*scale_x*Math.sin(rot));
    // console.log(dx,dy);
    // 绘制坐标
    ctx.putImageData(myImageData,dx , dy);
  }
}

// Draw
function draw(ast){
  console.log("Program");
  for (var i = 0; i < ast.body.length; i++) {
    console.log("  Statement " + i);
    switch(ast.body[i].name) {
      case "ROT":
        rot = eval(codeGenerator(ast.body[i].value));
        console.log("    ROT:" + rot);
        break;
      case "ORIGIN":
        origin_x = ast.body[i].value[0];
        origin_y = ast.body[i].value[1];
        console.log("    ORIGIN:" + origin_x , origin_y);
        break;
      case "SCALE":
        scale_x = ast.body[i].value[0];
        scale_y = ast.body[i].value[1];
        console.log("    SCALE:" + scale_x, scale_y);
        break;
      case "FOR":
        droploop(ast.body[i].params);
        break;
      default:
        throw new TypeError('执行错误: '+ ast.body[i] +' on ast.body:' + i, "compiler.js", 375);
    }
  }
}

module.exports = {
  lexer: lexer,
  parser: parser,
  draw: draw
};