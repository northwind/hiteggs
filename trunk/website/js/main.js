/**
 * @author Norris
 */
$( function(){
	
	//�н�����
	var luckyguys = $("#luckyguys"),  rank = $("#rank");
	var tmpl = [ { name : "��������", url : "view.html", gift : "����1", uid : "A8DK3", date : "2010-12-20" },
						 { name : "��������", url : "view.html",  gift : "����2", uid : "A8DK3", date : "2010-12-20" },
						  { name : "��������", url : "view.html",  gift : "����3", uid : "A8DK3", date : "2010-12-20" } ];
	
	$( "#luckyTemplate" ).tmpl( tmpl ).appendTo( 	$("#luckyguys").find("tbody")  );  
	
	var tmpl2 = [ { name : "��������", uid : "432942", total : "4444", today : "3434" },
						 { name : "��������", uid : "432942",  total : "54543", today : "3434" },
						  { name : "��������", uid : "432942",  total : "3434", today : "344" } ];
	
	$( "#rankTemplate" ).tmpl( tmpl2 ).appendTo( 	$("#rank").find("tbody")  );  	
	
	
	//��ʾ����
	$("#friends").hover( function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	} );
	
	
	var friends = 120;
	//��ʼ��΢��
	var source = "562831874";
	WB.core.load(['connect', 'client'], function() {
    var cfg = {
        key: source,
        xdpath: 'http://eggs.sinaapp.com/xd.html'
    };
    WB.connect.init(cfg);
    WB.client.init(cfg); 
	
	if ( WB.connect.checkLogin() ){
		//�Ѿ���¼	
		onLogin();	
	}else{
		WB.connect.login(function( ) {
		    onLogin();
		});
	}
	
	function onLogin(){
		
		setTimeout( function(){
			
			WB.client.parseCMD(
			    "/statuses/friends.json",	//$userid $id���Զ��滻 
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
