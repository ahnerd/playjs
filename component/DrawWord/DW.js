function main()
{
	var a = -1,
		texts = ["12","23","34"],
		colors = ["blue","black","red"];
	document.on("mousemove", function(e){
		if(++a % 10 != 0) return;
		var div = Element.createDiv();
		div.renderTo();			
		div.setStyle("color", colors[a/10% colors.length]);
		div.setText(texts[a/ 10 % texts.length]);			
	    div.setPosition(e.pageX, e.pageY);   
	});
}

window.ready(main);
