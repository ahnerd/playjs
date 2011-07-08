//===========================================
//  让元素对齐到            align.js    A
//===========================================



/**
 * 获取一个节点对齐到另外节点后实际位置。
 */
Py.Element.getAlignedPosition = function(target, elem, position, offsets){
	
};

Py.Element.implement({
	
	
// 	
	  // getAlignToXY : function(el, p, o){
        // el = Ext.get(el), d = this.dom;
        // if(!el.dom){
            // throw "Element.alignTo with an element that doesn't exist";
        // }
        // var c = false; 
        // var p1 = "", p2 = "";
        // o = o || [0,0];
// 
        // if(!p){
            // p = "tl-bl";
        // }else if(p == "?"){
            // p = "tl-bl?";
        // }else if(p.indexOf("-") == -1){
            // p = "tl-" + p;
        // }
        // p = p.toLowerCase();
        // var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
        // if(!m){
           // throw "Element.alignTo with an invalid alignment " + p;
        // }
        // p1 = m[1], p2 = m[2], c = m[3] ? true : false;
// 
//         
//         
        // var a1 = this.getAnchorXY(p1, true);
        // var a2 = el.getAnchorXY(p2, false);
        // var x = a2[0] - a1[0] + o[0];
        // var y = a2[1] - a1[1] + o[1];
        // if(c){
//             
            // var w = this.getWidth(), h = this.getHeight(), r = el.getRegion();
//             
            // var dw = D.getViewWidth()-5, dh = D.getViewHeight()-5;
// 
//             
//             
//             
            // var p1y = p1.charAt(0), p1x = p1.charAt(p1.length-1);
           // var p2y = p2.charAt(0), p2x = p2.charAt(p2.length-1);
           // var swapY = ((p1y=="t" && p2y=="b") || (p1y=="b" && p2y=="t"));
           // var swapX = ((p1x=="r" && p2x=="l") || (p1x=="l" && p2x=="r"));
// 
           // var doc = document;
           // var scrollX = (doc.documentElement.scrollLeft || doc.body.scrollLeft || 0)+5;
           // var scrollY = (doc.documentElement.scrollTop || doc.body.scrollTop || 0)+5;
// 
           // if((x+w) > dw){
               // x = swapX ? r.left-w : dw-w;
           // }
           // if(x < scrollX){
               // x = swapX ? r.right : scrollX;
           // }
           // if((y+h) > dh){
               // y = swapY ? r.top-h : dh-h;
           // }
           // if (y < scrollY){
               // y = swapY ? r.bottom : scrollY;
           // }
        // }
        // return [x,y];
    // }
// 	
// 	
// 	
// 	
// 	
// 	
// 	
// 	
// 	
    // getConstrainToXY : function(){
        // var os = {top:0, left:0, bottom:0, right: 0};
// 
        // return function(el, local, offsets){
            // el = Ext.get(el);
            // offsets = offsets ? Ext.applyIf(offsets, os) : os;
// 
            // var vw, vh, vx = 0, vy = 0;
            // if(el.dom == document.body || el.dom == document){
                // vw = Ext.lib.Dom.getViewWidth();
                // vh = Ext.lib.Dom.getViewHeight();
            // }else{
                // vw = el.dom.clientWidth;
                // vh = el.dom.clientHeight;
                // if(!local){
                    // var vxy = el.getXY();
                    // vx = vxy[0];
                    // vy = vxy[1];
                // }
            // }
// 
            // var s = el.getScroll();
// 
            // vx += offsets.left + s.left;
            // vy += offsets.top + s.top;
// 
            // vw -= offsets.right;
            // vh -= offsets.bottom;
// 
            // var vr = vx+vw;
            // var vb = vy+vh;
// 
            // var xy = !local ? this.getXY() : [this.getLeft(true), this.getTop(true)];
            // var x = xy[0], y = xy[1];
            // var w = this.dom.offsetWidth, h = this.dom.offsetHeight;
// 
//             
            // var moved = false;
// 
//             
            // if((x + w) > vr){
                // x = vr - w;
                // moved = true;
            // }
            // if((y + h) > vb){
                // y = vb - h;
                // moved = true;
            // }
//             
            // if(x < vx){
                // x = vx;
                // moved = true;
            // }
            // if(y < vy){
                // y = vy;
                // moved = true;
            // }
            // return moved ? [x, y] : false;
        // };
    // }(),
	
alignTo : function(element, position, offsets){
        var xy = this.getAlignToXY(element, position, offsets);
        this.setXY(xy, this.preanim(arguments, 3));
        return this;
    }


})