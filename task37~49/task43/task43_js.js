	
	// 拼图布局
	// container 容器选择器 String
	function PuzzleLayout(container){

		this.container = document.querySelector(container);

		// 设置初始样式
		for(var i=0,iLen=this.container.children.length; i<iLen; i+=1){
			this.container.children[i].style.width = '100%';
			this.container.children[i].style.position = 'relative';

			for(var j=0,jLen=this.container.children[i].children.length; j<jLen; j+=1){
				this.container.children[i].children[j].style.width = '100%';
				this.container.children[i].children[j].style.height = '100%';
				this.container.children[i].children[j].style.position = 'absolute';
			}
		}

		// 初始化
		this.setHeight();
		this.init();

		// resize执行setHeight调整子容器高度
		window.addEventListener('resize',function(){
			var timeoutId = null;
			if(!timeoutId){
				timeoutId = setTimeout(function(){
					this.setHeight();
					timeoutId = null;
				}.bind(this),200);
			}	
		}.bind(this));

	}

	// 调整子容器高度为body宽度的一半
	PuzzleLayout.prototype.setHeight = function(){
		var length = this.container.children.length;
		for(var i=0; i<length; i+=1){
			this.container.children[i].style.height = document.body.offsetWidth / 2 + 'px';
		}
	}

	// 设置各图片样式 进行拼图布局
	PuzzleLayout.prototype.init = function(){

		// 2张图片样式
		function twoImg(element){

			element.children[0].style.webkitClipPath = 'polygon( 0 0, 100% 0, 50% 100%, 0 100% )';
			element.children[0].style.width = '66.666%';

			element.children[1].style.webkitClipPath = 'polygon( 50% 0, 100% 0, 100% 100%, 0 100% )';
			element.children[1].style.width = '66.666%';
			element.children[1].style.left = '33.333%';

		}

		// 3张图片样式
		function threeImg(element){

			element.children[0].style.width = '66.666%';

			element.children[1].style.width = '33.333%';
			element.children[1].style.height = '50%';
			element.children[1].style.left = '66.666%';

			element.children[2].style.width = '33.333%';
			element.children[2].style.height = '50%';
			element.children[2].style.left = '66.666%';
			element.children[2].style.top = '50%';

		}

		// 4张图片样式
		function fourImg(element){

			element.children[0].style.width = '50%';
			element.children[0].style.height = '50%';

			element.children[1].style.width = '50%';
			element.children[1].style.height = '50%';
			element.children[1].style.left = '50%';

			element.children[2].style.width = '50%';
			element.children[2].style.height = '50%';
			element.children[2].style.top = '50%';

			element.children[3].style.width = '50%';
			element.children[3].style.height = '50%';
			element.children[3].style.left = '50%';
			element.children[3].style.top = '50%';

		}

		// 5张图片样式
		function fiveImg(element){

			element.children[0].style.width = '66.666%';
			element.children[0].style.height = '66.666%';

			element.children[1].style.width = '33.333%';
			element.children[1].style.height = '66.666%';
			element.children[1].style.left = '66.666%';

			element.children[2].style.width = '33.333%';
			element.children[2].style.height = '33.333%';
			element.children[2].style.top = '66.66666%';

			element.children[3].style.width = '33.333%';
			element.children[3].style.height = '33.333%';
			element.children[3].style.left = '33.333%';
			element.children[3].style.top = '66.66666%';

			element.children[4].style.width = '33.333%';
			element.children[4].style.height = '33.333%';
			element.children[4].style.left = '66.666%';
			element.children[4].style.top = '66.66666%';

		}

		// 6张图片样式
		function sixImg(element){

			element.children[0].style.width = '66.666%';
			element.children[0].style.height = '66.666%';

			element.children[1].style.width = '33.333%';
			element.children[1].style.height = '33.333%';
			element.children[1].style.left = '66.666%';

			element.children[2].style.width = '33.333%';
			element.children[2].style.height = '33.333%';
			element.children[2].style.left = '66.666%';
			element.children[2].style.top = '33.333%';

			element.children[3].style.width = '33.333%';
			element.children[3].style.height = '33.333%';
			element.children[3].style.top = '66.666%';

			element.children[4].style.width = '33.333%';
			element.children[4].style.height = '33.333%';
			element.children[4].style.left = '33.333%';
			element.children[4].style.top = '66.666%';

			element.children[5].style.width = '33.333%';
			element.children[5].style.height = '33.333%';
			element.children[5].style.left = '66.666%';
			element.children[5].style.top = '66.666%';

		}

		// 根据子容器的子元素个数执行对应的样式函数
		var length = this.container.children.length;
		for(var i=0; i<length; i+=1){
			switch(this.container.children[i].children.length){
				case 2 :
					twoImg(this.container.children[i]);
					break;
				case 3 :
					threeImg(this.container.children[i]);
					break;
				case 4 :
					fourImg(this.container.children[i]);
					break;
				case 5 :
					fiveImg(this.container.children[i]);
					break;
				case 6 :
					sixImg(this.container.children[i]);
					break;
				default: break;
			}
		}
	}
