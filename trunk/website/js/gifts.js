/**
 * @author Norris
 */
$( function(){
	
	
	var ul = $("#gifts");
	ul.children("li").hover( function(){
		$(this).addClass("hover");
	}, function(){
		$(this).removeClass("hover");
	} );
	
	var tmpl = [ { name : "가가가가", url : "view.html", key : "A8DK3", expire : "2010-12-20" },
						 { name : "가가가가", url : "view.html",  key : "A8DK3", expire : "2010-12-20" },
						  { name : "가가가가", url : "view.html",  key : "A8DK3", expire : "2010-12-20" } ];
	
	$( "#giftTemplate" ).tmpl( tmpl ).appendTo( 	$("#list").find("tbody").empty()  );  
	
} );
