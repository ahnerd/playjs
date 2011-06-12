


Py.using("System.Core.Date")  ;


(function(){
	
	
	Number.implementIf({
		limit: function(min, max){
			return Math.min(Math.max(min, this), max);
		}
	});
	
	function getDateIn(date, fullYear, month){
		return date.getFullYear() == fullYear && date.getMonth() == month ? date.getDate() : 0 	
	}
	
	// 显示天。
	var DecadeScreen = {
		
		render: function(calender, container) {
		
			
			// 初始化容器 -> days 。
			calender._renderContainerOfMonthsAndYears(container);
			
			// 目前的月。
			var date = calender.currentDate,
			
				// 目前的月。
				year = date.getFullYear();
				
			year = parseInt(year / 100) * 100;
			
			// 设置顶部标题。
			calender.header.setText(year + '-' + (year + 99));
			
			year--;
			
			Object.each(container.getElementsByTagName('a'), function(a, i){
				
				a.className = i === 0 || i === 11 ? 'x-monthcalender-decade x-disabled' : 'x-monthcalender-decade';
				
				a.tag = year + 5;
				
				a.innerHTML = year + '-<br>' + (year + 9) + '&nbsp;';
				
				year += 10;
			});
		},
		
		top: function(calender){
			YearScreen.top(calender);
		},
		
		switchTo: function(screen, calender){
			
			// 显示月。
			screen.render(calender, calender.contentProxy);
			
			// 设置当前视图。
			calender.currentScreen = screen;
			
			// 特效显示。
			calender._switchContentFromFade();
		},
		
		select: function(calender, node){
			
			calender.currentDate.setYear(node.tag);
			DecadeScreen.switchTo(YearScreen, calender);

		},
		
		next: function(calender){
			
			// 重新计算月。
			calender.currentDate.addYear(100);
		},
		
		previous: function(calender){
			
			// 重新计算月。
			calender.currentDate.addYear(-100);
			
		}
	},
	
	YearScreen = {
		
		render: function(calender, container) {
		
			
			// 初始化容器 -> days 。
			calender._renderContainerOfMonthsAndYears(container);
			
			// 目前的月。
			var date = calender.currentDate,
			
				// 目前的月。
				year = date.getFullYear();
				
			year = parseInt(year / 10) * 10;
			
			// 设置顶部标题。
			calender.header.setText(year + '-' + (year + 9));
			
			year--;
			
			Object.each(container.getElementsByTagName('a'), function(a, i){
				
				a.className = i === 0 || i === 11 ? 'x-disabled' : '';
				
				a.innerHTML = a.tag = year++;
			});
		},
		
		select: function(calender, node){
			
			calender.currentDate.setYear(node.tag);
				
			DecadeScreen.switchTo(MonthScreen, calender);

		},
		
		parent: DecadeScreen,
		
		next: function(calender){
			
			// 重新计算月。
			calender.currentDate.addYear(10);

			
		},
		
		previous: function(calender){
			
			// 重新计算月。
			calender.currentDate.addYear(-10);

		}
		
	},
	
	MonthScreen = {
		
		render: function(calender, container) {
			
			
			// 初始化容器 -> days 。
			calender._renderContainerOfMonthsAndYears(container);
			
			// 目前的月。
			var date = calender.currentDate,
			
				// 目前的月。
				month = date.getMonth(),
		
				// 显示所有月 。
				months = Py.MonthCalender.months;
			
			Object.each(container.getElementsByTagName('a'), function(a, i){
				
				a.tag = i;
				
				a.className = i === month ? 'x-selected' : '';
				
				
				a.innerHTML = months[i];
			});
			
			// 设置顶部标题。
			calender.header.setText(date.getFullYear());
		},
		
		parent: YearScreen,
		
		select: function(calender, node){
			
			calender.currentDate.setMonth(node.tag);
				
			DecadeScreen.switchTo(DayScreen, calender);
			
		},
		
		next: function(calender){
			
			// 重新计算月。
			calender.currentDate.addYear(1);

		},
		
		previous: function(calender){
			
			// 重新计算月。
			calender.currentDate.addYear(-1);

		}
		
	},
	
	DayScreen = {
		
		render: function(calender, container){
			
			// 初始化容器 -> days 。
			calender._renderContainerOfDays(container);
			
			// 目前的时间。
			var date = calender.currentDate,
			
				// 每项的样式，对于非当前月显示时需要 disabled。
				cls = 'x-disabled',
			
				// 获取当前年 。
				fullYear = date.getFullYear(),
				
				// 获取当前月。
				month = date.getMonth(),
				
				// 对选择的项 添加 selected
				// 下面对日期判断, 如果 = v 或 cd 则表示特殊日。
				// 由于只对某月有关，因此，如果不是当前的页，直接等于 0 。
				v = getDateIn(calender.value, fullYear, month),
				cd = getDateIn(calender.today, fullYear, month);
			
			// 设置顶部标题。
			calender.header.setText(date.toString(Py.MonthCalender.current));
			
			// 先获得月初。
			date = new Date(fullYear, month, 1);
			
			// 调整为星期天。 节约变量。
			month = date.getDay();
			date.addDay(month === 0 ? -7 : -month);
			
			// 对每个 a 绑定，共 6 * 7  。
			Object.each(container.getElementsByTagName('a'), function(a){
				
				// 获取当前日期。
				var day = date.getDate();
				
				// 显示。
				a.innerHTML = day;
				
				// 如果是第一天，切换 是否当前月 。
				if(day == 1){
					cls = cls ? '' : 'x-disabled';
				}
				
				// 设置属性。
				a.className = cls;
				
				// 如果是本日。
				if(cd == day && !cls)
					a.className += ' x-active';
				
				// 如果是选择的。
				if(v == day && !cls)
					a.className += ' x-selected';
				
				// 计算下一天。
				date.setDate(day + 1);
				
			});
			
		},
		
		parent: MonthScreen,
		
		select: function(calender, node){
			
			var newValue = calender.currentDate.clone(), date = parseInt(node.innerHTML);
			
			// 如果是disbaled， 则是上个月或下个月
			if (node.className == 'x-disabled') {
				newValue.addMonth(date < 15 ? 1 : -1);
				newValue.setDate(date);
				calender.value = newValue;
				if(date < 15){
					calender.onNext();
				} else {
					calender.onPrevious();
				}
			} else {
				newValue.setDate(date);
				calender.onSelect(newValue);
			}
		},
		
		next: function(calender){
			
			// 重新计算月。
			calender.currentDate.addMonth(1);

		},
		
		previous: function(calender){
			
			// 重新计算月。
			calender.currentDate.addMonth(-1);

		}
		
	};
	
	Py.namespace(".MonthCalender", Py.Control.extend({
	
		tpl: '<div class="x-monthcalender">\
		        <div class="x-monthcalender-header">\
		            <a href="javascript://更改时间" class="x-monthcalender-title">\
		          		\
		            </a>\
		            <a class="x-monthcalender-previous" href="javascript://上一个">\
		                «\
		            </a>\
		            <a class="x-monthcalender-next" href="javascript://下一个">\
		                »\
		            </a>\
		        </div>\
		        <div class="x-monthcalender-container">\
		            <div class="x-monthcalender-slider">\
		                <div style="left:1px; top:1px;"></div>\
						<div style="left:172px; top:1px;"></div>\
					</div>\
		        </div>\
		    	<div class="x-monthcalender-footer">\
		    		<a href="javascript://今天">今天: 2010年10月20日</a>\
		    	</div>\
			</div>',
			
		currentScreen: DayScreen,
	
		options: {
			renderTo: true,
			
			pickerClass: 'datepicker',
			inject: null,
			animationDuration: 400,
			useFadeInOut: true,
			positionOffset: {x: 0, y: 0},
			pickerPosition: 'bottom',
			draggable: true,
			showOnInit: true,
			today: new Date(),
			value: new Date()		
		},
		
		_renderContainer: function(container, className, width, height){
			
			if(container.className == className)
				return false;
			
			container.empty();
			container.className = className;
			for(var i = 0, j, c, a; i < width; i++){
				container.appendChild(c = document.createElement('div'));
				for(j = 0; j < height; j++) {
					a = document.createElement('a');
					a.href = 'javascript:;';
					c.appendChild(a);
				}
			}
			
			return true;
		},
		
		// 创建容纳 days 的节点。
		_renderContainerOfDays: function(container){
			
			if (this._renderContainer(container, 'x-monthcalender-days', 6, 7)) {
			
				var weeks = container.insert(document.createDiv('x-monthcalender-week'), 'afterBegin');
				
				Object.each(Py.MonthCalender.weeks, function(name, week) {
					weeks.appendChild(document.create('span', 'x-monthcalender-' + week)).innerHTML = name;
				});
				
			}
		},
		
		_renderContainerOfMonthsAndYears: function(container){
			this._renderContainer(container, 'x-monthcalender-monthyears', 3, 4);
		},
		
		onPrevious: function(){
			
			var me = this,
				scr = this.currentScreen;
			
			scr.previous(this);
			
			// 渲染到代理。
			scr.render(me, me.contentProxy);
			
			// 特效显示。
			me._switchContentFromLeft();
		},
		
		onNext: function(){
			
			var me = this,
				scr = this.currentScreen;
			
			scr.next(this);
			
			// 渲染到代理。
			scr.render(me, me.contentProxy);
			
			// 特效显示。
			me._switchContentFromRight();
		},
		
		onTop: function(){
			
			var me = this,
				p = me.currentScreen.parent;
			
			// 显示月。
			p.render(me, me.contentProxy);
			
			// 设置当前视图。
			me.currentScreen = p;
			
			// 特效显示。
			me._switchContentFromFade();
			
		},
		
		onContentClick: function(e){
			e = e || window.event;
			var target = e.target || e.srcElement;
			if (target.tagName === 'A') {
				this.currentScreen.select(this, target);
			}
		},
		
		onSelect: function(value){
			if (this.trigger('select', value)) {
				
				if (this.value - value !== 0) {
					this.value = value;
					
					// 触发内容改变。
					this.onChange();
					
					// 更新页面。
					this.currentScreen.render(this, this.content);
					
					//trace(value.toString("yyyy-MM-dd"))
					
				}
				
			}
		},
		
		width: 172,
		
		duration: -1,
		
		_switchContent: function(oldLeft, sliderLeft, newLeft, tweenLeft){
			var oldContent = this.content,
				newContent = this.contentProxy,
				slider = newContent.parentNode;
			
			oldContent.style.left = oldLeft + 'px';
			slider.style.left = sliderLeft + 'px';
			newContent.style.left = newLeft + 'px';
			slider.animate({left: tweenLeft}, this.duration, null, 'replace');
			
			this.content = newContent;
			this.contentProxy = oldContent;
		},
		
		_switchContentFromRight: function(){
			return this._switchContent(1, 1, this.width, -this.width);
		},
		
		_switchContentFromLeft: function(){
			return this._switchContent(this.width, -this.width, 1, 1);
		},
		
		_switchContentFromFade: function(){
			var me = this,
				oldContent = me.content,
				newContent = me.contentProxy,
				slider = newContent.parentNode,
				duration = me.duration / 2,
				newStyle = newContent.style,
				oldStyle = oldContent.style;
			
			newContent.setOpacity(0);
			slider.style.left = oldContent.style.left = newStyle.left = '1px';
			newStyle.zIndex = 2;
			oldStyle.zIndex = 1;
			newContent.animate({opacity: 1}, duration, null, 'restart');
			oldContent.animate({opacity: 0}, duration, function(){
				newStyle.left = '1px';
				oldStyle.left =  me.width + 'px';
				oldContent.setOpacity(1);
			}, 'restart');
			
			me.content = newContent;
			me.contentProxy = oldContent;
		},
		
		init: function(){
			var me = this.setUnselectable();
			me.header = me.find('.x-monthcalender-title');
			me.header.onclick = function(){
				me.onTop();
			};
			
			me.find('.x-monthcalender-previous').onclick = function(){
				me.onPrevious();
			};
			
			me.find('.x-monthcalender-next').onclick = function(){
				me.onNext();
			};
			
			var slider = this.find('.x-monthcalender-slider');
			me.content = slider.get(0);
			me.contentProxy = slider.get(1);
			me.content.onclick = me.contentProxy.onclick = function(e){
				me.onContentClick(e);
			};
			
			me.find('.x-monthcalender-footer a').onclick = function(){
				me.onSelect(me.today);
			}
	
		/*
		// Build the body of the picker
			var body = this.body = new Element('div.body').inject(picker);
	
			// oldContents and newContents are used to slide from the old content to a new one.
			var slider = this.slider = new Element('div.slider', {
				styles: {
					position: 'absolute',
					top: 0,
					left: 0
				}
			}).set('tween', {
				duration: options.animationDuration,
				transition: Fx.Transitions.Quad.easeInOut
			}).inject(body);
	
			this.oldContents = new Element('div', {
				styles: {
					position: 'absolute',
					top: 0
				}
			}).inject(slider);
	
			this.newContents = new Element('div', {
				styles: {
					position: 'absolute',
					top: 0,
					left: 0
				}
			}).inject(slider);
	
			// IFrameShim for select fields in IE
			var shim = this.shim = window['IframeShim'] ? new IframeShim(picker) : null;
	
			// Dragging
			if (options.draggable && typeOf(picker.makeDraggable) == 'function'){
				this.dragger = picker.makeDraggable(shim ? {
					onDrag: shim.position.bind(shim)
				} : null);
				picker.setStyle('cursor', 'move');
			}
	
			this.addEvent('open', function(){
				picker.setStyle('display', 'block');
				if (shim) shim.show();
			}, true);
	
			this.addEvent('hide', function(){
				picker.setStyle('display', 'none');
				if (shim) shim.hide();
			}, true);
	*/
	
		},
		
		
		setToday: function(value){
			this.find('.x-monthcalender-footer a').innerHTML = "今天: " + value.toString(Py.MonthCalender.today);
			this.today = value;
		},
		
		onChange: function(){
			return this.trigger('change');
		},
		
		// 切换当前显示的界面。
		switchView: function(name){
			var scr;
			switch(name){
				case 'day':
					scr = DayScreen;
					break;
				case 'month':
					scr = MonthScreen;
					break;
			}
			
			this.currentScreen = scr;
			scr.render(this, this.content);
		},
		
		setValue: function(value){ 
		
			var changed = this.value - value !== 0;
			
			// 设置值。
			this.value = value;
			
			// 设置目前显示的时间。
			this.currentDate = new Date(value.getFullYear(), value.getMonth());
			
			this.switchView('day');
			
			if(changed)
				// 触发内容改变。
				this.onChange();
			return this;
		},
	
		getValue: function(fn){
			return this.value;
		}
	
	}));
	
	DecadeScreen.parent = DecadeScreen;
	
	Py.MonthCalender.weeks = {
		sunday: '日',
		monday: '一',
		tuesday: '二',
		wednesday: '三',
		thursday: '四',
		friday: '五',
		saturday: '六'
		
	};
	
	Py.MonthCalender.current = "yyyy年M月";
	
	Py.MonthCalender.today = "yyyy年M月d日";
					
	Py.MonthCalender.months = "一月 二月 三月 四月 五月 六月 七月 八月 九月 十月 十一月 十二月".split(' ');
	
	
})();