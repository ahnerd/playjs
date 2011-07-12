//===========================================
//  描点布局       anchorlayout.js         A
//===========================================

Py.using("System.Controls.Layout.AdvanceLayout");
Py.imports("Resources.*.Layout.AdvanceLayout");



/**
 * 实现动态大小的布局。
 */
Py.Layout.register(Py.Layout.AnchorLayout = Py.Layout.AdvanceLayout.extend({
	
	/**
	 * xType
	 * @type String
	 * @property xType
	 */
	xType: 'anchor',
	
	layoutItemX: function(container, item){
		var getSize = Py.Element.getSizes;
		item.setSize({
			x: container.getWidth() + getSize(container.dom || container, 'x', 'p') - getSize(item.dom || item, 'x', 'd')
		});
	},
	
	layoutItemY: function(container, item){
		var getSize = Py.Element.getSizes;
		item.setSize({
			y: container.getHeight() + getSize(container.dom || container, 'y', 'p') - getSize(item.getDom(), 'y', 'd')
		});
	},
	
	layoutX: function(container){
		container.controls.forEach(function(ctrl){
			if(ctrl.autoWidth)
				this.layoutItemX(container, ctrl);
		}, this);
	},
	
	layoutY: function(container){
		container.controls.forEach(function(ctrl){
			if(ctrl.autoHeight)
				this.layoutItemY(container, ctrl);
		}, this);
	},
	
	/**
	 * 处理新加的节点。
	 * @method onAdd
	 * @param {Control} item 项。
	 * @param {Control} container 容器的控件。
	 */
	onControlAdded: function(container, item, index){
		this.baseCall('onControlAdded', arguments);
		var anchor = item.anchor;
		
		if (typeof anchor == 'string') {
			
			// 容器区域。
			var ctReg = container.getBound(),
			
				// 内容区域。
				itemeg = item.getBound(),
				
				// 内容节点。
				dom = item.dom || item,
				
				// 内容偏移。
				p = item.getOffset(),
				
				// 测试同时存在 left+right 或 top+bottom  。
				flag = false;
			
			// 检查 right
			if (anchor.indexOf('right') >= 0) {
				
				// 直接使用  getStyle 会得到 auto 。
				// 如果存在 anchor-right ， right 必须存在。
				if (isNaN(parseFloat(dom.style.right)))
					item.setStyle('right', ctReg.right - itemeg.right - Py.Element.styleNumber(dom, 'marginRight') - Py.Element.styleNumber(container.dom || container, 'borderRightWidth'));
				
				flag = true;
			}
			
			// 检查 left
			if (anchor.indexOf('left') >= 0) {
				item.setStyle('left', p.x);
				
				if (flag) {
					item.autoWidth = true;
					//this.layoutItemX(container, item);
				}
			}
			
			// 重新记号。
			flag = false;
			
			// 检查 bottom
			if (anchor.indexOf('bottom') >= 0) {
				if (isNaN(parseFloat(dom.style.bottom)))
					item.setStyle('bottom', ctReg.bottom - itemeg.bottom - Py.Element.styleNumber(dom, 'marginBottom') - Py.Element.styleNumber(container.dom || container, 'borderBottomWidth'));
				flag = true;
			}
			
			// 检查 top
			if (anchor.indexOf('top') >= 0) {
				item.setStyle('top', p.y);
				
				if (flag) {
					item.autoHeight = true;
					//this.layoutItemY(container, item);
				}
			}
			
			
		}
			
	}
	
}));


/*

if(navigator.isQuirks && navigator.isIE6){
	(function(){
		
		var e = Py.Element,
			styleNumber  = e.styleNumber,
			widthPadding = e.widthPadding,
			heightPadding = e.heightPadding,
			widthMargin = e.widthMargin,
			heightMargin = e.heightMargin;
		
		Py.Layout.AnchorLayout.prototype.layoutCore = function(container){
			container.controls.forEach(layoutControl);
		};
		
		function layoutControl(ctrl){
			
			var item = ctrl.dom || ctrl,
				container = item.parentNode;
				
			if(isSet(item, 'left')){
				
				// IE6中额外计算了padding值，在此删除。
				//item.runtimeStyle.left = item.style.pixelLeft  - styleNumber(container, 'paddingLeft');
				
				
				// 如果定义 left, right， 计算 width 。
				if(isSet(item, 'right') && !isSet(item, 'width'))
					item.runtimeStyle.width = Math.max(container.offsetWidth - widthPadding(item) - widthMargin(item) - item.style.pixelLeft - item.style.pixelRight, 0);
			} else if(isSet(item, 'right')) {
				
				// IE6无法自动处理 right， 改为 left。
				//item.runtimeStyle.left = container.offsetWidth - item.offsetWidth - widthPadding(item.parentNode) - widthMargin(item) - item.style.pixelRight;
				//item.runtimeStyle.right = 'auto';
			}
			
			if(isSet(item, 'top')){
				if(isSet(item, 'bottom') && !isSet(item, 'height'))
					item.runtimeStyle.height = Math.max(container.offsetHeight - heightPadding(item) - heightMargin(item) - item.style.pixelTop - item.style.pixelBottom, 0);
			} else if(isSet(item, 'bottom')) {
				//  item.runtimeStyle.top = container.offsetHeight - item.offsetHeight - heightPadding(item.parentNode) - heightMargin(item) - item.style.pixelBottom;
				//  item.runtimeStyle.bottom = 'auto';
			}
		}
			
		function isSet(elem, name){
			return elem.style[name] && elem.style[name] != 'auto'
		}

	})();
	
}
*/