//===========================================
//  树视图           treeview.js          A
//===========================================


imports("Resources.*.DataView.TreeView");
using("System.Controls.IContainerControl");
using("System.Controls.ICollapsable");


(function(){
	

namespace(".TreeNode", Py.Control.extend(Object.extendIf({
	
	xType: 'treenode',
	
	create: function(){
		var dom = document.create('div', 'x-' + this.xType);
		dom.appendChild(document.create('a', ''));
		return dom;
	},
		   
	depth: 0,
	
	init: function(options){
		this.label = this.find("a");
		this.initChildren('nodes');
	},
	
	onControlAdded: function(childNode, index){
		var me = this,
			list = this.initItem(childNode),
			re = this.controls[index];
		this.content.insertBefore(list, re ? (re.dom || re).parentNode : null);
		// 只有 已经更新过 才去更新。
		if(this.depth || this instanceof Py.TreeView){
			childNode.setDepth(this.depth + 1);
		}
		
		me.update();
	},
	
	onControlRemoved: function(childNode, index){
		this.update();
	},
	
	_initItem: function(childNode){
		var me = this, li = document.create('li', 'x-list-content');
		li.appendChild(childNode.dom);
		
		// 如果 子节点有子节点，那么插入子节点的子节点。
		if(childNode.content){
			li.appendChild(childNode.content);
		}
		
		if(childNode.duration == -1){
			childNode.duration = me.duration;
		}
		
		return li;
	},
	
	initItem: function(childNode){
		
		// 第一次执行创建容器。
		var dom = this.content = document.create('ul', 'x-list-container');
		
		this.dom.appendChild(dom);
		
		this.initItem = this._initItem;
		
		return this.initItem (childNode);
		
	},
	
	setNodeType: function(type){
		var handle = this.getSpan(0);
		if(handle)
			handle.className = 'x-treenode-space x-treenode-' + type;
	},
	
	// 设置当前节点的父节点。
	setParent: function(parent){
		
		// 然后附加到一个节点。
		parent.appendChild(this);
		return this;
	},
	
	// 由于子节点的改变刷新本节点和子节点状态。
	update: function(){
		
		
		if(this._checkChild()){
			var currentLastNode =  this.nodes[this.nodes.length - 1],
				lastNode = this.lastNode;
			if (lastNode !== currentLastNode) {
				currentLastNode.markAsLastNode();
				this.lastNode = currentLastNode;
				if (lastNode) lastNode.clearMarkAsLastNode();
			}
		}
		
		//this.toggleClass('x-treenode-last', this.parent.nodes.indexOf(this) == this.parent.nodes.length - 1);
	},
	
	updateAllSpan: function(){ 
	
	return;
		this.updateSpan();
		this.nodes.invoke('updateAllSpan', arguments);
	},
	
	/**
	 * 更新最后的节点的子节点前面的虚线。
	 */
	updateSpan: function(){
		
		
		var span = this.getSpan(0), current = this;
		// 更新 last node
		while((current = current.parent) && (span = span.previousSibling)){
			
			span.className = current.isLastNode() ? 'x-treenode-space x-treenode-none' : 'x-treenode-space';
		
		}
	},
	
	setAllSpan: function(depth, className){
		
		this.nodes.each(function(node){
			var first = node.get('first', depth);
			if(first.tagName == 'SPAN')
				first.className = className;
			node.setAllSpan(depth, className);
		});
		
	},
	
	expandAll: function(){
		
		if (this.content) {
			this.expand();
			this.nodes.invoke('expandAll', []);
		}
	},
	
	collapseAll: function(){
		
		
		if (this.content) {
			this.nodes.invoke('collapseAll', []);
			
			this.collapse();
		}
	},
	
	isLastNode: function(){
		return this.parent &&  this.parent.lastNode === this;
	},
	
	markAsLastNode: function(){
		this.addClass('x-treenode-last');
	//	this.nodes.invoke('updateAllSpan', []);
		this.setAllSpan(this.depth - 1, 'x-treenode-space x-treenode-none');
	},
	
	clearMarkAsLastNode: function(){
		this.removeClass('x-treenode-last');
		//this.nodes.invoke('updateAllSpan', []);
		this.setAllSpan(this.depth - 1, 'x-treenode-space');
	},
	
	_checkChild: function(){
		if (this.nodes.length === 0) {
			this.setNodeType('normal');
			return false;
		} else {
			this.onToggleCollapse(this.isCollapsed());
			return true;
		}
	},
	
	onToggleCollapse: function(value){
		this.setNodeType(value ? 'plus' : 'minus');
	},
	
	onExpand: function(){
		this.get('next', 'ul').style.height = 'auto';
		//    var p = this.dom.parentNode;
		//while(p.className.indexOf('x-list-') === 0){
		//	p.style.height = 'auto';
		//	p = p.parentNode;
		//}
		this.trigger('expand');
		this.onToggleCollapse(false);
	},
	
	// 获取当前节点的占位 span 。 最靠近右的是 index == 0
	getSpan: function(index){
		return this.label.get('previous', index);
	},

	// 设置当前节点的深度。
	setDepth: function(value){
		
	
		var currentDepth = this.depth, span;
		
		assert(value >= 0, "value 非法。 value = {0}", value);
		
		while(currentDepth > value){
			this.dom.removeChild(this.dom.firstChild);
			currentDepth--;
		}
	
	
		while(currentDepth < value){
			this.dom.insert(document.create('span', 'x-treenode-space'), 'afterBegin');
			currentDepth++;
		}
		
		this.depth = value;
		
		var span = this.getSpan(0);

		if(span.className == 'x-treenode-space'){
			if(this._checkChild()){
				span.onclick = Function.bind(this.toggleCollapse, this);
			}
		}
		
		this.updateSpan();
		
		// 对子节点设置深度+1
		this.nodes.invoke('setDepth', [value + 1]);
	},
	
	toString: function(){
		return String.format("{0}#{1}", this.getText(), this.depth);
	}

}, Py.IContainerControl )).implementIf(Py.ICollapsable));


Py.Control.delegate(Py.TreeNode, 'label', 'setHtml setText', 2, 'getHtml getText', 1);

namespace(".TreeView", Py.TreeNode.extend({
	
	xType: 'treeview'
	
	/*
create: function(){
		return document.create('div', 'x-treeview');
	},
	
	setNodeType: Function.empty,
	
	init: Py.ListControl.prototype.init
*/
	
}));



})();
