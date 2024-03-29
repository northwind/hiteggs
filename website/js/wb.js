var WB = (function(){
    var what = {};
    var moduleList = {
        connect: "/js/connect.js",
        client: "/js/client.js",
        "widget.base": "http://js.wcdn.cn/t3/platform/js/widget/base.js",
        "widget.atWhere": "http://js.wcdn.cn/t3/platform/js/widget/atWhere.js"
    };
    var IE = /msie/i.test(navigator.userAgent);
    function isArray(o){
        return Object.prototype.toString.call(o) === "[object Array]"
    }
    function loadScript(sURL, oCallBack){
        var js;
        js = document.createElement("script");
        js.charset = "UTF-8";
        if (IE) {
            js.onreadystatechange = function(){
                if (js.readyState.toLowerCase() == "complete" || js.readyState.toLowerCase() == "loaded") {
                    oCallBack.call(oCallBack)
                }
            }
        }
        else {
            js.onload = function(){
                oCallBack.call(oCallBack)
            }
        }
        js.src = sURL;
        document.getElementsByTagName("head")[0].appendChild(js)
    }
    what.regist = function(sNameSpace, oMark){
        var currentPart;
        var rootObject = what;
        var namespaceParts = sNameSpace.split(".");
        for (var i = 0; i < namespaceParts.length; i++) {
            currentPart = namespaceParts[i];
            if (rootObject[currentPart] == null) {
                if (i == namespaceParts.length - 1 && oMark != null) {
                    rootObject[currentPart] = oMark
                }
                else {
                    rootObject[currentPart] = {}
                }
            }
            rootObject = rootObject[currentPart]
        }
        return rootObject
    };
    what.regist("core", {
        load: function(aPkgName, oCallBack){
            var arr = isArray(aPkgName) ? aPkgName : [aPkgName];
            var i, len = arr.length, key, loadedNum = 0;
            for (i = 0; i < len; i++) {
                key = arr[i];
                loadScript(moduleList[key], function(){
                    loadedNum++;
                    if (loadedNum == len) {
                        oCallBack.call(oCallBack)
                    }
                })
            }
        }
    });
    return what
})();
