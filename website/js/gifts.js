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
	
	var tmpl = [ { name : "��������", url : "view.html", key : "A8DK3", expire : "2010-12-20" },
						 { name : "��������", url : "view.html",  key : "A8DK3", expire : "2010-12-20" },
						  { name : "��������", url : "view.html",  key : "A8DK3", expire : "2010-12-20" } ];
	
	$( "#giftTemplate" ).tmpl( tmpl ).appendTo( 	$("#list").find("tbody").empty()  );  
	
} );
