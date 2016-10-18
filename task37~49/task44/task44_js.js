
	// 瀑布流布局
	// container 容器selector  String
	// column 列数 number  默认为4列
	// directory 图片目录 String
	function WaterFall(container,column,directory){

		// 容器
		this.container = document.querySelector(container);

		// 列数 默认为4列
		this.column = column || 4;

		// 图片索引标记
		this.imgIndex = 1;

		// 图片目录
		this.directory = directory;
		// 是否正在执行ajax请求 / 防止重复执行
		this.isGetImg = false;
		// ajax获取时的loading图片元素
		this.getImgLoading = null;
		// 提示已经没有更多图片了的文字元素
		this.noMoreImg = null;

		// 弹出的图片盒子
		this.popupBox = null;
		// 弹出的遮罩层
		this.mask = null;

		// 插入列
		var columnDivHtml = '';
		// 100除以列数 为 每列宽度百分比
		var columnWidth = 100 / this.column;
		// 循环完成全部列的html字符串
		for(var i=0; i<this.column; i+=1){
			columnDivHtml += '<div class="gallery-column" style=" display: inline-block; width: '+columnWidth+'%; padding: 8px; box-sizing: border-box; vertical-align: top;"></div>';
		}
		this.container.innerHTML = columnDivHtml;

		// 图片绑定this.popup弹出层方法
		this.container.addEventListener('click',function(event){
			if(event.target.nodeName === 'IMG'){
				this.popup(event.target);
			}
		}.bind(this));

		// 滚动事件
		// 滚到底部时显示loading图片并且执行addImg加载图片
		window.onscroll = function(){
			// console.log(document.body.scrollTop +':'+ document.body.offsetHeight +':'+ window.innerHeight);

			// 判断是否滚到了底部
			if(document.body.offsetHeight - document.body.scrollTop < window.innerHeight + 20){
				// 首次执行生成loading图片元素
				if(!this.getImgLoading){
					this.getImgLoading = document.createElement('img');
					this.getImgLoading.src = 'image/loading.gif';
					this.getImgLoading.style.width = '50px';
					this.getImgLoading.style.height = '50px';
					this.getImgLoading.style.bottom = '30px';
					this.getImgLoading.style.position = 'fixed';
					this.getImgLoading.style.left = '50%';
					this.getImgLoading.style.transform = 'translate(-50%,0)';
					this.getImgLoading.style.borderRadius = '50%';
					document.body.appendChild(this.getImgLoading);
				}
				// 显示loading图片及执行addImg
				this.getImgLoading.style.display = 'block';
				this.addImg(10);
			}else{
				// 若不在底部时将提示文字隐藏
				if(this.noMoreImg){
					this.noMoreImg.style.display = 'none';
				}
			}
		}.bind(this);
	}

	// 添加图片函数
	// addnum 要添加的图片数量 number  默认为1
	WaterFall.prototype.addImg = function(addNum){
		
		// 如果ajax正在执行则退出函数
		if(this.isGetImg){
			return;
		}

		this.isGetImg = true;

		// 保存图片名字的数组
		var imgData = null;

		// ajax提交目录数据
		var dirData = new FormData();
		dirData.append('dir',this.directory);

		// ajax获取图片名字
		var xhr = new XMLHttpRequest
		xhr.open('post','img_info.json');

		xhr.onreadystatechange = function(){

			if(xhr.readyState === 4){
				// console.log(xhr.responseText);
				imgData = JSON.parse(xhr.responseText);
				
				// console.log(this.imgIndex +'>'+ imgData.length);

				// 执行添加图片函数
				eachAddImg.call(this);
				
				
				// 加载图片完隐藏loading元素
				if(this.getImgLoading){
					this.getImgLoading.style.display = 'none';
				}

				this.isGetImg = false;
			}
			
		}.bind(this);

		xhr.send(dirData);

		// 要添加的图片数量 默认为1
		var addImgNum = addNum || 1;

		function eachAddImg(){
			// 循环执行添加图片操作
			// console.log(1)
			for(var i=0; i<addImgNum; i+=1){
				
				// 判断是否还有图片
				if(!imgData[this.imgIndex]){
					if(!this.noMoreImg){
						this.noMoreImg = document.createElement('p');
						this.noMoreImg.innerHTML = '已无更多图片';
						this.noMoreImg.style.position = 'fixed';
						this.noMoreImg.style.bottom = '30px';
						this.noMoreImg.style.left = '50%';
						this.noMoreImg.style.transform = 'translate(-50%,0)';
						document.body.appendChild(this.noMoreImg);
					}else{
						this.noMoreImg.style.display = 'block';
					}	
					return;
				}

				// 测试用图片高度随机
				var randomHeight = Math.floor( Math.random()*(60-30) + 30 );

				// 使用this.heightBubbleSort方法排序拿到当前高度最小的列
				var minHeightColumn = this.heightBubbleSort(this.container.children)[0];

				// 图片div的html
				var galleryDivHtml = '<div class="gallery-item" style=" background: #fff; border-radius: 10px; padding: 8px; box-sizing: border-box; margin-bottom: 10px; ">' +
					'<img src="image/loading.gif" class="gallery'+this.imgIndex+'" style=" display: block; width: 100%; height: '+randomHeight+'0px;" alt="img'+this.imgIndex+'" />' +
					'<figcaption>title</figcaption>' +
					'<p>img '+this.imgIndex+'</p>' +
					'</div>';

				// 将图片追加到高度最小的列
				minHeightColumn.innerHTML += galleryDivHtml;
				
				// 用新图片的onload来延迟加载图片
				var img = new Image;

				// 循环里 异步延迟执行的onload 要使用到每次递增的this.imgIndex;
				// 典型的闭包, 在for循环里使用定时器输出i
				// 闭包还是不会用,想到用闭包解决但是不知道怎么写
				// 最后百度解决

				// img.onload = function(){
				// 	console.log(minHeightColumn.querySelector('.gallery'+this.imgIndex));
				// 	console.log('.gallery'+this.imgIndex);
				// 	console.log(arguments);
				// 	minHeightColumn.querySelector('.gallery'+this.imgIndex).src = arguments[event].src;
				// }.bind(this);

				// 要用到每次循环时的this.imgIndex;
				// 在一个自执行函数里,接受num参数为每次循环的this.imgIndex
				// 自执行函数内返回一个匿名函数,这个匿名函数使用到上级函数作用域的num(num即为this.imgIndex)
				// 最终这个匿名函数返回后就是 onload要执行的函数
				var imgLoadHandler = (function(num){
					return function(){
						document.querySelector('.gallery'+num).src = this.src;
					}
				})(this.imgIndex);

				// 绑定onload事件
				img.onload = imgLoadHandler;

				// 图片名字的处理 
				// if(this.imgIndex < 10){
				// 	img.src = 'image/waterfall_img/nature_10-00'+this.imgIndex+'.jpg';
				// }else{
				// 	img.src = 'image/waterfall_img/nature_10-0'+this.imgIndex+'.jpg';
				// }

				img.src = this.directory + imgData[this.imgIndex];

				// 添加一张图片后索引加一
				this.imgIndex += 1;
				
			}
		}

	}

	// 冒泡排序找到高度最小的列
	// array 要排序的数组或类数组
	WaterFall.prototype.heightBubbleSort = function(array){
		// 暂存一项的变量
		var tempItem;

		// 判断是否是数组,不是数组则转为数组
		if(Object.prototype.toString.call(array) !== '[object Array]'){
			var array = Array.prototype.slice.call(array);
		};

		// 排序
		for(var i=0; i<array.length; i++){
			for(var j=0; j<array.length-1; j++){
				if(array[j].offsetHeight > array[j+1].offsetHeight){
					tempItem = array[j];
					array[j] = array[j+1];
					array[j+1] = tempItem;
				}
			}
		}

		// 返回排序后数组
		return array;
	}

	// WaterFall.prototype.getImgAjax = function(directory){

	// 	if(this.isGetImg){
	// 		return;
	// 	}

	// 	this.isGetImg = true;

	// 	var dirData = new FormData();
	// 	dirData.append('dir',directory);

	// 	var xhr = new XMLHttpRequest
	// 	xhr.open('post','get_img.php');

	// 	xhr.onreadystatechange = function(){

	// 		if(xhr.readyState === 4){
	// 			// console.log(xhr.responseText);
	// 			var imgData = JSON.parse(xhr.responseText);
	// 			// console.log(imgData[2]);
	// 			this.isGetImg = false;
	// 			return imgData;
	// 		}
			
	// 	}.bind(this);

	// 	xhr.send(dirData);

	// }

	// 图片弹出层方法
	// targetImg 被点击的图片 element
	WaterFall.prototype.popup = function(targetImg){

		// 第一次执行时判断是否生成了弹出层
		if(!this.mask){
			// 遮罩
			this.mask = document.createElement('div');
			this.mask.style.backgroundColor = 'rgba(0,0,0,0.8)';
			this.mask.style.position = 'fixed';
			this.mask.style.top = '0';
			this.mask.style.left = '0';
			this.mask.style.bottom = '0';
			this.mask.style.right = '0';
			this.mask.style.display = 'none';

			// 图片盒子
			this.popupBox = document.createElement('div');
			this.popupBox.style.position = 'fixed';
			this.popupBox.style.top = '50%';
			this.popupBox.style.left = '50%';
			this.popupBox.style.transform = 'translate(-50%,-50%)';
			this.popupBox.style.display = 'none';

			// 盒子内图片
			var popupImg = document.createElement('img');
			this.popupBox.appendChild(popupImg);

			document.body.appendChild(this.mask);
			document.body.appendChild(this.popupBox);

			// 遮罩点击隐藏弹出层
			this.mask.addEventListener('click',function(){
				this.popupBox.style.display = 'none';
				this.mask.style.display = 'none';
			}.bind(this));

		}

		// 替换图片src, 设置最大宽高
		this.popupBox.firstElementChild.src = targetImg.src;
		this.popupBox.firstElementChild.style.maxWidth = document.body.offsetWidth * 0.6 + 'px';
		this.popupBox.firstElementChild.style.maxHeight = window.outerHeight * 0.6 + 'px';

		this.popupBox.style.display = 'block';
		this.mask.style.display = 'block';

	}

	
