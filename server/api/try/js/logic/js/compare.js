/*
 * param poker:array [poker : array, val : number]
 */
function compare(l,r){
	if(l[1] != r[1]){
		return l[1] > r[1] ? r : l
	}else{
		// 同阶牌 比大小
		let bool = false
		let type = l[1]
		// 0 同花顺 比首张的大小和花色
		switch(type){
			case 0 :
			return bool = l[0][0].key > r[0][0].key ?true : false
			default:
			return bool = true
		}
		if(bool)
			return r
		else 
			return l	
	}
}

