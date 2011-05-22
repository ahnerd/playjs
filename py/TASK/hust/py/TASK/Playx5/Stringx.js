//===========================================
//  字符串   Stringx.js  MIT LICENCE
//===========================================

Py.implementIf({

    left : function(length) {
        ///<summary>获取字符串左边 length 长度的子字符串。语法：left(length)</summary>
        ///<param name="length" type="int">要获取的子字符串长度。</param>
        ///<returns type="string">返回字符串左边 length 长度的子字符串。</returns>
            return this.substr(0, length);
        },


    right : function(length) {
        ///<summary>获取字符串右边 length 长度的子字符串。语法：right(length)</summary>
        ///<param name="length" type="int">要获取的子字符串长度。</param>
        ///<returns type="string">返回字符串右边 length 长度的子字符串。</returns>
            return this.substr(this.length - length, length);
        },


    trimLeft : function() {
        ///<summary>获取去除了字符串左端的半角和全角空格之后的字符串。语法：trimLeft()</summary>
        ///<returns type="string">返回去除了字符串左端的半角和全角空格之后的字符串。</returns>
            return this.replace(/^[ 　]+/gi, "");
    },


    trimRight : function() {
    ///<summary>获取去除了字符串右端的半角和全角空格之后的字符串。语法：trimRight()</summary>
    ///<returns type="string">返回去除了字符串右端的半角和全角空格之后的字符串。</returns>
        return this.replace(/[ 　]+$/gi, "");
    },


    padLeft : function(totalWidth, chr) {
        ///<summary>向字符串左端追加一定数量的字符并返回。语法：padLeft(totalWidth, chr)</summary>
        ///<param name="totalWidth" type="int">追加字符后要达到的总长度。</param>
        ///<param name="chr" type="char">要追加的字符。</param>
        ///<returns type="string">返回追加字符后的字符串。</returns>
        var str = "";
        for (var i = 0; i < totalWidth - this.length; i++) {
            str += chr;
        }

        return str + this;
    },


    padRight : function(totalWidth, chr) {
        ///<summary>向字符串右端追加一定数量的字符并返回。语法：padRight(totalWidth, chr)</summary>
        ///<param name="totalWidth" type="int">追加字符后要达到的总长度。</param>
        ///<param name="chr" type="char">要追加的字符。</param>
        ///<returns type="string">返回追加字符后的字符串。</returns>
        var str = "";
        for (var i = 0; i < totalWidth - this.length; i++) {
            str += chr;
        }

        return this + str;
    },


    removeHtml : function() {
        ///<summary>去除字符串中的 HTML 标签并返回。语法：removeHtml()</summary>
        ///<returns type="string">返回去除了 HTML 标签的字符串。</returns>
        return this.replace(/<(.|\n)+?>/gi, "");
    }


});