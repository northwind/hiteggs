/**
 * @author Norris
 */
$( function(){
	
	
	var luckyguys = $("#luckyguys"),  rank = $("#rank");
	
	var tmpl = [ { name : "��������", url : "view.html", gift : "����1", uid : "A8DK3", date : "2010-12-20" },
						 { name : "��������", url : "view.html",  gift : "����2", uid : "A8DK3", date : "2010-12-20" },
						  { name : "��������", url : "view.html",  gift : "����3", uid : "A8DK3", date : "2010-12-20" } ];
	
	$( "#luckyTemplate" ).tmpl( tmpl ).appendTo( 	$("#luckyguys").find("tbody")  );  
	
	var tmpl2 = [ { name : "��������", uid : "432942", total : "4444", today : "3434" },
						 { name : "��������", uid : "432942",  total : "54543", today : "3434" },
						  { name : "��������", uid : "432942",  total : "3434", today : "344" } ];
	
	$( "#rankTemplate" ).tmpl( tmpl2 ).appendTo( 	$("#rank").find("tbody")  );  	
} );
