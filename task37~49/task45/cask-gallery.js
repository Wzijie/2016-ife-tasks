
	// 木桶布局/等高格子布局(横向瀑布流)
	// selector 容器选择器 (string)
	// imgNum 添加的图片数量 (number) 默认30
	// minHeight 假设的高度 (number) 默认300
	function CaskGallery(selector,imgNum,minHeight){

		// 容器元素
		this.container = document.querySelector(selector);

		// 图片数量
		this.imgNum = imgNum || 30;

		// 假设高度
		this.minHeight = minHeight || 300;

		// 容器元素的长宽比
		this.minAspectRatio = this.container.clientWidth / this.minHeight;

		this.padding = 5;
		
	}

	// 渲染图片
	CaskGallery.prototype.append = function(){
		// 获取数据
		var rows = this.getRow();

		for(var i=0,rowsLen=rows.length; i<rowsLen; i++){
			var rowDiv = document.createElement('div');

			// 该行的高度 = 容器宽度 / 该行的图片累加的长宽比
			rowDiv.style.height = this.container.clientWidth / rows[i].aspectRatio + 'px';

			var rowContentHtml = '';

			// 输出该行的图片
			for(var j=0,photoLen=rows[i].photo.length; j<photoLen; j++){
				rowContentHtml += 
					'<div style="height: 100%; display: inline-block; white-space: nowrap; box-sizing: border-box; ">' +
						'<img ' +
							'style="height: 100%; "' +
							'src="'+ rows[i].photo[j].url +'" ' +
							'alt="'+ rows[i].photo[j].width +'x'+ rows[i].photo[j].height +'"' + 
						'/>' +
					'</div>';

			}

			rowDiv.innerHTML = rowContentHtml;
			this.container.appendChild(rowDiv);
		}
	}

	// 获取图片数据 及 计算行数
	CaskGallery.prototype.getRow = function(){

		// 存放所有图片
		this.imgArray = [];

		// 生成图片数据
		for(var i=0; i<this.imgNum; i+=1){
			var width = Math.floor( Math.random()*300+300 );
			var height = Math.floor( Math.random()*300+300 );
			var color = Math.random().toString(16).substring(2,8);
			
			this.imgArray.push({
				width : width,
				height : height,
				url : 'http://placehold.it/' + width + 'x' + height + '/' + color + '/fff',
				ratio : width/height
			});
		}

		// 暂存一行的图片
		var photo = [];

		// 存放处理完毕的数据
		var rows = [];

		// 一行累加的长宽比
		var aspectRatio = 0;


		for(var j=0; j<this.imgArray.length; j++){

			photo.push(this.imgArray[j]);

			// 累加图片长宽比
			aspectRatio += this.imgArray[j].ratio;

			// 如果累加的图片长宽比 > 容器的长宽比
			// 则暂存的图片为一行 并 记录长宽比
			if(aspectRatio > this.minAspectRatio){
				rows.push({
					photo : photo,
					aspectRatio : aspectRatio,
				});
				photo = [];
				aspectRatio = 0;
			}
		}
		
		return rows;
	}

	var caskGallery = new CaskGallery('.gallery',20);
	caskGallery.append();