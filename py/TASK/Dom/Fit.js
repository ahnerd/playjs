


   	
		  
    fitToParent : function(monitorResize, targetParent){
        var p = Ext.get(targetParent || this.dom.parentNode);
        this.setSize(p.getComputedWidth()-p.getFrameWidth('lr'), p.getComputedHeight()-p.getFrameWidth('tb'));
        if(monitorResize === true){
            Ext.EventManager.onWindowResize(this.fitToParent.createDelegate(this, []));
        }
        return this;
    },