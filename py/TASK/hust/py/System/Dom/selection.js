




(function(){
	
	function getSelection(textBox){
		return textBox.tagName == "TEXTAREA" ? textBox.createTextRange() : document.selection.createRange();
	}

	Py.namespace("Py.Element", {
		
		select: 'selection' in document ? function(textBox, start, end){
			textBox.select();
			var r =  document.selection.createRange() ; //   getSelection(textBox);
			r.moveStart("character", start);
			r.moveEnd("character", 3);
			r.select();
		} : function(textBox, start, end){
			textBox.select();
			textBox.selectionEnd = end;
			textBox.selectionStart = start;
		},
		
		getCursorPosition: 'selection' in document ? function(textBox) {
			var r = getSelection(textBox);
			r.moveStart("character", -textBox.value.length);
			return r.text.length;
		} : function(textBox){
			return textBox.selectionStart;
		},
		
		setCursorPosition:  function(textBox, position){
			Py.Element.select(textBox, position, position);	
		}
		
	});

})();
