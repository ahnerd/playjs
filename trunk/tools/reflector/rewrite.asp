<% @language="javascript" %>
<% var def = String(Request("t"));


var link;
                try{
                        link = new ActiveXObject("Msxml2.XMLHTTP");
                }catch(e){
                        try{
                                link = new ActiveXObject("Microsoft.XMLHTTP");
                        }catch(e){
                                link = new XMLHttpRequest();
                        }
                }
                link.onreadystatechange = function(){
                        if(link.readyState == 4 && link.status == 200){
                                Response.write(link.responseText);
                        }
                }
                link.open("get",def,false),link.send(null);




%>