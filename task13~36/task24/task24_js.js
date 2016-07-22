
var treeWalker = new TreeWalker(),
	rootNode = document.querySelector("#container"),
	searchValue = document.querySelector(".search-input"),
	depthFirstBtn = document.querySelector(".depth-first"),
	breadthFirstBtn = document.querySelector(".breadth-first"),
	depthFirstSearchBtn = document.querySelector(".depth-first-search"),
	breadthFirstSearchBtn = document.querySelector(".breadth-first-search"),
	removeNodeBtn = document.querySelector(".remove-node"),
	addNodeValue = document.querySelector(".add-node-value"),
	addNodeBtn = document.querySelector(".add-node");

//绑定事件 
depthFirstBtn.addEventListener("click",function(){
	treeWalker.depthFirst(rootNode);
	treeWalker.animation();
});
breadthFirstBtn.addEventListener("click",function(){
	treeWalker.breadthFirst(rootNode);
	treeWalker.animation();
});
depthFirstSearchBtn.addEventListener("click",function(){
	treeWalker.depthFirst(rootNode);
	treeWalker.search();
});
breadthFirstSearchBtn.addEventListener("click",function(){
	treeWalker.breadthFirst(rootNode);
	treeWalker.search();
});
rootNode.addEventListener("click",function(event){
	if(event.target.nodeName == "DIV"){
		treeWalker.depthFirst(rootNode);
		treeWalker.selected(event.target);
	}
});
removeNodeBtn.addEventListener("click",function(){
	treeWalker.removeNode();
});
addNodeBtn.addEventListener("click",function(){
	treeWalker.addNode();
});

//构造函数
function TreeWalker(){
	this.nodeStack = [];
	this.isWalker = false;
	this.BFindex = 0;
	this.selectedNode = null;
}

	//深度优先遍历
	TreeWalker.prototype.depthFirst = function(node){	

		this.nodeStack.push(node);
		if(node.firstElementChild){
			for(var i=0; i<node.children.length; i++){
				this.depthFirst(node.children[i]);
			}
		}

	}	

	//广度优先遍历
	TreeWalker.prototype.breadthFirst = function(node){
		
		if(node){
			this.nodeStack.push(node);
			this.breadthFirst(node.nextElementSibling);
			node = this.nodeStack[this.BFindex++];
			this.breadthFirst(node.firstElementChild);
		}

	}

	//搜索
	TreeWalker.prototype.search = function(){
		var search = "search";
		for(var item in this.nodeStack){
			this.nodeStack[item].aims = false;
			if(this.nodeStack[item].firstChild.nodeValue.trim() == searchValue.value){
				this.nodeStack[item].aims = true;
				var find = true;
			}
		}
		this.animation(search,find);
	}
		
	
	//遍历动画方法
	TreeWalker.prototype.animation = function(search,find){

		var nodeStack = this.nodeStack,
			item = 0,
			self = this,
			timerId;
		console.log(nodeStack);
		self.nodeStack = [];
		self.BFindex = 0;
		for(var index in nodeStack){
			nodeStack[index].style.backgroundColor = "#fff";
		}
		if(!self.isWalker){
			self.isWalker = true;
			timerId = setInterval(function(){
				if(nodeStack[item].aims){
					nodeStack[item].style.backgroundColor = "green";
					find = true;
				}else{
					nodeStack[item].style.backgroundColor = "blue";
				}
				
				if(nodeStack[item-1] && !nodeStack[item-1].aims){
					nodeStack[item-1].style.backgroundColor = "#fff";
				}
				item++;
				if(item >= nodeStack.length){
					clearInterval(timerId);
					setTimeout(function(){
						if(!nodeStack[item-1].aims){
							nodeStack[item-1].style.backgroundColor = "#fff";
						}	
						if(search){
							if(!find){
								alert("查找不到内容");
							}
						}
						self.isWalker = false;
						for(var index in nodeStack){
							nodeStack[index].aims = false;
						}
					},300);	
				}
			},300);
		}

	}

	//选中节点特殊样式显示
	TreeWalker.prototype.selected = function(target){
		for(var item in this.nodeStack){
			this.nodeStack[item].style.backgroundColor = "#fff";
		}
		console.log(this.nodeStack);
		this.nodeStack = [];
		this.selectedNode = target;
		target.style.backgroundColor = "red";
	}

	//删除选中节点及所有子节点
	TreeWalker.prototype.removeNode = function(){
		if(this.selectedNode){
			this.selectedNode.parentNode.removeChild(this.selectedNode);
			this.selectedNode = null;
		}else{
			alert("未选中节点");
		}
	}

	//添加节点
	TreeWalker.prototype.addNode = function(){
		if(this.selectedNode){
			if(addNodeValue.value != ""){
				var div = document.createElement("div");
				div.innerHTML = addNodeValue.value;
				this.selectedNode.appendChild(div);
			}else{
				alert("未输入要添加的节点内容");
			}
		}else{
			alert("未选中节点");
		}
	}