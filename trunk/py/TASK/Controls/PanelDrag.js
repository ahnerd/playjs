
/**
 * 获取 Panel 的代理。
 */
Panel.getProxy = function(){
	var p = document.getElementById('py_panelProxy');
	if(!p){
		p = new Panel().setAttr('id', 'py_panelProxy').hide().renderTo().dom;
	}
					
	return p;
};

Panel.dragOptions = {
	
	start: function(target, e){
		
		var p = Py.Controls.Panel.getProxy(), hp = p.select('.x-header-content'),  pf = target.body || target.dom, hpf = pf.select('.x-header-content');
		hp.innerHTML = pf.innerHTML;
		p.get('first', 2).style.cssText = pf.get('first', 2).style.cssText;
		p.className = pf.className + ' x-proxy';
		p.style.cssText = pf.style.cssText ;
		pf.style.left = pf.style.top = '-99999px';
		
		return p;
	},
	
	stop: function(target, e){
		
		var elem = e.target.target   ;
		target.dom.style.cssText = elem.style.cssText;
		//    elem.hide();
	}
	
}
