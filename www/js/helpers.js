$(document).ready(function(){
	var templates = {};
	var url = $.url().param(),
		id = url.id,
		uid = url.uid;	
	$.tp = {
		url : url,
		id : id,
		uid : uid
	};
  	$.draw = function (data,temp,target){
  		console.log(data);
	    var f = templates[temp], 
	      	rendered = "";
	    if (f){
			rendered = f(data);
			if (!target){
			return rendered;
			}else{
			$(target).html(rendered);
			}
	    }
   }
   $(".tmpl").each(function(){
    	templates[this.id] = Handlebars.compile(this.innerHTML);      
  	});

   var funcs = {
   	"formatTime" : function(date){
			if (date){
				date = new Date(date);
				var day = date.getDate()+1,
					month = date.getMonth()+1,
					year = date.getFullYear();
				return year+"-"+month+"-"+day;

			}else{
				return "";
			}
		},
		"formatCurrency" : function(currency){
			switch (currency){
				case "USD" :
					return "دولار";
					break;
				case "EUR" :
					return "يورو";
					break;
				case "LYD" :
					return "دينار ليبي";
					break;
				case "GBP" :
					return "باوند";
					break;
				default : 
					return "غير معروف";
			}
		},
		"stockStatus" : function(quantity,left){
			if (left < quantity/4) {
				return "error";
			} else if (left < quantity/2) {
				return "warning";
			} else {
				return "success";
			}
			
		},
		"customerType" : function(type){
			switch (type){
				case "CUSTOMER" :
					return "زبون";
					break;
				case "COMPANY" :
					return "شركة/مؤسسة حكومية";
					break;
			}
		},
		"invoiceStatus" : function(type,status){
			if(status=="ACTIVE"){
				if (type=="FIRST") {
					return "info";
				} else {
					return "warning";
				}
			} else {
				return "important";
			} 
		},
		"invoiceTitle" : function(type,status){
			if(status=="ACTIVE"){
				if (type=="FIRST") {
					return "فاتورة مبدئية";
				} else {
					return "فاتورة نهائية";
				}
			} else {
				return "فاتورة ملغاة";
			} 
		},
		"invoiceType" : function(invoice){
			if(invoice=="FIRST"){
				return "مبدئية"
			} else {
				return "نهائية";
			} 
		},
	};

	var helpers = $.each(funcs, function(key, val){
		Handlebars.registerHelper(key, val);
	});


});