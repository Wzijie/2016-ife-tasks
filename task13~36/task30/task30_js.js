var checkValue = document.querySelectorAll(".check");
var button = document.querySelector(".button");
var result = document.querySelector(".result");

//保存验证结果和相应提示
var checkResult = {
	right : false,
	tip : ""
}

//输入提示
var formatTip = ["请输入4~16位字符","请输入6~16位中英文字符","再次输入密码","123@qq.com","请输入11位手机号码"];
var inputList = [document.querySelectorAll(".check")[0],document.querySelectorAll(".check")[1],document.querySelectorAll(".check")[2],document.querySelectorAll(".check")[3],document.querySelectorAll(".check")[4]]

//添加事件
for(var i=0,len=checkValue.length; i<len; i++){
	checkValue[i].index = i;
	checkValue[i].addEventListener("blur",function(event){
		check(event.target);
		//验证结果
		var tipNode = event.target.parentNode.nextElementSibling;
		tipNode.innerHTML = checkResult.tip;
		if(checkResult.right){
			event.target.style.border = "1px solid #61ba44";
			tipNode.style.color = "#61ba44";	
		}else{
			event.target.style.border = "1px solid #e0000d";
			tipNode.style.color = "#e0000d";
		}
	});

	checkValue[i].addEventListener("focus",function(event){
		event.target.style.border = "1px solid #62aeec";
		console.log(inputList.indexOf(event.target));
		//var inputArr = new Array(checkValue);
		var tipNode = event.target.parentNode.nextElementSibling;
		tipNode.innerHTML = formatTip[event.target.index];
		tipNode.style.color = "#aaa";
	});
}

button.addEventListener("click",checkBtn);

//验证函数
function check(input){

	//是否为空
	var str = input.value.trim();
	if(str.length == 0 || str == ""){
		checkResult.right = false;
		checkResult.tip = "输入内容不能为空";
		return;
	}

	//名称验证
	if(input == checkValue[0]){
		var inputLength = 0;
		for(var i=0,len=str.length; i<len; i++){
			if(str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 128){
				inputLength += 1;
			}else{
				inputLength += 2;
			}
		}
		if(inputLength >= 4 && inputLength <= 16){
			checkResult.right = true;
			checkResult.tip = "格式正确";
		}else{
			checkResult.right = false;
			checkResult.tip = "名称格式错误";
		}
	}

	//密码验证
	if(input == checkValue[1]){
		if(str.match(/^[a-zA-Z0-9]{6,16}$/)){
			checkResult.right = true;
			checkResult.tip = "格式正确";
		}else{
			checkResult.right = false;
			checkResult.tip = "密码格式错误";
		}
	}

	//再次输入密码验证
	if(input == checkValue[2]){
		if(str == checkValue[1].value.trim()){
			checkResult.right = true;
			checkResult.tip = "密码一致";
		}else{
			checkResult.right = false;
			checkResult.tip = "密码不一致";
		}
	}

	//邮箱地址验证
	if(input == checkValue[3]){
		if(str.indexOf("@") >= 0){
			checkResult.right = true;
			checkResult.tip = "格式正确";
		}else{
			checkResult.right = false;
			checkResult.tip = "邮箱格式错误";
		}
	}

	//手机号码验证
	if(input == checkValue[4]){
		if(str.match(/^1[0-9]{10}$/)){
			checkResult.right = true;
			checkResult.tip = "格式正确";
		}else{
			checkResult.right = false;
			checkResult.tip = "手机格式错误";
		}
	}

}

//提交按钮循环验证全部表单
function checkBtn(){
	var right = true;
	for(var i=0,len=checkValue.length; i<len; i++){
		check(checkValue[i]);
		var tipNode = checkValue[i].parentNode.nextElementSibling;
		tipNode.innerHTML = checkResult.tip;
		if(checkResult.right){
			checkValue[i].style.border = "1px solid #61ba44";
			tipNode.style.color = "#61ba44";	
		}else{
			checkValue[i].style.border = "1px solid #e0000d";
			tipNode.style.color = "#e0000d";
			right = false;
		}
	}
	if(right){
		alert("提交成功");
	}else{
		alert("提交失败");
	}
}

