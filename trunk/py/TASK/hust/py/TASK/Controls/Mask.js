   
    mask : function(msg, msgCls){
        if(this.getStyle("position") == "static"){
            this.setStyle("position", "relative");
        }
        if(!this._mask){
            this._mask = Ext.DomHelper.append(this.dom, {tag:"div", cls:"ext-el-mask"}, true);
        }
        this.addClass("x-masked");
        this._mask.setDisplayed(true);
        if(typeof msg == 'string'){
            if(!this._maskMsg){
                this._maskMsg = Ext.DomHelper.append(this.dom, {tag:"div", cls:"ext-el-mask-msg", cn:{tag:'div'}}, true);
            }
            var mm = this._maskMsg;
            mm.dom.className = msgCls ? "ext-el-mask-msg " + msgCls : "ext-el-mask-msg";
            mm.dom.firstChild.innerHTML = msg;
            mm.setDisplayed(true);
            mm.center(this);
        }
        return this._mask;
    },
    
    
    unmask : function(removeEl){
        if(this._mask){
            if(removeEl === true){
                this._mask.remove();
                delete this._mask;
                if(this._maskMsg){
                    this._maskMsg.remove();
                    delete this._maskMsg;
                }
            }else{
                this._mask.setDisplayed(false);
                if(this._maskMsg){
                    this._maskMsg.setDisplayed(false);
                }
            }
        }
        this.removeClass("x-masked");
    },

    
    isMasked : function(){
        return this._mask && this._mask.isVisible();
    },
