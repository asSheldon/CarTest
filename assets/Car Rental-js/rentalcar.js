function addbox(carlist, result, i){
    var div = $("<div class=\"col-lg-4 col-md-6 col-sm-12\"></div>");
    var singlediv = $("<div class=\"single-taxi-one\"></div>");
    var inner = $("<div class=\"inner-content\"></div>");
    var img = $("<img alt=\"single-taxi-one\" alt=\"Awesome Image\"/>");
    img.attr("src", result[i].url);
    var title = $("<h3></h3>");
    title.text(result[i].model);
    //车数据
    var list = $("<ul class=\"feature-list\"></ul>");
    //车型
    var typeli = $("<li></li>");
    var typetitle = $("<span class=\"name-line\"></span>");
    typetitle.text("车型:");
    var type = $("<span class=\"price-line\"></span>");
    type.text(result[i].type);
    typeli.append(typetitle);
    typeli.append(type);
    //价格
    var priceli = $("<li></li>");
    var pricetitle = $("<span class=\"name-line\"></span>");
    pricetitle.text("日租价:");
    var price = $("<span class=\"price-line\"></span>");
    price.text(result[i].price);
    priceli.append(pricetitle);
    priceli.append(price);
    //乘员
    var personli = $("<li></li>");
    var persontitle = $("<span class=\"name-line\"></span>");
    persontitle.text("乘员:");
    var person = $("<span class=\"price-line\"></span>");
    person.text(result[i].person);
    personli.append(persontitle);
    personli.append(person);
    var rental = $("<a href=\"/CarRental/detail?id="+result[i].id+"\" class=\"book-taxi-btn\">查看详情</a>");
    //单数据添加
    list.append(typeli);
    list.append(priceli);
    list.append(personli);
    
    inner.append(img);
    inner.append(title);
    inner.append(list);
    inner.append(rental);
    singlediv.append(inner);
    div.append(singlediv);
    carlist.append(div);
};

$(document).ready(function(){
    $.ajax({
        url:"getRentalCar",
		type:"post",
		dataType:"json",
        success:function(result){
            for(var i = 0;i < result.length;i++)
            {
                var content = $(".content");
                addbox(content, result ,i);
            };
        },	
        error:function(){
        }
	});
});