'use strict';

/**
 * mock
 */
var mockData = {
  PDF:{
      "fileId": "helloworld.pdf",
     // "fileId": "i/image1/M00/00/81/CgHIDlY3QwyARuHOAAH5SjaSPhM819.pdf",
    "pageCount": 0,
    "pageImages": [],
    "previewType": "PDF",
    "textFileId": ""
  },
  IMAGE: {
    "fileId": "i/image1/M00/00/81/CgHIDlY3QwyARuHOAAH5SjaSPhM819.pdf",
    "pageCount": 2,
    "pageImages": [{
      "fileId": "i/image1/M00/00/81/CgHIDlY3QwyARuHOAAH5SjaSPhM819_0.png",
      "height": 1169,
      "index": 0,
      "width": 827
    }, {
      "fileId": "i/image1/M00/00/81/CgHIDlY3QwyARuHOAAH5SjaSPhM819_1.png",
      "height": 1169,
      "index": 1,
      "width": 827
    }],
    "previewType": "IMAGE",
    "textFileId": ""
  }
}


/**
 * 兼容ie6,ie7的querySelectorAll 和 querySelector
 */
if (!document.querySelectorAll) {
  document.querySelectorAll = function (selectors) {
    var style = document.createElement('style'), elements = [], element;
    document.documentElement.firstChild.appendChild(style);
    document._qsa = [];

    style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
    window.scrollBy(0, 0);
    style.parentNode.removeChild(style);

    while (document._qsa.length) {
      element = document._qsa.shift();
      element.style.removeAttribute('x-qsa');
      elements.push(element);
    }
    document._qsa = null;
    return elements;
  };
}

if (!document.querySelector) {
  document.querySelector = function (selectors) {
    var elements = document.querySelectorAll(selectors);
    return (elements.length) ? elements[0] : null;
  };
}

// 用于在IE6和IE7浏览器中，支持Element.querySelectorAll方法
var qsaWorker = (function () {
  var idAllocator = 10000;

  function qsaWorkerShim(element, selector) {
    var needsID = element.id === "";
    if (needsID) {
      ++idAllocator;
      element.id = "__qsa" + idAllocator;
    }
    try {
      return document.querySelectorAll("#" + element.id + " " + selector);
    }
    finally {
      if (needsID) {
        element.id = "";
      }
    }
  }

  function qsaWorkerWrap(element, selector) {
    return element.querySelectorAll(selector);
  }

  // Return the one this browser wants to use
  return document.createElement('div').querySelectorAll ? qsaWorkerWrap : qsaWorkerShim;
})();


/**
 * 定义组件
 * @type {{}}
 */
var lg = window.lg || {};

/**
 * 通用工具类
 * @type {{}|*}
 */
lg.Utils = lg.Utils || {};
/**
 * 扩展函数
 * @returns {*|{}}
 * @constructor
 */
lg.Utils.extend = lg.extend = function (target, src) {
  if (!src || typeof src != 'object') return target;

  target = target || {};
  var s, t;
  //处理数组的扩展
  if (src instanceof Array) {
    target = target instanceof Array ? target : [];
  }
  for (var i in src) {
    s = src[i];
    t = target[i];
    if (s && typeof s == 'object') {
      if (typeof t != 'object') t = {};
      target[i] = cb.extend(t, s);
    } else if (s != null) {
      target[i] = s;
    }
  }
  return target;
};

/**
 * 控件
 * @type {{}|*}
 */
lg.Widgets = lg.Widgets || {};

/**
 * PreView 预览
 * @param options
 * @constructor
 */
lg.Widgets.PreView = function (options) {
  this.default = {
    element:'[data-controltype="PreView"]',
    dataSource:{
        "fileId": "../../web/compressed.tracemonkey-pldi-09.pdf",
          "pageCount": 0,
          "pageImages": [],
          "previewType": "PDF",
          "textFileId": ""
    }
  };
  if(typeof options!='undefined'){
    //this.default.element =typeof options.element== "string"? options.element:this.default.element;
      if(typeof options.selector == "string"){
          this.default.selector ='[data-controltype="PreView"][data-propertyname="'+options.selector+'"]';
          //this.default.element = document.querySelectorAll(selector);
      }
   // this.default.element = typeof options.selector == "string"?document.querySelectorAll(selector):this.default.element;
    this.default.isPDF = typeof options.isPDF== "string"?options.isPDF:true;
    this.default.dataSource =typeof options.dataSource == "object"? options.dataSource:this.default.dataSource;
  }
  this.init();
}
/**
 * 获取当前控件dom
 * @returns {string}
 */
lg.Widgets.PreView.prototype.getElement = function (){
  return document.querySelectorAll(this.default.selector)[0];
}
lg.Widgets.PreView.prototype.getToolBar = function (){
    return document.querySelectorAll(this.default.selector+' .preview-toolbar')[0];
}
lg.Widgets.PreView.prototype.getViewBox = function (){
    return document.querySelectorAll(this.default.selector+' .preview-viewbox')[0];
}
lg.Widgets.PreView.prototype.getPrint = function (){
    return document.querySelectorAll(this.default.selector+' .print')[0];
}
/**
 * 控件初始化函数
 */
