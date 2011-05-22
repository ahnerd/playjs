



Py.using("System.Controls.Layout.LayoutEngine");



Py.Layout.LayoutEngine.implement({
	
	setLayout: function(elem, controls){
		elem = Py.$(elem);
		elem.controls = controls || Array.create(elem.childNodes);
		this.initLayout(elem);
		this.layout(elem);
		return elem;
	}
	
});
