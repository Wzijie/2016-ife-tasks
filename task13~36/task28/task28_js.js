
var airship = document.querySelectorAll(".airship");
var operationBtn = document.querySelector(".operation");
var airshipOrder = document.querySelectorAll(".airship-order");
var consoleLog = document.querySelector(".console");	
var powerSystem = document.querySelectorAll(".power-system");
var energySystem = document.querySelectorAll(".energy-system");
var stateTable = document.querySelector(".state-table");
var consoleLogStr = "";		//控制台输出
var timer = {};		//定时器
var initNum = {};	//角度
var energy = {};	//能源
var speed = {};		//速度
var info = {
	id : 1,
	commond: 'stop'
};
operationBtn.addEventListener("click",function(event){
	if(event.target.nodeName == "BUTTON"){
		mediumBUS(event);
	}
	
});

//传播介质
function mediumBUS(event){
	if(Math.random() > 0.1){
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
		},300);
		consoleLogStr += "<p tabindex='1'>信息传送成功</p>";
		consoleOutput();
	}else{
		setTimeout(function(){
			mediumBUS(event);
		},1000);
		console.log("信息传送失败,尝试再次传送信息");
		consoleLogStr += "<p tabindex='1'>信息传送失败,尝试再次传送信息</p>";
		consoleOutput();
	}
}

//起飞
function takeOff(id){
	if(airship[info.id].style.display != "block"){
		airship[info.id].style.display = "block";
		airship[info.id].style.transform = "rotate(0deg)";
		energy["total" + id] = 100;
		airship[id].innerHTML = energy["total" + id] + "%";
		clearInterval(timer["energyUp" + info.id]);

		//判断动力系统
		switch(powerSystem[id].value){
			case "前进号" :
				energy["down" + id] = 5;
				speed["id" + id] = 1;
				break;
			case "奔腾号" :
				energy["down" + id] = 7;
				speed["id" + id] = 2;
				break;
			case "超越号" :
				energy["down" + id] = 9;
				speed["id" + id] = 3;
				break;
			default :
				break;
		};

		//判断能源系统
		switch(energySystem[id].value){
			case "劲量型" :
				energy["up" + id] = 2;
				break;
			case "光能型" :
				energy["up" + id] = 3;
				break;
			case "永久型" :
				energy["up" + id] = 4;
				break;
			default :
				break;
		};

		//能源增长
		timer["energyUp" + info.id] = setInterval(function(){
			if(energy["total" + id] < 100){
				energy["total" + id] += energy["up" + id];
				airship[id].innerHTML = energy["total" + id] + "%";
				stateTable.lastElementChild.children[id].lastElementChild.innerHTML = energy["total" + id] + "%";
			}
		},1000);
		consoleLogStr += "<p tabindex='1'>"+ info.id +"号飞船起飞</p>";
		consoleOutput();

		var tr = document.createElement("tr");
		tr.innerHTML = "<td>"+id+"号飞船</td><td>"+powerSystem[id].value+"</td><td>"+energySystem[id].value+"</td><td>停止中</td><td>"+energy["total" + id]+"%</td>";
		stateTable.lastElementChild.appendChild(tr);
	}else{
		consoleLogStr += "<p tabindex='1'>"+ info.id +"号飞船以起飞</p>";
		consoleOutput();
	}
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
			initNum["id" + id] += speed["id" + id];
			if(initNum["id" + id] >= 360){
				initNum["id" + id] = 0;
			}
			airship[id].style.transform = "rotate(" + initNum["id" + id] + "deg)";
			console.log("id" + id +":"+initNum["id" + id]);
		},17);

		//能源消耗
		timer["energyDown" + id] = setInterval(function(){
			if(energy["total" + id] > 0){
				energy["total" + id] -= energy["down" + id];
				airship[id].innerHTML = energy["total" + id] + "%";
				stateTable.lastElementChild.children[id].lastElementChild.innerHTML = energy["total" + id] + "%";
			}else{
				clearInterval(timer["energyDown" + id]);
				clearInterval(timer["flight" + id]);
			}
		},1000);
		consoleLogStr += "<p tabindex='1'>"+ info.id +"号飞船开始飞行</p>";
		consoleOutput();
		stateTable.lastElementChild.children[id].children[3].innerHTML = "飞行中";
	}
}

//停止飞行
function flightStop(id){
	clearInterval(timer["flight" + id]);
	clearInterval(timer["energyDown" + id]);
	consoleLogStr += "<p tabindex='1'>"+ info.id +"号飞船停止飞行</p>";
	consoleOutput();
	stateTable.lastElementChild.children[id].children[3].innerHTML = "停止中";
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
	consoleOutput();
	for(var i=0,len=stateTable.lastElementChild.children.length; i<len; i++){
		if(stateTable.lastElementChild.children[i]){
			if(stateTable.lastElementChild.children[i].firstElementChild.innerHTML == (id+"号飞船")){
				stateTable.lastElementChild.removeChild(stateTable.lastElementChild.children[i]);
			}
		}
	}
}

//控制台输出
function consoleOutput(){
	consoleLog.innerHTML = consoleLogStr;
	consoleLog.lastElementChild.focus();
}