function ajax(options = {
  method,
  url,
  data,
  success,
  failure
}) {
  let opt = options || {}
  console.log('**opt**',options)
  if(!opt) return false
  opt.method = opt.method || 'GET'
  opt.method = opt.method.toUpperCase() || 'GET';
  opt.url = opt.url || '';
  opt.async = opt.async || true;
  opt.data = opt.data || null;
  opt.success = opt.success || function() {};
  // promise 化  时髦一点。。
  return new Promise(()=>{
  	var xhr = null
  // 兼容 ie
  if(XMLHttpRequest) {
    xhr = new XMLHttpRequest()
  } else {
    xhr = new ActiveXObject('Microsoft.XHLHTTP')
  }
  var params = []
  for(let key in opt.data) {
    params.push(`${key}=${opt.data[key]}`)
  }
  var query = params.join('&')
  if(opt.method == 'GET') {
  	console.log('#GET#',opt.url,query)
    xhr.open(opt.method, opt.url + '?' + query, opt.async);
    xhr.send(null);
  } else {
    // put delete
    xhr.open(opt.method, opt.url, opt.async);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    console.log('****',opt.data)
    xhr.send(JSON.stringify(opt.data));
  }
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
      return xhr
    } else if(xhr.readyState == 4 && xhr.status !== 200) {
      return new Error(xhr)
    }
  }
  })
  
}
//export default ajax