/**
 * @author Norris
 */
$( function(){

	var me;
	//获取自身信息
	var sid = $.cookie( "sid" );
	$.getJSON( "/api/index.php/User.get", { sid : sid }, function( obj ){
		if ( obj ){
			me = obj;
			$("#username").text( me.username );
			$("#point").text( obj.score );  

			//获取兑换清单
			$.getJSON( "/api/index.php/Gift.listSelfBuy", { sid : me.id }, function( obj ){
				if (obj != false && obj.length > 0) {
					$( "#historyTemplate" ).tmpl( obj ).appendTo( 	$("#list tbody") );
					$("#list").show();  
				}
			}  );
								
		} else{
			alert( "抱歉出错了，刷新页面再试试" );
		}
	});	
					
	$.getJSON( "/api/index.php/Gift.getAll", function( obj ){
		if (obj != false && obj.length > 0) {
			parseGift( obj );
			
			$( "#giftTemplate" ).tmpl( obj ).appendTo( 	$("#gifts") );  
			
			$("#gifts > li").hover( function(){
				$(this).addClass("hover");
			}, function(){
				$(this).removeClass("hover");
			} );			
		}else{
			$("<center/>").append( "<img src='http://eggs.sinaapp.com/images/coming-soon.jpg' title='' />" )
					 .appendTo( $("#gifts").parent() );
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
