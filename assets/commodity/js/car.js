var cardata;
var resultlength = 0;
var row = 1;
let rowsize = 9;
var carlist = $(".carshow");

//日期处理
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//盒子
function addbox(carlist, result, i){
	var div = $("<div class=\"col-lg-4 col-md-6\"></div>");
	var carbox = $("<div class=\"impl_fea_car_box\"></div>");
	var carimg = $("<div class=\"impl_fea_car_img\"></div>");
	var img = $("<img class=\"img-fluid impl_first_car_img\"/>");
	img.attr("src", result[i].url);
	var fimg = $("<img class=\"img-fluid impl_hover_car_img\"/>");
	fimg.attr("src", result[i].furl);
	carimg.append(img);
	carimg.append(fimg);
	carbox.append(carimg);
	var cardata = $("<div class=\"impl_fea_car_data\"></div>");
	var h2 = $("<h2></h2>");
	var a = $("<a></a>");
	a.text(result[i].brand);
	a.attr("href",result[i].brandurl);
	h2.append(a);
	var ul = $("<ul></ul>");
	var li = $("<li></li>");
	var title = $("<span class=\"impl_fea_title\">款型</span>");
	var content = $("<span class=\"impl_fea_name\"></span>");
	content.text(result[i].model);
	li.append(title);
	li.append(content);
	ul.append(li);
	li = $("<li></li>");
	title = $("<span class=\"impl_fea_title\">Vehicle Status</span>");
	content = $("<span class=\"impl_fea_name\"></span>");
	content.text(result[i].status);
	li.append(title);
	li.append(content);
	ul.append(li);
	li = $("<li></li>");
	title = $("<span class=\"impl_fea_title\">Color</span>");
	content = $("<span class=\"impl_fea_name\"></span>");
	content.text(result[i].color);
	li.append(title);
	li.append(content);
	ul.append(li);
	cardata.append(h2);
	cardata.append(ul);
	carbox.append(cardata);
	var btn = $("<div class=\"impl_fea_btn\"></div>");
	var button = $("<button class=\"impl_btn\"></button>");
	var span = $("<span class=\"impl_doller\"></span>");
	span.text("¥ " + result[i].price);
	button.append(span);
	span = $("<span class=\"impl_bnw\">buy now</span>");
	button.append(span);
	btn.append(button);
	cardata.append(btn);
	div.append(carbox);
	carlist.append(div);
};
//更新盒子
function updatebox(){
	carlist.empty();
	if(cardata.length < (row * rowsize)){
		for(var i = (row - 1) * rowsize;i < cardata.length;i++){
			addbox(carlist, cardata, i);
		}
	}else{
		for(var i = (row - 1) * rowsize;i < row * rowsize;i++){
			addbox(carlist, cardata, i);
		}
	}	
	var div = $("<div class=\"col-lg-12 col-md-12\"></div>");
	var impl = $("<div class=\"impl_pagination_wrapper\"></div>");
	var nav = $("<nav aria-label=\"Page navigation example\"></nav>");
	var ul = $("<ul class=\"pagination\"></ul>");
	var li = $("<li class=\"page-item\"></li>");
	var a = $("<a class=\"page-link\" onclick=\"subrow(this)\"></a>");
	var icontent = $("<i class=\"fa fa-angle-left\" aria-hidden=\"true\"></i>");
	a.append(icontent);
	li.append(a);
	ul.append(li);
	resultlength = Math.ceil(cardata.length/9);
	for(var i = 1; i <= Math.ceil(cardata.length/9);i++){
		var li = $("<li class=\"page-item\"></li>");
		var a = $("<a class=\"page-link number\" onclick=\"cut(this)\"></a>");
		a.text(i);
		li.append(a);
		ul.append(li);
	}	
	var li = $("<li class=\"page-item\"></li>");
	var a = $("<a class=\"page-link\" onclick=\"addrow(this)\"></a>");
	var icontent = $("<i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i>");
	a.append(icontent);
	li.append(a);
	ul.append(li);
	nav.append(ul);
	impl.append(nav);
	div.append(impl);
	carlist.append(div);            
}
//盒子
function getCarData(brand, brandlength, color, colorlength){
	$.ajax({
        url:"getCar",
		type:"post",
		data:{
			"brand": JSON.stringify(brand),
			"brandlength": brandlength,
			"color": JSON.stringify(color),
			"colorlength": colorlength
		},
		dataType:"json",
        success:function(result){
			cardata = result;
			row = 1;
			updatebox(row);
			$(".number").eq(row-1).addClass("active");
        },	
        error:function(){
        }
	});
};

