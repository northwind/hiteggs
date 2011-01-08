/**
 * @author Norris
 */
$( function(){
	
	var ul = $("#friends"), form = $("#transfer"), fid = $("#fid"), fname = $("#fname"),  num = $("#num");

	var tmpl = [ { name : "fdsafs��Ǯ ", avatar_url : "http://tp1.sinaimg.cn/1220291284/50/1281879003/1", uid : "A8DK3", point : "500" },
						 { name : "��Ǯ ", avatar_url : "http://tp1.sinaimg.cn/1220291284/50/1281879003/1",  uid : "A8DK3", point : "2443" },
						  { name : "��Ǯ", avatar_url : "http://tp1.sinaimg.cn/1220291284/50/1281879003/1",  uid : "A8DK3", point : "220" } ];
	
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
			msg( "����ѡ�����" );
		else if ( n == "" || n == 0 ){
			msg( "���������" );
		}else if ( isNaN( n ) || n < 0 ){
			msg( "������������ȷ�Ļ���" );
		}else{
			n = n * 1;
			if ( n > 100 ){
				msg( "�㻹û��ô������ء���" );
			}else if( n > 200 ){
				msg( "ʣ�µĻ��ֲ����������ѵ�Ŷ����" );
			}else{
				$.post( "transfer.html", $(this).serialize(), function( data ){
					if (data) {
						msg(data.msg);
					}else{
						msg( "�����������Ժ��ٳ���" );
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
