/**
 * @author Norris
 */
$( function(){
	
	$.getJSON( "/api/index.php/Gift.getAll", function( obj ){
		if (obj != false && obj.length > 0) {
			parseGift( obj );
			
			$( "#historyTemplate" ).tmpl( obj ).appendTo( 	$("#gifts") );  
		}
	}  );


	$.getJSON( "/api/index.php/Gift.getAll", function( obj ){
		if (obj != false && obj.length > 0) {
			parseGift( obj );
			
			$( "#giftTemplate" ).tmpl( obj ).appendTo( 	$("#gifts") );  
			
			$("#gifts > li").hover( function(){
				$(this).addClass("hover");
			}, function(){
				$(this).removeClass("hover");
			} );			
		}
	}  );
	
	function parseGift( datas ){
		for (var i=0; i<datas.length; i++) {
			var data = datas[i ];
			if ( data.cost <= 1000 ){
				data.cost = "<=1000";
			}else if ( data.cost <= 3000 ){
				data.cost = "<=3000";
			}else if ( data.cost <= 5000 ){
				data.cost = "<=5000";
			}else if ( data.cost <= 10000 ){
				data.cost = "<=10000";
			}else{
				data.cost = ">10000";
			}
		}
	}
		
	
} );
