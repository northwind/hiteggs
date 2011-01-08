/**
 * @author Norris
 */
$( function(){
	
	
	var luckyguys = $("#luckyguys"),  rank = $("#rank");
	
	var tmpl = [ { name : "가가가가", url : "view.html", gift : "쟉膠1", uid : "A8DK3", date : "2010-12-20" },
						 { name : "가가가가", url : "view.html",  gift : "쟉膠2", uid : "A8DK3", date : "2010-12-20" },
						  { name : "가가가가", url : "view.html",  gift : "쟉膠3", uid : "A8DK3", date : "2010-12-20" } ];
	
	$( "#luckyTemplate" ).tmpl( tmpl ).appendTo( 	$("#luckyguys").find("tbody")  );  
	
	var tmpl2 = [ { name : "가가가가", uid : "432942", total : "4444", today : "3434" },
						 { name : "가가가가", uid : "432942",  total : "54543", today : "3434" },
						  { name : "가가가가", uid : "432942",  total : "3434", today : "344" } ];
	
	$( "#rankTemplate" ).tmpl( tmpl2 ).appendTo( 	$("#rank").find("tbody")  );  	
} );
