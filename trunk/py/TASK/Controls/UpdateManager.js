
Ext.UpdateManager = function(el, forceNew){
    el = Ext.get(el);
    if(!forceNew && el.updateManager){
        return el.updateManager;
    }
    
    this.el = el;
    
    this.defaultUrl = null;
    
    this.addEvents({
        
        "beforeupdate": true,
        
        "update": true,
        
        "failure": true
    });
    var d = Ext.UpdateManager.defaults;
    
    this.sslBlankUrl = d.sslBlankUrl;
    
    this.disableCaching = d.disableCaching;
    
    this.indicatorText = d.indicatorText;
    
    this.showLoadIndicator = d.showLoadIndicator;
    
    this.timeout = d.timeout;
    
    
    this.loadScripts = d.loadScripts;
    
    
    this.transaction = null;
    
    
    this.autoRefreshProcId = null;
    
    this.refreshDelegate = this.refresh.createDelegate(this);
    
    this.updateDelegate = this.update.createDelegate(this);
    
    this.formUpdateDelegate = this.formUpdate.createDelegate(this);
    
    this.successDelegate = this.processSuccess.createDelegate(this);
    
    this.failureDelegate = this.processFailure.createDelegate(this);
     
     
    this.renderer = new Ext.UpdateManager.BasicRenderer();

    Ext.UpdateManager.superclass.constructor.call(this);
};

