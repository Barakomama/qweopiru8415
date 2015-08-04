var index = {
	url: "http://sureph-001-site1.smarterasp.net/",
	interval: "",
	//url: "http://localhost/",
	events: function(){
		$("input").on("dblclick", index.clearInputField);
		$("#userCredentials").on("submit", index.userLogin);
		$("#registerCredentials").on("submit", index.userRegister);	
		$("input").on("focus", index.highlightField); 
		$("input").on("blur", index.removeHighlight);
		$("#TestText").on("click", index.testText);
	},

	highlightField: function(){
		$(this).css("border-bottom", "3px solid orange");
	},

	removeHighlight: function(){
		$(this).css("border-bottom", "3px solid gray");
	},
	testText: function(){
	Android.showToast();
	alert("hello");
//		Android.sendSMS();
	},
	userRegister: function(e){
		e.preventDefault();
		var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
			emailValid = re.test($("#email").val()),
			phoneString = $("#number").val(),
			phoneString = phoneString.replace(/-/g, ''),
			error = "",
			isNameEmpty = $("#name").val().trim() == "" ? true : false;
			isEmailEmptyorValid = ($("#email").val().trim() == "" || !emailValid) ? true : false,
			isPhoneValid = ($("#number").val().indexOf("X") >= 0 || $("#number").val().length == 0) ? true : false,
			isPasswordEmpty = $("#password").val().trim() == "" ? true : false,
			isRepassSame = $("#password").val() != $("#repassword").val() ? true : false;
		
		if(isNameEmpty)
			error += "Name is Required.<br/>";
		if(isEmailEmptyorValid)
			error += "Email is Required and must be valid.<br/>";
		if(isPhoneValid)
			error += "Phone Number is required and must be valid.<br/>";
		if(isPasswordEmpty)
			error += "Password is Required.<br/>";
		else if(isRepassSame)
			error += "Password doesn't match.";
		
		if(error != ""){
			alert(error);
		}
		else{
			index.customModal("Please Wait...", "show"); 
			$("#number").val(phoneString);

			$.ajax({
				url: index.url + "/Account/MobileRegister",
				cache: false,
				data: $(this).serialize(),
				success: function(data){  
					if(data.ok){
						index.customModal("", "hide"); 
						localStorage.name = data.name[0];
						localStorage.userid = data.name[1];

						//index.checkValidated();
						window.location = "startpage.html";
						//window.open("http://developer.globelabs.com.ph/dialog/oauth?app_id=7gqzuzaRyeHzacXn7aTR65HnqgkMuKLB", '_blank');
					}
					else{
						index.customModal("", "hide"); 
						alert("An existing account may have used 1 or more of your registration information.");
					}
				},
				error: function(){
					index.customModal("", "hide"); 
					alert("Registration Failed");
				}
			});
		}
	},

	customModal: function(text, type){
		$("#loadText").html(text);
		$("#modalLoader").modal(type);
	},

	userLogin: function(e){
		e.preventDefault();
		var error = "";
		
		if($("#username").val().trim() == "")
			error = "<label class='text-danger'>Email/ Phone Number is Required</label><br/>";
		if($("#passwords").val().trim() == "")
			error += "<label class='text-danger'>Password is Required</label><br/>";

		if(error != ""){
			alert(error);
		}

		else{ 

			index.customModal("Logging In...", "show");

			$.ajax({
				url: index.url + "/Account/LoginMobile",
				cache: false,
				data: $(this).serialize(),
				success: function(data){
					index.customModal("", "hide");
					if(data.ok){

						window.open("http://developer.globelabs.com.ph/dialog/oauth?app_id=7gqzuzaRyeHzacXn7aTR65HnqgkMuKLB");

						localStorage.name = data.name[0];
						localStorage.userid = data.name[1];
						window.location = "startpage.html";
					}
					else{
						alert("User Does not Exist");
					}
				},
				error: function(){
					index.customModal("", "hide");
					alert("Login Failed");
				}
			});
		}
	},

	clearInputField: function(){
		$(this).val("");
	},

	load: function(){  
		if($("#current").val() == "index"){
			if(localStorage.name != null){
				window.location = "startpage.html";
			} 
			else{
				if(typeof Android === "undefined")
					$("#number").mask("999-999-9999", {placeholder: "9XX-XXX-XXXX"});
				else
					$("#number").mask("999-999-9999", {placeholder: "9XX-XXX-XXXX"}).val(Android.getNumber());
			}
		}
	},

	loadStartup: function(){
		index.load();
		index.events();
	},

	checkValidated: function(){
		interval = setInterval(function(){
			$.ajax({
				url: index.url + "/Account/AccountActive",
				cache: false,
				data:{
					name: localStorage.name
				},
				success: function(data){
					if(data){
						clearInterval(interval);
						
						window.location = "startpage.html";
					}
					console.log("App");
				}
			});
		}, 5000);
	}
}

$(document).ready(function(){ 
	index.loadStartup();
});