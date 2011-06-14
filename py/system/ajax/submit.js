//===========================================
//  通过 ajax 的表单提交   Submit.js
//===========================================



Py.using("System.Ajax.Ajax");

/**
 * 通过 ajax 提交一个表单。
 * @param {Object} formId 表单 id 。
 * @param {Object} onsuccess 成功事件。
 * @param {Object} onerror 错误事件。
 * @param {Object} oninit 初始化事件，可以用于检查表单。
 */
Ajax.submit = function(formId, onsuccess, onerror, oninit) {
	formId = Py.$(formId);
	return Ajax[formId.action](HTMLFormElement.param(formId), onsuccess, onerror, oninit);
};

/**
 * 返回一个表单的参数表示形式。
 * @param {HTMLFormElement} formElem 表单元素。
 * @return {String} 参数形式。
 */
Py.namespace("HTMLFormElement", true, {

	"param": function(formElem) {
		assert(formElem && formElem.tagName == "FORM", "formElem 不是合法的 表单 元素");
		var s = [], input, e = encodeURIComponent, value, name;
		for (var i = 0, len = formElem.length; i < len; i++) {
			input = formElem[i];
			if (name = input.name) {
				if (input.type == "select-multiple") {
					var j = input.selectedIndex;
					if (j != -1) {
						input = input.options;
						for (var l = input.length; j < l; j++) {
							if (input[j].selected) {
								s.push(name + "=" + e(input[j].value));
							}
						}
					}
					continue;
				}
				
				
				if (/checkbox|radio/.test(input.type) && input.checked === false) continue;
				s.push(name + "=" + e(input.value));
			}
		}
		
		return s.join('&');
	}
	
});

