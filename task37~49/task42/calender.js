	

	// insertPlace 放日历的元素
	// year 年份 Number
	// month 月份 Number  (从0数起, 0为1月, 11为12月)
	// 不传年月参数则默认当前年月
	// radioOrMulti 选择日期单元格是单选 还是 选择一个日期范围 'radio' or 'multi' String  默认radio
	// tdClickCallback 日期单元格点击后的回调函数 Function
	function Calender(insertPlace,year,month,radioOrMulti,tdClickCallback){

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

		// 放日历的元素
		this.insertPlace = insertPlace;

		// 多选还是单选
		// 日历默认为单选日历
		this.radioOrMulti = radioOrMulti === undefined ? 'radio' : radioOrMulti;

		// 多选日历中用来确定范围的2个td
		this.multiDayArray = [];

		// 获取年-月-日
		this.time = new Date(year,month);
		this.y = this.time.getFullYear();
		this.m = this.time.getMonth();
		this.d = this.time.getDate();
		// console.log(y+"-"+m+"-"+d);

		// 总容器
		this.container = document.createElement('div');
		this.container.style.display = 'inline-block';
		this.container.style.textAlign = 'center';
		this.container.style.fontFamily = '微软雅黑';
		this.container.style.position = 'relative';


		// 时间选择按钮
		this.timeSelectBtn = document.createElement('div');
		if(this.radioOrMulti === 'radio'){
			this.timeSelectBtn.style.width = '125px';
		}else if(this.radioOrMulti === 'multi'){
			this.timeSelectBtn.style.width = '250px';
		}
		this.timeSelectBtn.style.height = '30px';
		this.timeSelectBtn.style.border = '1px solid #000';
		this.timeSelectBtn.style.lineHeight = '30px';
		this.timeSelectBtn.style.cursor = 'pointer';
		// 插入到总容器
		this.container.appendChild(this.timeSelectBtn);


		// 头部控制器与日历表格  的日历面板容器
		this.calenderContainer = document.createElement('div');
		this.calenderContainer.style.display = 'none';
		this.calenderContainer.style.padding = '10px';
		this.calenderContainer.style.position = 'absolute';
		this.calenderContainer.style.top = '40px';
		this.calenderContainer.style.left = '50px';
		this.calenderContainer.style.boxShadow = '5px 5px 15px rgba(0,0,0,0.5)';
		this.calenderContainer.style.backgroundColor = '#fff';
		this.calenderContainer.setAttribute('id','calender-container');


		// 头部控制器元素 存放 上下月按钮 与 年月显示
		this.control = document.createElement('section'); 
		this.control.style.position = 'relative';
		// 插入到日历面板
		this.calenderContainer.appendChild(this.control);


		// 显示年月的h2
		this.yearShowH2 = document.createElement('h2');
		this.yearShowH2.style.fontWeight = '100';
		this.yearShowH2.style.lineHeight = '40px';
		// 插入到控制器
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
		// 插入到控制器
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
		// 插入到控制器
		this.control.appendChild(this.nextMonthSpan);


		// 日历表格元素
		this.tableEle = document.createElement('table');
		this.tableEle.style.textAlign = 'center';
		this.tableEle.style.borderCollapse = 'collapse';
		this.tableEle.style.fontFamily = '微软雅黑';
		this.tableEle.style.border = '1px solid #000';


		// 确定按钮
		this.sureBtn = document.createElement('button');
		this.sureBtn.innerHTML = '确定';
		this.sureBtn.style.width = '80px';
		this.sureBtn.style.height = '30px';
		this.sureBtn.style.fontFamily = '微软雅黑';
		this.sureBtn.style.margin = '10px 10px 0 0';
		this.calenderContainer.appendChild(this.sureBtn);
		this.sureBtn.addEventListener('click',function sureBtnHandler(){
			if(this.radioOrMulti === 'radio'){
				this.timeSelectBtn.innerHTML = this.y + "-" + (this.m+1) + "-" + this.d;
			}else if(this.radioOrMulti === 'multi'){
				this.timeSelectBtn.innerHTML = this.y + "-" + (this.m+1) + "-" + Math.min.apply(null,this.multiDayArray) + " ~ " + this.y + "-" + (this.m+1) + "-" + Math.max.apply(null,this.multiDayArray);
			}
		}.bind(this));
		// 取消按钮
		this.cancelBtn = document.createElement('button');
		this.cancelBtn.innerHTML = '取消';
		this.cancelBtn.style.width = '80px';
		this.cancelBtn.style.height = '30px';
		this.cancelBtn.style.fontFamily = '微软雅黑';
		this.cancelBtn.style.margin = '10px 0 0 10px';
		this.calenderContainer.appendChild(this.cancelBtn);

		// console.log(radioOrMulti); 访问的到
		// 判断是单选日历还是多选日历 添加相应的事件
		(function radioOrMultiHandler(){

			// console.log(radioOrMulti); //访问不到?
			// 测试为可以访问

			

			// 最外层的判断为判断单选还是多选
			if(this.radioOrMulti === 'radio'){

				this.tableEle.addEventListener('click',function(event){
					// 判断是否是td触发事件
					if(event.target.nodeName === 'TD'){
						// 判断该td是否为当月日期
						if(event.target.getAttribute('data-current') !== 'false'){
							// 如果已经高亮显示则去除高亮
							// 否则循环去除所有td高亮 再将目标td设置为高亮
							if(event.target.style.backgroundColor === 'rgb(255, 152, 0)'){
								event.target.style.backgroundColor = 'transparent';
							}else{
								var td = this.tableEle.querySelectorAll('td');
								for(var i=0; i<td.length; i++){
									td[i].style.backgroundColor = 'transparent';
								}
								event.target.style.backgroundColor = '#FF9800';
		 						// 保存当前点击的日期
								this.d = event.target.innerHTML;
								// 如果回调函数存在则执行
								if(typeof tdClickCallback === 'function'){
									tdClickCallback();
								}
							}

						}
					}
				}.bind(this));

			}else if(this.radioOrMulti === 'multi'){

				this.tableEle.addEventListener('click',function(event){
					// 判断是否是td触发事件
					if(event.target.nodeName === 'TD'){
						// 判断该td是否为当月日期
						if(event.target.getAttribute('data-current') !== 'false'){
							
							// 改变2个日期之间的日期的背景颜色

							// 首先判断存放日期的数组长度是否小于2,只需要2个日期确定范围
							// 第二个条件 当前td是否为橙色以点击过
							// 这个条件是为了 当已经点击过2个td确定范围时,我想再点击其中一个td取消范围,而存在的
							if(this.multiDayArray.length < 2 || event.target.style.backgroundColor === 'rgb(255, 152, 0)'){

								// 接下来判断 当前td是否为橙色以点击过
								// 如果是则取消橙色状态、将范围内td取消蓝色状态、去掉存放在日期数组的当前日期
								if(event.target.style.backgroundColor === 'rgb(255, 152, 0)'){
									// 取消当前td橙色状态
									event.target.style.backgroundColor = 'transparent';
									// 取消范围内td蓝色状态
									var tdNodeList = this.tableEle.querySelectorAll('td');
									for(var i=0; i<tdNodeList.length; i+=1){
										if(tdNodeList[i].style.backgroundColor === 'rgb(143, 255, 245)'){
											tdNodeList[i].style.backgroundColor = 'transparent';
										}
									};
									// 去掉存放在日期数组里的当前日期
									this.multiDayArray = this.multiDayArray.filter(function(value,index,array){
										// 过滤 , 只返回 不等于 当前日期的 值
										if(value !== event.target.innerHTML){
											return value;
										};
									});
								}else{
									// 如果当前td不是橙色选中状态

									// 将当前td变为橙色
									event.target.style.backgroundColor = '#FF9800';
									// 将当前td的日期加入到存放日期数组
									this.multiDayArray.push(event.target.innerHTML);
									// 如果存放日期数组长度等于2,则可以进行选中范围内日期,将范围内td变为蓝色
									if(this.multiDayArray.length === 2){
										// 将范围内td变为蓝色操作思路为
										
										// 获取存放所有td的nodeList
										var tdNodeList = this.tableEle.querySelectorAll('td');
										// 将nodeList转为array,目的是为了使用filter方法
										var tdArray = Array.prototype.slice.call(tdNodeList);
										// 拿到存放日期的数组中的最大值和最小值,Math.min不支持数组参数,使用apply将数组参数传入执行
										var tdMinValue = Math.min.apply(null,this.multiDayArray);
										var tdMaxValue = Math.max.apply(null,this.multiDayArray);
										// 过滤操作,返回所有td中 (日期大于最小值and日期小于最大值and是当月的日期) 的td
										var rangeTd = tdArray.filter(function(value,index,array){
											if(value.innerHTML > tdMinValue && value.innerHTML < tdMaxValue && value.getAttribute('data-current') !== 'false'){
												return value;
											};
										});
										// 将过滤后的td变为蓝色状态
										for(var i=0; i<rangeTd.length; i+=1){
											rangeTd[i].style.backgroundColor = '#8FFFF5';
										};
									}
								}

							}
							

						}
					}
				}.bind(this));

			}
		}.bind(this))();

		// 渲染日历表格
		this.init = function(year,month){
			this.tableEle.innerHTML = '';
			this.multiDayArray = [];
			// 如果没有传参数则默认为当前时间 年-月
			var yearQuery = year === undefined ? new Date().getFullYear() : year;
			var monthQuery = month === undefined ? new Date().getMonth() : month;
			// console.log(yearQuery +":"+ monthQuery);

			// 获取年-月-日
			this.time = new Date(yearQuery,monthQuery);
			this.y = this.time.getFullYear();
			this.m = this.time.getMonth();
			this.d = this.time.getDate();
			// console.log(this.y+"-"+this.m+"-"+this.d);

			// 显示年月
			this.yearShowH2.innerHTML = this.y + "-" + (this.m+1);

			// 给上下月按钮添加事件
			// addEventListener 不会移除原有事件
			// 事件属性 是 赋值行为 会覆盖掉原有事件
			this.lastMonthSpan.onclick = function lastMonthFun(){
				// 如果当前月数减一小于0则去到上一年12月
				if(this.m-1 < 0){
					this.init(this.y-1,11);
				}else{
					this.init(this.y,this.m-1);
				}
			}.bind(this);
			this.nextMonthSpan.onclick = function nextMonthFun(){
				// 如果当前月数加一大于11则去到下一年1月
				if(this.m+1 > 11){
					this.init(this.y+1,0);
				}else{
					this.init(this.y,this.m+1);
				}
			}.bind(this);

			// 所有月份
			var month = [31,28+this.isLeap(this.y),31,30,31,30,31,31,30,31,30,31];

			// 获取月的第一日是星期几
			var firstDayOfWeek = new Date(this.y,this.m,1).getDay();
			// console.log('第一天是星期几,0表示星期日:'+firstDayOfWeek);

			// 月的天数 加上 星期几 除 7 为所需行数
			var rows = Math.ceil( (month[this.m]+firstDayOfWeek) / 7 );
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
						var lastMonthDay = (month[this.m-1] || month[month.length-1])  + day;
						// data-current属性用来判断是否是当前月的天数(点击改变背景色时用到)
						tbodyTd += '<td style="color: #999; padding: 10px; border: 1px solid #000; cursor: default;" data-current="false">'+lastMonthDay+'</td>';
					}else if(day > month[this.m]){
						// day大于总天数则变为起始天数
						var nextMonthDay = day - month[this.m];
						tbodyTd += '<td style="color: #999; padding: 10px; border: 1px solid #000; cursor: default;" data-current="false">'+nextMonthDay+'</td>';
					}else{
						// 根据日数获取时间再获取该日是星期几 6和0为周六日
						var weekend = new Date(this.y,this.m,day).getDay();
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

			// 表格内容插入到日历表格 构造完成 日历表格
			this.tableEle.appendChild(tbody);
			// 日历表格插入到日历面板中
			this.calenderContainer.insertBefore(this.tableEle,this.sureBtn);
			// 日历面板插入到总容器中
			this.container.appendChild(this.calenderContainer);
			// 总容器插入到要显示的地方
			insertPlace.appendChild(this.container);

		}

		// this.calenderContainer日历面板 显示隐藏切换方法
		this.show = function(){
			// 隐藏则显示 显示则隐藏
			if(this.calenderContainer.style.display === 'none'){
				this.calenderContainer.style.display = 'inline-block';
			}else{
				this.calenderContainer.style.display = 'none';
			}
		}.bind(this);

		// this.timeSelectBtn时间选择按钮 点击 切换日历面板显示隐藏
		this.timeSelectBtn.addEventListener('click',this.show);
		this.cancelBtn.addEventListener('click',this.show);

		// 执行渲染函数
		this.init(year,month);
		
		// 初始化 this.timeSelectBtn时间选择按钮 内容为 时间年月
		this.timeSelectBtn.innerHTML = this.y + "-" + (this.m+1);

	}


	function $(id){
		return document.querySelector(id);
	}

	var calender = new Calender($('.calender-container'),2012,11,'multi',function(){console.log(calender.timeSelectBtn.innerHTML)});
	var calenderTest = new Calender($('.calender-test'));

	// $('.time-btn').addEventListener('click',calender.show);
	