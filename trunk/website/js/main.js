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
	
	//��ʼ��΢��
	var source = "562831874";
	WB.core.load(['connect', 'client'], function() {
    var cfg = {
        key: source,
        xdpath: 'http://eggs.sinaapp.com/xd.html'
    };
    WB.connect.init(cfg);
    WB.client.init(cfg); 
	
	WB.connect.waitReady(onLogin);
	
	//û�е�¼
	if ( !WB.connect.checkLogin() ){
		$("#loginarea").show();
		$("#logonarea").hide();
		
		$("#loginarea button").click( function(){
			WB.connect.login();			
		} );
	}
	
	var me;
	function onLogin(){
		$("#loginarea").hide();
		$("#logonarea").show();
		
		//��ȡ������Ϣ
		WB.client.parseCMD(
		    "/statuses/user_timeline.json",	//$userid $id���Զ��滻 
		    function(sResult, bStatus) {
				var ret = sResult[ 0 ];
		        if(bStatus == true && ret && ret.user ){
					me = ret.user;
					$("#username").text( me.screen_name );
					
					//init flash
					flash.setUser( me.id, source );
					
					getFriends();
		        }
		    }, {
				count  : 1
			},{
		        method: 'post'
		    }
		);	
		
		//�ӹ�ע
		$("#attention").click( function(){
			WB.client.parseCMD(
			    "/friendships/create.json",	//$userid $id���Զ��滻 
			    function(sResult, bStatus) {
			        $("#attention").html( "�ѹ�ע" ).unbind("click").attr( "disabled" ,"true" ).css("color", "gray");
			    }, {
					user_id  : "1676619367"
				},{
			        method: 'post'
			    }
			);				
		} );
		
		return;			
	}
	
	function getFriends(){
		if ( !me )
			return false;
		
		WB.client.parseCMD(
		    "/statuses/friends.json",	//$userid $id���Զ��滻 
		    function(sResult, bStatus) {
		        if(bStatus == true && sResult.users ){
					//��������
					$( "#friendsTemplate" ).tmpl( sResult.users ).appendTo( "#friends" );  	
					$("#friends").show();
					
					$("#friends").find("a").click( function(){
						$("#friends").removeClass("hover");
						
						flash.setPerson( $(this).text(), $(this).attr("profileUrl") );
						flash.addText( $(this).text() + "�����������ɡ�" );
					} );
		        }
		    }, {
				cursor : parseInt( Math.random() * Math.max(0, me.friends_count -50 ) ) ,
				count  : 50
			},{
		        method: 'post'
		    }
		);	
	}
	
	// flash �ӿ�
	var flash = {};
	$( ["setPerson", "setUser", "updateStatus", "addText" ] ).each( function( i, n ){
		( function(){
			flash[ n ] = function(){
				var obj = swfobject.getObjectById("${application}");
				if(obj){
					try {
						obj[ n ].apply( obj, arguments );
					} catch (e) {
						alert( e )
					}
				}					
			}
		} )();
	} );
	
}); 
	
} );
