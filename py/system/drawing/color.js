//===========================================
//  颜色 Color.js  BSD LICENCE
//  Copyright (c) 2009, Yahoo! Inc. All rights reserved.
//===========================================


Py.namesapce("System.Drawing");


Py.namespace(".Drawing.Color.", function() {
		
	var PARSE_INT = parseInt,
	    RE = RegExp,
		rRGB = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,
		rHex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
		rhex3 = /([0-9A-F])/gi;
	
	return {
	
	    toRGB: function(val) {
	        if (!rRGB.test(val)) {
	            val = this.toHex(val);
	        }
	
	        if(rHex.exec(val)) {
	            val = 'rgb(' + [
	                PARSE_INT(RE.$1, 16),
	                PARSE_INT(RE.$2, 16),
	                PARSE_INT(RE.$3, 16)
	            ].join(', ') + ')';
	        }
	        return val;
	    },
	
	    toHex: function(val) {
	        if (rRGB.exec(val)) {
	            val = [
	                Number(RE.$1).toString(16),
	                Number(RE.$2).toString(16),
	                Number(RE.$3).toString(16)
	            ];
	
	            for (var i = 0; i < val.length; i++) {
	                if (val[i].length < 2) {
	                    val[i] = val[i].replace(rhex3, '$1$1');
	                }
	            }
	
	            val = '#' + val.join('');
	        }
	
	        if (val.length < 6) {
	            val = val.replace(rhex3, '$1$1');
	        }
	
	        if (val !== 'transparent' && val.indexOf('#') < 0) {
	            val = '#' + val;
	        }
	
	        return val.toLowerCase();
	    }
	};
	
	
})();
