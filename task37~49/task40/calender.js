	

	// insertPlace 放日历的元素
	// year 年份 number
	// month 月份 number  (从0数起, 0位1月, 11为12月)
	// 不传年月参数则默认当前年月
	function Calender(insertPlace,year,month){

		// 判断是否是闰年  如果是闰年返回1 否则返回0
		this.isLeap = function(year){
			// 能整除4 再判断  不能整除100或能整除400  即是闰年
			if(year % 4 === 0){
				if(year % 100 !== 0 || year % 400 === 0){
					return 1;
				}else{
					return 0;
				}
			}else{
				return 0;
			}
		}

		this.insertPlace = insertPlace;

		// 头部控制器与日历表格的容器
		this.container = document.createElement('div');
		this.container.style.display = 'inline-block';
		this.container.style.textAlign = 'center';
		this.container.style.fontFamily = '微软雅黑';

		// 头部控制器元素 存放 上下月按钮 与 年月显示
		this.control = document.createElement('section'); 
		this.control.style.position = 'relative';
		this.container.appendChild(this.control);

		// 显示年月的h2
		this.yearShowH2 = document.createElement('h2');
		this.yearShowH2.style.fontWeight = '100';
		this.yearShowH2.style.lineHeight = '40px';
		this.control.appendChild(this.yearShowH2);

		// 上个月 按钮
		this.lastMonthSpan = document.createElement('span');
		this.lastMonthSpan.innerHTML = '&lt;';
		this.lastMonthSpan.style.display = 'block';
		this.lastMonthSpan.style.width = '50px';
		this.lastMonthSpan.style.height = '100%';
		this.lastMonthSpan.style.position = 'absolute';
		this.lastMonthSpan.style.top = '0px';
		this.lastMonthSpan.style.left = '0px';
		this.lastMonthSpan.style.fontSize = '28px';
		this.lastMonthSpan.style.cursor = 'pointer';
		this.lastMonthSpan.style.webkitUserSelect = 'none';
		this.control.appendChild(this.lastMonthSpan);

		// 下个月按钮
		this.nextMonthSpan = document.createElement('span');
		this.nextMonthSpan.innerHTML = '&gt;';
		this.nextMonthSpan.style.display = 'block';
		this.nextMonthSpan.style.width = '50px';
		this.nextMonthSpan.style.height = '100%';
		this.nextMonthSpan.style.position = 'absolute';
		this.nextMonthSpan.style.top = '0px';
		this.nextMonthSpan.style.right = '0px';
		this.nextMonthSpan.style.fontSize = '28px';
		this.nextMonthSpan.style.cursor = 'pointer';
		this.nextMonthSpan.style.webkitUserSelect = 'none';
		this.control.appendChild(this.nextMonthSpan);

		// 日历表格元素
		this.tableEle = document.createElement('table');
		this.tableEle.style.textAlign = 'center';
		this.tableEle.style.borderCollapse = 'collapse';
		this.tableEle.style.fontFamily = '微软雅黑';
		this.tableEle.style.border = '1px solid #000';

		// 当触发点击的是 td 时 添加背景色
		this.tableEle.addEventListener('click',function(event){
			if(event.target.nodeName === 'TD'){
				if(event.target.getAttribute('data-current') !== 'false'){

					if(event.target.style.backgroundColor === 'rgb(255, 152, 0)'){
						event.target.style.backgroundColor = 'transparent';
					}else{
						var td = this.querySelectorAll('td');
						for(var i=0; i<td.length; i++){
							td[i].style.backgroundColor = 'transparent';
						}
						event.target.style.backgroundColor = '#FF9800';
					}

				}
			}
		});

		this.init = function(year,month){
			this.tableEle.innerHTML = '';
			// 如果没有传参数则默认为当前时间 年-月
			var yearQuery = year === undefined ? new Date().getFullYear() : year;
			var monthQuery = month === undefined ? new Date().getMonth() : month;
			// console.log(yearQuery +":"+ monthQuery);

			// 获取当前年-月-日
			var time = new Date(yearQuery,monthQuery);
			var y = time.getFullYear();
			var m = time.getMonth();
			var d = time.getDate();
			// console.log(y+"-"+m+"-"+d);

			// 显示年月
			this.yearShowH2.innerHTML = y + "-" + (m+1);

			// 给上下月按钮添加事件
			// addEventListener 不会移除原有事件
			// 事件属性 是 赋值行为 会覆盖掉原有事件
			this.lastMonthSpan.onclick = function lastMonthFun(){
				if(m-1 < 0){
					this.init(y-1,11);
				}else{
					this.init(y,m-1);
				}
			}.bind(this);

			this.nextMonthSpan.onclick = function nextMonthFun(){
				if(m+1 > 11){
					this.init(y+1,0);
				}else{
					this.init(y,m+1);
				}
			}.bind(this);

			// 所有月份
			var month = [31,28+this.isLeap(y),31,30,31,30,31,31,30,31,30,31];

			// 获取月的第一日是星期几
			var firstDayOfWeek = new Date(y,m,1).getDay();
			// console.log('第一天是星期几,0表示星期日:'+firstDayOfWeek);

			// 月的天数 加上 星期几 除 7 为所需行数
			var rows = Math.ceil( (month[m]+firstDayOfWeek) / 7 );
			// console.log('所需行数:'+rows);

			// 所有星期
			var week = ['日','一','二','三','四','五','六'];

			// 渲染表头
			var thead = document.createElement('thead');
			var theadTr = document.createElement('tr');
			var theadTh = '';
			for(var i=0; i<week.length; i++){
				theadTh += '<th style="padding: 10px; font-weight: 100;">'+week[i]+'</th>';
			}
			theadTr.innerHTML = theadTh;
			thead.appendChild(theadTr);
			this.tableEle.appendChild(thead);

			// 渲染表格内容
			var tbody = document.createElement('tbody');

			// 第一个循环渲染行tr  rows为行数
			for(var j=0; j<rows; j++){
				var tbodyTr = document.createElement('tr');
				var tbodyTd = '';

				// 第二个循环渲染每行所需td  7为固定星期数
				for(var k=0; k<7; k++){
					// console.log(j)
					var index = j*7+k;  // 没想到的计算方式  抄来的  
					var day = index - firstDayOfWeek + 1; // 没想到的计算方式  抄来的
					// console.log('所有单元格的索引:'+index);
					// console.log('单元格索引减去第一天的星期数得到天数:'+day);

					if(day <= 0){
						// day小于0则取到上月的末尾天数
						var lastMonthDay = (month[m-1] || month[month.length-1])  + day;
						// data-current属性用来判断是否是当前月的天数(点击改变背景色时用到)
						tbodyTd += '<td style="color: #999; padding: 10px; border: 1px solid #000; cursor: default;" data-current="false">'+lastMonthDay+'</td>';
					}else if(day > month[m]){
						// day大于总天数则变为起始天数
						var nextMonthDay = day - month[m];
						tbodyTd += '<td style="color: #999; padding: 10px; border: 1px solid #000; cursor: default;" data-current="false">'+nextMonthDay+'</td>';
					}else{
						// 根据日数获取时间再获取该日是星期几 6和0为周六日
						var weekend = new Date(y,m,day).getDay();
						if(weekend === 0 || weekend === 6 ){
							tbodyTd += '<td style="color: red; padding: 10px; border: 1px solid #000; cursor: default;">'+day+'</td>';
						}else{
							tbodyTd += '<td style="padding: 10px; border: 1px solid #000; cursor: default;">'+day+'</td>';
						}	
					}

				}

				tbodyTr.innerHTML = tbodyTd;
				tbody.appendChild(tbodyTr);
			}

			this.tableEle.appendChild(tbody);
			this.container.appendChild(this.tableEle);
			insertPlace.appendChild(this.container);

		}

		// 执行渲染函数
		this.init(year,month);

	}


	function $(id){
		return document.querySelector(id);
	}

	var calender = new Calender($('.calender-container'),2012,11);
	var calenderTest = new Calender($('.calender-test'));

	
	