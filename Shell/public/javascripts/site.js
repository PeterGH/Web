$(document).ready(function() {
    resize();    
    $(window).on("resize", resize);
    $("#input").focus();
    $("#input").keypress(function(e) {
	if (e.which == 13 && !e.shiftKey) {
	    $.ajax({
		url: "/",
		data: $("#input").text(),
		type: "POST"
	    }).done(function(response) {
		console.log("Respones: " + response);
		$("<p></p>").text(response).insertBefore("#input");
		window.scrollTo(0, $("#input").offset().top);
	    }).fail(function(xhr, status, error) {
		console.log("Status: " + status);
		console.log("Error: " + error);
		console.dir(xhr);
	    }).always(function(xhr, status) {
	    });
	    e.preventDefault();
	    $("#input").focus();
	}
    });
});

function resize() {
    $("#input").width($(window).width() - 20);    
}
