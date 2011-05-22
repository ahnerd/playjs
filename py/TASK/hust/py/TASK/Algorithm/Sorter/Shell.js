//===========================================
//  希尔排序算法   Shell.js
//  Copyright(c) 2009-2011 xuld
//===========================================

Py.namespace("System.Algorithm.Sorter.Shell");
Py.using("System.Algorithm.Sorter.Sort");

/**
 * 对集合进行希尔排序。
 * @param {Object} iterater 集合。
 * @param {Number} start 开始排序的位置。
 * @param {Number} end 结束排序的位置。
 * @param {Function} fn 比较函数。
 */
Py.namespace("Py.Sorter", "shell", function(iterater, start, end, fn){

    var me = Py.Sorter, info = me._setup(iterater, start, end, fn);
    start = info[0];
    end = info[1];
    fn = info[2];
    for (var gap = (end - start) / 2; gap > 0; gap = parseInt(gap / 2)) {
        for (var i = gap + start; i < end; i++) {
            for (var temp = iterater[i], j = i; (j - gap >= start) && !fn(iterater[j - gap], temp); j -= gap) {
                iterater[j] = iterater[j - gap];
            }
            iterater[j] = temp;
        }
    }
	
	return iterater;
});



