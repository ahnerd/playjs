/**
 * @author Administrator
 * @email hustcoolboy@gmail.com
 */
using("System.Dom.Element");
var StarMarker = Control.extend({
	   xType:"starmarker",  // html 需要小写
	   options:{
	   	 totlaStar:5
		 //,
		// defaultStar:4,    // 这个  defaultStar 不需要 ，  因为 有 setValue  所以只要使用 value: 4
		// change:function(){},  // 这个就更不需要了
		// target:document.body   // 这个也不需要， 因为有  renderTo
	   },
	   create: function(options){
		    var div=document.create('div', 'star');//创建一个放置组件的div,className='star'
			for(var i=0;i<options.totlaStar;i++){
			    document.create('a').setAttr("title", (i+1)+"星级").renderTo(div);
			  };
			return div;
		 },
	   init:function(options){
		    var a=this.dom.childNodes;
			/*
for(var i=0,l=a.length;i<l;i++){
			  	if(i<options.defaultStar){
					a[i].select=true;
			        a[i].className="select";
			    };
			  }
*/
			 this.on('mouseover', this.onMouseOver).on('mouseout', this.onMouseOut).on('click', this.onClick).on('_change',options.change);
			// this.dom.renderTo(options.target);
		   },
	   setValue:function(value){
			Object.each(this.dom.childNodes,function(value,index){
			       value.className=index < value ? "select" : "";
				//   value.select= index < value;
			});
			this.onChange();
		   return this;
	   },
	   
	   onChange: function(value){
			this.trigger('valuechanged', value);
	   },
	   
	   getValue:function(){
	   	  var v=0;
		  Object.each(this.dom.childNodes, function(value,index){
			       if(value.className) v = index+1;
			});
	   	  return v;
	   },
	   onMouseOver:function(e){
		  Object.each(this.dom.childNodes,function(value,index){
			       if(index<parseInt(e.target.title)){
				   	 value.className="hover";
				   }
			});
	   },
	   onMouseOut:function(e){alert(e.type);
	   	  Object.each(this.dom.childNodes,function(value){
				   	 value.className=value.select?"select":"";
			});
	   },
	   onClick:function(e){
	   	 this.setValue(parseInt(e.target.title));
	   },
});

