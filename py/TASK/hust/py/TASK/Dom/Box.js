//===========================================
//  元素盒   Box.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================



using("System.Dom.Base", window.Element && Element.implement);


/// <summary>
/// 盒子
/// </summary>
/// <class name="Box" />
var Box = Py.Box = new Py.Class({
		
		owner: null,
		
  // set to true if needed, warning: firefox performance problems
  // NOT neeeded for page scrolling, only if draggable contained in
  // scrollable elements
  includeScrollOffsets: false,

  // must be called before calling withinIncludingScrolloffset, every time the
  // page is scrolled用于计算滚动条的位置信息
  constructor: function(el) {
  	this.owner = el;
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },
//计算节点的绝对滚动位置返回包含两个元素的数组到文档左侧 顶部的距离
  realOffset: function() {
    var valueT = 0, valueL = 0, el = this.owner;
    do {
      valueT += this.owner.scrollTop  || 0;
      valueL += this.owner.scrollLeft || 0;
      el = el.parentNode;
    } while (el);
    return [valueL, valueT];
  },
//计算结点相对于文档的绝对滚动位置，返回包含两个元素的数组到文档左侧 顶部的距离
  cumulativeOffset: function() {
    var valueT = 0, valueL = 0, el = this.owner;
    do {
      valueT += this.owner.offsetTop  || 0;
      valueL += this.owner.offsetLeft || 0;
      el = el.offsetParent;
    } while (el);
    return [valueL, valueT];
  },
//相对位置
  positionedOffset: function() {
    var valueT = 0, valueL = 0, el = this.owner;
    do {
      valueT += el.offsetTop  || 0;
      valueL += el.offsetLeft || 0;
      el = el.offsetParent;
      if (el) {
        p = el.css('position');
        if (p == 'relative' || p == 'absolute') break;
      }
    } while (el);
    return [valueL, valueT];
  },

  offsetParent: function() {
  	var el = this.owner;
    if (el.offsetParent) return el.offsetParent;
    while ((el = el.parentNode) && el != document.body)
      if (el.css('position') != 'static')
        return el;

    return document.body;
  },

  // caches x/y coordinate pair to use with overlap是否在this.owner内
  within: function(el, x, y) {
    if (this.includeScrollOffsets)
      return this.withinIncludingScrolloffsets(el, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = this.cumulativeOffset(el);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + this.owner.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + this.owner.offsetWidth);
  },

  withinIncludingScrolloffsets: function(el, x, y) {
    var offsetcache = this.realOffset();

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = this.cumulativeOffset();

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + this.owner.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + this.owner.offsetWidth);
  },

  // within must be called directly before
  overlap: function(mode, el) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + this.owner.offsetHeight) - this.ycomp) /
        this.owner.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + this.owner.offsetWidth) - this.xcomp) /
        this.owner.offsetWidth;
  },
//克隆结点 常用于拖放
  clone: function(source, target) {
    source = $(source);
    target = $(target);
    target.style.position = 'absolute';
    var offsets = this.cumulativeOffset(source);
    target.style.top    = offsets[1] + 'px';
    target.style.left   = offsets[0] + 'px';
    target.style.width  = source.offsetWidth + 'px';
    target.style.height = source.offsetHeight + 'px';
  },

  page: function(forel) {
    var valueT = 0, valueL = 0;

    var el = forthis.owner;
    do {
      valueT += this.owner.offsetTop  || 0;
      valueL += this.owner.offsetLeft || 0;

      // Safari fix
      if (this.owner.offsetParent==document.body)
        if (this.owner.getStyle(this.owner,'position')=='absolute') break;

    } while (this.owner = this.owner.offsetParent);

    this.owner = forthis.owner;
    do {
      valueT -= this.owner.scrollTop  || 0;
      valueL -= this.owner.scrollLeft || 0;
    } while (this.owner = this.owner.parentNode);

    return [valueL, valueT];
  },

  clone: function(source, target) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || {})

    // find page position of source
    source = $(source);
    var p = Position.page(source);

    // find coordinate system to use
    target = $(target);
    var delta = [0, 0];
    var parent = null;
    // delta [0,0] will do fine with position: fixed this.owners,
    // position:absolute needs offsetParent deltas
    if (this.owner.getStyle(target,'position') == 'absolute') {
      parent = Position.offsetParent(target);
      delta = Position.page(parent);
    }

    // correct by body offsets (fixes Safari)
    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    // set position
    if(options.setLeft)   target.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if(options.setTop)    target.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if(options.setWidth)  target.style.width = source.offsetWidth + 'px';
    if(options.setHeight) target.style.height = source.offsetHeight + 'px';
  },
//绝对定位
  absolutize: function() {
    this.owner = $(this.owner);
    if (this.owner.style.position == 'absolute') return;
    Position.prepare();

    var offsets = Position.positionedOffset(this.owner);
    var top     = offsets[1];
    var left    = offsets[0];
    var width   = this.owner.clientWidth;
    var height  = this.owner.clientHeight;

    this.owner._originalLeft   = left - parseFloat(this.owner.style.left  || 0);
    this.owner._originalTop    = top  - parseFloat(this.owner.style.top || 0);
    this.owner._originalWidth  = this.owner.style.width;
    this.owner._originalHeight = this.owner.style.height;

    this.owner.style.position = 'absolute';
    this.owner.style.top    = top + 'px';;
    this.owner.style.left   = left + 'px';;
    this.owner.style.width  = width + 'px';;
    this.owner.style.height = height + 'px';;
  },
  
  xType: "box",
  
//相对定位
  relativize: function() {
    this.owner = $(this.owner);
    if (this.owner.style.position == 'relative') return;
    Position.prepare();

    this.owner.style.position = 'relative';
    var top  = parseFloat(this.owner.style.top  || 0) - (this.owner._originalTop || 0);
    var left = parseFloat(this.owner.style.left || 0) - (this.owner._originalLeft || 0);

    this.owner.style.top    = top + 'px';
    this.owner.style.left   = left + 'px';
    this.owner.style.height = this.owner._originalHeight;
    this.owner.style.width  = this.owner._originalWidth;
  }

});

	
	
	

// Safari returns margins on body which is incorrect if the child is absolutely
// positioned.  For performance reasons, redefine Position.cumulativeOffset for
// KHTML/WebKit only.
if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
	Py.Box.prototype.cumulativeOffset = function(){
		var valueT = 0, valueL = 0;
		do {
			valueT += element.offsetTop || 0;
			valueL += element.offsetLeft || 0;
			if (element.offsetParent == document.body) 
				if (Element.getStyle(element, 'position') == 'absolute') 
					break;
			
			element = element.offsetParent;
		}
		while (element);
		
		return [valueL, valueT];
	}
	
	
	
}