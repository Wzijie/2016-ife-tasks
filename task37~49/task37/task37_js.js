/*
 *  @param 
 *  floatEle 浮出层, maskEle 遮罩层, dragEle 拖拽元素
 *  (如不提供拖拽元素参数則默认为浮出层的第一个子元素)
 */
function FloatLayer(floatEle,maskEle,dragEle){
	this.floatEle = floatEle;
	this.maskEle = maskEle;
	this.dragEle = dragEle;

	this.init();
}

// 添加样式及事件
FloatLayer.prototype.init = function(){
	this.floatEle.style.position = "fixed";
	this.floatEle.style.left = "50%";
	this.floatEle.style.top = "50%";
	this.floatEle.style.transform = "translate(-50%,-50%)";
	this.floatEle.style.zIndex = "999";

	this.maskEle.style.zIndex = "998";
	this.maskEle.addEventListener("click",function(){
		this.hide();
	}.bind(this));

	this.setDarg(this.dragEle || this.floatEle.children[0]);
}

// 显示
FloatLayer.prototype.show = function(){
	this.floatEle.style.left = "50%";
	this.floatEle.style.top = "50%";
	this.floatEle.style.visibility = "visible";
	this.maskEle.style.visibility = "visible";
}

// 隐藏
FloatLayer.prototype.hide = function(){
	this.floatEle.style.visibility = "hidden";
	this.maskEle.style.visibility = "hidden";
}

// 设置拖拽元素
FloatLayer.prototype.setDarg = function(node){
	node.style.cursor = "move";
	var self = this;
	var isMouseDown = false;

	node.addEventListener("mousedown",function(event){
		isMouseDown = true;
		var diffX = event.pageX - self.floatEle.offsetLeft;
		var diffY = event.pageY - self.floatEle.offsetTop;
		function move(event){
			if(isMouseDown){
				self.floatEle.style.left = event.pageX - diffX + "px";
				self.floatEle.style.top = event.pageY - diffY + "px";
			}	
		}

		document.addEventListener("mousemove",move);
		document.addEventListener("mouseup",function(){
			//document.removeEventListener("mousemove",move);
			isMouseDown = false;
		});

	});
}

// FloatLayer.prototype.resizeBottom = function(node){
// 	node.style.cursor = "s-resize";
// 	var self = this;
// 	var isMouseDown = false;

// 	node.addEventListener("mousedown",function(event){
// 		isMouseDown = true;
// 		var diffY = event.pageY ;
// 		var floatEleHeight = self.floatEle.offsetHeight;
// 		var floatEleTop = self.floatEle.offsetTop;

// 		function resize(event){
// 			if(isMouseDown){
// 				self.floatEle.style.height = floatEleHeight + (event.pageY - diffY)/2 + "px";
// 				self.floatEle.style.top = floatEleTop + (event.pageY - diffY)/2 + "px";
// 			}	
// 		}

// 		document.addEventListener("mousemove",resize);
// 		document.addEventListener("mouseup",function(){
// 			//document.removeEventListener("mousemove",move);
// 			isMouseDown = false;
// 		});

// 	});

// }

function createFloatLayer(floatEle,maskEle,dragEle){
	return new FloatLayer(floatEle,maskEle,dragEle);
}


function $(id){
	return document.querySelector(id);
}

var layer = createFloatLayer($('#float-layer'),$('#mask'),$('.content'));

$('.btn-show').addEventListener("click",function(){
	layer.show();
});
$('#btn-sure').addEventListener("click",function(){
	layer.hide();
});
$('#btn-cancel').addEventListener("click",function(){
	layer.hide();
});

//layer.resizeBottom($('#resize-bottom'));

