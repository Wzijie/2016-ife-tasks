
(function(){
	var inputNum = document.getElementById("input-num");
	var form = document.querySelector(".form");
	var queue = [];

	function output(){
		var container = document.getElementById("container");
		var queueDataStr = "";
		for(var i=0; i<queue.length; i++){
			queueDataStr += "<span>" + queue[i] + "</span>";
		}
		container.innerHTML = queueDataStr;
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
			queue.unshift(inputNum.value.trim());
			output();
		}else{
			alert("请输入数字！");
		}
	}
	function rightIn(){
		if(/\d/.test(inputNum.value)){
			queue.push(inputNum.value.trim());
			output();
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