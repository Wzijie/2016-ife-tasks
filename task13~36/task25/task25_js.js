
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
	if(event.target.nodeName == "A"){
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
rootNode.addEventListener("click",function(event){
	if(event.target.nodeName == "SPAN"){
		treeWalker.fold(event.target);
	}
});
window.addEventListener("load",function(){
	treeWalker.displayBlock();
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
				if(node.children[i].nodeName == "DIV"){
					this.depthFirst(node.children[i]);
				}
			}
		}

	}	

	//广度优先遍历
	TreeWalker.prototype.breadthFirst = function(node){
		
		if(node){
			if(node.nodeName == "DIV"){
				this.nodeStack.push(node);
			}
			this.breadthFirst(node.nextElementSibling);
			node = this.nodeStack[this.BFindex++];
			if(node){
				this.breadthFirst(node.firstElementChild);
			}
		}

	}

	//搜索
	TreeWalker.prototype.search = function(){
		var search = "search";
		for(var item in this.nodeStack){
			this.nodeStack[item].aims = false;
			if(this.nodeStack[item].firstElementChild.firstChild.nodeValue.trim() == searchValue.value){
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
		//console.log(nodeStack);
		self.nodeStack = [];
		self.BFindex = 0;
		for(var index in nodeStack){
			nodeStack[index].firstElementChild.style.backgroundColor = "#fff";
		}
		if(!self.isWalker){
			self.isWalker = true;
			timerId = setInterval(function(){
				if(nodeStack[item].aims){
					nodeStack[item].firstElementChild.style.backgroundColor = "green";
					self.searchFoldOpen(nodeStack[item]);
					find = true;
				}else{
					nodeStack[item].firstElementChild.style.backgroundColor = "blue";
				}
				
				if(nodeStack[item-1] && !nodeStack[item-1].aims){
					nodeStack[item-1].firstElementChild.style.backgroundColor = "#fff";
				}
				item++;
				if(item >= nodeStack.length){
					clearInterval(timerId);
					setTimeout(function(){
						if(!nodeStack[item-1].aims){
							nodeStack[item-1].firstElementChild.style.backgroundColor = "#fff";
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
					},100);	
				}
			},100);
		}

	}

	//选中节点特殊样式显示
	TreeWalker.prototype.selected = function(target){
		for(var item in this.nodeStack){
			this.nodeStack[item].firstElementChild.style.backgroundColor = "#fff";
		}
		console.log(this.nodeStack);
		this.nodeStack = [];
		this.selectedNode = target.parentNode;
		target.style.backgroundColor = "#ccc";
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

	//在选中节点下添加子节点
	TreeWalker.prototype.addNode = function(){
		if(this.selectedNode){
			if(addNodeValue.value != ""){
				var div = document.createElement("div");
				div.style.display = "block";
				div.innerHTML = "<a href='###'>" + addNodeValue.value + " <span>-</span></a>";
				this.selectedNode.appendChild(div);
			}else{
				alert("未输入要添加的节点内容");
			}
		}else{
			alert("未选中节点");
		}
	}

	//折叠效果
	TreeWalker.prototype.fold = function(target){

		for(var i=0,len=target.parentNode.parentNode.children.length; i<len; i++){
			if(target.parentNode.parentNode.children[i].nodeName == "DIV"){
				if(target.parentNode.parentNode.children[i].style.display == "block"){
					target.parentNode.parentNode.children[i].style.display = "none";
					target.innerHTML = "+";
				}else{
					target.parentNode.parentNode.children[i].style.display = "block";
					target.innerHTML = "-";
				}
				
			}
		}
		
	}

	TreeWalker.prototype.displayBlock = function(){
		this.depthFirst(rootNode);
		for(var index in this.nodeStack){
			this.nodeStack[index].style.display = "block";
		}
		this.nodeStack = [];
	};


	//搜索节点被折叠时展开
	TreeWalker.prototype.searchFoldOpen = function(node){
		if(node != rootNode){
			
			if(node.style.display == "none"){
				//node.style.display = "block";
				console.log(node.style.display);
				for(var i=0; i<node.parentNode.children.length; i++){
					if(node.parentNode.children[i].nodeName == "DIV"){
						node.parentNode.children[i].style.display = "block";
					}
							
				}
			
			}else{
				this.searchFoldOpen(node.parentNode);
			}
		}
	}
