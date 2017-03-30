/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * @author monkeywang
 * Date: 17/3/30
 */
class Matting {
  /**
   * 构造函数
   * @param file
   */
  constructor(file) {
    this.file = file;
  }

  /**
   * 创建图片流
   */
  createStream() {
    let reader = new FileReader();
    let ext = this.file.name.substring(this.file.name.lastIndexOf(".") + 1).toLowerCase();
    if (ext != 'png' && ext != 'jpg' && ext != 'jpeg') {
      alert("图片的格式必须为png或者jpg或者jpeg格式！");
      return;
    }
    reader.onload = e => {
      let src = e.target.result;
      let img = new Image();
      img.src = src;
      let w = img.width;
      let h = img.height;
      this.fitch(w, h, img);
    };
    reader.readAsDataURL(this.file);
  }

  /**
   * function 抠图逻辑
   * @param width
   * @param height
   * @param img
   */
  fitch(width, height, img) {
    let dataUrl;
    let c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    let ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    /**
     * 取图片四个脚边的像素点rgba
     * @type {*}
     */
    let tl = Array.prototype.slice.call(ctx.getImageData(0, 0, 1, 1).data).join(',');
    let tr = Array.prototype.slice.call(ctx.getImageData(width - 1, 0, 1, 1).data).join(',');
    let br = Array.prototype.slice.call(ctx.getImageData(width - 1, height - 1, 1, 1).data).join(',');
    let bl = Array.prototype.slice.call(ctx.getImageData(0, height - 1, 1, 1).data).join(',');
    let imgdata = [tl, tr, bl, br]; // 四个取色点
    let selfImageData = []; // 当前rgba
    imgdata.sort();
    // 目前只支持纯色背景抠图，简单的判断是否为纯色
    let deferNum = this.unique(imgdata).length;
    if (deferNum <= 1) {
      {
        selfImageData = imgdata[1].split(","); // 设置要扣除的主题色
        let isPNG = true; // 判断是否已经扣过
        let imgDataUrl = ctx.getImageData(0, 0, width, height); //获取像素点
        let data = imgDataUrl.data;
        for (let i = 0; i < data.length; i += 4) {
          // 得到 RGBA 通道的值
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          /**
           * function 判断颜色是不是属于背景色
           * @param numerical
           * @param index
           * @returns {boolean}
           */
          let isIn = (numerical, index) => {
            if (selfImageData[3] == 0) {
              isPNG = false;
              return false;
            }
            return numerical > parseInt(selfImageData[index]) - 20 && numerical < parseInt(selfImageData[index]) + 20; // 去掉边缘色
          };

          if ([r, g, b].every(isIn)) {
            data[i + 3] = 0; // 设置背景透明
          }
        }
        // 将修改后的代码复制回画布中
        ctx.putImageData(imgDataUrl, 0, 0);
        dataUrl = c.toDataURL("image/png");
        if (isPNG) {
          /**
           * 创建下载链接 进行图片下载
           * @type {Element}
           */
          let a = document.createElement('a');
          a.href = dataUrl; //下载图片
          a.download = '未命名.png';
          a.click();
        } else {
          alert('背景已抠除！');
        }
      }
    } else {
      alert('只支持纯色背景抠图！');
    }
  }

  /**
   * function 数组去重
   * @param arry
   * @returns {Array}
   */
  unique(arry) {
    let res = [];
    let json = {};
    arry.forEach(function (item, i) {
      if (!json[item]) {
        res.push(item);
        json[item] = 1;
      }
    });
    return res;
  }
}

window.Matting = Matting;

/***/ })
/******/ ]);