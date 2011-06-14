//===========================================
//  查询   QueryString.js
//  Copyright(c) 2009-2010 xuld
//===========================================


(function(q){
        var search = location.search;
        var dc = decodeURIComponent;
		if(!search) return;
		search.split('&').each(function(value){
		    value = value.split('=');
		    q[dc(value[0])] = value.length > 1 ? dc(value[1]) : null;
		});
})(location.queryString = []);