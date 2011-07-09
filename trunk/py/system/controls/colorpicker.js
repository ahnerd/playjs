/*

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML><HEAD>

<META http-equiv=Content-Type content="text/html; charset=gb2312">
<LINK href="color.css" type=text/css rel=stylesheet>
<SCRIPT language="JAVASCRIPT" src="config.js"></SCRIPT>
<SCRIPT language="JavaScript">

document.write("<TITLE>" + sTitle + "</TITLE>");
//====================================================
//  ��ɫѡ����   xuld
//====================================================

var tc=window.location.href.toString();
tc=tc.substr(tc.lastIndexOf("?")+1);
getcolor = tc || getcolor;
var oSelection;
var oControl;
var sRangeType;
// �Ƿ���Ч��ɫֵ
function IsColor(color){
	var temp=color;
	if (temp=="") return true;
	if (temp.length!=7) return false;
	return (temp.search(/\#[a-fA-F0-9]{6}/) != -1);
}

// ֻ������������
function IsDigit(){
  return ((event.keyCode >= 48) && (event.keyCode <= 57));
}

// ѡ��ɫ
function SelectColor(what){
	var dEL = document.all("d_"+what);
	var sEL = document.all("s_"+what);
	var url = "selcolor.htm?color="+encodeURIComponent(dEL.value);
	var arr = showModalDialog(url,window,"dialogWidth:280px;dialogHeight:250px;help:no;scroll:no;status:no");
	if (arr) {
		dEL.value=arr;
		sEL.style.backgroundColor=arr;
	}
}



// ���ر�ǩ���ѡ���ؼ�
function GetControl(obj, sTag){
	obj=obj.item(0);
	if (obj.tagName==sTag){
		return obj;
	}
	return null;
}

// ��ֵתΪRGB16������ɫ��ʽ
function N2Color(s_Color){
	s_Color = s_Color.toString(16);
	switch (s_Color.length) {
	case 1:
		s_Color = "0" + s_Color + "0000"; 
		break;
	case 2:
		s_Color = s_Color + "0000";
		break;
	case 3:
		s_Color = s_Color.substring(1,3) + "0" + s_Color.substring(0,1) + "00" ;
		break;
	case 4:
		s_Color = s_Color.substring(2,4) + s_Color.substring(0,2) + "00" ;
		break;
	case 5:
		s_Color = s_Color.substring(3,5) + s_Color.substring(1,3) + "0" + s_Color.substring(0,1) ;
		break;
	case 6:
		s_Color = s_Color.substring(4,6) + s_Color.substring(2,4) + s_Color.substring(0,2) ;
		break;
	default:
		s_Color = "";
	}
	return '#' + s_Color;
}

// ��ʼֵ
function InitDocument(){
	ShowColor.bgColor = color;
	RGB.innerHTML = color;
	SelColor.value = color;
}


var SelRGB = color;
var DrRGB = '';

var hexch = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');

function ToHex(n) {	
	var h, l;

	n = Math.round(n);
	l = n % 16;
	h = Math.floor((n / 16)) % 16;
	return (hexch[h] + hexch[l]);
}

function DoColor(c, l){
	var r, g, b;

	r = '0x' + c.substring(1, 3);
	g = '0x' + c.substring(3, 5);
	b = '0x' + c.substring(5, 7);

	if(l > 120){
		l = l - 120;

		r = (r * (120 - l) + 255 * l) / 120;
		g = (g * (120 - l) + 255 * l) / 120;
		b = (b * (120 - l) + 255 * l) / 120;
	}else{
		r = (r * l) / 120;
		g = (g * l) / 120;
		b = (b * l) / 120;
	}

	return '#' + ToHex(r) + ToHex(g) + ToHex(b);
}

function EndColor(){
	var i;

	if(DrRGB != SelRGB){
		DrRGB = SelRGB;
		for(i = 0; i <= 30; i ++)
		GrayTable.rows(i).bgColor = DoColor(SelRGB, 240 - i * 8);
	}

	SelColor.value = DoColor(RGB.innerText, GRAY.innerText);
	ShowColor.bgColor = SelColor.value;
}
</SCRIPT>

<SCRIPT language=JavaScript event=onclick for=ColorTable>
	SelRGB = event.srcElement.bgColor;
	EndColor();
</SCRIPT>

<SCRIPT language=JavaScript event=onmouseover for=ColorTable>
	RGB.innerText = event.srcElement.bgColor;
	EndColor();
</SCRIPT>

<SCRIPT language=JavaScript event=onmouseout for=ColorTable>
	RGB.innerText = SelRGB;
	EndColor();
</SCRIPT>

<SCRIPT language=JavaScript event=onclick for=GrayTable>
	SelGRAY = event.srcElement.title;
	EndColor();
</SCRIPT>

<SCRIPT language=JavaScript event=onmouseover for=GrayTable>
	GRAY.innerText = event.srcElement.title;
	EndColor();
</SCRIPT>

<SCRIPT language=JavaScript event=onmouseout for=GrayTable>
	GRAY.innerText = SelGRAY;
	EndColor();
</SCRIPT>

<SCRIPT language=JavaScript event=onclick for=Ok>
	color = SelColor.value;
	if (!IsColor(color)){
		alert('��Ч����ɫֵ��');
		return;
	}
	if(window.opener != null && window.opener != 'undefined'){
		window.opener.document.getElementById(getcolor).value = color;
		window.close();
	}else{
		try{
			return typeof getcolor=="undefinded"?"":getcolor(color);
		}catch(e){window.close();};
		
	}
</SCRIPT>

<META content="MSHTML 6.00.6001.18000" name=GENERATOR></HEAD>
<BODY bgColor=menu onload=InitDocument()>
<DIV align=center>
<CENTER>
<TABLE cellSpacing=10 cellPadding=0 border=0>
  <TBODY>
  <TR>
    <TD>
      <TABLE id=ColorTable style="CURSOR: hand" cellSpacing=0 cellPadding=0 border=0>
        <SCRIPT language=JavaScript>
function wc(r, g, b, n){
	r = ((r * 16 + r) * 3 * (15 - n) + 0x80 * n) / 15;
	g = ((g * 16 + g) * 3 * (15 - n) + 0x80 * n) / 15;
	b = ((b * 16 + b) * 3 * (15 - n) + 0x80 * n) / 15;

	document.write('<TD BGCOLOR=#' + ToHex(r) + ToHex(g) + ToHex(b) + ' height=8 width=8></TD>');
}

var cnum = new Array(1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0);

for(i = 0; i < 16; i ++){
	document.write('<TR>');
	for(j = 0; j < 30; j ++){
		n1 = j % 5;
		n2 = Math.floor(j / 5) * 3;
		n3 = n2 + 3;

		wc((cnum[n3] * n1 + cnum[n2] * (5 - n1)),
		(cnum[n3 + 1] * n1 + cnum[n2 + 1] * (5 - n1)),
		(cnum[n3 + 2] * n1 + cnum[n2 + 2] * (5 - n1)), i);
	}

	document.writeln('</TR>');
}
</SCRIPT>

        <TBODY></TBODY></TABLE></TD>
    <TD>
      <TABLE id=GrayTable style="CURSOR: hand" cellSpacing=0 cellPadding=0 
      border=0>
        <SCRIPT language=JavaScript>
for(i = 255; i >= 0; i -= 8.5)
document.write('<TR BGCOLOR=#' + ToHex(i) + ToHex(i) + ToHex(i) + '><TD TITLE=' + Math.floor(i * 16 / 17) + ' height=4 width=20></TD></TR>');
</SCRIPT>

        <TBODY></TBODY></TABLE></TD></TR></TBODY></TABLE></CENTER></DIV>
<DIV align=center>
<CENTER>
<TABLE cellSpacing=10 cellPadding=0 border=0>
  <TBODY>
  <TR>
    <TD align=middle rowSpan=2>ѡ��ɫ�� 
      <TABLE id=ShowColor height=30 cellSpacing=0 cellPadding=0 width=40 
      border=0>
        <TBODY>
        <TR>
          <TD></TD></TR></TBODY></TABLE></TD>
    <TD rowSpan=2>��ɫ: <SPAN id=RGB></SPAN><BR>����: <SPAN 
      id=GRAY>120</SPAN><BR>����: <INPUT id=SelColor maxLength=7 size=7></TD>
    <TD><BUTTON id=Ok type=submit>ȷ��</BUTTON></TD></TR>
  <TR>
    <TD><BUTTON 
onclick=window.close();>ȡ��</BUTTON></TD></TR></TBODY></TABLE></CENTER></DIV></BODY></HTML>


BODY {
	BORDER-RIGHT: #ffffff 0pt solid; BORDER-TOP: #ffffff 0pt solid; SCROLLBAR-FACE-COLOR: #f0f0f0; FONT-SIZE: 9pt; BACKGROUND: url(bg.gif) #e5eef5 repeat-y center 50%; MARGIN: 0px; SCROLLBAR-HIGHLIGHT-COLOR: #003366; BORDER-LEFT: #ffffff 0pt solid; SCROLLBAR-SHADOW-COLOR: #003366; COLOR: #666666; SCROLLBAR-3DLIGHT-COLOR: #f0f0f0; LINE-HEIGHT: 160%; SCROLLBAR-ARROW-COLOR: #000000; SCROLLBAR-TRACK-COLOR: #f0f0f0; BORDER-BOTTOM: #ffffff 0pt solid; FONT-STYLE: normal; FONT-FAMILY: "����"; SCROLLBAR-DARKSHADOW-COLOR: #f0f0f0; SCROLLBAR-BASE-COLOR: #f0f0f0
}
DIV {
	COLOR: #006699; LINE-HEIGHT: 15pt
}
FORM {
	COLOR: #006699; LINE-HEIGHT: 15pt
}
TABLE {
	COLOR: #006699; LINE-HEIGHT: 15pt
}

TABLE TD {
	
}
TABLE TD IMG {
	BORDER-RIGHT: #999999 1px solid; BORDER-TOP: #999999 1px solid; BORDER-LEFT: #999999 1px solid; BORDER-BOTTOM: #999999 1px solid
}




*/
