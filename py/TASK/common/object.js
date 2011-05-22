//==========================================
// playObject  by xuld
//
//   �����ݵ���
//
//
//����˵��: ����Ҫ���ڴ洢�������ݿ�ṹ�ı��
//              ȫ�ֱ���  DataSet :  ȫ�����ݵļ���
//              һ��DataSet���ж��DataTable  ÿ��DataTable ����һ��DataTitle�Ͷ��DataRow
//              ���ṩUI���档ֻ����Ϊһ������(XML,���ݿ�,JSON)�ӿڡ�
//���ʾ��:
//     /*  js code 
//		* * playObject ���ʾ��
//		* * ����һ����񲢴���һ����
//      */
//          var Table = DataSet.add("�������",["����1","����2","����3"]);    //����һ�����,������������Щ����
//			Table.add(["��һ�е�1��","��һ�е�2��","��һ�е�3��"],"����1");           //����һ��
//          Table.add(["�ڶ��е�1��","�ڶ��е�2��","�ڶ��е�3��"],"����2");           //����һ��
//			Table["����1"]["����1"] = 3;             // ������������Ϊ����1���еĵ�һ�С�
//			Table[0][3] = 6                          // Ҳ����ʹ������
//			Table.create()                           // ����һ�� <TABLE> ��ǩ,�������һ�����ڵ���,�۲����еı������
//
//����ʾ��:
//       ���÷���˵��: 
//          add   ����һ��
//          del   ɾ��һ��
//          indexOf   ����ָ������������
//          find   ����ָ����������,����Ҳ����й�����,���� -1
//          insert   �ڵ�ǰλ��ĩβ����һ������
//          insertAt   ��һ��λ�ò���һ������
//          remove   ��������ɾ��,���Դ���һ������
//          removeAt   ��������ɾ��
//          search   ���ص�ǰ����ָ������
//          getAt   ����ָ������λ��,�������Խ��,����һ�� NULL
//          length  ����
//          key     ����
//
//       DataSet::add()    ����һ����,����:�����1������ʾ������,���2��,ǰ������Ϊ�����,����Ǳ��⡣
//       DataSet::del()    ɾ��һ����,����:������֡�
//       DataSet::table    ȫ�����ļ���
//                              �������һ������,Ҫʹ��table���ϻ�øñ��     DataSet.table[����]  �� DataSet.table[��]
//       DataSet::count    �����
//       DataSet::xType    Py����������˵��
//       DataTable::addTitle    ���ӱ��ı���,��������������,�򶺺Ÿ������ַ�����
//       DataTable::addTitleAt    ���ӱ��ı��⵽һ��λ��,��һ������Ϊλ��(����),�ڶ���Ϊ����
//       DataTable::render    ��Ⱦ��һ��DIVԪ��
//       DataTable::container    ��ȡһ��<TABLE>
//       DataTable::sort(��,�ȽϺ���,˳��/����,��ʼλ��,����λ��)    ����
//                                 ������ʹ�ý϶�Ĺ���,ʹ�õĲ���ȫ��ѡ,
//                                 ��û����ʱ,��ʹ�����С�
//                                 �ȽϺ���,Ĭ���Ƿ�����С����
//                                       �Ƚк���  2   ������,  ��ʾ 2���С� ����һ������ �� function(x,y){return x<y};  ������  x<y  ����
//                                 ˳��,����:����,ʼ�������෴(Ĭ��true)��   
//                                 ��ʼλ��,��ʼ�����λ�á�  
//       
//==========================================


 /* dataSet
*     by xuld
*      http://www.xuld.net
*   ע�Ͱ�
*
*   �����о���ѧϰ��
*/
if(namespace("playObject")){
	
	//---------------------------------------
	// dataSet 
	//---------------------------------------
	dataSet = function(name){
		var playDataSet = {
			
			//---------------------------------------
			//˽�б���
			//---------------------------------------
			
			//ȫ�����
			table:new Array(),
			
			//�����
			count:0,
			
			//�汾
			version:0.1,

			//�ֱ�		
			xType:"dataSet",

			//���ݴ�������ݷ���һ������
			_getAt:function(t,x){
				if(isNaN(x)){
					return this._indexOf(x);
				}else{
					return x>t.count?null:t[x];
				}
			},

			//����һ��ֵ��ĩβ
			//����:ֵ������,ֵ
			//  value : ����
			//  key : ֵ 
			_insert:function(t,value,key){
				t.key = t.count;
				if(typeof value == "undefined" || value==""){
					t[t.count++] = key;
				}else{
					return t[t.count++] = t[value] = key;
				}
				return t[t.key];
			},
			
			//��һ��λ�ò���һ��ֵ
			//����:
			//  table : λ��
			//  value : ����
			//  key : ֵ
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
			
			//����,��������,�Ҳ��� ���� -1
			//����:
			//  name : ����
			_indexOf:function(t,name){
				for(var i=0;i<t.length;i++)
					if(t[i] &&  t[i].name==name)
						return i;
				return -1;
				
			},
			
			//ɾ��һ��ֵ
			//����:
			//  name : ֵ
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
			
			
			//ɾ��
			//����:
			//  table : ����
			//  ���ر�ɾ���ĸ���
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
			
			//����ֵ������
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
			
			//����ֵΪ����
			_setV : function(t,vals){
				for(var i=0;i<vals.length;i++)
					t[i] = vals[i];
			},
			
			//����һ��ֵ�����Ƿ����
			//����:
			//  table : ����
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
			//����,ʵ���ṩ������
			//---------------------------------------
				
			//��񳤶�
			length:function(){
				return this.table.length;
			},

			//���ݴ�������ݷ���һ�����
			getAt:function(x){
				return this._getAt(this.table,x);
			},
			
			//����һ�����ĩβ
			//����:
			//  value : ֵ
			//  tableName : ����
			//  title : ����
			insert:function(value,tableName,title){
				this.count++;
				return this._insert(this.table,tableName,new PyDataTable({value:value,parent:this,name:tableName,title:title}));
			},
			
			//��һ��λ�ò���һ��ֵ
			//����:
			//  n : ����
			//  value : ֵ
			// tableName: ����
			//  title : ����
			insertAt:function(x,value,tableName,title){
				this.count++;
				return this._insertAt(this.table,x,tableName,new PyDataTable({value:value,parent:this,name:tableName,title:title}));
			},

			//���ұ���,��������,�Ҳ��� ���� -1
			//����:
			//  name : ����
			indexOf:function(tableName){
				return this._indexOf(this.table,tableName);
				
			},

			//ɾ��һ����
			//����:
			//  table : ����
			remove:function(tableName){
				this.count -= this._remove(this.table,tableName);
			},

			//ɾ��һ����
			//����:
			//  table : ������
			removeAt:function(x){
				this.count -= this._removeAt(this.table,x);
			},
			
			//����һ�������Ƿ����
			//����:
			//  table : ����
			search:function(tableName){
				return this._search(this.table,tableName);
				
			},
			
			//����
			key:0
		};
		
		//���һ����  ����
		//  { name:
		//    value:
		//    title:
		//    position:
		//
		//    }
		//  ��ֱ������
		// add λ�� ���� ����
		// ����  isTitle  �Ƿ��value��һ����Ϊtitle��
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

		//ɾ��һ��  ����:λ�ñ���
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
	
	//��ʼ��
	// o Ϊ�������������
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
	
	//���������� [ [],[],[]  ]
	//����:  {"����":[],"��Ϣ":[]
	//  value : ֵ
	//  isTitle : �Ƿ�ѵ�һ�е�����
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

	//����һ���е�ĩβ  ["","ad","wde"]      [],
	// {a:[],c:[]}
	//����:
	//  value : ������,����parent,value,name
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
	
	//����һ���е�ĩβ
	//����:
	//  value : ������
	PyDataTable.prototype.insert = function(value,rowName){
		return dataSet._insert(this,rowName,new PyDataRow({value:value,parent:this,name:rowName}));
	};
	
	//����һ��
	//����:
	//  name : ����
	PyDataTable.prototype.addTitle = function(value){
		this.title.insert(value);
	};  
	
	//����һ��һ��λ��
	PyDataTable.prototype.addTitleAt = function(row,value){
		this.title.insertAt(row,value);
	};  

	//����ȫ������
	PyDataTable.prototype.titleSet = function(value,format){
		this.title.set(value,this,format);
	}; 
	
	//��һ��λ�ò�����
	//����:
	//  row : ����
	//  value : ����
	PyDataTable.prototype.insertAt = function(row,value,rowName){
		return dataSet._insertAt(row,this,rowName,new PyDataRow({value:value,parent:this,name:rowName}));
	};

	//��������,��������,�Ҳ��� ���� -1
	//����:
	//  name : ����
	PyDataTable.prototype.indexOf = function(name){
		return dataSet._indexOf(this);
		
	};
	
	PyDataTable.prototype.count = 0;
	
	//��һ���в���һ����Ԫ��,������,�Ҳ��� ���� -1
	//����:
	//  name : ֵ
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
	
	//����һ����Ԫ��,������������(��,��),�Ҳ��� ���� (-1,-1)
	//����:
	//  value : ֵ
	PyDataTable.prototype.searchOf = function(value){
		for(var i=0;i<this.length;i++)
			for(var j=0;j<this[i].length;j++)
				if(this[i][j]==value)
					return [i,j];
		return [-1,-1];
		
	};		
	
	//ɾ��һ��
	//����:
	//  row : ����
	PyDataTable.prototype.remove = function(row){
		dataSet._remove(this,row);
	};
		
	//ɾ��һ����
	//����:
	//  row : ����
	PyDataTable.prototype.removeAt = function(row){
		dataSet._removeAt(this,row);
	};
		
	//����һ�������Ƿ����
	//����:
	//  table : ����
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
	
	//����������һ��,û�� null
	PyDataTable.prototype.getAt = function(x){
		return dataSet._getAt(x);
	};


	//����  (ð��)
	//����: name id������
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

	//��һ��<table>��ǩ��������
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



	//д��һ��<table>��ǩ
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


	//����������id��
	//����: name id������
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

	//����� ["sd","sad","sad"]   ,   {"a":"type","ad","type"}       "a",
	//����: {name,type}
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
	
	//����һ��
	//��������,��������
	PyDataColumn.prototype.insert = function(name,type){
		return dataSet._insert(this,name,new PyDataTitle({value:name,type:type,parent:this})); 	
	};
	
	//��һ��λ�ò�����
	//����:
	//  row : ����
	//  ��������,��������
	PyDataColumn.prototype.insertAt = function(row,name,type){
		return dataSet._insertAt(this,row,name,new PyDataTitle({value:name,type:type,parent:this}));
	};

	//��������ֵ
	//ֵ������,��Ԫ��,����
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
	
	//�����в���ֵ,��������,�Ҳ��� ���� -1
	//����:
	//  name : ����
	PyDataColumn.prototype.indexOf = function(name){
		return dataSet._indexOf(this,name);
		
	};	
	
	
	//��������ֵ
	//ֵ������
	PyDataColumn.prototype.setTypes = function(value){
		this.types = value;
		for(var i=0;i<this.length;i++)
			this[i].type = value[i];
			//this[this[i]].type
			
	};
	
	//���������õ���һ����������λ�õ�ֵ
	//����:
	//  value : ֵ
	PyDataColumn.prototype.getAt = function(value){
		return dataSet._getAt(this,value); 
		
		
	};		
	
	//ɾ��һ��
	//����:
	//  row : ����
	PyDataColumn.prototype.remove = function(row){
		dataSet._remove(this,row);
	};
	
	//
	PyDataColumn.prototype.sort = function(row){
		this.parent.sort(row);
	}
	
	//ɾ��һ��
	//����:
	//  table : ����
	PyDataColumn.prototype.removeAt = function(row){
		dataSet._removeAt(this,row);
	};
	
	PyDataColumn.prototype.loadData = function(vals){
		dataSet._load(this,vals);
	}

	//�������Ƿ����
	//����:
	//  table : ����
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
	//���һ��
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
	
	//�����е�ĩβ
	//����:
	//  value : ����
	//  title : ����,������
	PyDataRow.prototype.insert = function(value,title){
		return dataSet._insert(this,title,value);
	};
	
	//��һ��λ�ò�����
	//����:
	//  row : ����
	//  value : ����
	PyDataRow.prototype.insertAt = function(row,value,title){
		return dataSet._insertAt(this,row,title,value);
	};

	//���뵽һ������
	PyDataRow.prototype.loadData =function(value){
		dataSet._load(this,value);
	};
	
	//��ϱ���
	PyDataRow.prototype.bind = function(v){
		v = this.title;
		for(var i=0;i<v.length;i++)
			this[v[i]] = this[i];
		
	};
	
	//�����в���ֵ,��������,�Ҳ��� ���� -1
	//����:
	//  name : ����
	PyDataRow.prototype.indexOf = function(name){
		return dataSet._indexOf(this,name);
		
	};

	//���������õ���һ����������λ�õ�ֵ
	//����:
	//  value : ֵ
	PyDataRow.prototype.getAt = function(value){
		return dataSet._getAt(this,value); 	
	};		
	
	//ɾ��һ��
	//����:
	//  row : ����
	PyDataRow.prototype.remove = function(row){
		if(typeof row=="undefined")
			this.parent.remove(this.name);
		dataSet._remove(this,row);
	};

	//ɾ��һ��
	//����:
	//  table : ����
	PyDataRow.prototype.removeAt = function(row){
		dataSet._removeAt(this,row);
	};

	//������  ["ad","asdf"] ,["as":"cz","as":"ad"],{"sd"}
	//����:
	//  row : ����
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
	
	//�������Ƿ����
	//����:
	//  table : ����
	PyDataRow.prototype.search = function(row){
		return !!this[row];
		
	};

	playObject = true;

	if(!window.playString)
	//��ʽ������
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
	
		
	//�ж��Ƿ�����
	function isArray(v){
		return Object.prototype.toString.apply(v) === '[object Array]';
	}
}



function namespace(arg){if(window._system)window._system.push(arg);else window._system = [arg];return eval('typeof ' + arg + '=="undefined" || ' + arg + '.xType != "' + arg + '"');}
