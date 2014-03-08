function Urucas() {

	this.checkFormData = function(){
		if($("#form_name").val() == "" || $("#form_name").val() == "Name" ){
			$("#form_name").next("div").show()
			return;
		}else{
			$("#form_name").next("div").hide()
			var name = $("#form_name").val();
		}

		if($("#form_email").val() == "" || $("#form_email").val() == "Email"){
			$("#form_email").next("div").show();
			return;
		}else{
			$("#form_email").next("div").hide()
			var email = $("#form_email").val();
		}

		if($("#form_comments").val() == "" || $("#form_comments").val() == "Comments?"){
			$("#form_comments").next("div").show();
			return;
		}else{
			$("#form_comments").next("div").hide()
			var comments = $("#form_comments").val();
		}

		$.post("enviar.php",{name:name,email:email,comments:comments},function(data){
			alert(data.msg);
			$("#form_name").val("");
			$("#form_email").val("");
			$("#form_comments").val("");
		},'json');
		
	}

}

var urucas = new Urucas();
