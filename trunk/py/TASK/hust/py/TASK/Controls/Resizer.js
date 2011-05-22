//===========================================
//  拖动   Dom.Dragable.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================




namespace("System.Controls", "Resizer", function(p, c){
    
    using("System.Dom.Dragable");
    using("System.Controls.Control");
    
    var d = p.Dom.Dragable,
        dests = "t l r b lt rt lb rb".split(' '),
        Dom = Py.Dom;
    
    function bindEvent(dom,  move, onbeforedrag ){
        d.play(drag, move, onbeforedrag, ondrag, onafterdrag, box);
    }
    
    function getResizer(id){
        switch(id){
            case 1:
                return function(to, from){
                    //trace.log(this._from.y, "-"  ,   to.y, "->",   d);
                    window.u(to.x, to.y);
                    this.__dom.style.top = this.__dom.offsetTop - from.y + to.y  + "px";
                    //this.__dom.h((d > 0 ? '+' : '-') + d);
                    this.__dom.style.height = this.from.h + this._from.y - to.y + "px";
                };
            case 2:
                return function(to, from){
                    this.__dom.style.left = this.__dom.offsetLeft - from.x + to.x  + "px";
                    this.__dom.style.width = this.from.w + this._from.x - to.x + "px";
                };
            case 3:
                return function(to, from){
                    this.__dom.style.width = this.from.w - this._from.x + to.x + "px";
                };
            case 4:
                return function(to, from){
                    this.__dom.style.height = this.from.h - this._from.y + to.y + "px";
                }; 
            case 5:
                return Function.concat(getResizer(1), getResizer(2));
            case 6:
                return Function.concat(getResizer(1), getResizer(3));
            case 7:
                return Function.concat(getResizer(2), getResizer(4));
            case 8:
                return Function.concat(getResizer(3), getResizer(4));    
                     
        }
    }
    
    
    window.Resizer = Py.Controls.Control.extend({
            
            _from: null,
            
            _bindEvent: function(id, resize){
                var me = this,
                    dom = me.dom.childNodes[id],
                	det = dests[id - 1] ;
                d.play(dom, null, function() {
                    me.beforeresize(det, this.from);
                }, resize.bind(this), this.afterresize.bind(this, det), this.assert());
            },
            
        	assert: function(min, max){
                if(min == undefined){
                    return this._assert;
                }
                this._assert = {
                    min: {
                       x: min && min.x || 0,
                       y: min && min.y || 0
                   },
                   max: {
                       x: max && max.x || Infinity,
                       y: max && max.y || Infinity
                   }
               };
               
               var min = this._assert.min, max =  this._assert.max;
               
               this.drag(function(to, from){
                    to.x = Math.max(to.x, min.x);
                    to.y = Math.max(to.y, min.y);
                    to.x = Math.min(to.x, max.x);
                    to.y = Math.min(to.y, max.y);
                });
                
                return this._assert;
        	},
            
            $beforeresize: function(id){
                return this.resizeable !== false;
            },
            
            beforeresize: function(id, from){
                trace("开始处理拖动" + id);
                //if(this.__dom) this.__dom.remove();
                var me = this.dom;
                var dom = this.__dom = Control.createTmp( me );
                dom.className = 'g-resizer-proxy';
                this.from = Dom.box(me.childNodes[0]);
                this.from.x--;
                this.from.y--;
                ++this.from.h;
                ++this.from.w;
                dom.box(this.from);
                this._from = from;
                //trace.log(this.from);
                //u(this._from.x, this._from.y);
            },
            
            resize: function(id, to, from){
                //trace.log("处理拖动",  id, to, from);
            },
            
            afterresize: function(id, to, from){
                trace("结束处理拖动" + id);
                if(this.__dom){
                    var box = this.__dom.box();
                    //this.__dom.remove();
                    //this.__dom = null;
                    this.w(box.w + 1);
                    this.h(box.h + 3);
                    this.top(to.y);
                    this.top(to.x);
                }
            },
            
        	constructor: function(obj){
                obj = Object.extendIf(obj || {}, {
                    h: 100,
                    w: 100
                });
            	this.base(obj);
        	},
            
            init: function(){
                //var start = Function.empty;
                for(var i = 1; i <= 8; i++)
                    this._bindEvent(i, getResizer(i));
            },
            
        	play: function(){
               
               //   拖动的对象
               var me = this,
               
                   d = me.dragingElement;
                   
                  return me;
                
                
           },
           
            xType: "Resizer"
            
        }).implement({
        
            play: function(control, box, onresize, onfinish){
                var b = typeof box == 'object',
                    dp = Py.Dom.Dragable.prototype,
                b = dp._play.call({
                    
                    dragingElement: c.Control.get(drag),
                    
                    resize: b ? dp.position(b.min, b.max , ondrag) : box ,
                    
                    finish: b ? ondrop : ondrag
                });
            
                b.stop = b._stop;
                b.play = dp._play;
        
                return b;
            }
            
        }, true),
        
        te = Resizer.template = {
            className: 'g-resizer',
            childNodes: [
                {
                    innerHTML: "sss",
	                className: 'g-resizer-wrap h' 
                }
            ]
        };
    
    
    /*
    
    Resizer.template = '<div class="g-panel g-resizer">\r\n' + 
    '<div class="g-win-e" id="_xe"></div>' + 
    '<div class="g-win-s" id="_xs"></div>' + 
    '<div class="g-win-w" id="_xw"></div>' +
    '<div class="g-win-n" id="_xn"></div>' + 
    <div class="g-win-sw" id="_xsw"></div>
    <div class="g-win-es" id="_xes"></div>
    <div class="g-win-wn" id="_xwn"></div>
    <div class="g-win-ne" id="_xne"></div>
    <div class="g-panel-wrap g-resizer-wrap" id="_wrap"></div>
    </div>');
    
    */

    
    
    dests.forEach(function(n){
        te.childNodes.push({
              className: 'g-resizer-handle g-resizer-' + n
        });
    });
    
    Class.addEvents(Resizer, "beforeresize,   resize,  stop,   afterresize");







	  	resizeHelper = {

  		    resizeCS : 'g-resize-ghost',
					
					maskerCS : 'g-resize-mask',
/**
 * @property {CC.Base} layer 映像层,只读,当调用applyLayer方法后可直接引用
 */

/**
 * @property {CC.Base} masker 页面掩层,只读,当调用applyMasker方法后可直接引用
 */
 
/**
 * 在resize开始或结束时调用
 * @param {Boolean} apply
 */
		      applyResize	: function(b){
		      	this.resizing = b;
			      this.applyLayer(b);
			      this.applyMasker(b);
		      },
/**
 * 是否应用映像层
 */
			    applyLayer : function(b){
			    	var y = this.layer;
			    	if(!y){
              y = this.layer = 
			        	  CC.Base.create({
			        	   	view:CC.$C('DIV'),
			        	   	autoRender:true,
			        	   	cs:this.resizeCS,
			        	   	hidden:true
			        	  });
			    	}
			    	b ? y.appendTo(doc.body) : y.del();
			    	y.display(b);
			    },
/**
 * 创建或移除页面掩层,在resize拖动操作开始时,创建一个页面掩层,
 * 以防止受iframe或其它因素影响resize
 * @param {Boolean} cor 创建或移除页面掩层
 */
			    applyMasker : function(b){
			    	var r = this.masker;
			      if(!r)
			       	r = this.masker = 
			       	  CC.Base.create({
			       	  	view:CC.$C('DIV'),
			       	  	autoRender:true,
			       	  	cs:this.maskerCS, 
			       	  	hidden:true, 
			       	  	unselectable:true
			       	  });
			
			      if(b && CC.ie)
			        r.setSize(CC.getViewport());
			      b ? r.appendTo(doc.body) : r.del();
			      r.display(b);
			    }
		  	}   










































    
    
    return Resizer;

});