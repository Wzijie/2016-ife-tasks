
(function(){
	var tagQueue = [];
	var tagContainer = document.getElementById("tag-container");
	var hobbyQueue = [];
	var hobbyContainer = document.getElementById("hobby-container");

	//渲染
	function output(queue,container){	
		var queueStr = "";
		for(var i=0; i<queue.length; i++){
			queueStr += "<span>" + queue[i] + "</span>";
		}
		container.innerHTML = queueStr;
	}

	//删除
	function deleteNum(queue,container,target){
		var span = container.getElementsByTagName("span");

		for(var i=0,len=span.length; i<len; i++){
			span[i].index = i;
		}
		tagQueue.splice(target.index,1);
		output(queue,container);
	}


	//去除数组中的重复项
	function isRepeat(arr){
		var hash = {};
		for(var i=0; i<arr.length; i++){
			if(hash[arr[i]] == true){
				arr[i]="";
				console.log(i)
			}
			hash[arr[i]] = true;
		}
		var result = arr.filter(function(item){
			return item != "";
		});
		return result;
	}

	//hobby按钮处理函数
	function hobbyOutput(){
		var hobbyInput = document.getElementById("hobby-input");
		var hobbyData = hobbyInput.value.trim().split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function(item){
							if(item != null && item.length > 0){
								return true;
							}else{
								return false;
							}
						});
		
		hobbyQueue = hobbyQueue.concat(hobbyData);
		hobbyQueue = isRepeat(hobbyQueue);
		if(hobbyQueue.length > 10){
			hobbyQueue.splice(0,hobbyQueue.length - 10);
		}
		output(hobbyQueue,hobbyContainer);
		hobbyInput.value = "";
	}

	//tag文本框事件处理函数
	function tagOutput(tagInput,event){
		if(/[,， ]/.test(tagInput.value) || event.keyCode == 13){
			if(tagInput.value.trim().replace(/[,，]/g,"") != ""){
				var noRepeat = tagQueue.some(function(item){ return item==tagInput.value.trim().replace(/[,，]/g,"")});
				console.log(noRepeat);
				if(!noRepeat){
					tagQueue.push(tagInput.value.trim().replace(/[,，]/g,""));
				}	
			}
			if(tagQueue.length > 10){
				tagQueue.shift();
			}
			output(tagQueue,tagContainer);
			tagInput.value = "";
		}
	}

	//绑定事件
	function initQueueBtn(){
		var tagInput = document.getElementById("tag-input");
		var hobbyBtn = document.getElementById("hobby-btn");
		tagInput.addEventListener("keyup",function(event){
			tagOutput(tagInput,event);
		});
		tagContainer.addEventListener("mouseover",function(event){
			if(event.target.nodeName == "SPAN"){
				event.target.style.backgroundColor = "#FC0304";
				event.target.innerHTML = "点击删除：" + event.target.innerHTML;
			}
		});
		tagContainer.addEventListener("mouseout",function(event){
			if(event.target.nodeName == "SPAN"){
				event.target.style.backgroundColor = "#8fc8ff";
				event.target.innerHTML = event.target.innerHTML.slice(5);
			}
		});
		tagContainer.addEventListener("click",function(event){
			if(event.target.nodeName == "SPAN"){
				deleteNum(tagQueue,tagContainer,event.target);
			}
		});
		hobbyBtn.addEventListener("click",hobbyOutput);
	}
	

	
	//初始化
	function init(){
		initQueueBtn();
	}
	init();
})();