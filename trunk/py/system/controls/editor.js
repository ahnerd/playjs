


using("System.Controls.Control");




namespace('.HtmlEditorBase', Py.Control.extend({
	
	defaultDocument: '<!DOCTYPE HTML>\
						<html>\
							<head>\
							</head>\
							<body style="margin:0;">\
							</body>\
						</html>',
	
	create: function (options) {
		return document.create('iframe', 'x-htmleditor');
	},
	
	init: function(options) {
		var iframe = this.dom, html;
		if(this.dom.tagName !== 'IFRAME') {
			var textarea = this.textarea = this.dom;
			this.dom = iframe = this.create(options);
			iframe.tabIndex = textarea.tabIndex;
			textarea.hide();
			
			if(textarea.parentNode)
				this.renderTo(textarea.parentNode);
			iframe.style.width = Element.styleString(textarea, 'width');
			iframe.style.height = Element.styleString(textarea, 'height');
		} else {
			this.textarea = document.create('textarea', '');
		}
		
		iframe.setAttr("frameBorder", "0").setAttr("src", "about:blank");
		
		var me = this;
		
		var iframeDoc = this.getDocument();
		iframeDoc.open();
		iframeDoc.write(me.defaultDocument);
		iframeDoc.close();
		
		iframeDoc.designMode = 'on';
		
		if(textarea)
			this.setHtml(textarea.getText());
		
	},
	
	getDocument: function () {
		var iframe = this.dom;
		return iframe.contentDocument || iframe.contentWindow.document;
	},
	
	setForm: function(form){
		form.appendChild(this.textarea);
	},
	
	setHtml: function (value) {
		this.getDocument().body.innerHTML = value;
		return this;
	},
	
	getHtml: function (value) {
		return this.getDocument().body.innerHTML;
	},
	
	setText: function (value) {
		this.getDocument().body[Element.attributes.innerText] = value;
		return this;
	},
	
	getText: function (value) {
		return this.getDocument().body[Element.attributes.innerText];
	},
	
	execCommand: function(cmdName, args) {
		this.getDocument().execCommand(cmdName, false, args);
		return this;
	},
	
	queryCommandState: function(cmdName) {
		return this.getDocument().queryCommandState(cmdName);
	}

	
}));


String.map('Bold Italic Underline StrikeThrough Subscript Superscript JustifyLeft JustifyCenter JustifyRight JustifyFull Indent Outdent', function(cmdName){
	var p = HtmlEditorBase.prototype;
	
 	p['set' + cmdName] = function (value) {
		return this.execCommand(cmdName, value);
	};
	
	p['get' + cmdName] = function (value) {
		return this.queryCommandState(cmdName);
	};
	
	p[cmdName.charAt(0).toLowerCase() + cmdName.substr(1)] = function (args) {
		return this.execCommand(cmdName, null);
	};
});


String.map('Undo Redo Unlink Paste Cut Copy InsertHorizontalRule InsertOrderedList InsertUnorderedList InsertParagraph', function(cmdName){
	var p = HtmlEditorBase.prototype;
	p[cmdName.charAt(0).toLowerCase() + cmdName.substr(1)] = function (args) {
		return this.execCommand(cmdName, null);
	};
});