lg.Widgets.PreView.prototype.init = function () {
    var toolBar = document.createElement('div');
    toolBar.setAttribute('class','preview-toolbar');
    var print = document.createElement('div');
    print.setAttribute('class','preview-toolbar-print');
    print.innerHTML="print";
    toolBar.appendChild(print);
    this.getElement().appendChild(toolBar);
    var preBox = document.createElement('div');
    preBox.setAttribute('class','preview-viewbox');
    this.getElement().appendChild(preBox);
    var printBox = document.createElement('div');
    printBox.setAttribute('class','preview-printbox');
    printBox.setAttribute('class','print');
    printBox.setAttribute('id','print');
    this.getElement().appendChild(printBox);
    this.content = null,
    this.pageNum = 1,
    this.pageRendering = false,
    this.pageNumPending = null,
    this.scale = 0.8,
    this.pageContent = {},
    this.ctx = {},
    this.pageContent[this.pageNum] = this.getIsPDF()?document.createElement("canvas"):document.createElement("img");
    if(this.getIsPDF()){
        this.ctx[this.pageNum] = this.pageContent[this.pageNum].getContext('2d');
    }
    if(this.getIsPDF()){
        this.initPDF();
    }else{
        this.initIMAGE();
    }
    this.initScrollLoader()
    this.initToolBar()
}
lg.Widgets.PreView.prototype.initToolBar = function(){
    var that = this;
    this.getToolBar().onclick = function(e){
        if(e.srcElement.getAttribute('class')=='preview-toolbar-print'){
            that.print()
        }
    }
}
lg.Widgets.PreView.prototype.initScrollLoader = function(){
    var that = this;
    this.getViewBox().onscroll = function(e){
        var panel =that.getViewBox();
        var scrollTop,maxScroll,minScroll=0;
        scrollTop = panel.scrollTop;
        maxScroll = panel.scrollHeight - panel.offsetHeight;
        if(scrollTop >= maxScroll){
            that.onNextPage();
            return false;
        }
        if(scrollTop <=0){
            //alert("0");
            return false;
        }
    }
}
/**
 * 是否是PDF
 * @returns {boolean}
 */
lg.Widgets.PreView.prototype.getIsPDF = function (){
  return this.default.dataSource.previewType =='PDF';
}
/**
 * 当预览的是PDF的时候,初始化
 */
lg.Widgets.PreView.prototype.initPDF = function () {
    var that = this;
    //that.getElement().appendChild(that.pageContent[that.pageNum]);
    PDFJS.getDocument(this.default.dataSource.fileId).then(function (pdfDoc_) {
        that.numPages = pdfDoc_.pdfInfo.numPages
        for (var i = 0; i < that.numPages; i++) {
            (function (index) {
                pdfDoc_.getPage(index).then(function (page) {
                    var scale = 1.0;
                    var viewport = page.getViewport(scale);
                    var canvas = document.createElement("canvas");
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                    that.pageContent[index] = canvas;
                    if(index==that.pageNum){
                        that.getViewBox().appendChild(that.pageContent[index]);
                    }
                });
            })(i + 1);
        }
    });
}

/**
 * 当预览的是IMAGE的时候,初始化
 */
lg.Widgets.PreView.prototype.initIMAGE = function () {
    var that = this;
    for(var i= 0,len=that.default.dataSource.pageImages.length;i<len;i++){
        if((that.default.dataSource.pageImages[i].index+1)==that.pageNum){
            that.pageContent[that.pageNum].src=that.default.dataSource.pageImages[i].fileId;
            that.pageContent[that.pageNum].width = that.default.dataSource.pageImages[i].width;
            that.pageContent[that.pageNum].height = that.default.dataSource.pageImages[i].height;
        }
    }
    this.getViewBox().appendChild(this.pageContent[this.pageNum]);
}
lg.Widgets.PreView.prototype.onPrevPage = function () {
    if (this.pageNum <= 1) {
        return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
}
lg.Widgets.PreView.prototype.onNextPage = function () {
    if (this.pageNum >= this.numPages) {
        return;
    }
    this.pageNum++;
    //this.queueRenderPage(this.pageNum);
    this.renderPage(this.pageNum);
}
lg.Widgets.PreView.prototype.queueRenderPage = function (num) {
    if (this.pageRendering) {
        this.pageNumPending = num;
    } else {
        this.renderPage(num);
    }
}
lg.Widgets.PreView.prototype.renderPage = function (num) {
    this.pageRendering = true;
    // Using promise to fetch the page
    var that = this;
    if(that.getIsPDF()){

        that.getViewBox().appendChild(that.pageContent[that.pageNum]);

    }else{
        for(var i= 0,len=that.default.dataSource.pageImages.length;i<len;i++){
            if((that.default.dataSource.pageImages[i].index+1)==that.pageNum){
                this.pageContent[that.pageNum] = that.pageContent[that.pageNum]?that.pageContent[that.pageNum]:document.createElement("img");
                that.pageContent[that.pageNum].src=that.default.dataSource.pageImages[i].fileId;
                that.pageContent[that.pageNum].width = that.default.dataSource.pageImages[i].width;
                that.pageContent[that.pageNum].height = that.default.dataSource.pageImages[i].height;
                that.getPrintBox().appendChild(that.pageContent[that.pageNum]);
            }
        }
    }
}
lg.Widgets.PreView.prototype.print = function () {
    for(var i= 0,len=this.numPages;i<len;i++){
        var page = document.createElement('div');
        page.setAttribute('class','page');
        page.appendChild(this.pageContent[i+1]);
        this.getPrint().appendChild(page);
    }

    window.print();
}
function onload(e){
    mockData.PDF.fileId = 'compressed.tracemonkey-pldi-09.pdf';

    mockData.IMAGE.pageCount = 2;
    mockData.IMAGE.pageImages=[{
        "fileId": "images/1.jpg",
        "height": 1169,
        "index": 0,
        "width": 827
    }, {
        "fileId": "images/1.jpg",
        "height": 1169,
        "index": 1,
        "width": 827
    }];
    var preView = new lg.Widgets.PreView({
        selector:'myPreViewTest',
        dataSource:mockData.PDF
    });
}
