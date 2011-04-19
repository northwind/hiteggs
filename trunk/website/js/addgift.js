/**
 * @author Norris
 */
$( function(){
	
	var url = "http://eggs.sinaapp.com/api/index.php/Gift.add";
	
	var excuting = false;
	$("#form").submit( function( e ){
		e.preventDefault();
		
		var emptys = 0;
		$("#form input,#form textarea").each( function(){
			if ( $(this).val() == "" )
				emptys++;
		} );
		
		if ( emptys > 0 ){
			alert( "输入项不能为空" );
		}else{
			if ( excuting )
				return false;
			
			excuting = true;
			
			
			var codes = $("#copycodes").val();
			$("#exchange").val( $( codes ).find( "a" ).attr( "href" ) );
			
			
			$.post( url,  $( this ).serialize()  , function( data ){
				var obj = jQuery.parseJSON( data );
				if ( obj && obj.ret == 0 ){
					alert( "提交成功，请等待审核"  );
				}else{
					alert( (obj && obj.msg) || "提交失败"  );
				}
				
				excuting = false;
			} );
				
		}
			
		
		return false;
	} );
	
} );
