//名称表单数据
var nameData = {
	id: "1",
	label: '名称',                   // 表单标签
    type: 'text',                    // 表单类型
    validator: nameCheck,    		 // 表单验证规
    rules: '必填，长度为4-16个字符', // 填写规则提示
    success: '名称格式正确',         // 验证通过提示
    fail: '请输入4-16位字符'         // 验证失败提示
}

//密码表单数据
var passWordData = {
	id: "2",
	label: '密码',                    // 表单标签
    type: 'text',                     // 表单类型
    validator: passWordCheck,         // 表单验证规
    rules: '必填，长度为6~16个字符',  // 填写规则提示
    success: '密码格式正确',          // 验证通过提示
    fail: '请输入6-16位字符'          // 验证失败提示
}

//再次输入密码表单数据
var passWordRepeatData = {
	id: "3",
	label: '再次输入密码',            // 表单标签
    type: 'text',                     // 表单类型
    validator: passWordRepeatCheck,   // 表单验证规
    rules: '再次输入密码',            // 填写规则提示
    success: '密码一致',              // 验证通过提示
    fail: '密码不一致'                // 验证失败提示
}

//邮箱地址表单数据
var mailAddressData = {
	id: "4",
	label: '邮箱',                    // 表单标签
    type: 'text',                     // 表单类型
    validator: mailAddressCheck,      // 表单验证规
    rules: '123@qq.com',              // 填写规则提示
    success: '邮箱地址格式正确',      // 验证通过提示
    fail: '邮箱地址格式错误'          // 验证失败提示
}

//手机号码表单数据
var phoneNumberData = {
	id: "5",
	label: '手机',                    // 表单标签
    type: 'text',                     // 表单类型
    validator: phoneNumberCheck,      // 表单验证规
    rules: '必填，长度为11个字符',    // 填写规则提示
    success: '手机号码格式正确',      // 验证通过提示
    fail: '手机号码格式错误'          // 验证失败提示
}

var container = document.querySelector(".container");

var nameInput = new FormFactory(nameData); 	//名称表单实例
var passWordInput = new FormFactory(passWordData);  //密码表单实例
var passWordRepeatInput = new FormFactory(passWordRepeatData);  //密码表单实例
var mailAddressInput = new FormFactory(mailAddressData);  //邮箱地址表单实例
var phoneNumberInput = new FormFactory(phoneNumberData);  //手机号码表单实例

//构造函数
function FormFactory(data){
	this.id = data.id;
	this.label = data.label;
	this.type = data.type;
	this.validator = data.validator;
	this.rules = data.rules;
	this.success = data.success;
	this.fail = data.fail;

	//验证必填
	this.required = function(str){
		if(str.length == 0 || str == ""){
			return false;
		}else{
			return true;
		}
	}
}

FormFactory.prototype.initForm = function(){
	//构建表单属性
	var div = document.createElement("div");
	var label = document.createElement("label");
	var input = document.createElement("input");
	label.innerHTML = this.label;
	label.setAttribute("for","name"+this.id);
	input.setAttribute("id","name"+this.id);
	input.setAttribute("type",this.type);
	var form = document.createElement("form");
	div.appendChild(label);
	div.appendChild(input);
	var span = document.createElement("span");
	div.appendChild(span);

	var self = this;

	//添加事件
	input.addEventListener("blur",function(event){

		//验证是否为空
		if(self.required(input.value.trim())){	

			//验证相应规则	
			if(self.validator(input.value.trim(),input,self.id)){
				span.innerHTML = self.success;
				input.style.border = "1px solid #61ba44";
				span.style.color = "#61ba44";	
			}else{
				span.innerHTML = self.fail;
				input.style.border = "1px solid #e0000d";
				span.style.color = "#e0000d";	
			}
		}else{
			span.innerHTML = "必填";
			input.style.border = "1px solid #e0000d";
			span.style.color = "#e0000d";	
		}
	});

	input.addEventListener("focus",function(event){
		span.innerHTML = self.rules;
		input.style.border = "1px solid #62aeec";
		span.style.color = "#62aeec";				
	});

	return div;
}


//名称验证规则
function nameCheck(str){
	var inputLength = 0;
	for(var i=0,len=str.length; i<len; i++){
		if(str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 128){
			inputLength += 1;
		}else{
			inputLength += 2;
		}
	}
	if(inputLength >= 4 && inputLength <= 16){
		return true;
	}else{
		return false;
	}
}

//密码验证规则
function passWordCheck(str){
	if(str.match(/^[a-zA-Z0-9]{6,16}$/)){
		return true;	
	}else{
		return false;
	}
}

//再次输入密码验证规则
function passWordRepeatCheck(str,input,id){
	var passWord = document.querySelector("#name"+(id-1)).value.trim();
	if(str == passWord){
		return true;
	}else{
		return false;
	}
}

//邮箱地址验证规则
function mailAddressCheck(str){
	if(str.indexOf("@") >= 0){
		return true;
	}else{
		return false;
	}
}

//邮箱地址验证规则
function phoneNumberCheck(str){
	if(str.match(/^1[0-9]{10}$/)){
		return true;
	}else{
		return false;
	}
}

//插入表单
container.appendChild(nameInput.initForm());
container.appendChild(passWordInput.initForm());
container.appendChild(passWordRepeatInput.initForm());
container.appendChild(mailAddressInput.initForm());
container.appendChild(phoneNumberInput.initForm());