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
	
	$.getJSON( "/api/index.php/Gift.listBuy", function( obj ){
		if (obj != false && obj.length > 0) {
			$( "#luckyTemplate" ).tmpl( obj ).appendTo( 	$("#luckyguys").find("tbody")  );
		}
	}  );
	
	$.getJSON( "/api/index.php/User.friendsRank", function( obj ){
		if (obj != false && obj.length > 0) {
			$( "#rankTemplate" ).tmpl( obj ).appendTo( 	$("#rank").find("tbody")  );  
		}
	}  );
	
	//显示好友
	$("#friends").hover( function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	} );
	
	//初始化微博
	var source = "562831874";
	WB.core.load(['connect', 'client'], function() {
    var cfg = {
        key: source,
        xdpath: 'http://eggs.sinaapp.com/xd.html'
    };
    WB.connect.init(cfg);
    WB.client.init(cfg); 
	
	var me;
	function onLogin(){
		$("#loginarea").hide();
		$("#logonarea").show();
		
		//获取自身消息
		WB.client.parseCMD(
		    "/statuses/user_timeline.json",	//$userid $id会自动替换 
		    function(sResult, bStatus) {
				var ret = sResult[ 0 ];
		        if(bStatus == true && ret && ret.user ){
					me = ret.user;
					$("#username").text( me.screen_name );
					
					//获取砸蛋信息
					$.getJSON( "/api/index.php/User.get", { sid : me.id }, function( obj ){
						if ( obj ) {
							$("#point").text( obj.score );  
							
							//init flash
							try {
								flash.init( source, me.id, me.screen_name, me.followers_count, obj.today_hits <= 0 );
							} catch (e) {	}
												
						}
					}  );		
					
					getFriends();			
		        }else{
					needLogin();
				}
		    }, {
				count  : 1
			},{
		        method: 'post'
		    }
		);	
		
		//加关注
		$("#attention").click( function(){
			WB.client.parseCMD(
			    "/friendships/create.json",	//$userid $id会自动替换 
			    function(sResult, bStatus) {
			        $("#attention").html( "已关注" ).unbind("click").attr( "disabled" ,"true" ).css("color", "gray");
			    }, {
					user_id  : "1676619367"
				},{
			        method: 'post'
			    }
			);				
		} );
		
		return;			
	}

	WB.connect.waitReady(onLogin);
	
	//没有登录
	if ( !WB.connect.checkLogin() ){
	//if ( !me ){
		needLogin();
	}

	$("#loginarea button").click( function(){
		//WB.connect.login( onLogin );			
		WB.connect.loginStatus( -1 );
		WB.connect.login( onLogin );
	} );	
	function needLogin(){
		$("#loginarea").show();
		$("#logonarea").hide();
		
		alert( "您还没有登录微博，请点击左侧登录按钮" );		
	}
		
	function getFriends(){
		if ( !me )
			return false;
		
		WB.client.parseCMD(
		    "/statuses/friends.json",	//$userid $id会自动替换 
		    function(sResult, bStatus) {
		        if(bStatus == true && sResult.users ){
					//生成名单
					$( "#friendsTemplate" ).tmpl( sResult.users ).appendTo( "#friends" );  	
					$("#friends").show();
					
					$("#friends a").click( function(){
						$("#friends").removeClass("hover");
						
						$("#friends a.selected").removeClass( "selected" );
						$( this ).addClass( "selected" );
						
						try {
							flash.setPerson( $(this).attr("sid"),  $(this).text(), $(this).attr("profileUrl") );
							flash.prompt( "@" + $(this).text() + "赐予我力量吧～" );
						} catch (e) {}
					} );
		        }
		    }, {
				cursor : parseInt( Math.random() * Math.max(0, me.friends_count -50 ) ) ,
				count  : 50
			},{
		        method: 'post'
		    }
		);	
	}
	
}); 
	
} );
//砸蛋后FLASH回调
function onShowGift( ret, msg ){
	//不能再选择好友  修改分数
	if ( ret == "0" ){
		$("#friends a").unbind( "click" );
		$("#point").text( $("#point").text() * 1 + (msg * 1) );
	}
	if ( ret == "2" ){
		$("#friends a").unbind( "click" );
	}
}


