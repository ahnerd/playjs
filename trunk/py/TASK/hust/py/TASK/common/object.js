//==========================================
// playObject  by xuld
//
//   纯数据的类
//
//
//功能说明: 类主要用于存储类似数据库结构的表格
//              全局变量  DataSet :  全部数据的集合
//              一个DataSet含有多个DataTable  每个DataTable 含有一个DataTitle和多个DataRow
//              不提供UI界面。只能作为一个数据(XML,数据库,JSON)接口。
//最简单示例:
//     /*  js code 
//		* * playObject 最简单示例
//		* * 创建一个表格并创建一个列
//      */
//          var Table = DataSet.add("表格名字",["标题1","标题2","标题3"]);    //创建一个表格,并定义表格有哪些标题
//			Table.add(["第一行第1列","第一行第2列","第一行第3列"],"名字1");           //创建一行
//          Table.add(["第二行第1列","第二行第2列","第二行第3列"],"名字2");           //创建一行
//			Table["名字1"]["标题1"] = 3;             // 这样调用名字为名字1的行的第一列。
//			Table[0][3] = 6                          // 也可以使用数字
//			Table.create()                           // 创建一个 <TABLE> 标签,这个方法一般用于调试,观察所有的表格数据
//
//基本示例:
//       常用方法说明: 
//          add   增加一项
//          del   删除一项
//          indexOf   返回指定索引的内容
//          find   返回指定内容索引,如果找不到有关内容,返回 -1
//          insert   在当前位置末尾插入一个内容
//          insertAt   在一个位置插入一个内容
//          remove   按照内容删除,可以传入一个数组
//          removeAt   按照索引删除
//          search   返回当前有无指定内容
//          getAt   返回指定索引位置,如果索引越界,返回一个 NULL
//          length  个数
//          key     主键
//
//       DataSet::add()    增加一个表,参数:如果是1个。表示表格标题,如果2个,前个参数为表格名,后个是标题。
//       DataSet::del()    删除一个表,参数:表格名字。
//       DataSet::table    全部表格的集合
//                              当您添加一个表格后,要使用table集合获得该表格     DataSet.table[索引]  或 DataSet.table[名]
//       DataSet::count    表格数
//       DataSet::xType    Py对象对自身的说明
//       DataTable::addTitle    增加表格的标题,参数可以是数组,或逗号隔开的字符串。
//       DataTable::addTitleAt    增加表格的标题到一个位置,第一个参数为位置(数字),第二个为标题
//       DataTable::render    渲染到一个DIV元素
//       DataTable::container    读取一个<TABLE>
//       DataTable::sort(列,比较函数,顺序/逆序,开始位置,结束位置)    排序
//                                 排序是使用较多的功能,使用的参数全可选,
//                                 当没有列时,列使用主列。
//                                 比较函数,默认是返回由小到大。
//                                       比叫函数  2   个参数,  表示 2个列。 返回一个布尔 如 function(x,y){return x<y};  这样按  x<y  排序
//                                 顺序,逆序:布尔,始排序结果相反(默认true)。   
//                                 开始位置,开始排序的位置。  
//       
//==========================================


 /* dataSet
*     by xuld
*      http://www.xuld.net
*   注释版
*
*   仅供研究与学习。
*/
if(namespace("playObject")){
	
	//---------------------------------------
	// dataSet 
	//---------------------------------------
	dataSet = function(name){
		var playDataSet = {
			
			//---------------------------------------
			//私有变量
			//---------------------------------------
			
			//全部表格
			table:new Array(),
			
			//表格数
			count:0,
			
			//版本
			version:0.1,

			//分别		
			xType:"dataSet",

			//根据次序或内容返回一个内容
			_getAt:function(t,x){
				if(isNaN(x)){
					return this._indexOf(x);
				}else{
					return x>t.count?null:t[x];
				}
			},

			//插入一个值到末尾
			//参数:值的名字,值
			//  value : 名字
			//  key : 值 
			_insert:function(t,value,key){
				t.key = t.count;
				if(typeof value == "undefined" || value==""){
					t[t.count++] = key;
				}else{
					return t[t.count++] = t[value] = key;
				}
				return t[t.key];
			},
			
			//在一个位置插入一个值
			//参数:
			//  table : 位置
			//  value : 名字
			//  key : 值
			_insertAt:function(t,table,value,key){
				t.key = table;
				t.count++;
				for(var i=t.count-1;i>=table;i--){
					t[i+1] = t[i];
				}			
				
				if(typeof value == "undefined" || value==""){
					t[table] = key;
				}else{
					t[value] = t[table] = key;
				}
				return t[t.key];
			},
			
			//查找,返回索引,找不到 返回 -1
			//参数:
			//  name : 名字
			_indexOf:function(t,name){
				for(var i=0;i<t.length;i++)
					if(t[i] &&  t[i].name==name)
						return i;
				return -1;
				
			},
			
			//删除一个值
			//参数:
			//  name : 值
			_remove:function(t,name){
				if(isArray(name)){
					var aa=new Array();
					for(var i=0; i<t.length; i++)
					   for(var n=0; n<name.length;  n++ )
						if(t[i] && t[i].name==name[n]){
						aa.push(i);
						break;
					}
					return this._removeAt(t,aa);
				}
				for(var i=0;i<t.length;i++)
					if(t[i] &&  t[i].name==name){
						this._removeAt(t,i);
						return 1;
						break;
					}
				return  0;
			},
			
			
			//删除
			//参数:
			//  table : 行数
			//  返回被删除的个数
			_removeAt:function(t,table){
				if(isArray(table)){
					var count = 0;
					for(var v=0;v<table.length;v++)
						if(t[table[v]]){
							count++;
							if(t[table[v]].name)
								delete t[t[table[v]].name];
					        delete t[table[v]];	
							t.count--;
						}
					var start,v;
							start = parseInt(table[0]);
							v = start;
							while(v++<t.count)
								if(t[v])
									t[start++] = t[v];
						t.length -= count;
						t.count -= count;
					return count;
				}
				table = parseInt(table);
				if(!t[table])
					return 0;
				if(t[table].name)
					 delete t[t[table].name];
				delete t[table];
				//while(table++<t.length)
				//	t[table-1]  = t[table];
				//t.length--;
				t.count--;
				return 1;
			},
			
			//载入值到数组
			_load :  function(t,value){
				switch(typeof value){
					case "object" :
						if(value.xType){
							t = value;
						}else{
							for(var i in value){
								if(!i) continue;
								this._insert(t,i,value[i]);
							}
						}
						break;
					case "string" :
							value = value.split(",");
							for(var i in value){
								if(!i) continue;
								this._insert(t,i,value[i]);
							}
						break;
					default:
						break;
				}
				
			},
			
			//设置值为索引
			_setV : function(t,vals){
				for(var i=0;i<vals.length;i++)
					t[i] = vals[i];
			},
			
			//搜索一个值内容是否存在
			//参数:
			//  table : 名字
			_search:function(t,table){
				if(isArray(table)){
					for(var v in table)
						if(t[table[v]])
							continue;
						else
							return false; 
				}
				return !!t[table];
				
			},  

			// ["",""]->{0:[]}
			_createS:function(value){
				var o = new Object();
				switch(typeof value){
					case "string" :
							value = value.split(",");
					case "object" :
						if(typeof value[0]!="object"){
							for(var i=0;i<value.length;i++){
								o[i] = value[i]
							}
						}else{
							o = value;
						}
					default:
						break;
				}
				
				return o;
				
			},

			//---------------------------------------
			//方法,实际提供的内容
			//---------------------------------------
				
			//表格长度
			length:function(){
				return this.table.length;
			},

			//根据次序或内容返回一个表格
			getAt:function(x){
				return this._getAt(this.table,x);
			},
			
			//插入一个表格到末尾
			//参数:
			//  value : 值
			//  tableName : 表名
			//  title : 标题
			insert:function(value,tableName,title){
				this.count++;
				return this._insert(this.table,tableName,new PyDataTable({value:value,parent:this,name:tableName,title:title}));
			},
			
			//在一个位置插入一个值
			//参数:
			//  n : 行数
			//  value : 值
			// tableName: 表名
			//  title : 标题
			insertAt:function(x,value,tableName,title){
				this.count++;
				return this._insertAt(this.table,x,tableName,new PyDataTable({value:value,parent:this,name:tableName,title:title}));
			},

			//查找表名,返回索引,找不到 返回 -1
			//参数:
			//  name : 名字
			indexOf:function(tableName){
				return this._indexOf(this.table,tableName);
				
			},

			//删除一个表
			//参数:
			//  table : 名字
			remove:function(tableName){
				this.count -= this._remove(this.table,tableName);
			},

			//删除一个表
			//参数:
			//  table : 表索引
			removeAt:function(x){
				this.count -= this._removeAt(this.table,x);
			},
			
			//搜索一个表面是否存在
			//参数:
			//  table : 名字
			search:function(tableName){
				return this._search(this.table,tableName);
				
			},
			
			//主表
			key:0
		};
		
		//添加一个表  参数
		//  { name:
		//    value:
		//    title:
		//    position:
		//
		//    }
		//  或直接内容
		// add 位置 表名 内容
		// 参数  isTitle  是否把value第一行作为title。
		playDataSet.table.add =playDataSet.add =  function(value){
			if(isArray(value)){
				var cc = this.count;
				for(var i in value){
					value[i].parent = this;
					var name = value[i] . name ;
					DataSet._insert(this.table,name, new PyDataTable(value[i]));
				}
				return this.table[cc+1];
			}else{
				value.parent = this;
			}
			return dataSet._insert(this.table,value.name , new PyDataTable(value));
		};

		//删除一表  参数:位置表名
		playDataSet.table.del = playDataSet.del = function(table){
			if(isNaN(table))
				playDataSet.remove(table);
			else
				playDataSet.removeAt(table);
		};
		
		playDataSet.table.search = playDataSet.search;
		
		playDataSet.table.indexOf = playDataSet.indexOf;	
		
		playDataSet.table.getAt = playDataSet.getAt;
		
		playDataSet.table.count = 0;
		
		return playDataSet;
	}();

	//---------------------------------------
	// PyDataTable 
	//---------------------------------------

    PyDataTable = function(sets){
		// PyDataTable
	   this.init.call(this,sets);
	};
 
	PyDataTable.prototype = new Array();
	
	//初始化
	// o 为包含这个表资料
	PyDataTable.prototype.init = function(o){
		
		
		if(!o) o = {parent:null,title:{parent:this}};
		else{
			this.parent = o.parent;
			if(o.isTitle)
				o.title = {value:getTitle(o.value),parent:this};
			else
				o.title = o.title  || o.parent.title || {parent:this};
			o.title.parent = this;
		}
		this.title = new PyDataColumn(o.title);
		this.count = 0;
		this.add(o.value);
		this.name = o.name;
		this.key = o.key || 0;
		
		
		function getTitle(c){
			if(c[0]) return c[0];
			var f = new Array();
			for(var i in c)
				f.push(i);
			return f;
		}
	};
	
	//从数组载入 [ [],[],[]  ]
	//参数:  {"行名":[],"信息":[]
	//  value : 值
	//  isTitle : 是否把第一行当标题
	PyDataTable.prototype.set = function(value,isTitle,rowName){
		if(isArray(value) && isArray(value[0])){
			for(var i=0;i<this.length;i++){
				if(this[i])
					this[i].set(value[i]);
				else
					dataSet._insert(this,"",new PyDataRow({parent:this,value:value[i]}));
			}
			if(isTitle) this.title.set(value[0]);
		}else if(!isArray(value) && typeof value=="object"){
			for(var rowName in value){
				if(this[rowName])
					this[rowName].set(value[i]);
				else
					dataSet._insert(this,rowName,new PyDataRow({parent:this,value:value[i]}));
			}
		}else{
			if(isTitle)
			   	this[rowName] = new PyDataRow({parent:this,value:value[i]});
			else
				this.title.set(value);
		}
	};		

	//插入一个行到末尾  ["","ad","wde"]      [],
	// {a:[],c:[]}
	//参数:
	//  value : 行内容,包括parent,value,name
	PyDataTable.prototype.add = function(value,rowName){
		if(isArray(value) && isArray(value[0])){
			var count = this.length;
			for(var i=0;i<value.length;i++){
				dataSet._insert(this,rowName?rowName[i]:"",new PyDataRow({parent:this,value:value[i]}));
			}
			return this[count+1];
		}else if(!isArray(value) && typeof value=="object"){
			var count = this.length;
			for(var rowName in value){
				dataSet._insert(this,rowName,new PyDataRow({parent:this,value:value[rowName]}));
			}
			return this[count+1];
		}
		return dataSet._insert(this,rowName,new PyDataRow({parent:this,value:value}));
	};
	
	//插入一个行到末尾
	//参数:
	//  value : 行内容
	PyDataTable.prototype.insert = function(value,rowName){
		return dataSet._insert(this,rowName,new PyDataRow({value:value,parent:this,name:rowName}));
	};
	
	//插入一列
	//参数:
	//  name : 名字
	PyDataTable.prototype.addTitle = function(value){
		this.title.insert(value);
	};  
	
	//插入一列一个位置
	PyDataTable.prototype.addTitleAt = function(row,value){
		this.title.insertAt(row,value);
	};  

	//输入全部标题
	PyDataTable.prototype.titleSet = function(value,format){
		this.title.set(value,this,format);
	}; 
	
	//在一个位置插入行
	//参数:
	//  row : 行数
	//  value : 名字
	PyDataTable.prototype.insertAt = function(row,value,rowName){
		return dataSet._insertAt(row,this,rowName,new PyDataRow({value:value,parent:this,name:rowName}));
	};

	//查找行名,返回索引,找不到 返回 -1
	//参数:
	//  name : 名字
	PyDataTable.prototype.indexOf = function(name){
		return dataSet._indexOf(this);
		
	};
	
	PyDataTable.prototype.count = 0;
	
	//在一列中查找一个单元格,返回行,找不到 返回 -1
	//参数:
	//  name : 值
	PyDataTable.prototype.findAt = function(){
		if(arguments.length==2)
			for(var i=0;i<this.length;i++)
				if(this[i][arguments[0]]==arguments[1])
					return i;
		else
			for(var i=0;i<this.length;i++)
				if(this[i][this.key]==arguments[0])
					return i;	
		return -1;
		
	};	
	
	PyDataTable.prototype.xType = "PyDataTable";	
	
	//查找一个单元格,返回索引数组(列,行),找不到 返回 (-1,-1)
	//参数:
	//  value : 值
	PyDataTable.prototype.searchOf = function(value){
		for(var i=0;i<this.length;i++)
			for(var j=0;j<this[i].length;j++)
				if(this[i][j]==value)
					return [i,j];
		return [-1,-1];
		
	};		
	
	//删除一行
	//参数:
	//  row : 名字
	PyDataTable.prototype.remove = function(row){
		dataSet._remove(this,row);
	};
		
	//删除一个表
	//参数:
	//  row : 行数
	PyDataTable.prototype.removeAt = function(row){
		dataSet._removeAt(this,row);
	};
		
	//搜索一个行名是否存在
	//参数:
	//  table : 名字
	PyDataTable.prototype.search = function(row){
		return !!this[row];
	}
	
	PyDataTable.prototype.forEach = function(row,f){
		if(!f){
			f = row;
			row = this.key  ;
		}
		
		for(var i=0;i<this.length;i++)
			f(this[i][row],i,row);
		
	
	};
	
	//按索引返回一行,没有 null
	PyDataTable.prototype.getAt = function(x){
		return dataSet._getAt(x);
	};


	//排序  (冒泡)
	//参数: name id列名字
	//  row  name bool f 
	PyDataTable.prototype.sort = function(row,f,bool,start,end){
		row = row || this.key;
		fn = typeof f=="function"?f:function(x,y){return x<y};
		if(bool===false) fn = function(x,y){return !fn(x,y)};
		start = start || 0;
		end = end || this.length;
		var tmp;
		for(var i=start;i< end;i++){
			for(var j=i+1;j<end;j++)
				if(!fn(this[i][row],this[j][row])){
					tmp = 	this[j][row];
					this[j][row] = this[i][row];
					this[i][row] = tmp;
				}
		}
		this.title[i].sorted = true;
	};

	//从一个<table>标签载入内容
	PyDataTable.prototype.container = function(id){
		id = typeof id=="string"?document.getElementById(id):id;
		if(id.tagName.toUpperCase()!="TABLE") return;
		this.title = new PyDataColumn({value:new Array(id.rows[0].cells.length),parent:this});
		for(var j=0;j<id.rows[0].cells.length;j++)
			this.title[j] = id.rows[0].cells[j].innerHTML.replace(/^\s|\s$/g,"");
		for(var i=1;i<id.rows.length;i++){
			this[i] = new PyDataRow({value:new Array(id.rows[0].cells.length),parent:this});
			for(var j=0;j<id.rows[i].cells.length;j++)
				this[i][this[i].title[j]] = this[i][j] = id.rows[i].cells[j].innerHTML.replace(/^\s|\s$/g,"");
		}
	};



	//写入一个<table>标签
	PyDataTable.prototype.render = function(id){
		id = typeof id=="string"?document.getElementById(id):id;
		var sHTML="  <tr>\n";
		for(var i=0;i<this.title.count;i++)
				sHTML  += "			<th>" + this.title[i] + "&nbsp;</th>" ;
		sHTML  += "    \n";
		sHTML  += "  </tr>\n";
		sHTML  += "\n";			
		sHTML  += "  \n";			
		for(var i=0;i<this.count;i++){
			sHTML  += "  <tr>\n		";
			for(var j=0;j<this[i].count;j++)
				sHTML  += "			<td>" + this[i][j] + "&nbsp;</td>" ;
			sHTML  += " 		\n  </tr>\n";
		}	
		sHTML = "<table id=\"" + this.name + "\">" + sHTML + "</table>"
		id.innerHTML = sHTML;
	};

	PyDataTable.prototype.create = function(){
		var n = this.name+"_v";
		document.write("<div id=\"" + n + "\"></div>")
		this.render(n);
	};


	//增加自增长id列
	//参数: name id列名字
	PyDataTable.prototype.autoID = function(name,start,row){
		name = name || "ID";
		this.addTitleAt(row || 0,name);
		start = start || 1;
		for(var i=0;i<this.count;i++)
			this[i].insertAt(0,start+i,name);
		a.title[name].autoID = true;
	};
	
	//---------------------------------------
	// PyDataColumn 
	//---------------------------------------

	PyDataColumn = function(o){
		this.init.call(this,o);
	}
	
	PyDataColumn.prototype = new Array();
	
	PyDataColumn.prototype.init = function(o){
		if(!o) o ={key:0,name:""};
		this.key = o.key || 0;
		this.count = 0;
		this.name = o.name || "";
		this.types = new Array();
		this.set(o.value,o.parent,o.type);
		this.show = o.show!==true;
	}


	PyDataColumn.prototype.xType = "PyDataColumn";

	//添加项 ["sd","sad","sad"]   ,   {"a":"type","ad","type"}       "a",
	//参数: {name,type}
	PyDataColumn.prototype.add = function(value){
		if(typeof value=="string" && value.indexOf(",")>0) value = value.split(",")
		if(isArray(value)){
			value[i] = dataSet._createS(value[i]);
			for(var i in value){
				dataSet._insert(this,i,new PyDataTitle({parent:this,value:value[i]})); 
			}
			return this[value[0]];
		}else if(typeof value=="object"){
			for(var i in value){
				dataSet._insert(this,i,new PyDataTitle({parent:this,value:i,type:value[i]})); 
			}
		}
		dataSet._load(this,[new PyDataTitle({parent:this,value:value})]); 
		return this[name];
	};
	
	PyDataColumn.prototype.count = 0;
	
	//插入一项
	//这列名字,这列类型
	PyDataColumn.prototype.insert = function(name,type){
		return dataSet._insert(this,name,new PyDataTitle({value:name,type:type,parent:this})); 	
	};
	
	//在一个位置插入列
	//参数:
	//  row : 行数
	//  这列名字,这列类型
	PyDataColumn.prototype.insertAt = function(row,name,type){
		return dataSet._insertAt(this,row,name,new PyDataTitle({value:name,type:type,parent:this}));
	};

	//设置所有值
	//值的内容,父元素,类型
	// set(["sdsd"],parent,["string"])
	PyDataColumn.prototype.set = function(value,parent,type){
		if(typeof value=="string" && value.indexOf(",")>0) value = value.split(",");
		if(isArray(value)){
			for(var i=0;i<value.length;i++){
				if(this[value[i]])
					this[value[i]] = new PyDataTitle({parent:this,value:value[i]}); 
				else
					dataSet._insert(this,value[i],new PyDataTitle({parent:this,value:value[i]})); 
			}
		}else if(typeof value=="object"){
			for(var i in value){
				if(this[i])
					this[i] = new PyDataTitle({parent:this,value:i,type:value[i]}); 
				else
					dataSet._insert(this,i,new PyDataTitle({parent:this,value:value[i]})); 					
			}
		}
		if(parent && parent.xType)this.parent = parent;
		if(type) this.setTypes(type);
	};
	
	//在这行查找值,返回索引,找不到 返回 -1
	//参数:
	//  name : 名字
	PyDataColumn.prototype.indexOf = function(name){
		return dataSet._indexOf(this,name);
		
	};	
	
	
	//设置所有值
	//值的内容
	PyDataColumn.prototype.setTypes = function(value){
		this.types = value;
		for(var i=0;i<this.length;i++)
			this[i].type = value[i];
			//this[this[i]].type
			
	};
	
	//根据索引得到这一行所在索引位置的值
	//参数:
	//  value : 值
	PyDataColumn.prototype.getAt = function(value){
		return dataSet._getAt(this,value); 
		
		
	};		
	
	//删除一列
	//参数:
	//  row : 名字
	PyDataColumn.prototype.remove = function(row){
		dataSet._remove(this,row);
	};
	
	//
	PyDataColumn.prototype.sort = function(row){
		this.parent.sort(row);
	}
	
	//删除一列
	//参数:
	//  table : 行数
	PyDataColumn.prototype.removeAt = function(row){
		dataSet._removeAt(this,row);
	};
	
	PyDataColumn.prototype.loadData = function(vals){
		dataSet._load(this,vals);
	}

	//搜索列是否存在
	//参数:
	//  table : 名字
	PyDataColumn.prototype.search = function(row){
		return !!this[row];
		
	};


	//---------------------------------------
	// PyDataTitle
	//---------------------------------------
	PyDataTitle = function(o){
		this.init.call(this,o);
		//PyDataTitle	
	}
	
	
	PyDataTitle.prototype = new String();
	
	PyDataTitle.prototype.init = function(o){
		if(!o) return;
		this.name = o.value;
		this.type = o.type || "string";
		this.parent = o.parent;
		this.autoID = o.autoID || false;
	};
	
	PyDataTitle.prototype.valueOf = PyDataTitle.prototype.toString = function(){
		return this.name;
	}
	
	PyDataTitle.prototype.remove = function(){
		this.parent.remove(this.name);
	}

	PyDataTitle.prototype.sort = function(){
		this.parent.sort(this.name);
	}
	
	//---------------------------------------
	// PyDataRow
	//---------------------------------------
	//表的一行
    PyDataRow = function(o){
		this.init.call(this,o);
		//PyDataRow
	};
	 
	PyDataRow.prototype = new Array();
	
	PyDataRow.prototype.init = function(o){
		if(!o) o ={key:0,name:""};
		this.count = 0;
		this.key = o.key;
		this.name = o.name;
		this.set(o.value,o.parent,o.format);
		this.show = o.show!==false;
	};

	PyDataRow.prototype.xType = "PyDataRow";
	
	
	PyDataRow.prototype.count = 0;
	
	//插入列到末尾
	//参数:
	//  value : 内容
	//  title : 列名,或索引
	PyDataRow.prototype.insert = function(value,title){
		return dataSet._insert(this,title,value);
	};
	
	//在一个位置插入列
	//参数:
	//  row : 行数
	//  value : 名字
	PyDataRow.prototype.insertAt = function(row,value,title){
		return dataSet._insertAt(this,row,title,value);
	};

	//载入到一个数组
	PyDataRow.prototype.loadData =function(value){
		dataSet._load(this,value);
	};
	
	//结合标题
	PyDataRow.prototype.bind = function(v){
		v = this.title;
		for(var i=0;i<v.length;i++)
			this[v[i]] = this[i];
		
	};
	
	//在这行查找值,返回索引,找不到 返回 -1
	//参数:
	//  name : 名字
	PyDataRow.prototype.indexOf = function(name){
		return dataSet._indexOf(this,name);
		
	};

	//根据索引得到这一行所在索引位置的值
	//参数:
	//  value : 值
	PyDataRow.prototype.getAt = function(value){
		return dataSet._getAt(this,value); 	
	};		
	
	//删除一列
	//参数:
	//  row : 名字
	PyDataRow.prototype.remove = function(row){
		if(typeof row=="undefined")
			this.parent.remove(this.name);
		dataSet._remove(this,row);
	};

	//删除一列
	//参数:
	//  table : 行数
	PyDataRow.prototype.removeAt = function(row){
		dataSet._removeAt(this,row);
	};

	//设置行  ["ad","asdf"] ,["as":"cz","as":"ad"],{"sd"}
	//参数:
	//  row : 名字
	PyDataRow.prototype.set = function(value,parent,format){
		var af = isArray(format);
		if(typeof value=="string" && value.indexOf(",")>0) value = value.split(",");
		if(isArray(value)){
			for(var i=0;i<value.length;i++){
				if(!this[i]) this.count++;
				this[i] = ((af?format[i]:format)?playString.format(value[i],this.title[i].type):value[i]);			
			}
		}else if(typeof value=="object"){
				for(var i in value[i]){
					if(this[i])
						this[i] = ((af?format[i]:format)?playString.format(value[i],this.title[i].type):value[i]);
					else
						dataSet._insert(this,i,((af?format[i]:format)?playString.format(value[i],this.title[i].type):value[i]));			
				}	
		}
		
		
		if(parent && parent.xType){
			this.parent = parent;
			this.title = parent.title;
			this.bind();
		}
	};
	
	//搜索列是否存在
	//参数:
	//  table : 名字
	PyDataRow.prototype.search = function(row){
		return !!this[row];
		
	};

	playObject = true;

	if(!window.playString)
	//格式化数据
	playString = {format : function(value,type){
					switch(type){
						case "string":
							return value;
						case "int":
							value = isNaN(value)?0:parseInt(value);									
						case "number":
							return isNaN(value)?0:value;	
						case "float":
							return isNaN(value)?0.00:parseFloat(value);
						case "yuan","dollar":
							return isNaN(value)?"0.00":((value=parseFloat(value)).toFixed?Math.floor(value*100)/100:(value.toFixed(2)));
						case "date":
							try{
								var s = Date.parse(value);
							}catch(e){
								var s = Date.now();
							}
							return s;
						case "boolean":
							return !(s===false || s.toLowerCase()=="false" || s.length==0 || s==0);
						
					}
				}
			};	
	
		
	//判断是否数组
	function isArray(v){
		return Object.prototype.toString.apply(v) === '[object Array]';
	}
}



function namespace(arg){if(window._system)window._system.push(arg);else window._system = [arg];return eval('typeof ' + arg + '=="undefined" || ' + arg + '.xType != "' + arg + '"');}
