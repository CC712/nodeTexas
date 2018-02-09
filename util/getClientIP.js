//获取url请求客户端ip
var get_client_ip = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
    	req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
//  if(ip.split(',').length>0){
//      ip = ip.split(',')[0]
//  }
	if (ip.substr(0, 7) == "::ffff:") {
  		ip = ip.substr(7)
	}
    return ip;
};
exports.getClientIp = get_client_ip