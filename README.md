拉勾 建立预览控件
===========
这是基于mozilla/pdf.js
#使用方法 
##新建方法
###'javascript'
`"javascript
var options = {
        selector:'myPreViewTest',
        dataSource:mockData.PDF //数据源
    };
var pewView = new lg.Widgets.PreView(options);
`"
###'html'
`"html
<div data-controltype="PreView" data-propertyname="myPreViewTest"></div>
`"
