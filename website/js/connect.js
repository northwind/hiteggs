(function(){
    var STK = (function(){
        var spec = {
            dependCacheList: {},
            importCacheStore: {},
            importCacheList: [],
            jobsCacheList: []
        };
        var that = {};
        var lastPoint = 1;
        var baseURL = "";
        var errorInfo = [];
        var register = function(ns, maker){
            var path = ns.split(".");
            var curr = that;
            for (var i = 0, len = path.length; i < len; i += 1) {
                if (i == len - 1) {
                    if (curr[path[i]] !== undefined) {
                        throw ns + "has been register!!!"
                    }
                    curr[path[i]] = maker(that);
                    return true
                }
                if (curr[path[i]] === undefined) {
                    curr[path[i]] = {}
                }
                curr = curr[path[i]]
            }
        };
        var checkPath = function(ns){
            var list = ns.split(".");
            var curr = that;
            for (var i = 0, len = list.length; i < len; i += 1) {
                if (curr[list[i]] === undefined) {
                    return false
                }
                curr = curr[list[i]]
            }
            return true
        };
        var checkDepend = function(){
            for (var k in spec.dependCacheList) {
                var loaded = true;
                for (var i = 0, len = spec.dependCacheList[k]["depend"].length; i < len; i += 1) {
                    if (!checkPath(spec.dependCacheList[k]["depend"][i])) {
                        loaded = false;
                        break
                    }
                }
                if (loaded) {
                    register.apply(that, spec.dependCacheList[k]["args"]);
                    delete spec.dependCacheList[k];
                    setTimeout(function(){
                        checkDepend()
                    }, 25)
                }
            }
        };
        var E = function(id){
            if (typeof id === "string") {
                return document.getElementById(id)
            }
            else {
                return id
            }
        };
        var addEvent = function(sNode, sEventType, oFunc){
            var oElement = E(sNode);
            if (oElement == null) {
                return
            }
            sEventType = sEventType || "click";
            if ((typeof oFunc).toLowerCase() != "function") {
                return
            }
            if (oElement.attachEvent) {
                oElement.attachEvent("on" + sEventType, oFunc)
            }
            else {
                if (oElement.addEventListener) {
                    oElement.addEventListener(sEventType, oFunc, false)
                }
                else {
                    oElement["on" + sEventType] = oFunc
                }
            }
        };
        that.inc = function(ns, undepended){
            if (!spec.importCacheList) {
                spec.importCacheList = []
            }
            for (var i = 0, len = spec.importCacheList.length; i < len; i += 1) {
                if (spec.importCacheList[i] === ns) {
                    if (!undepended) {
                        spec.importCacheList.push(ns)
                    }
                    return false
                }
            }
            if (!undepended) {
                spec.importCacheList.push(ns)
            }
            spec.importCacheStore[ns] = false;
            var js = document.createElement("SCRIPT");
            js.setAttribute("type", "text/javascript");
            js.setAttribute("src", baseURL + ns.replace(/\./ig, "/") + ".js");
            js.setAttribute("charset", "utf-8");
            js[that.IE ? "onreadystatechange" : "onload"] = function(){
                if (!that.IE || this.readyState.toLowerCase() == "complete" || this.readyState.toLowerCase() == "loaded") {
                    lastPoint = spec.importCacheList.length;
                    spec.importCacheStore[ns] = true;
                    checkDepend()
                }
            };
            document.getElementsByTagName("HEAD")[0].appendChild(js)
        };
        that.register = function(ns, maker, shortName){
            spec.dependCacheList[ns] = {
                args: arguments,
                depend: spec.importCacheList.slice(lastPoint, spec.importCacheList.length),
                "short": shortName
            };
            lastPoint = spec.importCacheList.length;
            checkDepend()
        };
        that.regShort = function(sname, sfun){
            if (that[sname] !== undefined) {
                throw sname + ":show has been register"
            }
            that[sname] = sfun
        };
        that.setBaseURL = function(url){
            baseURL = url
        };
        that.getErrorInfo = function(){
            return errorInfo
        };
        that.IE = /msie/i.test(navigator.userAgent);
        that.E = E;
        that.C = function(tagName){
            var dom;
            tagName = tagName.toUpperCase();
            if (tagName == "TEXT") {
                dom = document.createTextNode("")
            }
            else {
                if (tagName == "BUFFER") {
                    dom = document.createDocumentFragment()
                }
                else {
                    dom = document.createElement(tagName)
                }
            }
            return dom
        };
        that.Ready = (function(){
            var funcList = [];
            var inited = false;
            var exec_func_list = function(){
                if (inited == true) {
                    return
                }
                inited = true;
                for (var i = 0, len = funcList.length; i < len; i++) {
                    if ((typeof funcList[i]).toLowerCase() == "function") {
                        funcList[i].call()
                    }
                }
                funcList = []
            };
            if (document.attachEvent && window == window.top) {
                (function(){
                    try {
                        document.documentElement.doScroll("left")
                    } 
                    catch (e) {
                        setTimeout(arguments.callee, 0);
                        return
                    }
                    exec_func_list()
                })()
            }
            else {
                if (document.addEventListener) {
                    addEvent(document, "DOMContentLoaded", exec_func_list)
                }
                else {
                    if (/WebKit/i.test(navigator.userAgent)) {
                        (function(){
                            if (/loaded|complete/.test(document.readyState.toLowerCase())) {
                                exec_func_list();
                                return
                            }
                            setTimeout(arguments.callee, 25)
                        })()
                    }
                }
            }
            addEvent(window, "load", exec_func_list);
            return function(oFunc){
                if (inited == true || (/loaded|complete/).test(document.readyState.toLowerCase())) {
                    if ((typeof oFunc).toLowerCase() == "function") {
                        oFunc.call()
                    }
                }
                else {
                    funcList.push(oFunc)
                }
            }
        })();
        return that
    })();
    $Import = STK.inc;
    STK.register("core.obj.parseParam", function($){
        return function(oSource, oParams, isown){
            var key;
            if (typeof oParams != "undefined") {
                for (key in oSource) {
                    if (oParams[key] != null) {
                        if (isown) {
                            if (oSource.hasOwnProperty[key]) {
                                oSource[key] = oParams[key]
                            }
                        }
                        else {
                            oSource[key] = oParams[key]
                        }
                    }
                }
            }
            return oSource
        }
    });
    STK.register("core.str.parseURL", function($){
        return function(url){
            var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            var names = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"];
            var results = parse_url.exec(url);
            var that = {};
            for (var i = 0, len = names.length; i < len; i += 1) {
                that[names[i]] = results[i] || ""
            }
            return that
        }
    });
    STK.register("core.util.cookie", function($){
        var that = {
            set: function(sKey, sValue, oOpts){
                var arr = [];
                var d, t;
                var cfg = {
                    expire: null,
                    path: null,
                    domain: null,
                    secure: null,
                    encode: true
                };
                $.core.obj.parseParam(cfg, oOpts);
                if (cfg.encode == true) {
                    sValue = escape(sValue)
                }
                arr.push(sKey + "=" + sValue);
                if (cfg.path != null) {
                    arr.push("path=" + cfg.path)
                }
                if (cfg.domain != null) {
                    arr.push("domain=" + cfg.domain)
                }
                if (cfg.secure != null) {
                    arr.push(cfg.secure)
                }
                if (cfg.expire != null) {
                    d = new Date();
                    t = d.getTime() + cfg.expire * 3600000;
                    d.setTime(t);
                    arr.push("expires=" + d.toGMTString())
                }
                document.cookie = arr.join(";")
            },
            get: function(sKey){
                sKey = sKey.replace(/([\.\[\]\$])/g, "\\$1");
                var rep = new RegExp(sKey + "=([^;]*)?;", "i");
                var co = document.cookie + ";";
                var res = co.match(rep);
                if (res) {
                    return res[1] || ""
                }
                else {
                    return ""
                }
            },
            remove: function(sKey, oOpts){
                oOpts = oOpts || {};
                oOpts.expire = -10;
                that.set(sKey, "", oOpts)
            }
        };
        return that
    });
    STK.register("core.arr.isArray", function($){
        return function(o){
            return Object.prototype.toString.call(o) === "[object Array]"
        }
    });
    STK.register("core.str.trim", function($){
        return function(str){
            if (typeof str !== "string") {
                throw "trim need a string as parameter"
            }
            if (typeof str.trim === "function") {
                return str.trim()
            }
            else {
                return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, "")
            }
        }
    });
    STK.register("core.json.queryToJson", function($){
        return function(QS, isDecode){
            var _Qlist = $.core.str.trim(QS).split("&");
            var _json = {};
            var _fData = function(data){
                if (isDecode) {
                    return decodeURIComponent(data)
                }
                else {
                    return data
                }
            };
            for (var i = 0, len = _Qlist.length; i < len; i++) {
                if (_Qlist[i]) {
                    _hsh = _Qlist[i].split("=");
                    _key = _hsh[0];
                    _value = _hsh[1];
                    if (_hsh.length < 2) {
                        _value = _key;
                        _key = "$nullName"
                    }
                    if (!_json[_key]) {
                        _json[_key] = _fData(_value)
                    }
                    else {
                        if ($.core.arr.isArray(_json[_key]) != true) {
                            _json[_key] = [_json[_key]]
                        }
                        _json[_key].push(_fData(_value))
                    }
                }
            }
            return _json
        }
    });
    STK.register("core.json.jsonToQuery", function($){
        var _fdata = function(data, isEncode){
            data = data == null ? "" : data;
            data = $.core.str.trim(data.toString());
            if (isEncode) {
                return encodeURIComponent(data)
            }
            else {
                return data
            }
        };
        return function(JSON, isEncode){
            var _Qstring = [];
            if (typeof JSON == "object") {
                for (var k in JSON) {
                    if (JSON[k] instanceof Array) {
                        for (var i = 0, len = JSON[k].length; i < len; i++) {
                            _Qstring.push(k + "=" + _fdata(JSON[k][i], isEncode))
                        }
                    }
                    else {
                        if (typeof JSON[k] != "function") {
                            _Qstring.push(k + "=" + _fdata(JSON[k], isEncode))
                        }
                    }
                }
            }
            if (_Qstring.length) {
                return _Qstring.join("&")
            }
            else {
                return ""
            }
        }
    });
    STK.register("core.util.URL", function($){
        return function(sURL){
            var that = {};
            var url_json = $.core.str.parseURL(sURL);
            var query_json = $.core.json.queryToJson(url_json.query);
            var hash_json = $.core.json.queryToJson(url_json.hash);
            that.setParam = function(sKey, sValue){
                query_json[sKey] = sValue;
                return this
            };
            that.getParam = function(sKey){
                return query_json[sKey]
            };
            that.setParams = function(oJson){
                for (var key in oJson) {
                    that.setParam(key, oJson[key])
                }
                return this
            };
            that.setHash = function(sKey, sValue){
                hash_json[sKey] = sValue;
                return this
            };
            that.getHash = function(sKey){
                return hash_json[sKey]
            };
            that.valueOf = that.toString = function(){
                var url = [];
                var query = $.core.json.jsonToQuery(query_json);
                var hash = $.core.json.jsonToQuery(hash_json);
                if (url_json.scheme != "") {
                    url.push(url_json.scheme + ":");
                    url.push(url_json.slash)
                }
                if (url_json.host != "") {
                    url.push(url_json.host);
                    url.push(url_json.port)
                }
                url.push("/");
                url.push(url_json.path);
                if (query != "") {
                    url.push("?" + query)
                }
                if (hash != "") {
                    url.push("#" + hash)
                }
                return url.join("")
            };
            return that
        }
    });
    STK.register("core.str.queryString", function($){
        return function(sKey, oOpts){
            var opts = {
                source: window.location.href.toString(),
                split: "&"
            };
            $.core.obj.parseParam(opts, oOpts);
            var rs = new RegExp("(^|)" + sKey + "=([^\\" + opts.split + "]*)(\\" + opts.split + "|$)", "gi").exec(opts.source), tmp;
            if (tmp = rs) {
                return tmp[2]
            }
            return null
        }
    });
    STK.register("core.dom.removeNode", function($){
        return function(node){
            node = $.E(node) || node;
            try {
                node.parentNode.removeChild(node)
            } 
            catch (e) {
            }
        }
    });
    STK.register("core.util.getUniqueKey", function($){
        return function(){
            return Math.floor(Math.random() * 1000) + new Date().getTime().toString()
        }
    });
    STK.register("core.io.scriptLoader", function($){
        var entityList = {};
        return function(oOpts){
            var js, requestTimeout;
            var opts = {
                url: "",
                charset: "UTF-8",
                timeout: 30 * 1000,
                args: {},
                onComplete: null,
                onTimeout: null,
                uniqueID: null
            };
            $.core.obj.parseParam(opts, oOpts);
            if (opts.url == "") {
                throw "scriptLoader: url is null"
            }
            var uniqueID = opts.uniqueID || $.core.util.getUniqueKey();
            js = entityList[uniqueID];
            if (js != null && $.IE != true) {
                $.core.dom.removeNode(js);
                js = null
            }
            if (js == null) {
                js = entityList[uniqueID] = $.C("script")
            }
            js.charset = opts.charset;
            js.id = "scriptRequest_script_" + uniqueID;
            js.type = "text/javascript";
            if (opts.onComplete != null) {
                if ($.IE) {
                    js.onreadystatechange = function(){
                        if (js.readyState.toLowerCase() == "loaded" || js.readyState.toLowerCase() == "complete") {
                            clearTimeout(requestTimeout);
                            opts.onComplete()
                        }
                    }
                }
                else {
                    js.onload = function(){
                        clearTimeout(requestTimeout);
                        opts.onComplete()
                    }
                }
            }
            js.src = STK.core.util.URL(opts.url).setParams(opts.args);
            document.getElementsByTagName("head")[0].appendChild(js);
            if (opts.timeout > 0 && opts.onTimeout != null) {
                requestTimeout = setTimeout(function(){
                    opts.onTimeout()
                }, opts.timeout)
            }
            return js
        }
    });
    STK.register("core.io.jsonp", function($){
        return function(oOpts){
            var opts = {
                url: "",
                charset: "UTF-8",
                timeout: 30 * 1000,
                args: {},
                onComplete: null,
                onTimeout: null,
                responseName: null,
                varkey: "callback"
            };
            var funcStatus = -1;
            $.core.obj.parseParam(opts, oOpts);
            var uniqueID = opts.responseName || ("STK_" + $.core.util.getUniqueKey());
            opts.args[opts.varkey] = uniqueID;
            var completeFunc = opts.onComplete;
            var timeoutFunc = opts.onTimeout;
            window[uniqueID] = function(oResult){
                if (funcStatus != 2 && completeFunc != null) {
                    funcStatus = 1;
                    completeFunc(oResult)
                }
            };
            opts.onComplete = null;
            opts.onTimeout = function(){
                if (funcStatus != 1 && timeoutFunc != null) {
                    funcStatus = 2;
                    timeoutFunc()
                }
            };
            return $.core.io.scriptLoader(opts)
        }
    });
    if (WB == null) {
        return
    }
    var CFG = {
        key: null,
        xdpath: null,
        xddomain: null
    };
    var WAIT_FUNC_LIST = [];
    var OAUTH_LOGIN_URL = "http://api.t.sina.com.cn/oauth/login";
    var OAUTH_QUERY_URL = "http://api.t.sina.com.cn/oauth/query.json";
    var USER_STATUS = -1;
    function login(oCallBack){
        WB.connect.waitReady(oCallBack, true);
        if (checkLogin() != 1) {
            var url = STK.core.util.URL(OAUTH_LOGIN_URL);
            url.setParam("callback", CFG.xdpath);
            url.setParam("source", CFG.key);
            var oauth_login_window = window.open(url, "oauth_login_window", "width=500,height=400,toolbar=no,menubar=no,resizable=no,status=no");
            oauth_login_window.focus();
            return
        }
    }
    function logout(oCallBack){
        if (CFG.key != null) {
            STK.core.util.cookie.remove("anywhereToken", {
                path: "/",
                domain: document.domain
            });
            STK.core.util.cookie.remove("anywhereTokenTime", {
                path: "/",
                domain: document.domain
            });
            loginStatus(-1);
            try {
                STK.core.io.jsonp({
                    url: "http://api.t.sina.com.cn//account/end_session.json?source=" + CFG.key,
                    onComplete: function(){
                        oCallBack && oCallBack()
                    }
                })
            } 
            catch (e) {
                throw "JavaScript SDK: logout error"
            }
        }
    }
    function checkLogin(){
        return USER_STATUS == 1
    }
    function loginStatus(nLoginStatus){
        if (nLoginStatus != null) {
            USER_STATUS = nLoginStatus
        }
        return USER_STATUS
    }
    function waitReady(oFunc, bStart){
        var i, len;
        if (oFunc != null) {
            if (bStart == true) {
                WAIT_FUNC_LIST.unshift(oFunc)
            }
            else {
                WAIT_FUNC_LIST.push(oFunc)
            }
        }
        if (WB.connect.checkLogin() == 1) {
            for (i = 0, len = WAIT_FUNC_LIST.length; i < len; i++) {
                WAIT_FUNC_LIST[i].call()
            }
            WAIT_FUNC_LIST = []
        }
    }
    function loginReady(){
        var sAction = STK.core.str.queryString("action");
        if (sAction == "connect") {
            var sClientToken = STK.core.str.queryString("anywhereToken");
            STK.core.util.cookie.set("anywhereToken", sClientToken, {
                path: "/",
                domain: document.domain
            });
            STK.core.util.cookie.set("anywhereTokenTime", new Date().valueOf(), {
                path: "/",
                domain: document.domain
            });
            try {
                opener.WB.connect.loginStatus(1);
                opener.WB.connect.waitReady()
            } 
            catch (e) {
            }
            window.close()
        }
    }
    function init(oOpts){
        STK.core.obj.parseParam(CFG, oOpts);
        if (CFG.key == null) {
            throw "WB.connect.init -> key is null"
        }
        if (CFG.xdpath == null) {
            throw "WB.connect.init -> xdpath is null"
        }
        var parseURL = STK.core.str.parseURL(CFG.xdpath);
        CFG.xddomain = parseURL.scheme + ":" + parseURL.slash + parseURL.host;
        var token = STK.core.util.cookie.get("anywhereToken");
        var tokenTime = STK.core.util.cookie.get("anywhereTokenTime");
        var expiredTime = -1;
        if (token != "") {
            USER_STATUS = 1
        }
        if ((new Date().valueOf() - tokenTime) > expiredTime) {
            STK.core.io.jsonp({
                url: OAUTH_QUERY_URL,
                onComplete: function(oData){
                    oData = oData || {};
                    if (oData.status == 1) {
                        STK.core.util.cookie.set("anywhereTokenTime", new Date().valueOf(), {
                            path: "/",
                            domain: document.domain
                        });
                        STK.core.util.cookie.set("anywhereToken", oData.anywhereToken, {
                            path: "/",
                            domain: document.domain
                        })
                    }
                    USER_STATUS = oData.status;
                    waitReady()
                },
                args: {
                    source: CFG.key
                }
            })
        }
    }
    var that = {};
    that.login = login;
    that.logout = logout;
    that.checkLogin = checkLogin;
    that.loginStatus = loginStatus;
    that.waitReady = waitReady;
    that.loginReady = loginReady;
    that.init = init;
    WB.regist("connect", that)
})();
