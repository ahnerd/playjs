//===========================================
//  查询   querystring.js
//  Copyright(c) 2009-2010 xuld
//===========================================

// TODO

(function(q){
        var search = location.search,
        	dc = decodeURIComponent;
		if(!search) return;
		search.substring(1).split('&').each(function(value){
		    value = value.split('=');
		    q[dc(value[0])] = value.length > 1 ? dc(value[1]) : null;
		});
})(location.queryString = {});