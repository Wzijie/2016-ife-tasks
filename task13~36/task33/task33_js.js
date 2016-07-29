
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

//添加点击事件
runBtn.addEventListener("click",function(event){
	if(event.target.nodeName == "BUTTON"){
		switch(event.target.innerHTML){
			case "执行" :
				runCommand(commandInput.value.trim());
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

function runCommand(command){
	//转换成小写
	command = command.toLowerCase();
	//"go"命令为移动一格
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
		chess.style.top = chessWidth * y + "px";
		chess.style.left = chessWidth * x + "px";
	}

	//"tun lef","tun rig","tun bac"命令为旋转
	if(command == "tun lef"){
		dirOrder-=1;
		if(dirOrder < 0){
			dirOrder = 3;
		}
		rotateAngle -= 90;
	}
	if(command == "tun rig"){
		dirOrder = (dirOrder + 1) % 4;
		rotateAngle += 90;
	}
	if(command == "tun bac"){
		dirOrder = (dirOrder + 2) % 4;
		rotateAngle += 180;
	}
	chess.className = directions[dirOrder];
	chess.style.transform = "rotate("+rotateAngle+"deg)";
}


initChessBoard(".container",rows,columns);