
    /**是否合法EMAIL字符串.
     * 参见 CC.isMail().
     * @ignore
     */
    mailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
	
	
	

	
/**
 * 表单验证函数.
 * <pre><code>
//密码长度>=6
function checkPassword(v) {
  return v.length >= 6;
}

//两次密码要相同
function isTheSame(v, obj, form) {
  return form ? form.password.value == v: CC.$('password').value == v;
}

//出错时自定回调
function myCallback(msg, obj, form) {
  alert("出错显示的消息是:" + msg + " - 元素:" +
          obj.name + ",所在form:" + (form ? form.id: '无'));
}

//存在Form的例子
function testForm() {
  var result = CC.validate('testForm',
     ['username', '请输入用户名。'],
     ['mail', '邮箱格式不正确。', isMail],
     ['password', '密码长度大于或等于6。', checkPassword],
     //完整的配置示例
     ['password2', '两次密码不一致。', isTheSame,
        {nofocus: false,callback: myCallback,ignoreNull: false}
     ],
     {queryString: true});

  if (result !== false) alert("恭喜，通过验证!提交的字符串是:" + result);

  return result;
}
//无Form的例子.
function testNoForm() {
  var result = CC.validate( //既然没form了,这里不必存入form id作为第一个参数.
   ['username', '请输入用户名。'],
   ['mail', '邮箱格式不正确。', CC.isMail],
   ['password', '密码长度大于或等于6。', checkPassword],
   ['password2', '两次密码不一致。', isTheSame,
        {nofocus: false, callback: myCallback, ignoreNull: false}
   ],
  //函数最后一个参数
  { queryString: true});

  if (result !== false) alert("恭喜，通过验证!提交的字符串是:" + result);

  return result;
}
 * </code></pre>
 * @return {false|Object} 如果设置的queryString:true并通过验证,就返回form的提交字符串,验证失败返回false
 */
        validate: function() {
          var args = CC.$A(arguments),
          form = null;
          //form如果不为空元素,应置于第一个参数中.
          if (!CC.isArray(args[0])) {
            form = CC.$(args[0]);
            args.remove(0);
          }
          //如果存在设置项,应置于最后一个参数中.
          //cfg.queryString = true|false;
          //cfg.callback = function
          //cfg.ignoreNull
          //nofocus:true|false
          var b = CC.isArray(b) ? {}: args.pop();
          var queryStr = b.queryString;
          var result = queryStr ? '': {};
          CC.each(args, function(i, v) {
            //如果在fomr中不存在该name元素,就当id来获得
            var obj = v[0].tagName ? v[0] : form ? form[v[0]] : CC.$(v[0]);
            //if(__debug) console.log('checking field:',v, 'current value:'+obj.value);
            var value = obj.value, msg = v[1], d = typeof v[2] === 'function' ? v[3]:v[2];
            //选项
            if(!d || typeof d != 'object')
              d = b;

            //是否忽略空
            if (!d.ignoreNull &&
            (value == '' || value == null)) {
              //如果不存在回调函数,就调用alert来显示错误信息
              if (!d.callback)
                CC.alert(msg, obj, form);
              //如果存在回调,注意传递的三个参数
              //msg:消息,obj:该结点,form:对应的表单,如果存在的话
              else d.callback(msg, obj, form);
              //出错后是否聚集
              if (!d.nofocus)
                obj.focus();
              result = false;
              return false;
            }
            //自定义验证方法
            if (typeof v[2] === 'function') {
              var ret = v[2](value, obj, form);
              var pass = (ret !== false);
              if (typeof ret === 'string') {
                msg = ret;
                pass = false;
              }

              if (!pass) {
                if (!d.callback) CC.alert(msg, obj, form);
                //同上
                else d.callback(msg, obj, form);

                if (!d.nofocus)
                  obj.focus();
                result = false;
                return false;
              }
            }
            //如果不设置queryString并通过验证,不存在form,就返回一个对象,该对象包含形如{elementName|elementId:value}的数据.
            if (queryStr && !form) {
              result += (result == '') ? ((typeof obj.name === 'undefined' || obj.name==='') ? obj.id : obj.name) + '=' + value: '&' + v[0] + '=' + value;
            } else if (!form) {
              result[v[0]] = value;
            }
          });
          //如果设置的queryString:true并通过验证,就返回form的提交字符串.
          if (result !== false && form && queryStr)
            result = CC.formQuery(form);
          return result;
        }
		
		
		
		
		/**
 * 测试是否为数字
 * @param {Object} ob
 * @return {Boolean}
 */
        isNumber: function(ob) {
            
        }
        ,
