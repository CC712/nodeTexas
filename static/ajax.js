function ajax(options = {
  method,
  url,
  data,
  success,
  failure
}) {
  let opt = options || {}
  if(!opt) return false
  opt.method = opt.method || 'GET'
  
  opt.method = opt.method.toUpperCase() || 'GET';
  opt.url = opt.url || '';
  opt.async = opt.async || true;
  opt.data = opt.data || {};
  opt.success = opt.success || function() {};
  // promise 化  时髦一点。。
  return new Promise((resolve, reject)=>{
  	var xhr = null
  
  // 兼容 ie
  if(XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    xhr = new ActiveXObject('Microsoft.XHLHTTP')
  }
  	// **重要** json 格式
  	xhr.responseType = 'json'
  	// CORS
//	xhr.withCredentials = true
  var params = []
  for(let key in opt.data) {
    params.push(`${key}=${opt.data[key]}`)
  }
  var postData = params.join('&')
  if(opt.method === 'GET') {
  	if(params.length > 0)
    xhr.open(opt.method, opt.url + '?' + postData, opt.async);
    else {
    xhr.open(opt.method, opt.url, opt.async);
    	
    }
    xhr.send();
  } else {
    // put delete post
    xhr.open(opt.method, opt.url, opt.async);
    xhr.setRequestHeader("Content-Type", 'application/json;charset=utf-8');
    xhr.send(JSON.stringify(opt.data)); //string
  }
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
    	// response 和 responstxt差别巨大 一个是json 一个是文本
      resolve(xhr.response , xhr);
    } else if(xhr.readyState == 4 && xhr.status !== 200) {
      reject(xhr.response, xhr)
    }
  }
  })
  
}
export default ajax