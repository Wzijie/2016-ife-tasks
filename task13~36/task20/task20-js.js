
(function(){
	var inputNum = document.getElementById("input-num");
	var form = document.querySelector(".form");
	var queue = [];

	function output(searchStr){
		var container = document.getElementById("container");
		var queueDataStr = "";
		for(var i=0; i<queue.length; i++){
			if(searchStr != null && searchStr.length > 0){
				queueDataStr += "<div>" + queue[i].replace(new RegExp(searchStr,"g"),"<span>" + searchStr + "</span>") + "</div>";
			}else{
				queueDataStr += "<div>" + queue[i] + "</div>";
			}	
		}
		container.innerHTML = queueDataStr;
	}

	function deleteNum(container,target){
		var div = container.getElementsByTagName("div");

		for(var i=0,len=div.length; i<len; i++){
			div[i].index = i;
		}
		queue.splice([target.index],1);
		output();
	}

	function leftIn(data){
		for(var i=0; i<data.length; i++){
			queue.unshift(data[i]);
		}
		output();
	}
	function rightIn(data){
		for(var i=0; i<data.length; i++){
			queue.push(data[i]);
		}
		output();
	}

	function leftOut(data){
		if(queue.length){
			alert(queue.shift());
			output();
		}	
	}
	function rightOut(data){
		if(queue.length){
			alert(queue.pop());
			output();
		}
	}

	function search(){
		var searchStr = document.getElementById("search-input").value.trim();
		output(searchStr);
	}

	function initQueueBtn(){
		form.addEventListener("click",function(event){
			var data = inputNum.value.trim().split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function(item){
							if(item != null && item.length > 0){
								return true;
							}else{
								return false;
							}
						});
			switch (event.target.innerHTML){
				case "左侧入" :
					leftIn(data);
					break;
				case "右侧入" :
					rightIn(data);
					break;
				case "左侧出" :
					leftOut(data);
					break;
				case "右侧出" :
					rightOut(data);
					break;
				case "查询" :
					search();
					break;
			}
		});
	}
	

	function initDeleteNum(){
		var container = document.getElementById("container");
		container.addEventListener("click",function(event){
			if(event.target.nodeName == "DIV"){
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