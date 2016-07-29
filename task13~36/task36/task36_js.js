
var directions = ["top","right","bottom","left"];	//方向
var dirOrder = 0;	//directions序号
var rotateAngle = 0;	//旋转角度
var rows = 10;	//行
var columns = 10;	//列
var chess = document.querySelector("#cube");	//正方形dom
var chessWidth = chess.offsetWidth;		//正方形宽度
var x = 1;	//正方形x坐标
var y = 1;	//正方形y坐标
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

			case "BUILD" :
				runCommand("BUILD");
				break;
			case "BRU COLOR" :
				runCommand("BRU " + randomColor());
				break;
			case "随机修墙" :
				randomBuild();
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
			td.setAttribute("data-rows",i);
			td.setAttribute("data-columns",j);
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

	// 获取方块前面的td
	function wallCondition(x,y){
		return document.querySelector("[data-columns='"+x+"'][data-rows='"+y+"']");
	}
	//"go"命令为向蓝色边所面向的方向前进一格
	if(command == "go"){
		//根据dirOrder判断方向
		switch(dirOrder){
			case 0 :
				if(y > 1){
					if(wallCondition(x,y-1).className != "wall"){
						y-=1;
					}
				}
				break;
			case 1 :
				if(x < columns){
					if(wallCondition(x+1,y).className != "wall"){
						x+=1;
					}
				}
				break;
			case 2 :
				if(y < rows){
					if(wallCondition(x,y+1).className != "wall"){
						y+=1;
					}
				}
				break;
			case 3 :
				if(x > 1){
					if(wallCondition(x-1,y).className != "wall"){
						x-=1;
					}
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
			if(wallCondition(x-1,y).className != "wall"){
				x-=1;
			}
		}
	}

	//"tra top"命令为向屏幕的上面移动一格，方向不变
	if(command == "tra top"){
		if(y > 1){
			if(wallCondition(x,y-1).className != "wall"){
				y-=1;
			}
		}
	}

	//"tra rig"命令为向屏幕的右侧移动一格，方向不变
	if(command == "tra rig"){
		if(x < columns){
			if(wallCondition(x+1,y).className != "wall"){
				x+=1;
			}
		}
	}

	//"tra bot"命令为向屏幕的下面移动一格，方向不变
	if(command == "tra bot"){
		if(y < rows){
			if(wallCondition(x,y+1).className != "wall"){
				y+=1;
			}
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
			if(wallCondition(x-1,y).className != "wall"){
				x-=1;
			}
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
			if(wallCondition(x,y-1).className != "wall"){
				y-=1;
			}
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
			if(wallCondition(x+1,y).className != "wall"){
				x+=1;
			}
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
			if(wallCondition(x,y+1).className != "wall"){
				y+=1;
			}
		}
	}

	// BUILD，执行指令时，会在当前方块面对的方向前修建一格墙壁，
	// 如果被指定修墙的地方超过边界墙或者已经有墙了，则取消修墙操作，并调用浏览器的console.log方法打印一个错误日志
	if(command == "build"){
		//根据dirOrder判断方向
		var wallX = x;
		var wallY = y;
		switch(dirOrder){
			case 0 :
				if(wallY > 1){
					wallY-=1;
				}
				break;
			case 1 :
				if(wallX < columns){
					wallX+=1;
				}
				break;
			case 2 :
				if(wallY < rows){
					wallY+=1;
				}
				break;
			case 3 :
				if(wallX > 1){
					wallX-=1;
				}
				break;
			default :
				return;
		}
		var wallTd = document.querySelector("[data-columns='"+wallX+"'][data-rows='"+wallY+"']");
		if(wallTd && wallTd.className != "wall"){
			wallTd.className = "wall";
		}else{
			console.log("该位置超过边界或者已经有墙了");
		}
	}

	// BRU color，color是一个字符串，保持和css中颜色编码一致。执行指令时，如果当前方块蓝色边面对方向有紧相邻的墙，则将这个墙颜色改为参数颜色，
	// 如果没有，则通过调用浏览器的console.log方法，打印一个错误日志
	var regBruColor = /^bru\s#([0-9a-eA-E]{6})$/;
	if(regBruColor.test(command)){
		//根据dirOrder判断方向
		var wallX = x;
		var wallY = y;
		switch(dirOrder){
			case 0 :
				if(wallY > 1){
					wallY-=1;
				}
				break;
			case 1 :
				if(wallX < columns){
					wallX+=1;
				}
				break;
			case 2 :
				if(wallY < rows){
					wallY+=1;
				}
				break;
			case 3 :
				if(wallX > 1){
					wallX-=1;
				}
				break;
			default :
				return;
		}
		var wallTd = document.querySelector("[data-columns='"+wallX+"'][data-rows='"+wallY+"']");
		var bruColor = command.substring(command.lastIndexOf(" ")+1,command.length);
		if(wallTd && wallTd.className == "wall"){
			wallTd.style.backgroundColor = bruColor;
		}else{
			console.log("该位置超过边界或者没有墙");
		}
	}

	var regMOVxy = /^mov\s(10|[1-9]),(10|[1-9])$/;
	console.log(command);
	console.log(regMOVxy.test(command))
	if(regMOVxy.test(command)){
		console.log(command.substring(command.lastIndexOf(" ")+1,command.length));
		var endX = command.substring(command.lastIndexOf(" ")+1,command.length).split(",")[0];
		var endY = command.substring(command.lastIndexOf(" ")+1,command.length).split(",")[0];
		depthFirstSearchX(endX,endY);
	}

	chess.style.top = chessWidth * y + "px";
	chess.style.left = chessWidth * x + "px";

	chess.setAttribute("data-rows",y);
	chess.setAttribute("data-columns",x);
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
	// 控制方块命令
	var regGO = /^GO(\s\d+)?$/;
    var regTUN = /^TUN\s(LEF|BAC|RIG)$/; //检测TUN指令
    var regTRAMOV = /^(TRA|MOV)\s(LEF|RIG|TOP|BOT)(\s\d+)?$/; //检测TRA指令跟MOV指令

    // 修墙命令
    var regBuild = /^BUILD$/;
    var regBruColor = /^BRU\s#([0-9a-eA-E]{6})$/;

    // MOV X,Y
    var regMOVxy = /^MOV\s(10|[1-9]),(10|[1-9])$/;

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
			}else if(regBuild.test(item)){
				resultQueue.push(item);
			}else if(regBruColor.test(item)){
				resultQueue.push(item);
			}else if(regMOVxy.test(item)){
				console.log("pushMOVXY " +item);
				resultQueue.push(item);
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

// 随机16进制颜色
function randomColor(){
	var color = "#";
	for(var i=0; i<6; i++){
		color += "0123456789abcdef"[Math.floor(Math.random()*16)];
	}
	return color;
}

// 随机修墙
function randomBuild(){
	var randomX = Math.ceil(Math.random()*columns);
	var randomY = Math.ceil(Math.random()*rows);
	var randomWall = document.querySelector("td[data-columns='"+randomX+"'][data-rows='"+randomY+"']");
	if(randomX != x || randomY != y){
		if(randomWall.className != "wall"){
			randomWall.className = "wall";
		}else{
			console.log("该位置已有墙");
		}
	}else{
		console.log("该位置有方块");
	}	
}

/*
A*寻路算法（失败放弃了）
function aStar(){
	var openList = [];
	var closeList = [];
	var startNode = document.querySelector("td[data-columns='1'][data-rows='1']");
	var endNode = document.querySelector("td[data-columns='4'][data-rows='4']");
	var startPoint = {
		x : parseInt(startNode.getAttribute("data-columns")),
		y : parseInt(startNode.getAttribute("data-rows"))
	}
	var endPoint = {
		x : 4,
		y : 4
	}
	
	openList.push(startNode);

	// 找出节点四周的节点并放入openList
	function trbl(node){
		if(node){
			var nodeX = parseInt(node.getAttribute("data-columns"));
			var nodeY = parseInt(node.getAttribute("data-rows"));
		}
		if(nodeY-1 >= 1){
			//console.log("top");
			var topNode = document.querySelector("td[data-columns='"+nodeX+"'][data-rows='"+(nodeY-1)+"']");
			if(topNode.className != "wall" && !arrayCheck(closeList,topNode) && !arrayCheck(openList,topNode)){
				topNode.setAttribute("parent",nodeX+","+nodeY);
				openList.push(topNode);
			}
		}
		if(nodeX+1 <= columns){
			//console.log("right");
			var rightNode = document.querySelector("td[data-columns='"+(nodeX+1)+"'][data-rows='"+nodeY+"']");
			if(rightNode.className != "wall" && !arrayCheck(closeList,rightNode) && !arrayCheck(openList,rightNode)){
				rightNode.setAttribute("parent",nodeX+","+nodeY);
				openList.push(rightNode);
			}
		}
		if(nodeY+1 <= rows){
			//console.log("bottom");
			var bottomNode = document.querySelector("td[data-columns='"+nodeX+"'][data-rows='"+(nodeY+1)+"']");
			if(bottomNode.className != "wall" && !arrayCheck(closeList,bottomNode) && !arrayCheck(openList,bottomNode)){
				bottomNode.setAttribute("parent",nodeX+","+nodeY);
				openList.push(bottomNode);
			}
		}
		if(nodeX-1 >= 1){
			//console.log("left");
			var leftNode = document.querySelector("td[data-columns='"+(nodeX-1)+"'][data-rows='"+nodeY+"']");
			if(leftNode.className != "wall" && !arrayCheck(closeList,leftNode) && !arrayCheck(openList,leftNode)){
				leftNode.setAttribute("parent",nodeX+","+nodeY);
				openList.push(leftNode);
			}
		}
	}
	trbl(startNode);
	//console.log(openList);
	arrayRemove(openList,startNode);
	//console.log(openList);
	closeList.push(startNode);

	// 计算并设置F,G,H
	function countFGH(){
		for(var i=0; i<openList.length; i++){
			openList[i].G = Math.abs(startPoint.x - parseInt(openList[i].getAttribute("data-columns"))) + Math.abs(startPoint.y - parseInt(openList[i].getAttribute("data-rows")));
			openList[i].H = Math.abs(endPoint.x - parseInt(openList[i].getAttribute("data-columns"))) + Math.abs(endPoint.y - parseInt(openList[i].getAttribute("data-rows")));
			openList[i].F = openList[i].G + openList[i].H;
			openList[i].setAttribute("G",openList[i].G);
			openList[i].setAttribute("H",openList[i].H);
			openList[i].setAttribute("F",openList[i].F);
			openList[i].style.backgroundColor = "#000";
		}
	}

	// 检查closeList数组里有没有指定项
	function arrayCheck(array,item){
		if(array.length > 0){
			for(var i=0; i<array.length; i++){
				if(array[i] == item){
					return true;
				}else{
					return false;
				}
			}
		}else{
			return false;
		}
	};
	console.log(openList);
	console.log(closeList);
	console.log(arrayCheck(openList,document.querySelector("td[data-columns='2'][data-rows='1']")));
	console.log(arrayCheck(closeList,document.querySelector("td[data-columns='2'][data-rows='1']")));
	// 数组删除指定项方法
	function arrayRemove(array,item){
		for(var i=0; i<array.length; i++){
			if(array[i] == item){
				var index = i;
			}
		}
		array.splice(index,1);
	};

	// 冒泡排序找出F值最小的项
	function bubbleSort(array){
		var exChangeValue;
		for(var i=0; i<array.length; i++){
			for(var j=0; j<array.length-1; j++){
				if(array[j].F > array[j+1].F){
					exChangeValue = array[j];
					array[j] = array[j+1];
					array[j+1] = array[j];
				}
			}
		}
		return array[0];
	}

	// 递归重复执行函数直到在开启列表数组里找到终点格子
	var exeNum = 0;
	function pathStart(){
		countFGH();
		var currentNode = bubbleSort(openList);
		arrayRemove(openList,currentNode);
		console.log(currentNode);
		x = currentNode.getAttribute("data-columns");
		y = currentNode.getAttribute("data-rows");
		chess.style.top = chessWidth * y + "px";
		chess.style.left = chessWidth * x + "px";
		console.log(x+","+y);
		closeList.push(currentNode);
		trbl(currentNode);
		//num++;
		setTimeout(function(){
			if(openList.some(function(item){return item == endNode})){
				//pathStart();
				console.log("已到达终点");
			}else{
				pathStart();
				console.log(openList);
				console.log("执行次数" + exeNum++);
			}
		},500);
	}
	pathStart();

}
*/

// 寻路...问题很大
function depthFirstSearchX(endX,endY){
	console.log("depthFirstSearchX");
	var startX = x;
	var startY = y;
	// 获取方块前面的td
	function wallCondition(x,y){
		return document.querySelector("[data-columns='"+x+"'][data-rows='"+y+"']");
	}
	if(startX > endX){
		if(wallCondition(x-1,y).className != "wall"){
			runCommand("MOV LEF");
			setTimeout(function(){
				depthFirstSearchX(endX,endY);
			},500);
		}else{
			runCommand("MOV RIG");
			setTimeout(function(){
				depthFirstSearchY(endX,endY);
			},500);
		}
	}else if(startX < endX){
		if(wallCondition(x+1,y).className != "wall"){
			runCommand("MOV RIG");
			setTimeout(function(){
				depthFirstSearchX(endX,endY);
			},500);
		}else{
			runCommand("MOV LEF");
			setTimeout(function(){
				depthFirstSearchY(endX,endY);
			},500);
		}
	}else if(startX == endX){
		depthFirstSearchY(endX,endY);
	}
}
function depthFirstSearchY(endX,endY){
	var startX = x;
	var startY = y;
	// 获取方块前面的td
	function wallCondition(x,y){
		return document.querySelector("[data-columns='"+x+"'][data-rows='"+y+"']");
	}
	if(startY > endY){
		if(wallCondition(x,y-1).className != "wall"){
			runCommand("MOV TOP");
			setTimeout(function(){
				depthFirstSearchY(endX,endY);
			},500);
		}else{
			runCommand("MOV BOT");
			setTimeout(function(){
				depthFirstSearchX(endX,endY);
			},500);
		}
	}else if(startY < endY){
		if(wallCondition(x,y+1).className != "wall"){
			runCommand("MOV BOT");
			setTimeout(function(){
				depthFirstSearchY(endX,endY);
			},500);
		}else{
			runCommand("MOV TOP");
			setTimeout(function(){
				depthFirstSearchX(endX,endY);
			},500);
		}
	}else if(startY == endY){
		depthFirstSearchX(endX,endY);
	}
}

//console.log(commandCheck(commandStrSplit("MOV RIG 30")));
initChessBoard(".container",rows,columns);
//aStar();
//console.log(document.querySelector("[data-columns='"+x+"'][data-rows='"+y+"']"));