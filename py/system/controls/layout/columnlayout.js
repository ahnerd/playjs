//===========================================
//  TableLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

using("System.Controls.Layout.LayoutEngine");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.ColumnLayout = Py.Layout.LayoutEngine.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'column',
	
	/**
	 * 初始化布局。
	 * @method initLayout
	 * @param {Control} container 容器的控件。
	 */
	initLayoutCore: function(container){
		
		// 生成 left top right bottom fill 区域。
		var table = container.table = container.content.appendChild(document.create('table', 'x-layout-table'));
		
		
		table.border = table.cellSpacing = container.split || 0;
		table.width = '100%';
		table.appendChild(document.createElement('tr')).vAlign = container.vAlign || 'middle';
	},
	
	/**
	 * 取消和容器的关联。
	 * @method uninitLayout
	 * @param {Control} container 容器的控件。
	 */
	uninitLayoutCore: function(container){
		container.content.find('.x-layout-table').remove();
	},
		
	/**
	 * 容器添加一个子控件后执行。
	 * @method onControlAdded
	 * @param {Control} container 容器的控件。
	 * @param {Control} item 项。
	 */
	onControlAdded: function(container, item, index){
		var row = container.table.rows[0];
		
		if(index === undefined)
			index = row.cells.length;
		
		while(row.cells.length <= index){
			row.appendChild(document.createElement('td'));
		}
		
		row = row.cells[index];
		
		var dom = row.appendChild(item.dom || item);
		
		if (dom.style.width) {
			row.style.width = dom.style.width;
			dom.style.width = '100%';
		}
	}

}));

