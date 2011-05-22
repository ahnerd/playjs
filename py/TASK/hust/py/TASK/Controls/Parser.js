

(function(){
    var Parser = {
           
           methods : "h w top left val text parent css cssClass data x y height width load render onaddChild onremoveChild ondispose".split(' '),
           
           events : "render addChild removeChild dispose".split(' '), 
           
           _parse: function(methods, control, attributes, event){
               var value, attribute;
               methods.forEach(function(name){
                   if(event){
                       name = "on" + name;
                   }
                   attribute = attributes[name];
                   value = attribute.value;
                   if(!attribute || !attribute.specified || value.indexOf('function(') == 0) return;
                   if (event) {
                       value = Function.create(value);
                   } else {
                       switch (Object.type(control[name])) {
                           case "function":
                               control[name](value);
                               return;case "array":
                               value = eval("([" + value + "])");
                               break;
                           case "object":
                               value = eval("({" + value + "})");
                       }
                   }
                   
                   control[name] = value;
               });
           },
           
           parse: function(control){
               var me = Parser, t, attributes = control.dom.attributes;
               me._parse(me.methods, control, attributes);
               me._parse(me.events, control, attributes, true);
               if(control.getType().parse ){
                   if(t.event)  me._parse(t.event, control, attributes, true);
                   if(t.attibute)  me._parse(t.attibute, control, attributes, false);
               } 
           }
           
            
        };
    });






Object.extend(Control,{

    //判断相关文件已载入。
    _checkControl : function(control){
        alert(control);
        return;
        if(!Py.Controls[control])
            using("System.Controls." + control);
    },

    load : function(htmlconstrol){
        var c = Py.Control.Control._checkControl;
        switch(htmlconstrol.tagName){
            case "INPUT":
                switch(htmlconstrol.type){
                    case "text":
                        c("TextBox");
                        break;
                    case "button":
                        c("Button");
                        break;
                    case "sumbit":
                        c("SubmitButton");
                        break;
                    case "checkbox":
                        c("CheckBox");
                        break;
                    case "radiobox":
                        c("RadioBox");
                        break;
                    case "image":
                        c("ImageButton");
                        break;
                    case "hidden":
                        c("HiddenField");
                        break;
                    case "password":
                        c("PasswordBox");
                        break;
                    default:
                        break;
                
                }
            case "DIV":
                c("Panel");
                break; 
            case "TEXTAREA":
                c("TextArea");
            case "SELECT":
                if(htmlconstrol.size > 1){
                    c("LISTBOX");
                    
                    
                
                
                }else{
                    c("DROPDOWNLIST");
                    
                    
                }
                break;
           case "TABLE":
                c("Table");
                break;
           case "BUTTON":
                c("LinkButton");
                break;
           case "LABEL":
                c("Label");
                break;
           case "A":
                c("HyperLink");
                break;
           case "MAP":
                c("MapImage");
                break;
           case "GROUPBOX":
                c("Literal");
                break;
           case "SCRIPT":
                c("Script");
                break;
           case "IFRAME":
                c("iframe");
                break;
           default:
                c("GenicControl");
                break;
        }
    }




});


(function(){
var cache = Py.Config && Config.catcheControl;
var t = document.getElementsByAttribute("runat","play");
if(cache){
    var dc = document.controls = [];
    Array.each(t, function(Control){
        dc.push(Py.Control.Control.load(htmlconstrol).render());
    }) ;
}else{
    Array.each(t, function(Control){
        Py.Control.Control.load(Control).render();
    }) ;
}
})();


