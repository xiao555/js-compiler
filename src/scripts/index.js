import 'copy!jquery/dist/jquery.min.js'
import $ from 'jquery'
var compiler = require('./compiler');
import CodeMirror from 'codemirror/lib/codemirror.js'

var lexer = compiler.lexer;
var parser = compiler.parser;
var draw = compiler.draw;

$(document).ready(function($) {
  // var operator = ['+','-','*','/','**'];
  // console.log(!!~operator.indexOf('+')); // true
  $(window).resize(function() {
    $('canvas').attr("width",$('#canvas').width());
  });
  // Init CodeMirror
  var editor = CodeMirror.fromTextArea(document.getElementById("codearea"), {
      lineNumbers: true,
      mode: "javascript",
      matchBrackets: true
  });
  // 获取当前内容, 开始编译
  $(".draw").click(function(e) {
    var input = editor.getValue().toUpperCase();
    console.log("Draw: \n"+input);
    
    var tokens = lexer(input);
    console.log(tokens);
    var ast = parser(tokens);
    console.log(ast);
    draw(ast);
    // compiler(input);
  })

  $(".clear").click(function(e) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var width = $("canvas").attr("width");
    var height = $("canvas").attr("height");
    ctx.clearRect(0, 0, width, height);
    console.log("Clear Canvas!");
  })

  // Test Canvas
  function canvasTest() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // 填充矩形 ctx.fillRect (x, y, width, height);
    // 边框矩形 ctx.strokeRect(x, y, width, height);
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect (0, 0, 10, 10);
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.strokeRect(60, 20, 100, 100);
    ctx.strokeRect(80, 20, 100, 100);
    // 清除指定矩形区域 ctx.clearRect(x, y, width, height)
    // 圆弧 ctx.arc(x, y, radius, starAngle, endAngle, anticlockwise);
    // 填充颜色
    ctx.fillStyle = 'rgba(255,0,0,0.8)';
    // 轮廓颜色
    ctx.strokeStyle  = 'rgba(0,255,0,0.8)';
    ctx.beginPath();
    ctx.arc(200, 200, 50, 0, Math.PI * 2, true);
    // 填充
    ctx.fill(); 
    // 轮廓
    ctx.stroke();
    // 绘制像素
    var myImageData = ctx.getImageData(0,0,1,1);
    for (var i = 300; i >= 0; i--) {
      ctx.putImageData(myImageData,200+eval("i*20")*2, (400-Math.sin(i)));
    }
    // 绘图语言说明
    // origin(a,b) x+a y+b
    // rot a x=x*cos(a) + y*sin(a); y=y*cos(a) + x*sin(a)
    // scale(a,b) x*a y*b
    // 变换顺序：比例变换 -> 旋转变换 -> 平移变换
    // 保留字
    // ORIGIN SCALE ROT IS TO STEP DRAW FOR FROM
    // 函数
    // SIN COS TAN SQRT EXP LN
    // 运算符
    //  + - * / **
    //  分隔符
    //  ; ( )
    //  
  }
  // canvasTest();
});
