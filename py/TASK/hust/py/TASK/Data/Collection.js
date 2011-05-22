//===========================================
//  集合   Collection.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================

namespace("System.Data");

Py.Data.List = Array.extend({

    xType : "List",
    
    constructor : function(array){
        return array;
    },
    
    add : Array.prototype.push,
    
    addRange : function(){
        Array.each(arguments,this.add);
    }

});


Py.Data.Dictionary = Array.extend({

    xType : "Dictionary",
    
    constructor : function(array){
        return array;
    },
    
    add : function(name,value){
        this[name] = value;
        return this;
    },
    
    addRange : function(){
        var me = this;
        Array.each(arguments,function(value,key){
            me[value] = key;
        });
    }

});


Py.Data.OrderList = List.extend({

    xType : "List",

    add : function(value){
        for(var i = 0;i<this.length;i++)
            if(this[i] > value){
                this.insertAt(value,i);
                return;
            }
        this.push(value);
    },
    
    indexOf : function(value,start,end){
        var left = start || 0, right = end || (this.length - left),middle;
        while(left < right){
            middle = parseInt((left + right) / 2);
            if(value == this[middle])
                return middle;
            if(this[middle] < value)
                left = middle + 1;
            else
                right = middle - 1;
        }
    }


});