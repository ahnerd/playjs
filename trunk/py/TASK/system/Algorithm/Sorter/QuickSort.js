//===========================================
//  快速排序算法   Shell.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.namespace("System.Algorithm.Sorter.QuickSort");
Py.using("System.Algorithm.Sorter.Sort");

/**
 * 对集合进行快速排序。
 * @param {Object} iterater 集合。
 * @param {Number} start 开始排序的位置。
 * @param {Number} end 结束排序的位置。
 * @param {Function} fn 比较函数。
 */
Py.namespace("Py.Sorter", "quickSort", function(iterater, start, end, fn, me){

    if (!me) {
        me = Py.Sorter;
        var info = me._setup(iterater, start, end, fn);
        start = info[0];
        end = info[1];
        fn = info[2];
    }
    
    var i = start, j = end, temp = iterater[i];
    do {
        while (!fn(iterater[j], temp) && (j > i)) 
            j--;
        if (i < j) {
            me._swap(iterater, i++, j);
        }
        while (fn(iterater[i], temp) && (i < j)) 
            i++;
        if (i < j) {
            me._swap(iterater, j--, i);
        }
    } while (i < j);//如果两边扫描的下标交错，就停止（完成一次）
    
	if (temp != undefined) iterater[i] = temp;
    
	if (start < end) {
        me.quickSort(iterater, start, i - 1, fn, me);
        me.quickSort(iterater, i + 1, end, fn, me);
    }
	
	return iterater;
});



