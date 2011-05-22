//===========================================
//  集合接口   ICollection.js  MIT LICENCE
//  Copyright(c) 2009-2010 xuld
//===========================================





/// <summary>
/// 集合接口
/// </summary>
/// <type name="Object" />
        
namespace("System.Data", "ICollection", function(p, c){
    
    var ap = Array.prototype;
    
    return {
    
        /// <summary>
        /// 添加
        /// </summary>
        add: function(v) {
            if (!this.onadd || this.onadd(v) !== false) 
                this[this.count++] = v;
            return this;
        },
        
        /// <summary>
        /// 添加
        /// </summary>
        addAt: function(i, v) {
            if (typeof i != "number") 
                return this.add(v);
            if (!this.onadd || this.onadd(v, i) !== false) {
                while (l > i) 
                    this[l] = this[--l];
                this[i] = v;
            }
            return this;
        },
        
        /// <summary>
        /// 删除
        /// </summary>
        remove: ap.remove,
        
        /// <summary>
        /// 删除
        /// </summary>
        clear: function() {
            if (!this.onremove && !this.onremove(null, null, true) !== false) 
                this.count = 0;
            return this;
        },
        
        /// <summary>
        /// 大小
        /// </summary>
        count: 0,
        
        /// <summary>
        /// 删除
        /// </summary>
        splice: function(s, l) {
            var item = [];
            if (this.onremove && this.onremove(this[s], s) === false) 
                return item;
            for (var i = s, e = s + l; i < e && i < this.count; i++) {
                item.push(this[i]);
                this[i] = this[l + i];
            }
            this.count -= i - s;
            return item;
        },
        
        /// <summary>
        /// 遍历
        /// </summary>
        each: function(fn, bind) {
            return Array.each(this, fn, bind);
        },
        
        /// <summary>
        /// 查找
        /// </summary>
        indexOf: ap.indexOf,
        
        /// <summary>
        /// 查找
        /// </summary>
        contain: ap.contain,
        
        /// <summary>
        /// 删除
        /// </summary>
        removeAt: ap.removeAt
        
        
    };
});