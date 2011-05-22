


Py.using("System.Controls.ScrollableControl");
Py.using("System.Controls.IParentControl");

/**
 * 内容显示面板。
 * @class ContainerControl
 * @abstract
 */
Py.namespace("Py", "TabControl", Py.ScrollableControl.extend({
	
	heightFix: 33,
	
	widthFix: 2,
	
	/**
	 * 模板。
	 * @type String
	 */
	tpl: '<div class="x-tabcontrols">\
                <div class="x-tabcontrols-header x-header">\
                    <div class="x-header-container">\
                        <ul class="x-list-container x-tabcontrols-header-container">\
						</ul>\
					</div>\
                </div>\
                <div class="x-container x-tabcontrols-container">\
                    \
                </div>\
                <div class="x-footer x-tabcontrols-footer">\
                    <div class="x-footer-container">\
                        <div class="x-footer-content"></div>\
                    </div>\
                </div>\
            </div>\
            ',
			
	addHeaderItem: function(name, onclick, title){
		var item = this.header.append('<input type="button" class="x-menu-button x-menu-' + name +'" title="' + title + '">');
		item.onclick = Function.bind(onclick, this);
		return item;
	},
	
	/**
	 * 当被子类重写时，渲染控件。
 	 * @method init
 	 * @param {Object} [options] 配置。
 	 * @protected
	 */
	init: function(options) {
		this.header = this.find('.x-tabcontrols-header ul');
		this.tabPages = new Py.Control.ControlCollection(this);
		this.content = this.find('.x-tabcontrols-container');
	},
	
	selectTab: function(index){
		var c = this.tabPages[index];
		
		if(c)
			c.active();
	},
	
	/**
	 * 内部添加一个 tabPage。
	 * @param {Object} item
	 * @param {Object} index
	 */
	onControlAdded: function(tabPage, index){
		
		// 添加内容。
		tabPage.dom.addClass('x-content x-tabcontrols-content').hide().renderTo(this.find('.x-container'));
		
		// 用于搜索插入位置。
		var nextControl = this.tabPages[index];
		
		if(nextControl)
			nextControl = nextControl.header;
		else
			nextControl = null;
		
		// 插入节点。
		this.header.insertBefore(tabPage.header, nextControl);
		
		if(!this.selectedTab)
			this.selectTab(0);
			
	},
	
	onControlRemoved: function(tabPage, index){
		if(this.selectedTab === tabPage)
			this.selectTab(index);
		tabPage.header.remove();
		tabPage.remove();
		
	}


}) );


Py.TabControl.ControlCollection = Py.Control.ControlCollection.extend({
	
	check: function(childControl){
		
		if(typeof childControl === 'string')
			childControl = new Py.TabPage().setText(childControl);
		
		// 如原来控件已经有父节点，先删除。
		if(childControl.parent){
			childControl.parent.tabPages.remove(childControl);
		}
		
		return childControl;
	}
	
});

Py.namespace("Py", "TabPage", Py.Control.extend({
	
	header: null,
	
	init: function(options){
		// 创建 header 。
		var me = this,
			li = document.create('li', 'x-list-content x-tabcontrols-header-content');
		li.innerHTML = '<div><h3>' + (options.name || '&nbsp;') + '</h3></div>';
		me.header = li.setUnselectable();
		me.header.onclick = function(){
			me.active();
		};
	},
	
	setIcon: function(icon){
		var n = this.header.find('.x-icon');
		if(!n || n.tagName !== 'SPAN') n =  this.header.insert(document.createElement('span'), 'afterBegin')
		
		n.className = 'x-icon x-icon-' + icon;
	},
	
	setHeaderItem: function(icon){
		var n = this.header.find('.x-icon');
		if(!n || n.tagName !== 'A') n =  this.header.insert(document.createElement('a'), 'beforeEnd')
		
		n.className = 'x-icon x-icon-' + icon;
	},
	
	setTitle: function(value){
		this.name = value;
		for(var node = this.header.firstChild.firstChild.firstChild; node; node = node.nextSibling){
			if(node.nodeType === 3){
				node[Py.Element.attributes.innerText] = value;
				return this;
			}
		}
	},
	
	getTitle: function(){
		return this.name;
	},
	
	active: function(){
		var me =  this, 
			c = me.parent;
		if(c.selectedTab !== me && c.selectedTab){
			
			c.selectedTab.deactive();
			
		}
		
		c.selectedTab = me;

		me.header.addClass('x-selected');
		
		me.dom.show();
	},
	
	close: function(){
		this.parent.tabPages.remove(this);
	},
	
	deactive: function(){
		
		this.parent.selectedTab = null;
		
		this.header.removeClass('x-selected');
		
		this.dom.hide();
	}
}));