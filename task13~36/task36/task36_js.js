
var directions = ["top","right","bottom","left"];	//方向
var dirOrder = 0;	//directions序号
var rotateAngle = 0;	//旋转角度
var rows = 16;	//行
var columns = 30;	//列
var chess = document.querySelector("#cube");	//正方形dom
var chessWidth = chess.offsetWidth;		//正方形宽度
var x = 4;	//正方形x坐标
var y = 8;	//正方形y坐标
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
		// depthFirstSearchX(endX,endY);
		astar(x,y, endX,endY);
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
initChessBoard(".map-container",rows,columns);
//aStar();
//console.log(document.querySelector("[data-columns='"+x+"'][data-rows='"+y+"']"));

// 17-4-22尝试实现a星寻路算法
function astar(startX, startY, endX, endY){
	// 开始节点
	var startNode = rightNode = document.querySelector("[data-columns='"+startX+"'][data-rows='"+startY+"']");
	startNode.g = Math.abs(startX - startX) + Math.abs(startY - startY);
	startNode.h = Math.abs(startX - endX) + Math.abs(startY - endY);
	startNode.f = startNode.g + startNode.h;

	// 目标节点
	var endNode = rightNode = document.querySelector("[data-columns='"+endX+"'][data-rows='"+endY+"']");
	endNode.style.background = 'blue';

	// 开启列表存放待检查的节点
	var openList = [];
	// 关闭列表存放查询后开启列表中f值最小的节点
	var closeList = [];

	// 结果路径
	var resultPath = [];

	function aroundNode(node){
		// 节点的x,y值
		var nodeX = parseInt(node.getAttribute('data-columns'));
		var nodeY = parseInt(node.getAttribute('data-rows'));

		// 上下左右相邻节点
		var topNode = null;
		var bottomNode = null;
		var leftNode = null;
		var rightNode = null;

		// 判断是否在地图内
		if(nodeY-1 > 0){
			topNode = document.querySelector("[data-columns='"+nodeX+"'][data-rows='"+(nodeY-1)+"']");

			// 判断该位置是否是墙及该位置节点是否在关闭列表
			// 关闭列表的节点不需要检查
			if(topNode.className.indexOf('wall') === -1 && closeList.indexOf(topNode) === -1){
				// 设置g,h,f
				// g为自己距离父节点的值
				topNode.g = Math.abs(nodeX - nodeX) + Math.abs(nodeY-1 - nodeY);
				// h为自己距离目标节点的值
				topNode.h = Math.abs(nodeX - endX) + Math.abs(nodeY-1 - endY);
				// f为g+h
				topNode.f = topNode.g + topNode.h;
				topNode.classList.add('blue');
				// 设置parent属性为父节点
				topNode.parent = node;
				// 将该位置节点放入开启列表
				openList.push(topNode);
				console.log(topNode,topNode.g,topNode.h,topNode.f,'topNode');
			}
		}
		if(nodeY+1 < rows+1){
			bottomNode = document.querySelector("[data-columns='"+nodeX+"'][data-rows='"+(nodeY+1)+"']");
			if(bottomNode.className.indexOf('wall') === -1 && closeList.indexOf(bottomNode) === -1){
				bottomNode.g = Math.abs(nodeX - nodeX) + Math.abs(nodeY+1 - nodeY);
				bottomNode.h = Math.abs(nodeX - endX) + Math.abs(nodeY+1 - endY);
				bottomNode.f = bottomNode.g + bottomNode.h;
				bottomNode.classList.add('blue');
				bottomNode.parent = node;
				openList.push(bottomNode);
				console.log(bottomNode,bottomNode.g,bottomNode.h,bottomNode.f,'bottomNode');
			}
		}
		if(nodeX-1 > 0){
			leftNode = document.querySelector("[data-columns='"+(nodeX-1)+"'][data-rows='"+nodeY+"']");
			if(leftNode.className.indexOf('wall') === -1 && closeList.indexOf(leftNode) === -1){
				leftNode.g = Math.abs(nodeX-1 - nodeX) + Math.abs(nodeY - nodeY);
				leftNode.h = Math.abs(nodeX-1 - endX) + Math.abs(nodeY - endY);
				leftNode.f = leftNode.g + leftNode.h;
				leftNode.classList.add('blue');
				leftNode.parent = node;
				openList.push(leftNode);
				console.log(leftNode,leftNode.g,leftNode.h,leftNode.f,'leftNode');
			}
		}
		if(nodeX+1 < columns+1){
			rightNode = document.querySelector("[data-columns='"+(nodeX+1)+"'][data-rows='"+nodeY+"']");
			if(rightNode.className.indexOf('wall') === -1 && closeList.indexOf(rightNode) === -1){
				rightNode.g = Math.abs(nodeX+1 - nodeX) + Math.abs(nodeY - nodeY);
				rightNode.h = Math.abs(nodeX+1 - endX) + Math.abs(nodeY - endY);
				rightNode.f = rightNode.g + rightNode.h;
				rightNode.classList.add('blue');
				rightNode.parent = node;
				openList.push(rightNode);
				console.log(rightNode,rightNode.g,rightNode.h,rightNode.f,'rightNode');
			}
		}
		// console.log(topNode,topNode.g,topNode.h,topNode.f);
		// console.log(bottomNode,bottomNode.g,bottomNode.h,bottomNode.f);
		// console.log(leftNode,leftNode.g,leftNode.h,leftNode.f);
		// console.log(rightNode,rightNode.g,rightNode.h,rightNode.f);
	}
	console.log(startNode,startNode.g,startNode.h,startNode.f);
	// while(openList.indexOf(endNode) === -1 && openList.length !== 0){
	// // for(var i=0; i<4; i++){
	// 	openList.sort((a,b) => {
	// 		return a.f - b.f;
	// 	});
	// 	var currentNode = openList.splice(0, 1)[0];
	// 	console.log(currentNode,'currentNode');
	// 	closeList.push(currentNode);
	// 	aroundNode(currentNode);
		
		
	// 	console.log(openList);
	// 	console.log(closeList);
	// // }	
	// }

	// 最开始将开始节点放入开启列表
	openList.push(startNode);

	// 添加promise，当查询到路径后再执行移动操作
	function promiseQuery(){

		var promise = new Promise((resolve, reject) => {

			function query(){

				// 排序找到开启列表里f值最小的节点
				openList.sort((a,b) => {
					return a.f - b.f;
				});

				// 将当前f值最小的节点移出开启列表并加入关闭列表
				var currentNode = openList.splice(0, 1)[0];
				console.log(currentNode,'currentNode');
				closeList.push(currentNode);

				// 将当前f值最小的节点的上下左右相邻的节点加入开启列表
				aroundNode(currentNode);
				
				
				console.log(openList);
				console.log(closeList);
				// 开启列表中出现目标终点则寻路完毕, 如果开启列表中没有节点了则路径不存在
				if(openList.indexOf(endNode) === -1 && openList.length !== 0){
					// 继续执行查找
					setTimeout(query, 5);
					// query();
				}else{
					// 查找完毕
					resolve();
				}
			}
			query();
		});

		return promise;
	
	}
		

	// openList.sort((a,b) => {
	// 	return a.f - b.f;
	// });
	// openList.forEach((node) => {
	// 	console.log(node,node.g,node.h,node.f);
	// })
	var promiseResult = promiseQuery();
	// 查找完毕后开始移动
	promiseResult.then(() => {

		// 从终点节点开始寻找父节点，所有父节点连起来就是路径
		function queryParent(node){
			resultPath.push(node);
			console.log(node);
			if(node.parent){
				queryParent(node.parent);
			}
		}
		queryParent(endNode);
		console.log(resultPath);

		// 结果路径数组是从终点到起点的所有节点，先翻转数组在逐个判断相差位置然后执行何种移动
		resultPath.reverse().forEach((node, index) => {
			var lastX = parseInt(node.getAttribute('data-columns'));
			var lastY = parseInt(node.getAttribute('data-rows'));
			((time) => {
				setTimeout(() => {
					if(x > lastX){
						runCommand('MOV LEF');
					}
					if(x < lastX){
						runCommand('MOV RIG');
					}
					if(y > lastY){
						runCommand('MOV TOP');
					}
					if(y < lastY){
						runCommand('MOV BOT');
					}
				}, 200*time);
			})(index);
			
			
		});

	});
}

