
// tableEle: 表格元素 element
// data: 数据 object
// data格式 obj = {
//	name : [分数,分数,分数]
// }
// thead: 表头信息 array
function SortTable(tableEle,data,thead){
	this.tableEle = tableEle;
	this.data = data;
	this.thead = thead;

	this.init(this.data);

	// 首行表头固定
	window.addEventListener('scroll',function(){
		// console.log(this.tableEle.offsetTop);
		// console.log(document.body.scrollTop);
		if(document.body.scrollTop >= this.tableEle.offsetTop && document.body.scrollTop < this.tableEle.offsetTop + this.tableEle.offsetHeight){
			this.tableEle.firstElementChild.style.position = 'fixed';
			this.tableEle.firstElementChild.style.top = '0';
			this.tableEle.firstElementChild.style.left = this.tableEle.offsetLeft + 'px';
		}else{
			this.tableEle.firstElementChild.style.position = 'static';
		}
	}.bind(this));
}

// 初始化表格 data 数据
SortTable.prototype.init = function(data){
	var tableThead = document.createElement("thead");
	var theadTr = document.createElement("tr");
	// var theadTdStr = "";
	this.tableEle.style.textAlign = 'center';
	this.tableEle.style.backgroundColor = '#fff';

	tableThead.style.backgroundColor = '#666';
	tableThead.style.color = '#fff';

	// 初始化表头thead
	for(var i=0; i<this.thead.length; i++){
		var theadTd = document.createElement('td');
		// 给表头td加上索引 用来知道点的是哪一列
		theadTd.index = i;
		theadTd.style.position = 'relative';
		// theadTd.style.padding = '5px 20px';
		theadTd.style.width = '100px';
		// 输出表头信息
		theadTd.innerHTML = this.thead[i];
		// i不等于0 就是除第一列姓名外 其他添加排序按钮
		if(i !== 0){
			// 升降排序按钮
			var theadSortSpanDESC = document.createElement('span');
			var theadSortSpanASC = document.createElement('span');

			// 添加事件
			theadSortSpanDESC.addEventListener('click',function(event){
				this.sortASC(event.target,'DESC');
			}.bind(this));
			theadSortSpanASC.addEventListener('click',function(event){
				this.sortASC(event.target,'ASC');
			}.bind(this));

			// 初始化样式
			theadSortSpanDESC.style.width = '0px';
			theadSortSpanDESC.style.height = '0px';
			theadSortSpanDESC.style.display = 'block';
			// theadSortSpanDESC.style.backgroundColor = '#000';
			theadSortSpanDESC.style.position = 'absolute';
			theadSortSpanDESC.style.top = '3px';
			theadSortSpanDESC.style.right = '5px';
			theadSortSpanDESC.style.borderLeft = '5px solid transparent';
			theadSortSpanDESC.style.borderRight = '5px solid transparent';
			theadSortSpanDESC.style.borderBottom = '10px solid #000';
			theadSortSpanDESC.style.cursor = 'pointer';

			theadSortSpanASC.style.width = '0px';
			theadSortSpanASC.style.height = '0px';
			theadSortSpanASC.style.display = 'block';
			// theadSortSpanASC.style.backgroundColor = '#000';
			theadSortSpanASC.style.position = 'absolute';
			theadSortSpanASC.style.bottom = '3px';
			theadSortSpanASC.style.right = '5px';
			theadSortSpanASC.style.borderLeft = '5px solid transparent';
			theadSortSpanASC.style.borderRight = '5px solid transparent';
			theadSortSpanASC.style.borderTop = '10px solid #000';
			theadSortSpanASC.style.cursor = 'pointer';

			// 将排序按钮插入到td
			theadTd.appendChild(theadSortSpanDESC);
			theadTd.appendChild(theadSortSpanASC);
		}
		// 将td插入到tr
		theadTr.appendChild(theadTd);
		// theadTdStr += "<td>"+ this.thead[i] +"</td>";
	}

	// 将tr插入到thead并将thead插入到table
	// theadTr.innerHTML = theadTdStr;
	tableThead.appendChild(theadTr);
	this.tableEle.appendChild(tableThead);

	// 表格内容tbody
	var tableTbody = document.createElement("tbody");

	// 获取数据内容初始化表格内容
	for(var item in data){
		var tbodyTr = document.createElement("tr");
		// tbodyTr.style.textAlign = 'center';
		var tbodyTdStr = "";
		// 每行第一个单元格为姓名
		tbodyTdStr += "<td style='width:100px;'>"+ item +"</td>";
		// 后续为放分数的单元格
		for(var j=0; j<data[item].length; j++){
			tbodyTdStr += "<td style='width:100px;'>"+ data[item][j] +"</td>";
		}
		tbodyTr.innerHTML = tbodyTdStr;
		tableTbody.appendChild(tbodyTr);
	}
	this.tableEle.appendChild(tableTbody);
}

