/**
 * @author Norris
 */
$( function(){

	// flash 接口
	var flash = {};
	$( ["init", "prompt", "setPerson" ] ).each( function( i, n ){
		( function(){
			flash[ n ] = function(){
				var obj = swfobject.getObjectById("mainFlash");
				if(obj){
					try {
						obj[ n ].apply( obj, arguments );
					} catch (e) {
						if (console && console.debug) {
							console.debug("flash : " + $.makeArray( arguments ));
						}
					}
				}					
			}
		} )();
	} );
		
	//中将名单
	var luckyguys = $("#luckyguys"),  rank = $("#rank");
	setTimeout( function(){
		$.getJSON( "/api/index.php/Gift.listBuy", function( obj ){
			if (obj != false && obj.length > 0) {
				$( "#luckyTemplate" ).tmpl( obj ).appendTo( 	$("#luckyguys").find("tbody")  );
			}
		}  );
	}, 500 );
	
	setTimeout( function(){
		$.getJSON( "/api/index.php/User.friendsRank", function( obj ){
			if (obj != false && obj.length > 0) {
				$( "#rankTemplate" ).tmpl( obj ).appendTo( 	$("#rank").find("tbody")  );  
			}
		}  );
	}, 750 );
	
	//显示好友
	$("#friends").hover( function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	} );
	
	var sid = $.cookie( "sid" );
	var me;
	var source = "562831874";
	var token = $.cookie( "anywhereToken" );
	var secret = $.cookie( "anywhereTokenSecret" );
	//获取自身消息
	$.getJSON( "/api/index.php/User.get", { sid : sid }, function( obj ){
		if ( obj ) {
			me = obj;
			$("#username").text( me.username );
			$("#point").text( me.score );  

			window.onFlashComplete = function (){
				//alert( "flash is ok!" );
				//init flash
				try {
					flash.init( source, token, secret, me.sid, me.username, me.friends, true );
				} catch (e) {
					//alert( e );
				}					
			}

			var urlFlash = "/hiteggs.swf";
			var urlFlash = "http://eggs.sinaapp.com/hiteggs.swf";
			swfobject.embedSWF( urlFlash + "?_=" + (+new Date()) , "mainFlash", "500", "480", "10.0.0.0", "http://www.sinaimg.cn/cj/swf/20100612/expressInstall.swf",  {},{
				name: "mainFlash",
				wmode: "opaque",
				allowScriptAccess: "always",
				scale: "noborder",
				bgcolor : "#DAFECF",
				menu: "false",
				allowFullScreen:'false'
			}, null, function(){
				
			} );
										
		}else{
			alert( "抱歉出错了，刷新页面再试试" );
		}
	}  );		
	
	
	setTimeout( getFriends , 250 );				

	function getFriends(){
		$.getJSON( "/api/index.php/Weibo.getFriends50",  { sid : sid }, function( obj ){
			if ( obj ) {
				obj.users = obj.users || [];
				for (var i=0; i<obj.users.length; i++) {
					obj.users[i].profile_image_url = obj.users[i].profile_image_url.replace( /\/50\//, "/180/" ); 
				}
				//生成名单
				$( "#friendsTemplate" ).tmpl( obj.users ).appendTo( "#friends" );  	
				$("#friends").show();

				$("#friends a").click( function(){
					$("#friends").removeClass("hover");
					
					$("#friends a.selected").removeClass( "selected" );
					$( this ).addClass( "selected" );
					
					try {
						flash.setPerson( $(this).attr("sid"),  $(this).text(), $(this).attr("profileUrl") );
						flash.prompt( "@" + $(this).text() + "赐予我力量吧～" );
					} catch (e) {}
					
					//移动最前方
					$( this ).remove().prependTo( "#friends" );
					
				} );
														
			}else{
				alert( "抱歉出错了，刷新页面再试试" );
			}
		}  );			
	}
	
	
} );

//砸蛋后FLASH回调
function onShowGift( ret, msg ){
	//不能再选择好友  修改分数
	if ( ret == "0" ){
		//$("#friends a").unbind( "click" );
		$("#point").text( $("#point").text() * 1 + (msg * 1) );
	}
	if ( ret == "2" ){
		$("#friends a").unbind( "click" );
	}
}


