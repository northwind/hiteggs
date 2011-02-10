
$( function(){

			Request = {
				QueryString: function(item){
					var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
					return svalue ? svalue[1] : svalue;
				}
			};
			var id = Request.QueryString("id");
			
			if ( id ){
				$.getJSON( "/api/index.php/Gift.get", { id : id }, function( gift ){
					if ( gift ){
						setFrame( gift.link );
						$("#name").text( gift.name );
						$("#cost").text( gift.cost );
						$("#ad_words").text( gift.ad_words );
						
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
								$("#nav button").click( function(){
									WB.connect.login();			
								} );
							}
							
							function  onLogin(){
								//获取自身消息
								WB.client.parseCMD(
								    "/statuses/user_timeline.json",	//$userid $id会自动替换 
								    function(sResult, bStatus) {
										var ret = sResult[ 0 ];
								        if(bStatus == true && ret && ret.user ){
											me = ret.user;
											$("#nav button").click( function(){
												window.location.href = "/buygift.php?gid=" + id + "&uid=" + me.id;
											} );													
								        }
								    }, {
										count  : 1
									},{
								        method: 'post'
								    }
								);									
							}
						});
					}else{
						jump();
					}
				} );
				
			}else{
				jump();
			}
			
			function jump (){
				window.location.href = "index.php";
			}
			
			function setFrame( url ){
				var de =  document.documentElement;
				document.getElementById("iframe").src = url;
				document.getElementById("iframe").style.height = ( window.innerHeight || ( de && de.clientHeight ) || document.body.clientHeight ) - 30 + "px";
			}	
	
} );
