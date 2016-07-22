var checkValue = document.querySelector(".check");
var button = document.querySelector(".button");
var result = document.querySelector(".result");

button.addEventListener("click",check);

function check(){
	if(countLength(checkValue.value) == 0){
		result.innerHTML = "姓名不能为空";
		result.style.color = "red";
		checkValue.style.border = "1px solid red";
	}else if(countLength(checkValue.value) >= 4 && countLength(checkValue.value) <= 16){
		result.innerHTML = "名称格式正确";
		result.style.color = "#6fd153";
		checkValue.style.border = "1px solid #6fd153";
	}else{
		result.innerHTML = "请输入4~16个字符";
		result.style.color = "red";
		checkValue.style.border = "1px solid red";
	}
}

function countLength(str){
	var inputLength = 0;
	for(var i=0,len=str.length; i<len; i++){
		if(str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 128){
			inputLength += 1;
		}else{
			inputLength += 2;
		}
	}
	return inputLength;
}