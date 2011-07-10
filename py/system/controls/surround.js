




Py.using("System.Controls.Control");



Py.Surround = {
	
	allDirection: 'lt t rt l r lb b rb'.split(' '),
	
	install: function(target, className, direction, oncreate){
		
		direction = direction || this.allDirection;
		oncreate = oncreate || Function.empty;
		
		
		
		// 全部方向。
		direction.forEach(function(direct){
			oncreate(target.getDom().appendChild(document.create('div', className + '-' + direct)), direct);
		});
		
		// 目标添加 x-shadow 。
		target.addClass(className);
		
		
		// 允许移动。
		Py.Element.setMovable(target.dom || target);
		
	},
	
	toggle: function(target, className, value, oncreate){
		var show = value !== false;
		if (target.hasClass(className)) {
			target.get('child', function(n){return (n.className || "").indexOf(className + '-') != -1;})[show ? 'show' : 'hide'](0);
		} else if(show){
			this.install(target, className, value, oncreate);
		}
		
		return target;
	}

}