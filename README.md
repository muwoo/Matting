# Matting
canvas实用小工具，利用html5 canvas 将纯色背景图片的背景抠出， 转为png图片。
## 抠图之前
<img src='https://github.com/monkeyWangs/Matting/blob/master/images/bike.jpg'>

## 抠图之后
<img src='https://github.com/monkeyWangs/Matting/blob/master/images/bike.png'>

## 使用方法
```html
<input type="file" id="file">
<button onclick="matting()">开始抠图</button>
<script src="./dist/matting.js"></script>
```
```javascript
function matting() {
    var file = document.getElementById('file').files[0];
    var mat = new Matting(file);
    mat.createStream();
  }
```
