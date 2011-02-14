

			Request = {
				QueryString: function(item){
					var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
					return svalue ? svalue[1] : svalue;
				}
			};
			var id = Request.QueryString("id");
			var sid =  $.cookie("sid");
			
			if ( id && sid ){
				$("#form").attr( "action" , "/buygift.php?gid=" + id + "&sid=" + sid );
						
				$.getJSON( "/api/index.php/Gift.get", { id : id }, function( gift ){
					if ( gift ){
						setFrame( gift.link );
						$("#name").text( gift.name );
						$("#cost").text( gift.cost );
						$("#ad_words").text( gift.ad_words );
					}else{
						jump();
					}
				} );
				
			}else{
				jump();
			}
			
			function jump (){
				window.location.href = "main.php";
			}
			
			function setFrame( url ){
				var de =  document.documentElement;
				document.getElementById("iframe").src = url;
				document.getElementById("iframe").style.height = ( window.innerHeight || ( de && de.clientHeight ) || document.body.clientHeight ) - 30 + "px";
			}	
	