function cut(ele){
	row = parseInt($(ele).text());
	updatebox();
	$(".number").eq(row-1).addClass("active");
};

function addrow(){
	console.log(row);
	if(row < resultlength){
		row++;
		updatebox();
		$(".number").eq(row-1).addClass("active");
	}
};

function subrow(){
	if(row > 1){
		row--;
		updatebox();
		$(".number").eq(row-1).addClass("active");
	}
};

$(document).ready(function(){
	var brand = new Array();
	var brandlength = 0;
	var color = new Array();
	var colorlength = 0;
	getCarData(brand, brandlength, color, colorlength, row);

	//商品分类
	$(":checkbox").change(function() {
		var brand = new Array();
		var brandlength = 0;
		var color = new Array();
		var colorlength = 0;
		$("input[name='check']").each(function(){   
			if($(this).is(":checked"))    
			{    
				brandlength = brand.push($(this).val());    
			} 
	 	});	  
		$("input[name='color']").each(function(){    
			if($(this).is(":checked"))    
			{    
				colorlength = color.push($(this).val());
			} 
		});	     
		row = 1;                        
		getCarData(brand, brandlength, color, colorlength, row, rowsize);
	});

	//商品检查
	function purchased(username, model){
		var flag;
		$.ajax({
			url:"checkCar",
			type:"post",
			async:false,
			data:{
				"username": username,
				"model": model,
			},
			dataType:"json",
			success:function(result){
				if(result.msg == "true"){
					flag =  true;
				}else{
					flag =  false;
				}
			},
			error:function(){}
		});
		return flag;
	};

	//商品加入
	/////抛物效果开始
	$(document).on("click",".impl_btn",function(event){
		var username = $(".navbar-brand").eq(1).text().trim();
		var model = $(this).parents(".impl_fea_car_data").find(".impl_fea_name").eq(0).text();
		var quantity = 1;
		var time = new Date().Format("yyyyMMddhhmmss");
		var btn = $(this);
		//添加购物车动画
		if("" != username){
			console.log(purchased(username, model));
			//添加车辆
			if(purchased(username, model)){
				$.ajax({
					url:"addCar",
					type:"post",
					data:{
						"username": username,
						"model": model,
						"quantity": quantity,
						"time": time
					},
					dataType:"json",
					success:function(result){
						var offset = $(".dropdown").offset();   // 终点位置  
						var addcar = $(this);
						var img = addcar.parents(".impl_fea_car_box").children('.impl_fea_car_img').find('.impl_first_car_img').attr('src');
						var flyer = $('<img class="u-flyer" src="' + img + '">');
						var Oscrolltop = $(document).scrollTop();
						flyer.fly({
							start: {
								left: event.pageX, //开始位置（必填）#fly元素会被设置成position: fixed 
								top: event.pageY - Oscrolltop - 30, //开始位置（必填） 
							},
							end: {
								left: offset.left + 10, //结束位置（必填） 
								top: offset.top + 10 - Oscrolltop, //结束位置（必填） 
								width: 0, //结束时宽度 
								height: 0 //结束时高度 
							},
							onEnd: function () { //结束回调 
								this.destory(); //移除dom 
							}
						});  
						btn.children(".impl_bnw").text("Purchased");
						btn.attr("disabled","disabled");
					},	
					error:function(){
					}
				});
			}else{
				btn.children(".impl_bnw").text("Purchased");
				btn.attr("disabled","disabled");
			}
		}else{
			alert("请登录！！！");
		}
	});

	$(document).on("click",".foo_subs_btn",function(){
		var condition = $(".form-control").val();
		$.ajax({
			url:"FindCar",
			type:"post",
			data:{
				"condition": condition
			},
			dataType:"json",
			success:function(result){
				cardata = result;
				row = 1;
				updatebox(row);
				$(".number").eq(row-1).addClass("active");
			},	
			error:function(){
			}
		});
	});

});