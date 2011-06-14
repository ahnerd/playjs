


/// <summary>
	/// 判断请求是否修改
	/// </summary>
	/// <params name="xhr" type="XMLHttpRequest">请求</params>
	/// <params name="url" type="String">地址</params>
	/// <returns type="Boolean">布尔</returns>
	XMLHttpRequest.httpNotModified = function( xhr, url ){
		try{
			var xhrRes = xhr.getResponseHeader('Last-Modified');
	
			// 火狐返回状态  200.检查是否修改
			return xhr.status == 304 || xhrRes == XMLHttpRequest.lastModified[url];
		}catch(e){}
		return false;
	 }