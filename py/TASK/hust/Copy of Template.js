/**
 * @author hust_小C
 * email:hustcoolboy@gmail.com
 */

(function(w){
    w.Template=Template||{};
	function Template(options){
	    return this instanceof arguments.callee?this.init(options):new arguments.callee(options);
	}
	Template.tags=["if","for"];//存放模版标签，目前制作了if的解析，日后在进行扩展
	Template.prototype={
		init:function(options){
			this.tpl=options.tpl;//待解析的模版
			this.target=options.target||options.tpl;//解析后渲染的模板dom
		    this.tplcontent=options.tpl.innerHTML.replace(/\n|\t/g,'');
		    this.left=options.left||"{{";//左分隔符
			this.right=options.rigth||"}}";//右分隔符
			this.vars=[];
			this.body=[];
		},
		parseIf:function (){
			var self=this,tplcontent=this.tplcontent.split(new RegExp('(?='+this.left+'if)')).filter(function(v,k){return v.test(self.left)});
			var temp=[];//alert(tplcontent.join('\n'));
			for(var i=0,len=tplcontent.length;i<len;i++){
				temp.push(tplcontent[i].replace(new RegExp(this.right+'(.*?)'+this.left,'g'),function(){
					 return "{this.vars.push('"+arguments[1]+"')}";
		            }
		           ).replace(new RegExp(this.left+'\s*(.*)\/if\s*'+this.right),'$1'));
			}
			return temp.join('');
		},
		parsefor:function(){
			alert('not done yet!');
		},
		compile:function(){
			var self=this;
			this.tplcontent.replace(new RegExp(Template.tags.join('|'),'i'),function(){
				self.body.push(self['parse'+arguments[0].capitalize()]());
			});alert(this.body.join(''));
		    return new Function(this.body.join('')+"   return this.vars.join('')").call(this);
		},
		render:function(){
		    
			this.target.innerHTML=this.tplcontent.replace(new RegExp(this.left+'\s*if(.*)\/if\s*'+this.right),this.compile());
		}
	}
	
})(this);
