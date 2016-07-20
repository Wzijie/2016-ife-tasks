/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
var cityInput = document.querySelector("#aqi-city-input");
var aqiInput = document.querySelector("#aqi-value-input");

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = cityInput.value.trim();	//trim() 去掉前后的空格
	var aqi = aqiInput.value.trim();

	if(!city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)){	//照搬
        alert("城市名必须为中英文字符！");
        return;
    }
    if(!aqi.match(/^\d+$/)) {
        alert("空气质量指数必须为整数！");
        return;
    }

    aqiData[city] = aqi;
    console.log(aqiData);
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var aqiTable = document.querySelector("#aqi-table");
	aqiTable.innerHTML = "";
	for(var city in aqiData){
		if(aqiTable.children.length === 0){
			aqiTable.innerHTML = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
		}

		var tr = document.createElement("tr");
		tr.innerHTML = "<td>" + city + "</td><td>" + aqiData[city] + "</td><button class='del-btn'>删除</button>";
		aqiTable.appendChild(tr);
	}

}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(target) {
  // do sth.
  delete aqiData[target.parentNode.firstChild.innerHTML];
  console.log(target.parentNode.firstChild.innerHTML);
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addBtn = document.querySelector("#add-btn");
  addBtn.onclick = addBtnHandle;

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var table = document.querySelector("#aqi-table");
  table.addEventListener("click",function(event){
  	if(event.target.nodeName === "BUTTON"){
  		delBtnHandle(event.target);
  	}
  });
}

init();