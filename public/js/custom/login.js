time = 5*60;
seconds_limit = 60;
var code_verification_limit = 3;
var password_min_length = 8;
var password_max_length = 60;
var name_max_length     = 25;
function verifyCode(){
  if(!(--code_verification_limit)) return $(".user_register_from").submit();
  $.ajax({
    type: "POST",
    url: baseurl+'/verify_user_register_code',
    data: $('.user_register_from').serialize(),
    beforeSend: function(){
      $('.user_register_form_submit').text('Processing...').attr('disabled', true);
    },
    success: function (response) {
      console.log(code_verification_limit);
      if(!response.is_match){
        $('input[name="verify_code"]').val('').focus();
        $('span.verify-code-error').html('The verification code you entered is incorrect.');
      } else {
        $(".user_register_from").submit();
      }
    },
    complete: function(){
      $('.user_register_form_submit').text('Register').removeAttr('disabled');
    }
  });
}
function removeTimer(){
    window.localStorage.removeItem('verification_timer');
    window.localStorage.removeItem('verification_time_set');
}
window.onbeforeunload = function(){
  removeTimer();
}

$( document ).ready(function() {
  var current_date = new Date();
  var current_time_stamp  = current_date.getTime();
  var previous_time_stamp = localStorage['current_time_stamp'];
  var difference_in_time_stamp = current_time_stamp - previous_time_stamp;
  var difference_in_seconds = parseInt((difference_in_time_stamp/1000));
  difference_in_seconds = difference_in_seconds - parseInt(5);

  if(difference_in_seconds > seconds_limit){
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  if($.isNumeric(difference_in_seconds)){
    seconds_limit=(parseInt(seconds_limit)-parseInt(difference_in_seconds));
  }

  var yet_visited = localStorage['visited'];
  var verification_timer = localStorage['verification_timer'];
  var text = $('.error-msg').text();

  if(verification_timer > 0) {
    time = localStorage['verification_time_set'];
    onVerify();
  }
  if($('#code').length) onVerify();

  if(yet_visited > 0) {
    onTimer();
  }

  if (text.match(/[0-9]/i)) {
    onTimer();
  }

  $("#code").on('change, paste input', function(){
    var value = $(this).val();
    if(value.length>0){
          $("#show-sent").prop('disabled', false);
    }else{
      $("#show-sent").prop('disabled', true);
    }
  });
  $(".bluelinks").on('click',function(){
    removeTimer();
  });
  $(".check_box_error").hide();
  $(document).on("click", ".checkd", function(e) {
    $(".check_box_error").hide();
  });

  
  $('.verify-user-details').click(function(){
    $(this).hide();
    $('.user_register_form_submit').toggle(100);
    $('.verify-code').toggle(100);
    $('.registration-verification p').html('Please check your inbox for your verification code.').parent().show();
    $.ajax({
      type: "POST",
      url: baseurl+'/verify_user',
      data: {
        'email': $('.user_register_from input[name=email]').val(),
        'space_id': $('.user_register_from input[name=shareid]').val()
      }
    });

  });
});

function onVerify() {
  $('#timer').show();
  var minutes = Math.floor( time / seconds_limit );
  if (minutes < 10) minutes = "0" + minutes;
  var seconds = time % seconds_limit;
  if (seconds < 10) seconds = "0" + seconds; 
  var text = minutes + ':' + seconds;
   $('#timer').text("Verification code sent on your email, Please Verify in "+text+" seconds");
  time--;
  if (time >= 0) {
     localStorage['verification_timer'] = minutes;
     localStorage['verification_time_set'] = time;
    setTimeout(onVerify, 1000);
  }else{
    removeTimer();
    window.location = baseurl + "/";
    $('#timer').hide();
  }
}

$(document).on("click", ".close_btn", function(e) {
  $('.login_error_message').hide();
});

function onTimer() {
  $('.timeout-message').show();
  var date = new Date();
  var current_time_stamp = date.getTime();
  var is_current_time_stamp_added = localStorage['current_time_stamp'];
  if(!is_current_time_stamp_added) {
    localStorage['current_time_stamp'] = current_time_stamp;
  }
  $('.timeout-message .text-center').text("Too many incorrect login attempts. Please try again in "+seconds_limit+" seconds");
  seconds_limit--;
  $('.error-msg').hide();
  if (seconds_limit >= 0) {
    localStorage['visited'] = seconds_limit;
    setTimeout(onTimer, 1000);
    $('button').prop('disabled', true);
  }else{
    localStorage['visited'] = 0;
    $('.timeout-message').hide();
    $('.error-msg').hide();
    $("div").removeClass("has-error");
    $('button').prop('disabled', false);
  }
}

$(document).on("click", ".user_register_form_submit", function(e) {
  e.preventDefault();
  var new_password = $('#password').val();
  var confirm_password = $('#password_confirmation').val();
  var first_name = $('#firstname').val();
  var last_name = $('#lastname').val();
  var validate_new_password =  true;
  var validate_confirm_password =  true;
  var validate_firstname =  true;
  var validate_lastname =  true;
  var validate_all_values =  true;
  $('.login_error_message p').hide(100);
  if(new_password && confirm_password && first_name && last_name){
    if(new_password.length < password_min_length || new_password.length > password_max_length)
       validate_new_password = false;
    if(confirm_password.length < password_min_length || confirm_password.length > password_max_length)
       validate_confirm_password = false;
    if(first_name.length <1 || first_name.length >name_max_length)
       validate_firstname = false;
    if(last_name.length <1 || last_name.length >name_max_length)
       validate_lastname = false;
    if(!/\d/.test(new_password))
       validate_new_password = false;
    if(!/[a-z]/.test(new_password))
       validate_new_password = false; 
    if(!/[A-Z]/.test(new_password))
       validate_new_password = false;
    if(!/[0-9]/.test(new_password))
       validate_new_password = false;
    if(!/\d/.test(confirm_password))
       validate_confirm_password = false;
    if(!/[a-z]/.test(confirm_password))
       validate_confirm_password = false; 
    if(!/[A-Z]/.test(confirm_password))
       validate_confirm_password = false;
    if(!/[0-9]/.test(confirm_password))
       validate_confirm_password = false;

    if(!validate_new_password){
      $('.password_error').html('Your password must be a minimum of '+password_min_length+' characters and maximum of '+password_max_length+' characters and contain an upper case letter, lower case letter and a number');
      validate_all_values = false;
    }else{
      $('.password_error').html('');
    }
    if(!validate_confirm_password){
      $('.confirm_password_error').html('Your password must be a minimum of '+password_min_length+' characters and maximum of '+password_max_length+' characters and contain an upper case letter, lower case letter and a number');
      validate_all_values = false;
    }else{
      $('.confirm_password_error').html('');
    }
    if(!validate_firstname){
      $('.firstname_error').html('First name cannot be greater than '+name_max_length+' characters');
      validate_all_values = false;
    }else{
      $('.firstname_error').html('');
    } 
    if(!validate_lastname){
      $('.lastname_error').html('Last name cannot be greater than '+name_max_length+' characters');
      validate_all_values = false;
    }else{
      $('.lastname_error').html('');
    }    
    if(new_password != confirm_password){
      $('.confirm_password_error').html('Password & Confirm Password must be same');
      validate_all_values = false;
    }    
  }
  if(!new_password){
      $('.password_error').html('Password is required');
      validate_all_values = false;
  }
  if(!first_name){
      $('.firstname_error').html('First name is required');
      validate_all_values = false;
  }
  if(!last_name){
      $('.lastname_error').html('Last name is required');
      validate_all_values = false;
  }
  if(!confirm_password){
      $('.confirm_password_error').html('Confirm password is required');
      validate_all_values = false;
  }
  if(!$('input[name="verify_code"]').val().length){
    $('.verify-code-error').html('Verification code is required');
      validate_all_values = false;
  }

  if($('.uncheck').is(':hidden')){
    $(".check_box_error").show();
    validate_all_values = false;
  }
  
  if(validate_all_values){
    verifyCode();
  }else{
    return false;
  }
});

$(document).on("click", ".reset_pass", function(e) {
  e.preventDefault();  
  var email = $('#email').val();
  var new_password = $('#password').val();
  var confirm_password = $('#confirm_password').val();
  var validate_new_password =  true;
  var validate_confirm_password =  true;
  var validate_all_values =  true;
  if(email.length > 0){
      $('.email_error').html('');
  }
  if(email && new_password && confirm_password){
    if(new_password.length < password_min_length || new_password.length > password_max_length)
      validate_new_password = false;
    if(confirm_password.length < password_min_length || confirm_password.length > password_max_length)
      validate_confirm_password = false;
    if(!/\d/.test(new_password))
      validate_new_password = false;
    if(!/[a-z]/.test(new_password))
      validate_new_password = false; 
    if(!/[A-Z]/.test(new_password))
      validate_new_password = false;
    if(!/[0-9]/.test(new_password))
      validate_new_password = false;
    if(!/\d/.test(confirm_password))
      validate_confirm_password = false;
    if(!/[a-z]/.test(confirm_password))
      validate_confirm_password = false; 
    if(!/[A-Z]/.test(confirm_password))
      validate_confirm_password = false;
    if(!/[0-9]/.test(confirm_password))
      validate_confirm_password = false;
    if(!validate_new_password){
      $('.password_error').html('Your password must be a minimum of '+password_min_length+' characters and maximum of '+password_max_length+' characters and contain an upper case letter, lower case letter and a number');
      validate_all_values = false;
    }else{
      $('.password_error').html('');
    }
    if(!validate_confirm_password){
      $('.confirm_password_error').html('Your password must be a minimum of '+password_min_length+' characters and maximum of '+password_max_length+' characters and contain an upper case letter, lower case letter and a number');
      validate_all_values = false;
    }else{
      $('.confirm_password_error').html('');
    }   
    if(new_password != confirm_password){
      $('.confirm_password_error').html('Password & Confirm Password must be same');
      validate_all_values = false;
    }    
  }
  if(!email){
    $('.email_error').html('Email is required');
    validate_all_values = false;
  }
  if(!new_password){
    $('.password_error').html('Password is required');
    validate_all_values = false;
  }   
  if(!confirm_password){
    $('.confirm_password_error').html('Confirm password is required');
    validate_all_values = false;
  }     
  if(validate_all_values){
    $(".reset_password_form").submit();
  }else{
    return false;
  }
});