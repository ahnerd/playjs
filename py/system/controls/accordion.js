//===========================================
//  层叠选项卡   accordion.js         A
//===========================================



imports("Resources.*.Container.Accordion");
using("System.Controls.Control");
using("System.Controls.IContainerControl");
using("System.Controls.ICollapsable");


namespace(".Accordion", Py.Control.extend(Object.extendIf({
	
	/**
	 * xType
	 * @type String
	 */
	xType: 'accordion',
	
	duration: 200,
	
	create:function(options){
		return document.create('div', 'x-accordion');
	},
	
	init:function(options){
		this.initChildren('tabPages');
	},
	
	/**
	 * 包装元素为 TabPage 。
	 */
	initItem: function (item) {
		return new Py.Accordion.TabPage(item, item.title, this);
	},
	
	activeTab: null,
	
	onControlAdded: function(childControl, index){
		index = this.controls[index];
		this.dom.insertBefore(childControl.dom, index ? index.dom : null);
		this.dom.insertBefore(childControl.header, childControl.dom);
	},
	
	onControlRemoved: function(childControl, index){
		this.dom.removeChild(childControl.dom);
		this.dom.removeChild(childControl.header);
	},
	
	setActiveTab: function(tabPage){
		if(this.activeTab === tabPage)
			return;
		this.activeTab.collapse();
		tabPage.expand();
		this.activeTab = tabPage;
	}
	
}, Py.IContainerControl))).TabPage = Py.Control.extend({
	
	constructor: function(dom, title, accordition){
		if(dom instanceof Py.Accordion.TabPage)
			return dom;
		var me = this,
			header = this.header = document.create('div', 'x-header x-accordion-header'),
			container = this.content = this.dom = document.create('div', 'x-body x-accordion-body');
		header.appendChild(document.create('h3', '').setHtml(title));
		header.onclick = function(e){
			accordition.setActiveTab(me);
		};
		container.appendChild(dom.dom  || dom);
		 
		me.duration = accordition.duration;
		
		if(accordition.activeTab){
			container.hide();
		} else {
			accordition.activeTab = this;
			this.onToggleCollapse(false);
		}
		
	},
	
	setTitle: function (value) {
		this.header.find('h3').setText(value);
		
		return this;
	},
	
	getTitle: function () {
		return this.header.find('h3').getText();
	},
	
	onToggleCollapse: function (value) {
		this.header.find('h3').toggleClass('x-collapsable', !value);
	}
	
}).implementIf(Py.ICollapsable);