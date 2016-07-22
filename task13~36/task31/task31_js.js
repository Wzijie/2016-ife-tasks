
var option = document.querySelectorAll("input[name='option']");
var cont = document.querySelectorAll("section");

option[0].parentNode.addEventListener("click",function(event){
	if(event.target.nodeName == "LABEL" || event.target.nodeName == "INPUT"){
		checked();
	}
});

function checked(target){
	for(var i=0,len=option.length; i<len; i++){
		cont[i].style.display = "none";
		if(option[i].checked == true){
			cont[i].style.display = "block";
		}
	}
}