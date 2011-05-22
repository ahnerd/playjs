
	        /**
	         * 改变大小。
			 * @method setSize
	         * @param {Number} x 坐标。
	         * @param {Number} y 坐标。
	         * @return {Element} this
	         */
	        setSize: function(x, y) {
				this.dom.setSize(x, y);
				this.trigger('resize');
					 
				return this;
	        },
	
			setLeftTop: function(p){
				this.dom.setLeftTop(p);
				this.trigger('move', p);
				return this;
			},
			
			setPosition: function(x, y){
				this.dom.setPosition(x, y);
				this.trigger('move', getXY(x, y));
				return this;
			},
			
			
			

			
			
			
			
			
			
			.addEvents({
			
			'move': {
				delegate: function(e){
					return this.trigger('move', e.target.to);
				},
				
				add: function(elem, type, fn){
					elem.on('dragend', this.delegate);
				},
				remove: function(elem, type, fn){
					elem.un('dragend', this.delegate);
				}
			}
			
		}