//==========================================
// PyObject  by xuld
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
//		* * PyObject 最简单示例
//		* * 创建一个表格并创建一个列
//      */
//          var Table = DataSet.add("表格名字",["标题1","标题2","标题3"]);    //创建一个表格,并定义表格有哪些标题
//			Table.add("名字1",["第一行第1列","第一行第2列","第一行第3列"]);           //创建一行
//          Table.add("名字2",["第二行第1列","第二行第2列","第二行第3列"]);           //创建一行
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
*      由于技术有限:这里的js没有很多优化过,甚至存在问题。如果您有更好的修改建议,希望能发给我一份修改的源码。
*   全局说明
*      命名规则使用js规则。
*   仅供研究与学习。
*/
if(!window.dataSet && dataSet.xType!="dataSet"){
	dataSet = function(name){
		var playDataSet = {
			
			//全部表格
			table:new Array(),
			
			//表格数
			count:0,
			
			//版本
			version:0.1,
			
			//表格长度
			length:function(){
				return this.table.length;
			},

			//根据次序或内容返回一个内容
			_getAt:function(t,x){
				if(isNaN(x)){
					return this._indexOf(x);
				}else{
					return x>t.length?null:t[x];
				}
			},
			
			xType:"dataSet",
			
			//插入一个值到末尾
			//参数:
			//  value : 名字
			//  key : 值 
			_insert:function(t,value,key){
				t.key = t.length;

				if(typeof value == "undefined" || value==""){
					t[t.length] = key;
				}else{
					return t[t.length] = t[value] = key;
				}
				
				return t[t.key];
			},
			
			//在一个位置插入一个值
			//参数:
			//  table : 行数
			//  value : 名字
			//  key : 值
			_insertAt:function(t,table,value,key){
				t.key = table;
				
				for(var i=t.length-1;i>=table;i--){
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
						}
					var start,v;
							start = parseInt(table[0]);
							v = start;
							while(v++<t.length)
								if(t[v])
									t[start++] = t[v];
						t.length -= count;
					return count;
				}
				table = parseInt(table);
				if(!t[table])
					return 0;
				if(t[table].name)
					 delete t[t[table].name];
				delete t[table];
				while(table++<t.length)
					t[table-1]  = t[table];
				t.length--;
				return 1;
			},
			
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
			
			//根据次序或内容返回一个表格
			getAt:function(x){
				return this._getAt(this.table,x);
			},
			
			//插入一个表格到末尾
			//参数:
			//  tableName : 表名
			insert:function(tableName,value){
				this.count++;
				return this._insert(this.table,tableName,playDataTable(tableName,value));
			},
			
			//在一个位置插入一个值
			//参数:
			//  n : 行数
			// tableName: 表名
			insertAt:function(x,tableName,value){
				this.count++;
				return this._insertAt(this.table,x,tableName,playDataTable(tableName,value));
			},

			//查找表名,返回索引,找不到 返回 -1
			//参数:
			//  name : 名字
			indexOf:function(name){
				return this._indexOf(this.table,name);
				
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
		
		//添加一个表  参数:位置表名
		// add 位置 表名 内容
		playDataSet.table.add =playDataSet.add =  function(table,TableName,C){
			if(C && typeof table!="Object")
				return playDataSet.insertAt(table,TableName,C);		
			else if(!C && !TableName)
				return playDataSet.insert(playDataSet.count+"_play",table);
			else if(typeof table!="Object")
				return playDataSet.insertAt(table,TableName,C);
			else
				return playDataSet.insert(table,TableName);
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
		
		return playDataSet;
	}();

   playDataTable = function(name,title,vals){
	   
	    var DataTable = new Array();
			
		//全部列
		DataTable.title = playDataColumn(name+"Title",title,this);
		
		//名字
		DataTable.name = name;
		
		//插入一个行到末尾
		//参数:
		//  value : 名字
		DataTable.insert = function(value,vals){
			return dataSet._insert(this,value,playDataRow(value,vals,this));
		};
		
		//插入一列
		//参数:
		//  name : 名字
		DataTable.addTitle = function(value){
			dataSet._load(this.title,value); 
		};  
		
		//插入一列一个位置
		DataTable.addTitleAt = function(row,value){
			dataSet._insertAt(this.title,row,value,value); 
		};  
		//在一个位置插入行
		//参数:
		//  row : 行数
		//  value : 名字
		DataTable.insertAt = function(row,value,vals){
			var title = this.title;
			return dataSet._insertAt(this,row,value,playDataRow(value,vals,this));
		};

		//查找行名,返回索引,找不到 返回 -1
		//参数:
		//  name : 名字
		DataTable.indexOf = function(name){
			return dataSet._indexOf(this);
			
		};

		//在一列中查找一个单元格,返回行,找不到 返回 -1
		//参数:
		//  name : 值
		DataTable.findAt = function(){
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
		
		DataTable.xType = "playDataTable";		
		//查找一个单元格,返回索引数组(列,行),找不到 返回 (-1,-1)
		//参数:
		//  value : 值
		DataTable.searchOf = function(value){
			for(var i=0;i<this.length;i++)
				for(var j=0;j<this[i].length;j++)
					if(this[i][j]==value)
						return [i,j];
			return [-1,-1];
			
		};		
		
		//删除一行
		//参数:
		//  row : 名字
		DataTable.remove = function(row){
			dataSet._remove(this,row);
		};
			
		//删除一个表
		//参数:
		//  row : 行数
		DataTable.removeAt = function(row){
			dataSet._removeAt(this,row);
		};
			
		//搜索一个行名是否存在
		//参数:
		//  table : 名字
		DataTable.search = function(row){
			return !!this[row];
		}
		
		//从数组,对象增加
		// 参数:
		//  行的名字
		//   值 可以是逗号隔开的值,或json,或数组,playDataRow
		DataTable.add = function(row,value){
			if(!value){
				return this.insert("",row);
			}else{
				return this.insert(row,value);
			}
		}
		
		DataTable.forEach = function(row,f){
			if(!f){
				f = row;
				row = this.key  ;
			}
			
			for(var i=0;i<this.length;i++)
				f(this[i][row],i,row);
			
		
		}
		
		//按索引返回一行,没有 null
		DataTable.getAt = function(x){
			return dataSet._getAt(x);
		}


		//排序  (冒泡)
		//参数: name id列名字
		//  row  name bool f 
		DataTable.sort = function(row,f,bool,start,end){
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
		}

		//从一个<table>标签载入内容
		DataTable.container = function(id){
			id = typeof id=="string"?document.getElementById(id):id;
			if(id.tagName.toUpperCase()!="TABLE") return;
			for(var i=0;i<id.row.length();i++)
			  for(var j=0;j<id.row[i].cell.length();j++)
			    this[i][j] = id.row[i].cell[j].innerHTML;
		}



		//写入一个<table>标签
		DataTable.render = function(id){
			id = typeof id=="string"?document.getElementById(id):id;
			var sHTML="  <tr>\n";
			sHTML  += "    <th>";
			sHTML  += this.title.join("&nbsp;</th><th>");
			sHTML  += "    </th>\n";
			sHTML  += "  </tr>\n";
			sHTML  += "\n";			
			sHTML  += "  \n";			
			for(var i=0;i<this.length;i++){
				sHTML  += "  <tr>\n   <td>";
				sHTML  += this[i].join("&nbsp;</td><td>");
				sHTML  += "   </td>\n  </tr>\n";
			}	
			sHTML = "<table id=\"" + this.name + "\">" + sHTML + "</table>"
			id.innerHTML = sHTML;
		}

		DataTable.create = function(){
			var n = this.name+"_v";
			document.write("<div id=\"" + n + "\"></div>")
			DataTable.render(n);
		}


		//增加自增长id列
		//参数: name id列名字
		DataTable.autoID = function(name,start,row){
			name = name || "ID";
			this.addTitleAt(row || 0,name);
			start = start || 1;
			for(var i=0;i<this.length;i++)
				this[i].insertAt(0,name,start+i);
		}
		
		//主索引
		DataTable.key = 0;
		
		
		return DataTable;
	};
	
	playDataColumn = function(name,vals,parent){
		var DataColumn = new Array();
		
		DataColumn.key = 0;
		
		DataColumn.name = name;
		
		DataColumn.xType = "playDataColumn";
		
		DataColumn.sorted = false;
		
		DataColumn.parnet = parent;
		
		DataColumn.show = true,
		
		DataColumn.add = function(value){
			dataSet._load(this,value); 
		}
	
		DataColumn.insert = function(value,values){
			return dataSet._insert(this,value,values); 	
		}
		
		//在一个位置插入列
		//参数:
		//  row : 行数
		//  value : 名字
		DataColumn.insertAt = function(row,value,values){
			return dataSet._insertAt(this,row,value,values);
		};

		//在这行查找值,返回索引,找不到 返回 -1
		//参数:
		//  name : 名字
		DataColumn.indexOf = function(name){
			return dataSet._indexOf(this,name);
			
		};
		
		//根据索引得到这一行所在索引位置的值
		//参数:
		//  value : 值
		DataColumn.getAt = function(value){
			return dataSet._getAt(this,value); 
			
			
		};		
		
		//删除一列
		//参数:
		//  row : 名字
		DataColumn.remove = function(row){
			dataSet._remove(this,row);
		};
			
		//删除一列
		//参数:
		//  table : 行数
		DataColumn.removeAt = function(row){
			dataSet._removeAt(this,row);
		};
		
		DataColumn.loadData = function(vals){
			dataSet._load(this,vals);
		}
		//搜索列是否存在
		//参数:
		//  table : 名字
		DataColumn.search = function(row){
			return !!this[row];
			
		}	
		
		DataColumn.loadData(vals);
		return DataColumn;
		
	}
	
	function isArray(a){
		return typeof a == "object" && (a.constructor ==Array || typeof a.sort=="function" && !isNaN(a.length)) && !a.xType;
		
	}
	//表的一行
   playDataRow = function(name,vals,parent){
	  
	    var DataRow = new Array();
		
		DataRow.xType = "playDataRow";
		
		DataRow.title = parent.title;
		//名字
		DataRow.name = name;
		
		DataRow.parent = parent;
		
		DataRow.sorted = false;
		
		DataRow.show = true,
		
		//插入列到末尾
		//参数:
		//  value : 名字
		DataRow.insert = function(value,values){
			return dataSet._insert(this,value,values);
		};
		
		//在一个位置插入列
		//参数:
		//  row : 行数
		//  value : 名字
		DataRow.insertAt = function(row,value,values){
			return dataSet._insertAt(this,row,value,values);
		};

		//载入到一个数组
		DataRow.loadData =function(value){
			dataSet._load(this,value);
		};
		
		//结合标题
		DataRow.bind = function(v){
			for(var i=0;i<v.length;i++)
				this[v[i]] = this[i];
			
		}
		
		//在这行查找值,返回索引,找不到 返回 -1
		//参数:
		//  name : 名字
		DataRow.indexOf = function(name){
			return dataSet._indexOf(this,name);
			
		};
	
		//根据索引得到这一行所在索引位置的值
		//参数:
		//  value : 值
		DataRow.getAt = function(value){
			return dataSet._getAt(this,value); 
			
			
		};		
		
		//删除一列
		//参数:
		//  row : 名字
		DataRow.remove = function(row){
			dataSet.remove(this,row);
		};
			
		//删除一列
		//参数:
		//  table : 行数
		DataRow.removeAt = function(row){
			dataSet.removeAt(this,row);
		};
			
		//搜索列是否存在
		//参数:
		//  table : 名字
		DataRow.search = function(row){
			return !!this[row];
			
		}
		
		//主索引
		DataRow.key = 0;
		
		DataRow.loadData(vals);
		
		DataRow.bind(DataRow.title);
		
		return DataRow;
	};
}