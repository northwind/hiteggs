/**
 * @author Norris
 */
$( function(){
	var ul = $("#friends"), form = $("#transfer"), fid = $("#fid"), fname = $("#fname"),  num = $("#num");
	
	var sid = $.cookie( "sid" );
	var  me;

	//获取砸蛋信息
	$.getJSON( "/api/index.php/User.get", { sid : sid }, function( obj ){
		if ( obj ) {
			me = obj;
			$("#username").text( me.username );
			$("#point").text( me.score );  
		}
	}  );		

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
				$.getJSON( "/api/index.php/User.transfer", { from_sid : me.sid, to_sid : fid.val(), score : n }, function( obj ){
					if ( obj ) {
						if ( obj.ret == 0 ){
							msg( "操作成功" );
							$("#point").text( point - n * 1.3 );
							num.val( "" );
							ul.children("li").removeClass("selected");
							
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
