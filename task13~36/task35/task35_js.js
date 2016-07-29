
var directions = ["top","right","bottom","left"];	//方向
var dirOrder = 0;	//directions序号
var rotateAngle = 0;	//旋转角度
var rows = 10;	//行
var columns = 10;	//列
var chess = document.querySelector("#cube");	//正方形dom
var chessWidth = chess.offsetWidth;		//正方形宽度
var x = Math.ceil(Math.random()*columns);	//正方形x坐标
var y = Math.ceil(Math.random()*rows);	//正方形y坐标
var commandInput = document.querySelector(".command");	//命令输入表单
var runBtn = document.querySelector(".control");	//按钮
var rowsOrderList = document.querySelector(".rows-order");  // 显示当前行数的<ol>
var rowsOrder = 1;	// 显示行数的起始数字
var runCommandTimer = null;	// 命令执行定时器ID
var isRunComman = false;	// 判断命令是否正在执行的变量

//添加点击事件
runBtn.addEventListener("click",function(event){
	if(event.target.nodeName == "BUTTON"){
		switch(event.target.innerHTML){
			case "执行" :
				runCommandQueue();
				console.log(commandInput.value.split("\n"));
				break;
			case "Refresh" :
				refresh();
				break;

			case "GO" :
				runCommand("GO");
				break;
			case "TUN LEF" :
				runCommand("TUN LEF");
				break;
			case "TUN RIG" :
				runCommand("TUN RIG");
				break;
			case "TUN BAC" :
				runCommand("TUN BAC");
				break;

			case "TRA LEF" :
				runCommand("TRA LEF");
				break;
			case "TRA TOP" :
				runCommand("TRA TOP");
				break;
			case "TRA RIG" :
				runCommand("TRA RIG");
				break;
			case "TRA BOT" :
				runCommand("TRA BOT");
				break;

			case "MOV LEF" :
				runCommand("MOV LEF");
				break;
			case "MOV TOP" :
				runCommand("MOV TOP");
				break;
			case "MOV RIG" :
				runCommand("MOV RIG");
				break;
			case "MOV BOT" :
				runCommand("MOV BOT");
				break;
			default :
				return;
		}
	}
});

//添加方向键控制
document.addEventListener("keydown",function(event){
	switch(event.keyCode){
		case 37 :
			runCommand("TUN LEF");
			break;
		case 38 :
			runCommand("GO");
			break;
		case 39 :
			runCommand("TUN RIG");
			break;
		case 40 :
			runCommand("TUN BAC");
			break;
		default :
			return;
	}
});

// 回车键增加一行
commandInput.addEventListener("keydown",function(event){
	if(event.keyCode == 13){
		rowsListAdd();
	}
});

