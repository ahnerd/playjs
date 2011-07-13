//===========================================
//  控件   Control.js
//  Copyright(c) 2009-2010 xuld
//===========================================

namespace("System.Controls.Icon");
using("System.Dom.Element");



namespace("Py.Controls", "Panel", Py.Controls.Control.extend({
	
	xType: 'panel',
	
	tpl: '<div>\
                <div class="x-header">\
                    <div class="x-header-container">\
                    	<div class="x-header-content">\
                    		<h3>&nbsp;</h3>\
						</div>\
                    </div>\
                </div>\
                <div class="x-container">\
                    \
                </div>\
                <div class="x-footer">\
                    <div class="x-footer-container">\
                        <div class="x-footer-content"></div>\
                    </div>\
                </div>\
            </div>\
            ',
	
	init: function(){
		this.dom.className = 'x-' + this.xType;
		this.header = this.dom.select('.x-header-content h3');
		this.content = this.dom.select('.x-container');
	},
	
	/*
addIcon: function(){
		
	},
*/
}).proxy({
	'setText': 'header',
	'appendChild appendHTML': 'content'
}, true)
.proxy({
	'getText': 'header'
})
);