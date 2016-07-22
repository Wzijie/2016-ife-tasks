
var treeWalker = new TreeWalker();
var preOrderBtn = document.querySelector(".pre-order");
var container = document.querySelector("#container");

preOrderBtn.addEventListener("click",function(){
	treeWalker.preOrder(container);
	treeWalker.animation();
});


function TreeWalker(){

	var nodeStack = [];

	this.preOrder = function(node){		
		//alert(node.className);
		nodeStack.push(node);
		// for(var i=0; i<node.children.length; i++){
		// 	this.preOrder(node.children[i]);
		// }
		if(node.nextElementSibling){
			this.preOrder(node.nextElementSibling);
		}
		if(node.firstElementChild){
			this.preOrder(node.firstElementChild);
		}
	}

	this.animation = function(){
		console.log(nodeStack);
		var timerId;
		var item = 0;
		setTimeout(function(){
			timerId = setInterval(function(){
				nodeStack[item].style.backgroundColor = "blue";
				if(nodeStack[item-1]){
					nodeStack[item-1].style.backgroundColor = "#fff";
				}
				item++;
				if(item >= nodeStack.length){
					clearInterval(timerId);
					setTimeout(function(){
						nodeStack[item-1].style.backgroundColor = "#fff";
						nodeStack = [];
					},500);	
				}
			},500);
		},50)
		
	}
}