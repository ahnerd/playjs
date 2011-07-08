//===========================================
//  锁定元素   pin.js    C
//===========================================


Py.Element.implement({

	/**
	 * 设置元素是否固定。
	 */
	setPin: (function() {

		var supportsPositionFixed = false,
		supportTested = false;

		var testPositionFixed = function() {
			var test = new Element('div').setStyles({
				position: 'fixed',
				top: 0,
				right: 0
			}).inject(document.body);
			supportsPositionFixed = (test.offsetTop === 0);
			test.dispose();
			supportTested = true;
		};

		return function(value, hideWhenScroll) {
			if (!supportTested)
				testPositionFixed();
			if (this.getStyle('display') == 'none')
				return this;

			var pinnedPosition,
			scroll = window.getScroll(),
			parent,
			scrollFixer;

			if (enable !== false) {
				pinnedPosition = this.getPosition(supportsPositionFixed ? document.body : this.getOffsetParent());
				if (!this.retrieve('pin:_pinned')) {
					var currentPosition = {
						top: pinnedPosition.y - scroll.y,
						left: pinnedPosition.x - scroll.x
					};

					if (supportsPositionFixed && !forceScroll) {
						this.setStyle('position', 'fixed').setStyles(currentPosition);
					} else {

						parent = this.getOffsetParent();
						var position = this.getPosition(parent),
						styles = this.getStyles('left', 'top');

						if (parent && styles.left == 'auto' || styles.top == 'auto')
							this.setPosition(position);
						if (this.getStyle('position') == 'static')
							this.setStyle('position', 'absolute');

						position = {
							x: styles.left.toInt() - scroll.x,
							y: styles.top.toInt() - scroll.y
						};

						scrollFixer = function() {
							if (!this.retrieve('pin:_pinned'))
								return;
							var scroll = window.getScroll();
							this.setStyles({
								left: position.x + scroll.x,
								top: position.y + scroll.y
							});
						}.bind(this);

						this.store('pin:_scrollFixer', scrollFixer);
						window.addEvent('scroll', scrollFixer);
					}
					this.store('pin:_pinned', true);
				}

			} else {
				if (!this.retrieve('pin:_pinned'))
					return this;

				parent = this.getParent();
				var offsetParent = (parent.getComputedStyle('position') != 'static' ? parent : parent.getOffsetParent());

				pinnedPosition = this.getPosition(offsetParent);

				this.store('pin:_pinned', false);
				scrollFixer = this.retrieve('pin:_scrollFixer');
				if (!scrollFixer) {
					this.setStyles({
						position: 'absolute',
						top: pinnedPosition.y + scroll.y,
						left: pinnedPosition.x + scroll.x
					});
				} else {
					this.store('pin:_scrollFixer', null);
					window.removeEvent('scroll', scrollFixer);
				}
				this.removeClass('isPinned');
			}
			return this;
		}

	} )()

});