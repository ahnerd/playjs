
Ext.Component = function(config){
    config = config || {};
    if(config.tagName || config.dom || typeof config == "string"){         config = {el: config, id: config.id || config};
    }
    this.initialConfig = config;

    Ext.apply(this, config);
    this.addEvents({
        
        disable : true,
        
        enable : true,
        
        beforeshow : true,
        
        show : true,
        
        beforehide : true,
        
        hide : true,
        
        beforerender : true,
        
        render : true,
        
        beforedestroy : true,
        
        destroy : true
    });
    if(!this.id){
        this.id = "ext-comp-" + (++Ext.Component.AUTO_ID);
    }
    Ext.ComponentMgr.register(this);
    Ext.Component.superclass.constructor.call(this);
    this.initComponent();
};

Ext.Component.AUTO_ID = 1000;

Ext.extend(Ext.Component, Ext.util.Observable, {
    
    hidden : false,
    
    disabled : false,
    
    disabledClass : "x-item-disabled",
    
    rendered : false,

    allowDomMove: true,

        ctype : "Ext.Component",

        actionMode : "el",

        getActionEl : function(){
        return this[this.actionMode];
    },

    initComponent : Ext.emptyFn,     
    
    render : function(container, position){
        if(!this.rendered && this.fireEvent("beforerender", this) !== false){
            if(!container && this.el){
                this.el = Ext.get(this.el);
                container = this.el.dom.parentNode;
                this.allowDomMove = false;
            }
            this.container = Ext.get(container);
            this.rendered = true;
            if(position !== undefined){
                if(typeof position == 'number'){
                    position = this.container.dom.childNodes[position];
                }else{
                    position = Ext.getDom(position);
                }
            }
            this.onRender(this.container, position || null);
            if(this.cls){
                this.el.addClass(this.cls);
                delete this.cls;
            }
            if(this.style){
                this.el.applyStyles(this.style);
                delete this.style;
            }
            this.fireEvent("render", this);
            this.afterRender(this.container);
            if(this.hidden){
                this.hide();
            }
            if(this.disabled){
                this.disable();
            }
        }
        return this;
    },

            onRender : function(ct, position){
        if(this.el){
            this.el = Ext.get(this.el);
            if(this.allowDomMove !== false){
                ct.dom.insertBefore(this.el.dom, position);
            }
        }
    },

        getAutoCreate : function(){
        var cfg = typeof this.autoCreate == "object" ?
                      this.autoCreate : Ext.apply({}, this.defaultAutoCreate);
        if(this.id && !cfg.id){
            cfg.id = this.id;
        }
        return cfg;
    },

        afterRender : Ext.emptyFn,

        destroy : function(){
        if(this.fireEvent("beforedestroy", this) !== false){
            this.purgeListeners();
            this.beforeDestroy();
            if(this.rendered){
                this.el.removeAllListeners();
                this.el.remove();
                if(this.actionMode == "container"){
                    this.container.remove();
                }
            }
            this.onDestroy();
            Ext.ComponentMgr.unregister(this);
            this.fireEvent("destroy", this);
        }
    },

    beforeDestroy : function(){

    },

    onDestroy : function(){

    },

    
    getEl : function(){
        return this.el;
    },

    
    getId : function(){
        return this.id;
    },

    
    focus : function(selectText){
        if(this.rendered){
            this.el.focus();
            if(selectText === true){
                this.el.dom.select();
            }
        }
        return this;
    },

        blur : function(){
        if(this.rendered){
            this.el.blur();
        }
        return this;
    },

    
    disable : function(){
        if(this.rendered){
            this.onDisable();
        }
        this.disabled = true;
        this.fireEvent("disable", this);
        return this;
    },

    onDisable : function(){
        this.getActionEl().addClass(this.disabledClass);
        this.el.dom.disabled = true;
    },

    
    enable : function(){
        if(this.rendered){
            this.onEnable();
        }
        this.disabled = false;
        this.fireEvent("enable", this);
        return this;
    },

    onEnable : function(){
        this.getActionEl().removeClass(this.disabledClass);
        this.el.dom.disabled = false;
    },

    
    setDisabled : function(disabled){
        this[disabled ? "disable" : "enable"]();
    },

    
    show: function(){
        if(this.fireEvent("beforeshow", this) !== false){
            this.hidden = false;
            if(this.rendered){
                this.onShow();
            }
            this.fireEvent("show", this);
        }
        return this;
    },

        onShow : function(){
        var st = this.getActionEl().dom.style;
        st.display = "";
        st.visibility = "visible";
    },

    
    hide: function(){
        if(this.fireEvent("beforehide", this) !== false){
            this.hidden = true;
            if(this.rendered){
                this.onHide();
            }
            this.fireEvent("hide", this);
        }
        return this;
    },

        onHide : function(){
        this.getActionEl().dom.style.display = "none";
    },

    
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
        return this;
    },

    
    isVisible : function(){
        return this.getActionEl().isVisible();
    },

    cloneConfig : function(overrides){
        overrides = overrides || {};
        var id = overrides.id || Ext.id();
        var cfg = Ext.applyIf(overrides, this.initialConfig);
        cfg.id = id;         return new this.__extcls(cfg);
    }
});