//生成类似棋盘的格子空间
function initChessBoard(containerId,rows,columns) {
	var container = document.querySelector(containerId);
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);
	container.appendChild(table);
	for(var i=0; i<=rows; i++) {
		var tr = document.createElement("tr");
		for(var j=0; j<=columns; j++) {
			var td = document.createElement("td");
			if(i == 0 && j == 0) {
				console.log("第一个格子为空");
			}else if(i == 0){
				//列序号
				td.innerHTML = j;	
			}else if(j == 0){
				//行序号
				td.innerHTML = i;
			}
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	chess.style.top = chessWidth * y + "px";
	chess.style.left = chessWidth * x + "px";
	chess.style.transform = "rotate("+rotateAngle+"deg)";
	chess.className = directions[dirOrder];
}

// 执行命令
function runCommand(command){
	//转换成小写
	command = command.toLowerCase();

	//"go"命令为向蓝色边所面向的方向前进一格
	if(command == "go"){
		//根据dirOrder判断方向
		switch(dirOrder){
			case 0 :
				if(y > 1){
					y-=1;
				}
				break;
			case 1 :
				if(x < columns){
					x+=1;
				}
				break;
			case 2 :
				if(y < rows){
					y+=1;
				}
				break;
			case 3 :
				if(x > 1){
					x-=1;
				}
				break;
			default :
				return;
		}
	}

	//"tun lef"命令为逆时针旋转90度
	if(command == "tun lef"){
		dirOrder-=1;
		if(dirOrder < 0){
			dirOrder = 3;
		}
		rotateAngle -= 90;
	}

	//"tun rig"命令为顺时针旋转90度
	if(command == "tun rig"){
		dirOrder = (dirOrder + 1) % 4;
		rotateAngle += 90;
	}

	//"tun bac"命令为顺时针旋转180度
	if(command == "tun bac"){
		dirOrder = (dirOrder + 2) % 4;
		rotateAngle += 180;
	}

	//"tra lef"命令为向屏幕的左侧移动一格，方向不变
	if(command == "tra lef"){
		if(x > 1){
			x-=1;
		}
	}

	//"tra top"命令为向屏幕的上面移动一格，方向不变
	if(command == "tra top"){
		if(y > 1){
			y-=1;
		}
	}

	//"tra rig"命令为向屏幕的右侧移动一格，方向不变
	if(command == "tra rig"){
		if(x < columns){
			x+=1;
		}
	}

	//"tra bot"命令为向屏幕的下面移动一格，方向不变
	if(command == "tra bot"){
		if(y < rows){
			y+=1;
		}
	}

	//MOV LEF：方向转向屏幕左侧，并向屏幕的左侧移动一格
	if(command == "mov lef"){
		if(rotateAngle == 0){
			rotateAngle -= 90;
		}else if(rotateAngle > 0){
			switch(rotateAngle % 360){
				case 0 :
					rotateAngle+=270;
					break;
				case 90 :
					rotateAngle+=180;
					break;
				case 180 :
					rotateAngle+=90;
					break;
				default :
					break;
			}
		}else if(rotateAngle < 0){
			switch(rotateAngle % 360){
				case 0 :
					rotateAngle-=90;
					break;
				case -180 :
					rotateAngle-=270;
					break;
				case -270 :
					rotateAngle-=180;
					break;
				default :
					break;
			}
		}
		dirOrder = 3;
		if(x > 1){
			x-=1;
		}
	}

	//MOV TOP：方向转向屏幕上面，向屏幕的上面移动一格
	if(command == "mov top"){
		if(rotateAngle > 0){
			switch(rotateAngle % 360){
				case 90 :
					rotateAngle+=270;
					break;
				case 180 :
					rotateAngle+=180;
					break;
				case 270 :
					rotateAngle+=90;
					break;
				default :
					break;
			}
		}else if(rotateAngle < 0){
			switch(rotateAngle % 360){
				case -90 :
					rotateAngle-=270;
					break;
				case -180 :
					rotateAngle-=180;
					break;
				case -270 :
					rotateAngle-=90;
					break;
				default :
					break;
			}
		}
		dirOrder = 0;
		if(y > 1){
			y-=1;
		}
	}

	//MOV RIG：方向转向屏幕右侧，向屏幕的右侧移动一格
	if(command == "mov rig"){
		if(rotateAngle == 0){
			rotateAngle += 90;
		}else if(rotateAngle > 0){
			switch(rotateAngle % 360){
				case 0 :
					rotateAngle+=90;
					break;
				case 180 :
					rotateAngle+=270;
					break;
				case 270 :
					rotateAngle+=180;
					break;
				default :
					break;
			}
		}else if(rotateAngle < 0){
			switch(rotateAngle % 360){
				case 0 :
					rotateAngle-=270;
					break;
				case -90 :
					rotateAngle-=180;
					break;
				case -180 :
					rotateAngle-=90;
					break;
				default :
					break;
			}
		}
		dirOrder = 1;
		if(x < columns){
			x+=1;
		}
	}

	// MOV BOT：方向转向屏幕下面，向屏幕的下面移动一格
	if(command == "mov bot"){
		if(rotateAngle == 0){
			rotateAngle += 180;
		}else if(rotateAngle > 0){
			switch(rotateAngle % 360){
				case 0 :
					rotateAngle+=180;
					break;
				case 90 :
					rotateAngle+=90;
					break;
				case 270 :
					rotateAngle+=270;
					break;
				default :
					break;
			}
		}else if(rotateAngle < 0){
			switch(rotateAngle % 360){
				case 0 :
					rotateAngle-=180;
					break;
				case -90 :
					rotateAngle-=90;
					break;
				case -270 :
					rotateAngle-=270;
					break;
				default :
					break;
			}
		}
		dirOrder = 2;
		if(y < rows){
			y+=1;
		}
	}
	chess.style.top = chessWidth * y + "px";
	chess.style.left = chessWidth * x + "px";
	chess.setAttribute("data-columns",x);
	chess.setAttribute("data-rows",y);
	chess.className = directions[dirOrder];
	chess.style.transform = "rotate("+rotateAngle+"deg)";
}

//	回车增加一个li
function rowsListAdd(){
	var li = document.createElement("li");
	li.innerHTML = rowsOrder;
	li.setAttribute("tabindex","1");
	rowsOrder++;
	rowsOrderList.appendChild(li);
	rowsOrderList.lastElementChild.focus();
	commandInput.focus();
}


// 输入的命令分割成数组
function commandStrSplit(commandStr){
	var temporaryQueue = commandStr.split("\n");
	// .filter(function(item){
	// 	if(item != "" && item.length >0){
	// 		return true
	// 	}else{
	// 		return false}
	// 	});
	return temporaryQueue;
}

// 检查命令数组
function commandCheck(commandQueue){
	var resultQueue = [];

	// 正则为抄袭来的
	var regGO = /^GO(\s\d+)?$/;
    var regTUN = /^TUN\s(LEF|BAC|RIG)$/; //检测TUN指令
    var regTRAMOV = /^(TRA|MOV)\s(LEF|RIG|TOP|BOT)(\s\d+)?$/; //检测TRA指令跟MOV指令

	if(commandQueue.length > 0){
		for(var i=0; i<commandQueue.length; i++){
			var item = commandQueue[i].trim();
			// 正则检查命令是否符合指定命令
			if(regGO.test(item) || regTUN.test(item) || regTRAMOV.test(item)){
				// 如果后面跟有移动格子数量的参数 则按数量多少添加命令
				// 例：GO 3 则添加GO,GO,GO
				var num = item.substring(item.lastIndexOf(" "),item.length);
				if(isNaN(num)){
					resultQueue.push(item);
				}else{
					for(var j=0; j<num; j++){
						resultQueue.push(item.substring(0,item.lastIndexOf(" ")));
					}
				}
			}else{
			// 如果不符合指定命令则红色标记
				if(rowsOrderList.children[i]){
					rowsOrderList.children[i].style.backgroundColor = "red";
				}
			}
		}
	}
	return resultQueue;
}

// 执行命令队列数组
function runCommandQueue(commandQueue){
	var queue = commandCheck(commandStrSplit(commandInput.value));
	// 判断是否正在执行命令
	if(!isRunComman){
		isRunComman = true;
		// 逐个命令取出执行
		runCommandTimer = setInterval(function(){
			var item = queue.shift();
			if(item){
				runCommand(item);
			}else{
				clearInterval(runCommandTimer);
				isRunComman = false;
			}
		},500);
	}

	// 显示当前执行的代码（没做好）
	var runQueueIndex = 0;
	function runQueueListTips(){
		var inputCommand = commandStrSplit(commandInput.value);
		var timerDate = 0;
		//for(var i=0; i<inputCommand.length; i++){
			//if(inputCommand[runQueueIndex+1]){
				var num = inputCommand[runQueueIndex].substring(inputCommand[runQueueIndex].lastIndexOf(" "),inputCommand[runQueueIndex].length)
				if(!isNaN(num)){
					timerDate = 500*num;
				}else{
					timerDate = 500;
				}
				// var runTips = (function(num){
				// 	return function(){
				// 		if(rowsOrderList.children[num]){
				// 			rowsOrderList.children[num].style.backgroundColor = "blue";
				// 		}
				// 		console.log(num);
				// 	}
				// })(i);
				setTimeout(function(){
					console.log(runQueueIndex);
					if(rowsOrderList.children[runQueueIndex]){
						rowsOrderList.children[runQueueIndex].focus();
						runQueueIndex++;
						if(runQueueIndex < inputCommand.length){
							runQueueListTips();
						}
					}
				},timerDate);
			//}
		//}
	}
	runQueueListTips()
}

// 清空表单内容
function refresh(){
	commandInput.value = "";
	rowsOrderList.innerHTML = "";
	rowsOrder = 1;
}

//console.log(commandCheck(commandStrSplit("MOV RIG 30")));
initChessBoard(".container",rows,columns);