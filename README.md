拉勾 建立预览控件
===========
这是基于mozilla/pdf.js
#使用方法 
##新建方法
###javascript
```javascript
/**
*mock数据
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
var options = {
        selector:'myPreViewTest',
        dataSource:mockData.PDF //数据源 还可以是mockData.IMAGE
    };
var pewView = new lg.Widgets.PreView(options);
```
###html
```html
<div data-controltype="PreView" data-propertyname="myPreViewTest"></div>
```
