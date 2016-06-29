/**
 * @author xiazhaoxu
 * @date 2016-06-16
 */
(function() {
	ClientDetect = (function() {
		
		//-----------
		// private成员
		//-----------
		var _nv = navigator;
		var _ua = _nv.userAgent.toLowerCase();
		var _sc = window.screen;
		/*临时存储browser检测信息*/
		var _browser = {};
		/*临时存储device检测信息*/
		var _device = {};
		/*临时存储platform信息*/
		var _platform;

		var init = function() {
			osDetect();
			deviceDetect();
			browserDetect();
		};

		/**
		 * 在userAgent中查询指定的字符串
		 */
		var find = function(key) {
			return _ua.indexOf(key) !== -1;
		};

		/**
		 * 检测浏览器是否支持某个插件
		 */
		var isBrowserSupportPlugin = function(pluginKey) {
			var r;
			if (_browser.ie) {
				try {
					new ActiveXObject(dataPluginList[pluginKey].activex);
					r = true;
				} catch (e) {
					r = false;
				}
			} else {
				r = typeof _nv.plugins[dataPluginList[pluginKey].plugin] != "undefined";
			}
			return r;
		};
		
		/**
		 * 检测浏览器信息
		 */
		var browserDetect = function() {
			var s;
			s = _ua.match(/rv:([\d.]+)\) like gecko/) ? _browser.ie = s[1]
				: (s = _ua.match(/msie ([0-9]{1,}[.0-9]{0,})/)) ? _browser.ie = s[1]
				: (s = _ua.match(/firefox\/([\d.]+)/)) ? _browser.firefox = s[1]
				: (s = _ua.match(/chrome\/([\d.]+)/)) ? _browser.chrome = s[1]
				: (s = _ua.match(/opera.([\d.]+)/)) ? _browser.opera = s[1]
				: (s = _ua.match(/ucbrowser\/([\d.]+)/)) ? _browser.uc = s[1]
				: (s = _ua.match(/version\/([\d.]+).*safari/)) ? _browser.safari = s[1]
				: 0;
		};

		/**
		 * 检测设备信息
		 */
		var deviceDetect = function() {
			
			if(find("windows")){
				find("phone") ? _device.windowsPhone = "windows phone" 
					: find("touch") ? device.windowsTablet = "windows tablet"
					: null;
			}else if(find("mac")){
				find("iphone")? _device.iphone = "iphone"
					: find("ipod")? _device.ipod = "ipod"
					: find("ipad")? _device.ipod = "ipad"
					: null;
			}else if(find("android")){
				find("mobile")? _device.androidPhone = "android mobile"
					: _device.androidTablet = "android tablet";
			}else if(find("blackberry")){
				find("tablet")? _device.blackberryTablet = "blackberry tablet"
					: _device.blackberryPhone = "blackberry mobile";
			}
			
			for(var key in _device){
				if(key == "windowsPhone" || key == "iphone" 
					|| key == "ipod" || key == "androidPhone" 
						|| key == "blackberryPhone"){
					
					_device.type = "mobile";
					
				}else if(key == "ipad" || key == "windowsTablet" 
					|| key == "androidTablet" || key == "blackberryTablet"){
					
					_device.type = "tablet";
				
				}
				_device.name = _device[key];
			}
			if(!_device.type){
				_device.name = "PC"
				_device.type = "desktop";
			}
			/*
			var isWindows = find("windows");
			isWindows && find('phone') ? _device.windowsPhone = "windows phone" : 0;
			_device.windowsTablet = isWindows && find('touch');

			var isMac = find("mac");
			_device.iphone = isMac && find("iphone");
			_device.ipod = isMac && find("ipod");
			_device.ipad = isMac && find("ipad");

			var isAndroid = find("android");
			_device.androidPhone = isAndroid && find("mobile");
			_device.androidTablet = isAndroid && !find("mobile");

			var isBlackberry = find("blackberry");
			_device.blackberryPhone = isBlackberry && !find("tablet");
			_device.blackberryTablet = isBlackberry && find("tablet");

			_device.isMobile = _device.windowsPhone || _device.iphone
					|| _device.ipod || _device.androidPhone
					|| _device.blackberryPhone;
			_device.isTablet = _device.windowsTablet || _device.ipad
					|| _device.androidTablet || _device.blackberryTablet;
			_device.isDesktop = !_device.isMobile && !_device.isTablet;
			*/
		};

		/**
		 * 检测操作系统
		 */
		var osDetect = function() {
			var platform = _nv.platform.toLowerCase();
			for (var i = 0; i < dataOSList.length; i++) {
				if (platform.indexOf(dataOSList[i].key) != -1) {
					_platform = dataOSList[i].desc;
					return;
				}
			}
		};

		var getBroserName = function() {
			for ( var b in _browser) {
				return b;
			}
		};
		
		/**
		 * 获取屏幕分辨率
		 */
		var getScreenResolution = function() {
			return {
					width : _sc.width,
					height : _sc.height
				};
		}
		
		/**
		 * 获取屏幕DPI
		 */
		var getScreenDPI = function(){
			var dpi = {};
		    if (typeof _sc.deviceXDPI != "undefined") {
		    	dpi.x = _sc.deviceXDPI;
		    	dpi.y = window.screen.deviceYDPI;
		    } else {
		        var tmpNode = document.createElement("p");
		        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:-1000px;top:-1000px;z-index:0";
		        document.body.appendChild(tmpNode);
		        dpi.x = parseInt(tmpNode.offsetWidth);
		        dpi.y = parseInt(tmpNode.offsetHeight);
		        tmpNode.parentNode.removeChild(tmpNode);   
		    }
		    return dpi;
		}
		
		var submitByAjax = function(options) {
			options.type = (options.type || "GET").toUpperCase();
			options.async = typeof options.async != 'undefined'? options.async : true;
			var arr = [];
			for (var name in options.data) {
		        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
		    }
		    var params = arr.join("&");
			var stateChange = function() {
				if (xhr.readyState == 4) {
					var status = xhr.status;
					if (status >= 200 && status < 300) {
						options.success
								&& options.success(xhr.responseText, xhr.responseXML);
					} else {
						options.fail && options.fail(status);
					}
				}
			}
			// 创建 - 非IE6 - 第一步
		    var xhr;
			if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
			} else { // IE6及其以下版本浏览器
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}

			// 连接 和 发送 - 第二步
			if (options.type == "GET") {
				xhr.open("GET", options.url + "?" + params, options.async);
				xhr.send(null);
			} else if (options.type == "POST") {
				xhr.open("POST", options.url, options.async);
				// 设置表单提交时的内容类型
				xhr.setRequestHeader("Content-Type",
						"application/x-www-form-urlencoded");
				xhr.send(params);
			}
			
			// 接收 - 第三步
			if(options.async){
				xhr.onreadystatechange = stateChange;
			}else{
				stateChange();
			}
		};
		
		/**
		 * 已知的插件信息
		 * plugin：非IE浏览器
		 * activex：IE浏览器
		 */
		var dataPluginList = {
			flash : {
				plugin : "Shockwave Flash",
				activex : "ShockwaveFlash.ShockwaveFlash"
			}
		};
		/**
		 * 已知的操作系统
		 */
		var dataOSList = [ {
			key : "win",
			desc : "Windows"
		}, {
			key : "linux",
			desc : "Linux"
		}, {
			key : "mac",
			desc : "Mac"
		} ];

		init();
		
		var clientDetect = {
			/* 浏览器信息 */
			browser : {
				name : getBroserName(),
				version : _browser[getBroserName()],
				ua : _nv.userAgent,
				isIE : !!_browser.ie,
				isChrome : !!_browser.chrome,
				isFirefox : !!_browser.firefox,
				isSafari : !!_browser.safari,
				isOpera : !!_browser.opera,
				//TODO
				isSupportScript : true,
				isSupportFlash : isBrowserSupportPlugin("flash"),
				//TODO
				isSupportImage : true,
				isSupportCookie : _nv.cookieEnabled,
				accept : null,
				acceptLanguage : null,
				acceptEncoding : null,
				browserLanguage : _nv.browserLanguage || null,
				systemLanguage : _nv.systemLanguage || null,
				userLanguage : _nv.userLanguage || null,
				language : _nv.language || _nv.browserLanguage
						|| _nv.systemLanguate || _nv.userLanguage || null
				
			},
			/* 屏幕信息 */
			screen : {
				colorDepth : _sc.colorDepth,
				resolution : getScreenResolution(),
				DPI : getScreenDPI()
			},
			/* 设备信息 */
			device : {
				name : _device.name,
				type : _device.type
			},
			/* 操作系统信息 */
			OS : {
				platform : _platform
			},
			/* 网络信息 */
			netEnvironment : {
				ipAddress : null,
				macAddress : null
			},
			/* 其他信息 */
			others : {
				requestFrom : document.referrer,
				timezone : new Date().getTimezoneOffset() / 60
			}
		};
		
		submitByAjax({
			url : "../ClientDetecterService",
			async : false,
			success : function(responseText){
				var response;
				if(typeof JSON == 'undefined'){
					response = eval("(" + responseText + ")");
				}else{
					response = JSON.parse(responseText);
				}
				clientDetect.netEnvironment.ipAddress = response.ip;
				clientDetect.netEnvironment.macAddress = response.macAddress;
				clientDetect.browser.accept = response.accept;
				clientDetect.browser.acceptLanguage = response.acceptLanguage;
				clientDetect.browser.acceptEncoding = response.acceptEncoding;
			},
			fail : function(status){
				alert(status);
			}
		});
		
		return clientDetect;
	})();
})();
