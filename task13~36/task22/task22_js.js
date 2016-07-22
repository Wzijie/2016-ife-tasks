
var treeWalker = new TreeWalker();
var container = document.querySelector("#container");
var preOrderBtn = document.querySelector(".pre-order");
var inOrderBtn = document.querySelector(".in-order");
var postOrderBtn = document.querySelector(".post-order");

//绑定事件
preOrderBtn.addEventListener("click",function(){
	treeWalker.preOrder(container);
	treeWalker.animation();
	treeWalker.nodeStack = [];
});
inOrderBtn.addEventListener("click",function(){
	treeWalker.inOrder(container);
	treeWalker.animation();
	treeWalker.nodeStack = [];
});
postOrderBtn.addEventListener("click",function(){
	treeWalker.postOrder(container);
	treeWalker.animation();
	treeWalker.nodeStack = [];
});

//构造函数
function TreeWalker(){
	this.nodeStack = [];
	//this.isWalker = false;
}
	//前序遍历
	TreeWalker.prototype.preOrder = function(node){		
		this.nodeStack.push(node);
		if(node.firstElementChild){
			this.preOrder(node.firstElementChild);
		}
		if(node.lastElementChild){
			this.preOrder(node.lastElementChild);
		}
	}

	//中序遍历
	TreeWalker.prototype.inOrder = function(node){		
		if(node.firstElementChild){
			this.preOrder(node.firstElementChild);
		}
		this.nodeStack.push(node);
		if(node.lastElementChild){
			this.preOrder(node.lastElementChild);
		}
	}

	//后序遍历
	TreeWalker.prototype.postOrder = function(node){		
		if(node.firstElementChild){
			this.preOrder(node.firstElementChild);
		}
		if(node.lastElementChild){
			this.preOrder(node.lastElementChild);
		}
		this.nodeStack.push(node);
	}

	//动画
	TreeWalker.prototype.animation = function(){
		var nodeStack = this.nodeStack;
		//var isWalker = this.isWalker;
		var timerId;
		var item = 0;
		console.log(this.nodeStack);
		//setTimeout(function(){
		//if(!this.isWalker){
			timerId = setInterval(function(){
				//console.log(this.nodeStack);
				//console.log(isWalker);
				nodeStack[item].style.backgroundColor = "blue";
				if(nodeStack[item-1]){
					nodeStack[item-1].style.backgroundColor = "#fff";
				}
				item++;
				if(item >= nodeStack.length){
					clearInterval(timerId);
					setTimeout(function(){
						nodeStack[item-1].style.backgroundColor = "#fff";
						//this.isWalker = false;
					},100);	
				}
			},100);
			//this.isWalker = true;
		//}
		//},50)
		
	}