Ext.extend(Ext.UpdateManager, Ext.util.Observable, {
    
    getEl : function(){
        return this.el;
    },
    
    update : function(url, params, callback, discardUrl){
        if(this.fireEvent("beforeupdate", this.el, url, params) !== false){
            var method = this.method;
            if(typeof url == "object"){ 
                var cfg = url;
                url = cfg.url;
                params = params || cfg.params;
                callback = callback || cfg.callback;
                discardUrl = discardUrl || cfg.discardUrl;
                if(callback && cfg.scope){
                    callback = callback.createDelegate(cfg.scope);
                }
                if(typeof cfg.method != "undefined"){method = cfg.method;};
                if(typeof cfg.nocache != "undefined"){this.disableCaching = cfg.nocache;};
                if(typeof cfg.text != "undefined"){this.indicatorText = '<div class="loading-indicator">'+cfg.text+"</div>";};
                if(typeof cfg.scripts != "undefined"){this.loadScripts = cfg.scripts;};
                if(typeof cfg.timeout != "undefined"){this.timeout = cfg.timeout;};
            }
            this.showLoading();
            if(!discardUrl){
                this.defaultUrl = url;
            }
            if(typeof url == "function"){
                url = url.call(this);
            }
            if(typeof params == "function"){
                params = params();
            }
            if(params && typeof params != "string"){ 
                var buf = [];
                for(var key in params){
                    if(typeof params[key] != "function"){
                        buf.push(encodeURIComponent(key), "=", encodeURIComponent(params[key]), "&");
                    }
                }
                delete buf[buf.length-1];
                params = buf.join("");
            }
            var cb = {
                success: this.successDelegate,
                failure: this.failureDelegate,
                timeout: (this.timeout*1000),
                argument: {"url": url, "form": null, "callback": callback, "params": params}
            };
            method = method || (params ? "POST" : "GET");
            if(method == "GET"){
                url = this.prepareUrl(url);
            }
            this.transaction = Ext.lib.Ajax.request(method, url, cb, params);
        }
    },
    
    
    formUpdate : function(form, url, reset, callback){
        if(this.fireEvent("beforeupdate", this.el, form, url) !== false){
            formEl = Ext.getDom(form);
            if(typeof url == "function"){
                url = url.call(this);
            }
            if(typeof params == "function"){
                params = params();
            }
            url = url || formEl.action;
            var cb = {
                success: this.successDelegate,
                failure: this.failureDelegate,
                timeout: (this.timeout*1000),
                argument: {"url": url, "form": formEl, "callback": callback, "reset": reset}
            };
            var isUpload = false;
            var enctype = formEl.getAttribute("enctype");
            if(enctype && enctype.toLowerCase() == "multipart/form-data"){
                isUpload = true;
                cb.upload = this.successDelegate;
            }
            this.transaction = Ext.lib.Ajax.formRequest(formEl, url, cb, null, isUpload, this.sslBlankUrl);
            this.showLoading.defer(1, this);
        }
    },
    
    
    refresh : function(callback){
        if(this.defaultUrl == null){
            return;
        }
        this.update(this.defaultUrl, null, callback, true);
    },
    
    
    startAutoRefresh : function(interval, url, params, callback, refreshNow){
        if(refreshNow){
            this.update(url || this.defaultUrl, params, callback, true);
        }
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
        }
        this.autoRefreshProcId = setInterval(this.update.createDelegate(this, [url || this.defaultUrl, params, callback, true]), interval*1000);
    },
    
    
     stopAutoRefresh : function(){
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
            delete this.autoRefreshProcId;
        }
    },

    isAutoRefreshing : function(){
       return this.autoRefreshProcId ? true : false;  
    },
    
    showLoading : function(){
        if(this.showLoadIndicator){
            this.el.update(this.indicatorText);
        }
    },
    
    
    prepareUrl : function(url){
        if(this.disableCaching){
            var append = "_dc=" + (new Date().getTime());
            if(url.indexOf("?") !== -1){
                url += "&" + append;
            }else{
                url += "?" + append;
            }
        }
        return url;
    },
    
    
    processSuccess : function(response){
        this.transaction = null;
        if(response.argument.form && response.argument.reset){
            try{ 
                response.argument.form.reset();
            }catch(e){}
        }
        if(this.loadScripts){
            this.renderer.render(this.el, response, this, 
                this.updateComplete.createDelegate(this, [response]));
        }else{
            this.renderer.render(this.el, response, this);
            this.updateComplete(response);
        }
    },
    
    updateComplete : function(response){
        this.fireEvent("update", this.el, response);
        if(typeof response.argument.callback == "function"){
            response.argument.callback(this.el, true, response);
        }
    },
    
    
    processFailure : function(response){
        this.transaction = null;
        this.fireEvent("failure", this.el, response);
        if(typeof response.argument.callback == "function"){
            response.argument.callback(this.el, false, response);
        }
    },
    
    
    setRenderer : function(renderer){
        this.renderer = renderer;
    },
    
    getRenderer : function(){
       return this.renderer;  
    },
    
    
    setDefaultUrl : function(defaultUrl){
        this.defaultUrl = defaultUrl;
    },
    
    
    abort : function(){
        if(this.transaction){
            Ext.lib.Ajax.abort(this.transaction);
        }
    },
    
    
    isUpdating : function(){
        if(this.transaction){
            return Ext.lib.Ajax.isCallInProgress(this.transaction);
        }
        return false;
    }
});


   Ext.UpdateManager.defaults = {
       
         timeout : 30,
         
         
        loadScripts : false,
         
        
        sslBlankUrl : (Ext.SSL_SECURE_URL || "javascript:false"),
        
        disableCaching : false,
        
        showLoadIndicator : true,
        
        indicatorText : '<div class="loading-indicator">Loading...</div>'
   };


Ext.UpdateManager.updateElement = function(el, url, params, options){
    var um = Ext.get(el, true).getUpdateManager();
    Ext.apply(um, options);
    um.update(url, params, options ? options.callback : null);
};

Ext.UpdateManager.update = Ext.UpdateManager.updateElement;
 
Ext.UpdateManager.BasicRenderer = function(){};

Ext.UpdateManager.BasicRenderer.prototype = {
    
     render : function(el, response, updateManager, callback){
        el.update(response.responseText, updateManager.loadScripts, callback);
    }
};