// 排序
// target 触发事件的元素
// sortOrder 排序方式 'DESC' or 'ASC' 默认为ASC
// data 数据 默认为this.data
SortTable.prototype.sortASC = function(target,sortOrder,data){
	// 数据 (没用到)
	var sortASCData = data || this.data;

	// 存放排序后的数据
	var dataArray = [];

	// var arraySortEd = {};

	// 拿到表格数据
	(function(){
		// 表格rows属性为全部的行 就是全部的tr
		for(var i=1;i<target.parentNode.parentNode.parentNode.parentNode.rows.length;i++){
			dataArray[i] = [];
			// cells为一行内全部的td
			// console.log(target.parentNode.parentNode.parentNode.parentNode.rows[i].cells);
			for(var j=0; j<target.parentNode.parentNode.parentNode.parentNode.rows[i].cells.length; j++){

				dataArray[i].push(target.parentNode.parentNode.parentNode.parentNode.rows[i].cells[j].innerHTML);
			};
		}
	})();
	console.log(dataArray);
	console.log(target.parentNode.index);

	(function(){
		// 排序用来暂存一项数据
		var tempItem;
		
		// console.log(dataArray.length);
		// 从小到大排序
		for(var i=1; i<dataArray.length; i++){
			// console.log(i)
			for(var j=1; j<dataArray.length-1; j++){
				// console.log(j)
				// if(dataArray[j+1]){
					// 出错问题 '61' > '8' 为false??  不是转换成数字  61 > 8 为真吗???
					// var bResult = "25" < "3";
					// alert(bResult);	输出 "true"
					// 上面这段代码比较的是字符串 "25" 和 "3"。两个运算数都是字符串，
					// 所以比较的是它们的字符代码（"2" 的字符代码是 50，"3" 的字符代码是 51）。
					// console.log(dataArray[j][target.parentNode.index] +">"+ dataArray[j+1][target.parentNode.index]);
					// console.log(dataArray[j][target.parentNode.index] > dataArray[j+1][target.parentNode.index]);
					if(parseInt(dataArray[j][target.parentNode.index]) > parseInt(dataArray[j+1][target.parentNode.index])){
						// console.log(dataArray[j][target.parentNode.index] +">"+ dataArray[j+1][target.parentNode.index]);
						tempItem = dataArray[j];
						dataArray[j] = dataArray[j+1];
						dataArray[j+1] = tempItem;
					}
				// }
			}
			// arraySortEd[dataArray[i][0]] = dataArray[i].slice(0);
			// console.log(dataArray[i] +":"+ i);	
			// console.log(arraySortEd[dataArray[i][0]] +":"+ i);
		}
		// for(var k=1; k<dataArray.length; k++){
		// 	arraySortEd[dataArray[k].shift()] = dataArray[k].slice(0);
		// }
		// for(var name in arraySortEd){
		// 	// arraySortEd[name].shift();
		// 	console.log(name +':'+ arraySortEd[name]);
		// }
		console.log(dataArray);
		// console.log(arraySortEd);

	})();

	// 指定排序为DESC则将数组翻转
	(function(){
		if(sortOrder === 'DESC'){	
			console.log(dataArray[0]);	
			dataArray.reverse();
			console.log(dataArray[0]);
		}	
	})();

	this.output(dataArray,sortOrder);
}

// 改变表格数据
SortTable.prototype.output = function(data,sortOrder){
	for(var i=0; i<this.tableEle.lastElementChild.rows.length; i++){
		for(var j=0; j<this.tableEle.lastElementChild.rows[i].cells.length; j++){
			if(sortOrder === 'DESC'){
				this.tableEle.lastElementChild.rows[i].cells[j].innerHTML = data[i][j];
			}else{
				this.tableEle.lastElementChild.rows[i].cells[j].innerHTML = data[i+1][j];
			}
		}
	}
}

SortTable.prototype.freeze = function(){

}

function $(id){
	return document.querySelector(id);
}

// 随机产生分数
function randomScore(n){
	var arr = [];
	var sum = 0;
	for(var i=0; i<n; i++){
		var num = Math.floor(Math.random()*101);
		sum += num;
		arr.push(num);
	}
	arr.push(sum);
	return arr;
}

var data = {
	"张三" : randomScore(3),
	"李四" : randomScore(3),
	"小明" : randomScore(3),
	"啊狗" : randomScore(3),
	"小虎" : randomScore(3),
	"啊豹" : randomScore(3),
	"无极剑圣" : randomScore(3),
	"沙漠死神" : randomScore(3)
}

var thead = ["姓名","语文","数学","英语","总分"];

var table = new SortTable($('#sort-table'),data,thead);

