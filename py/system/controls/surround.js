//===========================================
//  实现元素围绕显示                          surround.js          A
//===========================================




Py.using("System.Controls.Control");



Object.extend(Py.Element, {
	
	allDirection: 'lt t rt l r lb b rb'.split(' '),
	
	installSurround: function(target, className, direction, oncreate){
		
		var dom = target.dom || target;
		
		
		// 全部方向。
		direction.forEach(function(direct){
			oncreate(dom.appendChild(document.create('div', className + '-' + direct)), direct);
		});
		
		// 目标添加 x-shadow 。
		target.addClass(className);
		
		
		// 允许移动。
		this.setMovable(dom);
		
	},
	
	toggleSurround: function(target, className, directions, oncreate){
		if(typeof directions === 'string')
			directions = directions.length === 1 ? [directions] : [directions, directions.charAt(0), directions.charAt(1)];
		var show = directions !== false;
		if (target.hasClass(className)) {
			target.get('child', function(n){return (n.className || "").indexOf(className + '-') != -1;})[show ? 'show' : 'hide'](0);
		} else if(show){
			this.installSurround(target, className, directions || this.allDirection, oncreate || Function.empty);
		}
		
		return target;
	}

});


