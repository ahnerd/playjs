


using("System.Controls.CombinedTextBox");


namespace(".SearchTextBox", Py.CombinedTextBox.extend({
	
	xType: 'searchtextbox',
	
	tpl: '<label><input type="text" class="x-textbox"><a class="x-textbox-clear" href="#" style="display: none"></a><input type="button" value="工具按钮" class="x-menu-button x-menu-button-search"></label>',
	
	init: function(){
		this.baseCall('init', arguments);
		this.clearButton = this.find('.x-textbox-clear');
		
		this.textBox.on('change', Function.bind(this.onChange, this));
		this.clearButton.get('next').onclick = Function.bind(this.onSearch,  this);
		
		this.clearButton.onclick = Function.bind(this.clear,  this);
	},
	
	setText: function(value){
		
		this.textBox.setText(value);
		this.onChange();
	},
	
	onChange: function(e){
		this.clearButton[this.getText() ? 'show' : 'hide']();
	},
	
	onSearch: Function.empty
}));




