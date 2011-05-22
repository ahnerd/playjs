




Py.defineDomEvents('ctrlenter', 'keypress', undefined, true, true).delegate = function(e){
	if(e.ctrlKey && (e.which == 13 || e.which == 10))
		this.trigger('ctrlenter', e);
};


Py.Element.enableSubmitOnCtrlEnter = function(elem, check){
	check = check || Function.returnTrue;
	Py.$(elem).on('ctrlenter', function(){if(check(this.value) && this.form) this.form.submit();});
};