// astar(x,y, 10,10);

var pathfindingStart = document.querySelector('.start-pathfinding');
var clearWall = document.querySelector('.clear-wall');
var xinput = document.querySelector('.end-x');
var yinput = document.querySelector('.end-y');
var td = document.querySelectorAll('td');
pathfindingStart.addEventListener('click', () => {
	// 把寻路查询时节点改变的颜色去掉
	Array.from(td).forEach((tdNode) => {
		tdNode.classList.remove('blue');
	});
	var xvalue = parseInt(xinput.value);
	var yvalue = parseInt(yinput.value);
	astar(x,y, xvalue,yvalue);
});

clearWall.addEventListener('click', () => {
	Array.from(td).forEach((tdNode) => {
		tdNode.classList.remove('wall');
	});
});

// 随机修墙
// document.querySelector('.randomBuildBtn').addEventListener('click', () => {
// 	randomBuild();
// });


var table = document.querySelector('table');
var isTableClick = false;
table.addEventListener('mousedown', () => {
	isTableClick = true;
});
table.addEventListener('mouseup', () => {
	isTableClick = false;
});
table.addEventListener('mouseover', (event) => {
	if(isTableClick === false || event.target.nodeName !== 'TD'){
		return;
	}
	event.target.className = 'wall';
	console.log('wall');
});
table.addEventListener('selectstart', (event) => {
	event.preventDefault();
	event.stopPropagation();
});
