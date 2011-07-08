//===========================================
//  多个元素的效果   multifade.js      A
//===========================================







Py.using("System.Fx.Animate");

Py.ElementList.implement({
	
	multiFade: function( opacity ) {
		opacity = opacity === undefined ? 0.3 : opacity;
		
		var me = this;
		
		this.on('mouseenter', function(e){
			me.each( function( elem ) {
		    	if( elem != e.target ){
					elem.animate('opacity', opacity, -1, null, 'restart' );
				}
		    });
		});
		  
		this.on('mouseleave', function(e) {
		    me.each( function( elem ){
		      if( elem != e.target )
					elem.animate('opacity', 1, -1, null, 'restart');
		    });
		});
		
	}

})

