
(function(){
	var inputNum = document.getElementById("input-num");
	var form = document.querySelector(".form");
	var queue = [];

	function output(j){
		var container = document.getElementById("container");
		var queueDataStr = "";
		for(var i=0; i<queue.length; i++){
			if(i == j){
				queueDataStr += "<span style='height:" + queue[i]*2 + "px;background-color:blue'></span>";
			}else{
				queueDataStr += "<span style='height:" + queue[i]*2 + "px'></span>";
			}
		}
		container.innerHTML = queueDataStr;
		inputNum.value = "";
	}

	function deleteNum(container,target){
		var span = container.getElementsByTagName("span");

		for(var i=0,len=span.length; i<len; i++){
			span[i].index = i;
		}
		queue.splice([target.index],1);
		output();
	}

	function leftIn(){
		if(/\d/.test(inputNum.value)){
			if(parseInt(inputNum.value.trim()) >= 10 && parseInt(inputNum.value.trim()) <= 100){
				if(queue.length <= 60){
					queue.unshift(inputNum.value.trim());
					output();
				}else{
					alert("队列元素最多60个！");
				}	
			}else{
				alert("请输入10~100的数字！");
			}
		}else{
			alert("请输入数字！");
		}
	}
	function rightIn(){
		if(/\d/.test(inputNum.value)){
			if(parseInt(inputNum.value.trim()) >= 10 && parseInt(inputNum.value.trim()) <= 100){
				if(queue.length <= 60){
					queue.push(inputNum.value.trim());
					output();
				}else{
					alert("队列元素最多60个！");
				}	
			}else{
				alert("请输入10~100的数字！");
			}
		}else{
			alert("请输入数字！");
		}
	}

	function leftOut(){
		if(queue.length){
			alert(queue.shift());
			output();
		}	
	}
	function rightOut(){
		if(queue.length){
			alert(queue.pop());
			output();
		}
	}

	function bubbleSort(){
		var len = queue.length;
		var j = 0;
		var i = len - 1;
		var exchangeValue;
		var timer;

		// for(var i=0; i<len; i++){
		// 	for(j=0; j<len-1; j++){
		// 		if(queue[j] > queue[j+1]){
		// 			exchangeValue = queue[j+1];
		// 			queue[j+1] = queue[j];
		// 			queue[j] = exchangeValue;
		// 			output();	
		// 		}
		// 	}
		// }
		var span = document.querySelectorAll("span"); 
		timer = setInterval(function(){

			if(i < 1){
				clearInterval(timer);
				console.log("clear");
			}
			if(j == i){
				i--;
				j = 0;
			}
			if(queue[j] > queue[j+1]){
				exchangeValue = queue[j+1];
				queue[j+1] = queue[j];
				queue[j] = exchangeValue; 
			}
			output(j);
			// if(span[j].offsetHeight > span[j+1].offsetHeight){
			// 	exchangeValue = span[j+1].offsetHeight;
			// 	span[j+1].style.height = span[j].offsetHeight + "px";
			// 	span[j+1].style.backgroundColor = "blue";
			// 	span[j].style.height = exchangeValue + "px";
			// 	span[j].style.backgroundColor = "red";

			// 	console.log(span[j+1].offsetHeight);
			// }	
			j++;
			
		},10);
	}

	function randomData(){
		queue.splice(0,queue.length);
		for(var i=50; i>0; i--){
			queue.push(Math.floor(Math.random()*(100-10+1)+10));
		}
		output();
	}

	function initQueueBtn(){
		form.addEventListener("click",function(event){
			switch (event.target.innerHTML){
				case "左侧入" :
					leftIn();
					break;
				case "右侧入" :
					rightIn();
					break;
				case "左侧出" :
					leftOut();
					break;
				case "右侧出" :
					rightOut();
					break;
				case "冒泡排序" :
					bubbleSort();
					break;
				case "随机50个数据" :
					randomData();
					break;
			}
		});
	}
	

	function initDeleteNum(){
		var container = document.getElementById("container");
		container.addEventListener("click",function(event){
			if(event.target.nodeName == "SPAN"){
				deleteNum(container,event.target)
			}
		});
	}

	function init(){
		initQueueBtn();
		initDeleteNum();
	}
	init();
})();