/**
 * 测试字符串是否为邮箱格式.
 * @param {String} strMail
 * @return {Boolean}
 */
        isMail : function(strMail) {
            return mailReg.test(strMail);
        },
		
		
		
		
		


}
	,"isNum":function(val){
    	var reg = /[\d|\.|,]+/;
    	return reg.test(val);
	}
	,"isAlphaNum":function (str){
		var result=str.match(/^[a-zA-Z0-9]+$/);
		if(result==null) return false;
		return true;
	}
	,"isInt":function(val){
    	var reg = /\d+/;
    	return reg.test(val);
	}
	,"isEMail":function(email){
    	var reg = /([\w|_|\.|\+]+)@([-|\w]+)\.([A-Za-z]{2,4})/;
    	return reg.test(email);
	}
	,"isDate":function (str){
   		var result=str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
   		if(result==null) return false;
   		var d=new Date(result[1], result[3]-1, result[4]);
   		return (d.getFullYear()==result[1] && d.getMonth()+1==result[3] && d.getDate()==result[4]);
	}
	,"isDateTime":function(val){
		var result=str.match(/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
		if(result==null) return false;
		var d = new Date(result[1], result[3]-1, result[4], result[5], result[6], result[7]);
		return (d.getFullYear()==result[1]&&(d.getMonth()+1)==result[3]&&d.getDate()==result[4]&&d.getHours()==result[5]&&d.getMinutes()==result[6]&&d.getSeconds()==result[7]);
	}
	//���?��һ��ѡ���Ƿ��Ѿ���һ����ѡ�� nameѡ�����name
    ,"isChecked":function(frmname, name){
		var form = document.forms[frmname];
		var eles = form[name];
        if(typeof(eles.length) == "undefined") return eles.checked;
        for(var i=0; i<eles.length; i++){
            if(eles[i].checked) return true;
        }
        return false;
    }
	//���֤�͵����Ա�Ĺ�ϵ
	,"IdCardInfo":function (id){
		var sum=0; var info="";
		
		if(!/(\d){15,19}/.test(id))return false; //非法证号
		var city={11:"����",12:"���",13:"�ӱ�",14:"ɽ��",15:"���ɹ�",21:"����",22:"����",23:"����",31:"�Ϻ�",32:"����",33:"�㽭",34:" ����",35:"����",36:"����",37:"ɽ��",41:"����",42:"����",43:"����",44:"�㶫",45:"����",46:"����",50:"����",51:"�Ĵ�",52:"����",53:"����",54:"����",61:"����",62:"����",63:"�ຣ",64:"����",65:"�½�",71:"̨��",81:"���",82:"����",91:"����"};
		
		if(!/(\d){15,19}/.test(id))return false; //�Ƿ�֤�� 
	
		id=id.replace(/x$/i,"a");
		if(city[parseInt(id.substr(0,2))]==null) return false; //�Ƿ�����
	
		var birthday=id.substr(6,4)+"-"+Number(id.substr(10,2))+"-"+Number(id.substr(12,2));
		var d=new Date(birthday.replace(/-/g,"/"));
		if(birthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false; //�Ƿ����� 
	
		for(var i = 17;i>=0;i --) sum += (Math.pow(2,i) % 11) * parseInt(id.charAt(17 - i),11) 
		if(sum%11!=1) return false; //�Ƿ�֤�� 
	
		return [city[parseInt(id.substr(0,2))]+","+birthday+","+(id.substr(16,1)%2?"��":"Ů")];
	} 
	//�ж��Ƿ��¼
	,"isLogin":function(name){
		var flag=false;
		if(getCookie(name) != null) flag=true;
		return flag;
	}
