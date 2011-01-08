/**
 * @author Norris
 */
$( function(){
	
	var ul = $("#friends"), form = $("#transfer"), fid = $("#fid"), fname = $("#fname"),  num = $("#num");

	var tmpl = [ { name : "fdsafs块钱 ", avatar_url : "http://tp1.sinaimg.cn/1220291284/50/1281879003/1", uid : "A8DK3", point : "500" },
						 { name : "块钱 ", avatar_url : "http://tp1.sinaimg.cn/1220291284/50/1281879003/1",  uid : "A8DK3", point : "2443" },
						  { name : "块钱", avatar_url : "http://tp1.sinaimg.cn/1220291284/50/1281879003/1",  uid : "A8DK3", point : "220" } ];
	
	$( "#friendTemplate" ).tmpl( tmpl ).appendTo( 	$("#friends") );  
		
	ul.children("li").hover( function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	} )
	.children("a").click( function(){
		
		fid.val( $(this).attr("uid") );
		fname.val(  $(this).siblings("h4").text()  );
		
	} );
	
	form.submit( function( e ){
		var n =   $.trim( num.val() ); 
		if ( fid.val() == "" || $.trim( fname.val() ) == "" )
			msg( "请先选择好友" );
		else if ( n == "" || n == 0 ){
			msg( "请输入积分" );
		}else if ( isNaN( n ) || n < 0 ){
			msg( "认真点嘛，输入正确的积分" );
		}else{
			n = n * 1;
			if ( n > 100 ){
				msg( "你还没那么多积分呢～～" );
			}else if( n > 200 ){
				msg( "剩下的积分不够付手续费的哦～～" );
			}else{
				$.post( "transfer.html", $(this).serialize(), function( data ){
					if (data) {
						msg(data.msg);
					}else{
						msg( "服务器错误，稍后再尝试" );
					}
				} );
			}
		}
		
		return false;
	} );
	
	function msg( str ){
		alert( str );
	}
	
} );
