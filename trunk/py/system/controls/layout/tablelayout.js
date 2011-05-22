//===========================================
//  TableLayout.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.using("System.Controls.Layout.LayoutEngine");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.TableLayout = Py.Layout.LayoutEngine.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'table',
	
	/**
	 * 初始化布局。
	 * @method initLayout
	 * @param {Control} container 容器的控件。
	 */
	initLayoutCore: function(container){
		
		// 生成 left top right bottom fill 区域。
		var table = container.table = container.content.append(document.create('table', 'x-layout-table'));
		
		
		table.border = table.cellSpacing = container.split || 0;

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
		var table = container.table,
			row = item.row, 
			column = item.column;
			
		if(row === undefined)
			row = table.rows.length;
			
		if(column === undefined)
			column = table.rows[row] ? table.rows[row].cells.length : 0;
			
		while(table.rows.length <= row){
			table.appendChild(document.createElement('tr'));
		}
		
		row = table.rows[row];
		while(row.cells.length <= column){
			row.appendChild(document.createElement('td'));
		}
		
		column = row.cells[column];
		
		column.appendChild(item.getDom());
		
		if (item.colSpan) {
			column.colSpan = item.colSpan;
		}
		
		if(item.rowSpan) {
			column.rowSpan = item.rowSpan;
		}
	}

}));

