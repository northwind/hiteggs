/**
 * @author Norris
 */
$( function(){
	
	//ÖÐ½«Ãûµ¥
	var luckyguys = $("#luckyguys"),  rank = $("#rank");
	var tmpl = [ { name : "°¡°¡°¡°¡", url : "view.html", gift : "ÀñÎï1", uid : "A8DK3", date : "2010-12-20" },
						 { name : "°¡°¡°¡°¡", url : "view.html",  gift : "ÀñÎï2", uid : "A8DK3", date : "2010-12-20" },
						  { name : "°¡°¡°¡°¡", url : "view.html",  gift : "ÀñÎï3", uid : "A8DK3", date : "2010-12-20" } ];
	
	$( "#luckyTemplate" ).tmpl( tmpl ).appendTo( 	$("#luckyguys").find("tbody")  );  
	
	var tmpl2 = [ { name : "°¡°¡°¡°¡", uid : "432942", total : "4444", today : "3434" },
						 { name : "°¡°¡°¡°¡", uid : "432942",  total : "54543", today : "3434" },
						  { name : "°¡°¡°¡°¡", uid : "432942",  total : "3434", today : "344" } ];
	
	$( "#rankTemplate" ).tmpl( tmpl2 ).appendTo( 	$("#rank").find("tbody")  );  	
	
	
	//ÏÔÊ¾ºÃÓÑ
	$("#friends").hover( function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	} );
	
	
	var friends = 120;
	//³õÊ¼»¯Î¢²©
	var source = "562831874";
	WB.core.load(['connect', 'client'], function() {
    var cfg = {
        key: source,
        xdpath: 'http://eggs.sinaapp.com/xd.html'
    };
    WB.connect.init(cfg);
    WB.client.init(cfg); 
	
	if ( WB.connect.checkLogin() ){
		//ÒÑ¾­µÇÂ¼	
		onLogin();	
	}else{
		WB.connect.login(function( ) {
		    onLogin();
		});
	}
	
	function onLogin(){
		
		setTimeout( function(){
			
			WB.client.parseCMD(
			    "/statuses/friends.json",	//$userid $id»á×Ô¶¯Ìæ»» 
			    function(sResult, bStatus) {
					alert( bStatus );
			        if(bStatus == true){
			            
			        }
			    }, {
					cursor : parseInt( Math.random() * Math.max(0, friends -50 ) ) ,
					count  : 50
				}
			);			
			
		}, 1000 );
		
		
	}
	
}); 
	
} );
