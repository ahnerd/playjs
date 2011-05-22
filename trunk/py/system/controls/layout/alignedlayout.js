//===========================================
//  AbsoluteLayout.js
//  Copyright(c) 2009-2011 xuld
//============================================

Py.using("System.Controls.Layout.AbsoluteLayout");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.AlignedLayout = Py.Layout.AbsoluteLayout.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'aligned',
	
	onControlAdded: function(container, item, index)  {
			
		this.baseCall('onControlAdded', arguments);
		
		var direction = item.anthor;
		
		if (direction) {
			this._initItem(item, direction.charAt(0), true);
			this._initItem(item, direction.charAt(1), false);
		}
		
	},
	
	_initItem: function(item, dir, x){
		var basePosition = ({
			t: 'top',
			l: 'left',
			r: 'right',
			b: 'bottom'
		})[dir];
		if(basePosition){
			item.setStyle(basePosition, 0);
		} else if(x) {
			item.setStyle('left', '50%').setStyle('marginLeft', -item.getSize().x / 2);
		} else {
			item.setStyle('top', '50%').setStyle('marginTop', -item.getSize().y / 2);
		}
	}
	
}));



