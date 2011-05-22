



//  支持指定元素统一。



Py.using("System.Fx.Element");

Py.ElementList.implement({
	
	multiFade: function( opacity ) {
		opacity = {
			opacity: opacity === undefined ? 0.3 : opacity
		};
		
		var me = this;
		
		this.on('mouseenter', function(e){
			me.each( function( elem ) {
		    	if( elem != e.target ){
					elem.tween(opacity );
				}
		    });
		});
		  
		this.on('mouseleave', function(e) {
		    me.each( function( elem ){
		      if( elem != e.target )
					elem.tween( {
						opacity: 1
					});
		    });
		});
		
	}

})

