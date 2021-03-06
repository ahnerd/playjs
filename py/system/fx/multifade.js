//===========================================
//  多个元素的效果   multifade.js      A
//===========================================







using("System.Fx.Animate");

Py.ElementList.implement({
	
	multiFade: function( opacity, onFade, onShow ) {
		opacity = opacity === undefined ? 0.3 : opacity;
		
		var me = this;
		
		this.on('mouseenter', function(e){
			me.each( function( elem ) {
		    	if( elem != e.target ){
					elem.animate('opacity', opacity, -1, onFade, null, 'restart' );
				}
		    });
		});
		  
		this.on('mouseleave', function(e) {
		    me.each( function( elem ){
		      if( elem != e.target )
					elem.animate('opacity', 1, -1, onShow, null, 'restart');
		    });
		});
		
	}

})

