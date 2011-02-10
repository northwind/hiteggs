/**
 * @author Norris
 */
$( function(){
	//初始化微博
	var source = "562831874";
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
	
	var me;
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
						}
					}  );		
					
					//获取兑换清单
					$.getJSON( "/api/index.php/Gift.listSelfBuy", { sid : me.id }, function( obj ){
						if (obj != false && obj.length > 0) {
							$( "#historyTemplate" ).tmpl( obj ).appendTo( 	$("#list tbody") );
							$("#list").show();  
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
