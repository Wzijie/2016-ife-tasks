
var airship = document.querySelectorAll(".airship");
var operationBtn = document.querySelector(".operation");
var airshipOrder = document.querySelectorAll(".airship-order");
var consoleLog = document.querySelector(".console");	
var consoleLogStr = "";		//控制台输出
var timer = {};		//定时器
var initNum = {};	//角度
var energy = {};	//能源
var info = {
	id : 1,
	commond: 'stop'
};
operationBtn.addEventListener("click",function(event){
	if(event.target.nodeName == "BUTTON"){
		if(packetLoss()){
			console.log("信息传送成功");
			for(var i=0,len=airshipOrder.length; i<len; i++){
				airshipOrder[i].id = i;		//绑定飞船序号
			}
			info.id = event.target.parentNode.id;
			setTimeout(function(){
				switch(event.target.innerHTML){
					case "起飞" :
						takeOff(event.target.parentNode.id);
						break;
					case "飞行" :
						flight(event.target.parentNode.id);
						break;
					case "停止" :
						flightStop(event.target.parentNode.id);
						break;
					case "销毁" :
						destroy(event.target.parentNode.id);
						break;
				}
			},1000);
			consoleLogStr += "<p tabindex='1'>信息传送成功</p>";
			consoleLog.innerHTML = consoleLogStr;
			consoleLog.lastElementChild.focus();
		}else{
			console.log("信息传送失败");
			consoleLogStr += "<p tabindex='1'>信息传送失败</p>";
			consoleLog.innerHTML = consoleLogStr;
			consoleLog.lastElementChild.focus();
		}
	}
	
});

//起飞
function takeOff(id){
	airship[info.id].style.display = "block";
	airship[info.id].style.transform = "rotate(0deg)";
	energy["id" + id] = 100;
	airship[id].innerHTML = energy["id" + id] + "%";
	clearInterval(timer["energyUp" + info.id]);

	//能源增长
	timer["energyUp" + info.id] = setInterval(function(){
		if(energy["id" + id] < 100){
			energy["id" + id] += 2;
			airship[id].innerHTML = energy["id" + id] + "%";
		}
	},1000);
	consoleLogStr += "<p tabindex='1'>"+ info.id +"号飞船起飞</p>";
	consoleLog.innerHTML = consoleLogStr;
	consoleLog.lastElementChild.focus();
}

//飞行
function flight(id){
	if(airship[info.id].style.display == "block"){
		clearInterval(timer["flight" + id]);
		clearInterval(timer["energyDown" + id]);
		if(isNaN(initNum["id" + id])){
			initNum["id" + id] = 0;
		}

		//改变角度
		timer["flight" + id] = setInterval(function(){
			initNum["id" + id]+=2;
			if(initNum["id" + id] >= 360){
				initNum["id" + id] = 0;
			}
			airship[id].style.transform = "rotate(" + initNum["id" + id] + "deg)";
			console.log("id" + id +":"+initNum["id" + id]);
		},17);

		//能源消耗
		timer["energyDown" + id] = setInterval(function(){
			if(energy["id" + id] > 0){
				energy["id" + id] -= 5;
				airship[id].innerHTML = energy["id" + id] + "%";
			}else{
				clearInterval(timer["energyDown" + id]);
				clearInterval(timer["flight" + id]);
			}
		},1000);
		consoleLogStr += "<p tabindex='1'>"+ info.id +"号飞船开始飞行</p>";
		consoleLog.innerHTML = consoleLogStr;
		consoleLog.lastElementChild.focus();
	}
}

//停止飞行
function flightStop(id){
	clearInterval(timer["flight" + id]);
	clearInterval(timer["energyDown" + id]);
	consoleLogStr += "<p tabindex='1'>"+ info.id +"号飞船停止飞行</p>";
	consoleLog.innerHTML = consoleLogStr;
	consoleLog.lastElementChild.focus();
}

//销毁
function destroy(id){
	airship[info.id].style.display = "none";
	initNum["id" + id] = 0;
	airship[info.id].style.transform = "rotate(" + initNum + "deg)";
	clearInterval(timer["flight" + id]);
	clearInterval(timer["energyDown" + id]);
	clearInterval(timer["energyUp" + info.id]);
	consoleLogStr += "<p tabindex='1'>"+ info.id +"号飞船销毁</p>";
	consoleLog.innerHTML = consoleLogStr;
	consoleLog.lastElementChild.focus();
}

//模拟丢包率
function packetLoss(){
	if(Math.random() > 0.3){
		return true;
	}else{
		return false;
	}
}