const path = require('path')
// 解决路径回溯 或者深入的问题 全部基于原始文件夹
global.resolvePath = function(p){
	
	return require(path.resolve(p))
}
