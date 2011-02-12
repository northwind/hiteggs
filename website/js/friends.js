/**
 * @author Norris
 */
$( function(){
	var ul = $("#friends"), form = $("#transfer"), fid = $("#fid"), fname = $("#fname"),  num = $("#num");
	//初始化微博
	var source = "562831874" , me;
	WB.core.load(['connect', 'client'], function() {
	    var cfg = {
	        key: source,
	        xdpath: 'http://eggs.sinaapp.com/xd.html'
	    };
	    WB.connect.init(cfg);
	    WB.client.init(cfg); 
		
		WB.connect.waitReady(onLogin);
		
		//没有登录
		if ( !WB.connect.checkLogin() ){
			window.location.href = "/index.php";
		}
		
		function onLogin(){
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
								
								//渲染好友
								$.getJSON( "/api/index.php/User.friends", function( obj ){
									if (obj != false && obj.length > 0) {
										$( "#friendTemplate" ).tmpl( obj ).appendTo( "#friends" ); 
										
								ul.children("li").hover( function(){
									$(this).addClass("hover");
								}, function(){
									$(this).removeClass("hover");
								} )
								.click( function(){
									
									ul.children("li").removeClass("selected");
									$(this).addClass("selected");
									
									fid.val( $(this).attr("sid") );
									fname.val(  $(this).find("h4 strong").text()  );
									
								} );
																		
									}else{
										$("<li>").text("赶快邀请好友参加吧").appendTo( "#friends" );
									}
								}  );
							}
						}  );		
						
			        }
			    }, {
					count  : 1
				},{
			        method: 'post'
			    }
			);	
			
			return;			
		}
	
	}); 
	
	form.submit( function( e ){
		var n =   $.trim( num.val() ) , point = ($("#point").text() || 0 ) * 1; 
		if ( fid.val() == "" || $.trim( fname.val() ) == "" )
			msg( "请先选择好友" );
		else if ( n == "" || n == 0 ){
			msg( "请输入积分" );
		}else if ( isNaN( n ) || n < 0 ){
			msg( "认真点嘛，输入正确的积分" );
		}else{
			n = n * 1;
			if ( n * 1.3 > point ){
				msg( "你还没那么多积分呢～～" );
			} else {
				$.getJSON( "/api/index.php/User.transfer", { from_sid : me.id, to_sid : fid.val(), score : n }, function( obj ){
					if ( obj ) {
						if ( obj.ret == 0 ){
							msg( "操作成功" );
							$("#point").text( point - n * 1.3 );
						}else{
							msg( obj.msg );
						}
					}
				}  );	
			}
		}
		
		return false;
	} );
	
	function msg( str ){
		alert( str );
	}
	
} );
