var bulk_invitation = new Array();

/* log home page visit */
window.onload = function(){
  custom_logger({
    'description' : 'visit setting',
    'action' :'visit setting'
  });
}

/* */
function cleanUrl(selected_tab){
    var tab_name = selected_tab;
    var old_url = window.location.href;
    var index_of_character = 0;
    var new_url = old_url;
    index_of_character = old_url.indexOf('?');
    if(index_of_character == -1){
      index_of_character = old_url.indexOf('#');
    }
    if(index_of_character != -1){
      new_url = old_url.substring(0, index_of_character);
    }
    if(getParameterByName('tab_name')){
      old_url = tab_name = '#'+getParameterByName('tab_name');
    }
    window.history.pushState("", "", new_url+tab_name);
    if(old_url == tab_name) $('a[href="'+tab_name+'"]').trigger('click');
}
/**/
function reset_bulk_invitation(){
  bulk_invitation = new Array();
  $('.bulk-invitation-progress-info').empty();  
  $('.bulk-email-trigger').attr('disabled', true);
}

/**/
function initiate_bulk_invitation(){
  $('.bulk-email-trigger').focus();
}

function bulk_invitation_preview(){
  $('.bulk-invitation-progress-info').html('<label class="uploaded-document">'+(window[direct_upload_s3_data[0]['storage']])[0]['originalName']+'<img src="'+baseurl+'/images/loading_bar1.gif"></label>');

  $.ajax({
    type: 'POST',
    url: 'bulk_invitations',
    headers: {
      'cache-control': 'no-cache',
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    data: $('.bulk-invitation-form').serialize(),
    success: function (response) {
      if(!response) return false;
      if(response.error){
        reset_bulk_invitation();
        alert(response.message);
        return false;
      }
      var response_length = response.length;
      $('.file-preview').empty();
      for (var increment = 0, length_limit = response_length; increment < length_limit; increment++) {
        html = '<div class="data-wrap">';
        html += '<div class="col-md-4">'+response[increment].first_name;
        if(response[increment].status.first_name)
          html +='<div class="error-msg">'+response[increment].status.first_name+'</div>';
        html += '</div>';
        
        html += '<div class="col-md-4">'+response[increment].last_name;
          if(response[increment].status.last_name)
            html += '<div class="error-msg">'+response[increment].status.last_name+'</div>';
        html += '</div>';

        html += '<div class="col-md-4">'+response[increment].email;
          if(response[increment].status.email)
            html += '<div class="error-msg">'+response[increment].status.email+'</div>';
        html += '</div>';
        html += '</div>';
        $('.file-preview').append(html);
      }
      $('input[name=finalized_data]').val(JSON.stringify(response));
      $('#bulk-upload-status').modal();
      $('.bulk-email-trigger').attr('disabled', false);
      /* remove processing animation */
      $('.bulk-invitation-progress-info').find('img').remove();      
    }
  });
}

function invitationFileTrigger() {
  bulk_invitation = new Array();
  $('.bulk-email-trigger').attr('disabled', true);
  $('.bulk-invitation-progress-info').empty();
  if($('.s3_running_process').length) return false;
  direct_upload_s3_data.push({
    'storage': 'bulk_invitation',
    'progress_element_class': 's3_progress',
    'form_field_class': 'bulk-invitation-file',
    'done_callback': 'bulk_invitation_preview',
    // 'error_callback': 'upload_executive_file_error',
    'allowed_extension': ['csv'],
    'progress_bar_ele': '.bulk-invitation-progress-info'
  });
  $('#upload_s3_file').trigger('click');
}

function send_mail_setting(btn) {
  var spaceid = $(".spaceid").val();
  var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
  $('.white_box_info').hide();
  var mail_container = $(btn).parent().parent();
  $(btn).attr('disabled', true);
  $(btn).html('Please wait...');
  $(btn).append('<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true" ></i>');
  var mail = new Array();
  mail[0] = $(mail_container).find('.mailbody').find('span').eq(0).html();
  mail[1] = $(mail_container).find('.mailbody').find('span').eq(1).html();
  mail[2] = "\n\n\n" + $(mail_container).find('.mail_body').val();
  mail[3] = "\n\n\n" + $(mail_container).find('.mailbody').find('div').eq(0).html();
  mail[4] = "\n" + $(mail_container).find('.mailbody').find('div').eq(1).html();
  mail[5] = "\n" + $(mail_container).find('.mailbody').find('div').eq(2).html();
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": baseurl+"/invite_user",
    "method": "post",
    "headers": {
        "cache-control": "no-cache",
        'X-CSRF-TOKEN': CSRF_TOKEN
    },
    "data": {
      "resend_mail": 1,
      "share_id": spaceid,
      "user": {
        "first_name": $(mail_container).find("input[name=first_name]").val(),
        "last_name": $(mail_container).find("input[name=last_name]").val(),
        "email": $(mail_container).find("input[name=email]").val(),
        "subject": $(mail_container).find('.subjectbody').find('span').html()
      },
      "mail": {
        "to": $(mail_container).find("input[name=email]").val(),
        "body": mail
      }
    }
  }

  if( !$(btn).hasClass('resend_invite_btn') )
    delete settings.data.resend_mail;

  $.ajax(settings).done(function(response) {
    if (response.code == 0) {
      $(mail_container).find('.white_box_info').addClass('success-msg');
      $(mail_container).find('.white_box_info').removeClass('error-message warning-message');
      $(mail_container).find('.white_box_info').html("Invitation sent successfully");
      $(mail_container).find('.white_box_info').show();
      $(".white-popup").find("input[name=first_name], input[name=last_name], input[name=email]").val("");
      $('.mailbody').find("span").eq(0).hide();
      $('.mailbody').find("span").eq(1).html("");
      localStorage.setItem("Status","Invitation sent successfully");
      setTimeout(function(){
        $('#resendinvites').modal('hide');
        location.reload();},2000);
    }else if (response.code == 400) {
      $(mail_container).find('.white_box_info').removeClass('success-msg');
      $(mail_container).find('.white_box_info').addClass('warning-message');
      $(mail_container).find('.white_box_info').html(response.message);
      $(mail_container).find('.white_box_info').show();
    } else {
      if (response.message['user.first_name']) {
        $(mail_container).find("input[name=first_name]").parent().addClass('has-error');
        $(mail_container).find("input[name=first_name]").parent().find('.error-msg').remove();
        $(mail_container).find("input[name=first_name]").after('<span class="error-msg text-left">' + response.message['user.first_name'] + '</span>');
      } else {
        $(mail_container).find("input[name=first_name]").parent().removeClass('has-error');
        $(mail_container).find("input[name=first_name]").parent().find('.error-msg').remove();
      }
      if (response.message['user.last_name']) {
        $(mail_container).find("input[name=last_name]").parent().addClass('has-error');
        $(mail_container).find("input[name=last_name]").parent().find('.error-msg').remove();
        $(mail_container).find("input[name=last_name]").after('<span class="error-msg text-left">' + response.message['user.last_name'] + '</span>');
      } else {
        $(mail_container).find("input[name=last_name]").parent().removeClass('has-error');
        $(mail_container).find("input[name=last_name]").parent().find('.error-msg').remove();
      }
      if (response.message['user.email']) {
        $(mail_container).find("input[name=email]").parent().addClass('has-error');
        $(mail_container).find("input[name=email]").parent().find('.error-msg').remove();
        $(mail_container).find("input[name=email]").after('<span class="error-msg text-left">' + response.message['user.email'] + '</span>');
      } else {
        $(mail_container).find("input[name=email]").parent().removeClass('has-error');
        $(mail_container).find("input[name=email]").parent().find('.error-msg').remove();
      }
    }
    $(btn).attr('disabled', false);
    $(btn).html('INVITE');
  }).error(function() {
    $(mail_container).find('.white_box_info').removeClass('success-msg');
    $(mail_container).find('.white_box_info').addClass('error-message');
    $(mail_container).find('.white_box_info').html("Something went wrong, Try again later!!");
    $(mail_container).find('.white_box_info').show();
    $(btn).attr('disabled', false);
  });
  $(".modal-dialog ").scrollTop(0);
} 

  /* Toggle feedback status */
function toggleFeedbackStatus(feedback_on_of) {
  var space_id = $('.space_id').val();
  var feedback_type = $('#selectFeedbackType').val();
  $.ajax({
    type: 'GET',
    url: baseurl + '/feedback_setting?space_id=' + space_id + '&feedback_on_of=' + feedback_on_of + '&feedback_type=' + feedback_type,
    success: function (response) {
      $('.thankyou-feedback-button').attr('disabled', 'disabled');
      $('.feedback-status-message').show();
      setTimeout(function () {
        $('.feedback-status-message').fadeOut()
      }, 2000);
      window.location.hash = '#feedback-tab';
      location.reload();
    },
    error: function (message) {
    }
  });
}

function set_email_rule_in_setting(form_class) {
  $('.domain_name_inp').attr('disabled', false);
  $(".save-last").attr('disabled', true);
  form_to_submit = $("."+form_class);
  both_mail_parent = form_to_submit.parent().parent().parent();
  var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
  var spaceid = $(".spaceid").val();
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": baseurl+"/clientshare/"+spaceid,
    "method": "put",
    "headers": {
        "cache-control": "no-cache",
        'X-CSRF-TOKEN': CSRF_TOKEN
    },
    "data": {
        "metadata": {
            "rule": $(form_to_submit).serializeArray()
        },
        "_method": "put",
    }
  }
  $.ajax(settings).done(function(response) {
    $('.domain_name_inp').attr('disabled', true);
    input = $(form_to_submit).find('input');
    input.parent().find('.error-msg').remove();
    input.parent().removeClass("has-error");
    if (response.code) {
      if(response.code == 401){
        $(".save-last").attr('disabled', false);
      }
      $.each(response.message, function(index, value) {
        index = index.split(".");
        input = $(form_to_submit).find('input').eq(index[0]);
        input.parent().find('.error-msg').remove();
        input.parent().removeClass("has-error");
        input.attr('disabled', false);
        input.focus();
        input.after('<span class="error-msg text-left">' + value + '</span>');
        input.parent().addClass("has-error");
      });
    } else {
      $('.blue-popup').fadeOut('fast');
      html = $(both_mail_parent).find('.white_box_info').html('Restricted email access to domains: ');
      $(form_to_submit).find('.domain_name_inp').each(function( index ) {
        html = $(both_mail_parent).find('.white_box_info').html();

        if( index < $(form_to_submit).find('.domain_name_inp').length-1 ) {
          $(both_mail_parent).find('.white_box_info').html(html +$(this).val()+ ", ");
        } else {
          $(both_mail_parent).find('.white_box_info').html(html +$(this).val());
        }
      });
      $(both_mail_parent).find('.white_box_info').show();
      $(both_mail_parent).find(".white-popup").removeClass('disable');
    }
  });
}

function menu_pre_select() {
  if(window.location.hash) {
    var hash = $(location).attr('href').split('#')[1];
    if(hash != '!') {
      return $('a[href="#'+hash+'"]').trigger('click');
    }
  }
  return $('.setting_tabs li:first-child').find('a').trigger('click');
}

$(document).ready(function(){
  setTimeout(function(){$(".session-flash-message").fadeOut()}, 15000);

  $('button.close').click(function() {
    $(this).parent().fadeOut();
  });

  var cancel_invi="";
  $(".invite-btn,.modelinvite").click(function() {
    autosize(document.querySelectorAll('textarea.comment-area'));
  });

  $(document).on('click', '.post_check_box', function() {
    $(".save_notification_email_status").prop('disabled', false);
    var postcheck = $('.post_check_box').val();
    if(postcheck){
       $('.post_check_box').val('');
    }
    if(!postcheck){
       $('.post_check_box').val('1');
    }
  });

  $(document).on('click', '.comment_check_box', function() {
    $(".save_notification_email_status").prop('disabled', false);
    var commentcheck = $('.comment_check_box').val();
    if(commentcheck){
         $('.comment_check_box').val('');
    }
    if(!commentcheck){
         $('.comment_check_box').val('1');
    }
  });
  $(document).on('click', '.like_check_box', function() {
    $(".save_notification_email_status").prop('disabled', false);
    var likecheck = $('.like_check_box').val();
    if(likecheck){
         $('.like_check_box').val('');
    }
    if(!likecheck){
         $('.like_check_box').val('1');
    }
  });
    $(document).on('click', '.invite_check_box', function() {
    $(".save_notification_email_status").prop('disabled', false);
    var invitecheck = $('.invite_check_box').val();
    if(invitecheck){
         $('.invite_check_box').val('');
    }
    if(!invitecheck){
         $('.invite_check_box').val('1');
    }
  });

    $(document).on('click', '.tag_user_alert', function() {
    $(".save_notification_email_status").prop('disabled', false);
    var tag_user_alert = $('.tag_user_alert').val();
    if(tag_user_alert){
         $('.tag_user_alert').val('');
    }
    if(!tag_user_alert){
         $('.tag_user_alert').val('1');
    }
  });

    $(document).on('click', '.weekly_check_box', function() {
    $(".save_notification_email_status").prop('disabled', false);
    var weeklycheck = $('.weekly_check_box').val();
    if(weeklycheck){
         $('.weekly_check_box').val('');
    }
    if(!weeklycheck){
         $('.weekly_check_box').val('1');
    }
  });

  $(document).on('click', '.tempDateUpdate', function() {
    var tempday =  $('#tempday').val();
    var tempmonth =  $('#tempmonth').val();
    var tempyear =  $('#tempyear').val();
    var space_id = $('.space_id').val();
    $.ajax({
      type: "GET",
      url:  baseurl+'/feedback_tempDate_update?space_id='+space_id+ '&tempyear=' + tempyear+ '&tempmonth=' + tempmonth+ '&tempday=' + tempday,
      success: function(response) {
        location.reload(true);
      },
      error: function(message) {
      }
    });
  });

/* send feedback reminder */   
  $(document).on('click', '.feedback_reminder', function() {
      $.ajax({
         type: "GET",
         url:  baseurl+'/send_feedback_reminder/'+$('.space_id').val(),
         success: function(response) {
            $('.feedback-status-message').html(response);
            $('.feedback-status-message').show();
            setTimeout(function(){$(".feedback-status-message").fadeOut();location.reload(true);}, 1500);
         }, error: function(error) {
            custom_logger({
              'action': 'sending feedback reminder',
              'description': 'An admin sending feedback reminder to all buyers left with feedback submission',
              'metadata': JSON.stringify(error)
            });
         }
      });
  });

/* save Feedback on/ off status*/
  $(document).on('click', '.save_feedback_on_off', function () {
    if ($('#feedback_on_off').prop('checked') == true) {
      toggleFeedbackStatus('TRUE');
    }
  });
    /*** Change  status type then disable button is active ***/
  $(document).on('change', '#selectFeedbackType', function() {
   var feedbackType = $('#selectFeedbackType').val();
    if(feedbackType != ''){
        $('.save_feedback_on_off').prop('disabled', false);
    }else{
        $('.save_feedback_on_off').prop('disabled', true);
    }
   $('.filter-option, .caret').css('color','#424242');
  });

  /*******  feedback enable save button click on checkbox *******/
  $(document).on('click', '#feedback_on_off', function() {
    var saveDisable = $('.thankyou-feedback-button').prop('disabled');
    if (saveDisable) {
       $('.thankyou-feedback-button').prop('disabled', false);
    } else {
       $('.thankyou-feedback-button').prop('disabled', true);
    }
  });

  /*******  Get previous vaule of check box click on the cancel button *******/
  $(document).on('click', '#cancelReload', function() {
        location.reload(true);
  });


  function saveNotificationSettings(){
    var form_data = {};
    $("form[name=email_notification_setting] input").each(function(){
        form_data[this.name] = $(this).val()?$(this).val():0;
    });
    $.ajax({
      type: 'POST',
      headers: {
        "cache-control": "no-cache",
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      url:  baseurl+'/notification_setting',
      data: form_data,
      success: function(response) {
        $('.email_noti_msg').show();
        setTimeout(function(){$(".email_noti_msg").fadeOut()}, 2000);
      },
      error: function(xhr, status, error) {
        errorOnPage(xhr, status, error)
      }
    });
  }

  $(document).on('click', '.save_notification_email_status', function() {
    saveNotificationSettings();
  });

  /*click on promote user */
  $(document).on('click', '.promote_user', function() {
    $('.companyName').show();
    $('.companyNameEdit').hide();
     var userid = $(this).attr('userid');
     var spaceid = $(this).attr('spaceid');
     $('#promote_user').attr('inactive',userid);
     var name = $('.user_nme'+userid).html();
     $('.u_name').html(name);
  });

   /*Promote User on DB */
  $(document).on('click', '#promote_user', function() {
    var userid = $(this).attr('inactive');
    var spaceid = $('.spaceid').val();
    $.ajax({
      type: "GET",
      url:  baseurl+'/promote_admin?spaceid='+spaceid+ '&userid=' + userid,
      success: function(response) {
      },
      error: function(message) {
      }
    });
    $('#promoteuser').modal('hide');
      $('.user_nme'+userid).append(' (admin)');
      $('.user'+userid).find('.promote_user').hide();
      return false;
  });

   /*Add Inactive user id */
  $(document).on('click', '.remove_user', function() {
    $('.companyName').show();
    $('.companyNameEdit').hide();
    var user_id = $(this).attr('userid');
    $('#delete_user').attr('inactive',user_id);
    var name = $('.user_nme'+user_id).html();
    $('.u_name').html(name);
  });

   /*Remove Inactive User */
  $(document).on('click', '#delete_user', function() {
    $('.companyName').show();
    $('.companyNameEdit').hide();
    var inactive_user = $(this).attr('inactive');
    var space_id = $('.spaceid').val();
    $.ajax({
      type: "GET",
      url:  baseurl+'/inactive_user?id='+inactive_user+ '&space_id=' + space_id ,
      success: function(response) {
      },
      error: function(message) {
      }
    });
    $('#removeuserpopup').modal('hide');
    $( ".user_manage" ).trigger( "click" );
    $('.user'+inactive_user).hide();
    return false;
  });

  var mouse_is_inside = false;
  $('.shareupdate-wrap,#a_nav').hover(function(){
    mouse_is_inside=true;
  }, function(){
    mouse_is_inside=false;
  });

  $("body").mouseup(function(){
      if(! mouse_is_inside) {
          if($('#bs-example-navbar-collapse-2').hasClass('in')) {
              $("#bs-example-navbar-collapse-2").removeClass("in");
          }

      }
  });

  $('.resend_trigger').on('click', function(){
      $('.success-msg').hide();
      main_div = $(this).closest('.tablerow');
      $('#resendinvites').find('input[name=email]').val( $(main_div).find('input[name=email]').val() );
      $('#resendinvites').find('input[name=first_name]').val( $(main_div).find('input[name=first_name]').val() );
      $('#resendinvites').find(".mailbody").find('span').eq(1).html(' ' + $(main_div).find('input[name=first_name]').val() + ',');
      $('#resendinvites').find('input[name=last_name]').val( $(main_div).find('input[name=last_name]').val() );
  });

  $('.cancel_invi_trigger').on('click', function(){
    main_div = $(this).closest('.tablerow');
    cancel_invi = $(main_div).find('input[name=space_user_id]').val();
  });

  $('.cancel_invitation_trigger').on('click', function(){
  main_div = $(this).closest('.tablerow');
  var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": baseurl+"/cancel_invitation/"+cancel_invi,
    "method": "get",
    "headers": {
        "cache-control": "no-cache",
        'X-CSRF-TOKEN': CSRF_TOKEN
    }
  }
    $.ajax(settings).done(function(response) {
      $('#cancelinvitepopup').modal('hide');
      mixpanelLogger({
        'space_id': sess_space_id, 
        'event_tag':'Cancel Pending Invite'
      })
      location.reload();
    });
  });

  $("input[name=first_name]").on('change, keyup paste input', function() {
    if($(this).val().length){
       $(this).parent().parent().parent().find(".mailbody").find('span').eq(0).show();
    } else {
       $(this).parent().parent().parent().find(".mailbody").find('span').eq(0).hide();
       $(this).parent().parent().parent().find(".mailbody").find('span').eq(1).html('');
    }
    $(this).parent().parent().parent().find(".mailbody").find('span').eq(1).html(' ' + $(this).val() + ',');
  });

   /* domain_inp_edit start */
  $(document).on("click", ".domain_inp_edit", function() {
    $(this).parent().parent().parent().find('.domain_name_inp').attr('disabled', false);
    $(this).parent().parent().parent().find('.domain_name_inp').focus();
    val_temp = $(this).parent().parent().parent().find('.domain_name_inp').val();
    $(this).parent().parent().parent().find('.domain_name_inp').val( '' );
    $(this).parent().parent().parent().find('.domain_name_inp').val(val_temp)
    $(".save-last").attr('disabled', false);
  });
   /* domain_inp_edit end */

   /* domain_inp_delete start */
  $(document).on("click", ".domain_inp_delete", function() {
    if($("#domain-management-tab").find('.domain_inp_delete').length == 1){
      $('.domain_name_inp').after('<span class="error-msg text-left">' + "There should atleast one domain" + '</span>');
      $('.domain_name_inp').parent().addClass("has-error");
       return false;
    }
    $(this).closest('.domain-input-grp').remove();
    $(".save-last").attr('disabled', false);
  });
   /* domain_inp_delete end */

   /* Add Domain row start*/
  $('.add_domain_row').on('click', function(){
    domain_skull = $('.add_domain_skull').clone();
    domain_skull.show();
    domain_skull.removeClass('add_domain_skull');
    domain_skull.find('input').addClass('domain_name_inp');

    var ele = $('.form_field_section').find('.domain-input-grp').length-1;

    if( ele < 0) {
       $('.form_field_section').find('.input-group').eq(0).after(domain_skull);
    } else {
       $('.form_field_section').find('.domain-input-grp').eq(ele).after(domain_skull);
    }
    domain_skull.find('.domain_name_inp').focus();
    $(".save-last").attr('disabled', false);
  });


  $(document).on('keypress, keyup', '.domain_name_inp', function(e) {
    $(this).val( $(this).val().toLowerCase() );
    var block_key = [64,32,44,59];
      if (block_key.indexOf(e.which) > -1) {
        return false;
      }
  });

   /**/
  $('.white_box_info').on('click', function() {
    $(this).fadeOut('fast');
  });

   /* Remove error-msg from input when value change */
  $("textarea, input").on('change, keyup paste input', function() {
    $(this).parent().removeClass('has-error');
    $(this).parent().find('.error-msg').remove();
  });

   /* reset form and div */
  $('#myModalInvite').on('show.bs.modal', function () {
    $('.white_box_info').fadeOut('fast');
  });

  $("#myModalInvite").on('hide.bs.modal', function() {
    location.reload();
  });


  if($(".show_tab").attr('showtab').length>0){
    var show_tab = $(".show_tab").attr('showtab');
    $('a[href="#'+show_tab+'"]').parent().addClass('active');
    $('#'+show_tab).show();
    cleanUrl("#"+show_tab);
  }else{
    setTimeout(menu_pre_select, 1000);
  }

  $(".save_notification_email_status").prop('disabled', true);
  $(".save_password").prop('disabled', true);
    if(localStorage.getItem("Status")) {
      $('.box').scrollTop();
       $('.pending_noti_msg').show();
        setTimeout(function(){
               $(".pending_noti_msg").fadeOut();
               localStorage.clear();
      }, 3000);
    }

  $('.post_permission').on('change', function() {
    $(this).closest('form').find('.btn.btn-primary').removeAttr('disabled');
  });

  $(".save-last").attr('disabled', true);
  $(document).on('click','.side_tabs', function(){
    cleanUrl($(this).attr('href'));
  });

  $(".edit_user_name").on('click', function(e) {
    $(this).hide();
    $(".user_first_last_name").hide();
    $(".edit_user").show();
  });

  $(".cancel_user_name").on('click', function(e) {
    $(".user_first_last_name").show();
    $(".edit_user").hide();
    var first_prev_name = $("#first_prev_name").val();
    var last_prev_name = $("#last_prev_name").val();
    $("#first_name").val(first_prev_name);
    $("#last_name").val(last_prev_name);
    $(".first_name_text_error").css("display", "none");
    $(".last_name_text_error").css("display", "none");
    $(".edit_user_name").show();
  });

  $(document).on('keyup', '#first_name', function() {
      var char = $('#first_name').val().length;
      if( char > 0){ 
          $(".first_name_text_error").css("display", "none");
      }
  });

  $(document).on('keyup', '#last_name', function() {
      var char = $('#last_name').val().length;
      if( char > 0){ 
          $(".last_name_text_error").css("display", "none");
      }
  });

  $(document).on('click','.check_hover_dots',function(){    
    if($('.check_hover_dropdown').hasClass('open')){    
       $('.check_hover_dropdown').parent().parent().parent().find('.tablerow-detail').addClass('fix_hover');
       $('.pending-eye').removeClass('active');    
    } else {    
       $('.check_hover_dropdown').parent().parent().parent().find('.tablerow-detail').removeClass('fix_hover');   
    }   
  });

  var mouse_is_outside_eye = false;
  $('.pending-eye').hover(function(){
        mouse_is_outside_eye=true;
  }, function(){
        mouse_is_outside_eye=false;
  });

  $(document ).on('click','body',function(){   
    if($('.check_hover_dropdown').hasClass('open')){    
         $('.check_hover_dropdown').parent().parent().parent().find('.tablerow-detail').removeClass('fix_hover');   
    }
    if(!mouse_is_outside_eye){
      if($('.pending-eye').hasClass('active')){
        $('.pending-eye').removeClass('active');
      }
    }
  });

  $(document).on('click','.pending-eye',function(){    
    var eye_id =  $(this).attr('data-id');
      if($('.pending-history-'+eye_id).hasClass('active')){
          $('.pending-history-'+eye_id).removeClass('active');
      } else {    
       $('.pending-eye').removeClass('active');
        $('.pending-history-'+eye_id).addClass('active');
      }  
  });

  $('#editcompany').on('hidden.bs.modal', function () {
    $('.bootstrap-select').prop('selectedIndex',0);//reset selec box
    location.reload(true);
  });
  $(document).on('click','.current_pass,.new_pass,.new_confirm_pass',function(){
    $(".save_password").prop('disabled', false);
  });
  $(document).on("click", ".save_password", function(e) {
    $(".save_password").prop('disabled', true);
    e.preventDefault();
    var current_password = $('.current_pass').val();
    var new_password = $('.new_pass').val();
    var confirm_password = $('.new_confirm_pass').val();
    var validate_new_password = true;
    var validate_confirm_password = true;
    var over_all_val = true;
    var password_min_length = 8
    var password_max_length = 60
    var error = { "color": "#ff5252","font-size": "12px","letter-spacing": "0","line-height": "12px","margin-bottom": "9px","margin-top": "9px" };
    $('.current_pass_error').html('');

    if(current_password && new_password && confirm_password){
      if(new_password.length < password_min_length || new_password.length>password_max_length)
         validate_new_password = false;
      if(confirm_password.length < password_min_length || new_password.length>password_max_length)
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
        $('.new_pass_error').css(error).html('Your password must be a minimum of '+password_min_length+' characters and maximum of '+password_max_length+' characters and contain an upper case letter, lower case letter and a number');
            over_all_val = false;
      }else{
        $('.new_pass_error').html('');
      }
      if(!validate_confirm_password){
        $('.new_confirm_pass_error').css(error).html('Your password must be a minimum of '+password_min_length+' characters and maximum of '+password_max_length+' characters and contain an upper case letter, lower case letter and a number');
           over_all_val = false;
      }else{
        $('.new_confirm_pass_error').html('');
      }
      if(new_password != confirm_password){
        $('.new_confirm_pass_error').css(error).html('Password & Confirm Password must be same');
           over_all_val = false;
      }
    }
    if(!current_password){
      $('.current_pass_error').css(error).html('Please enter current password');
      over_all_val = false;
    }
    if(!new_password){
      $('.new_pass_error').css(error).html('Please enter new password');
      over_all_val = false;
    }
    if(!confirm_password){
      $('.new_confirm_pass_error').css(error).html('Please confirm new password again');
      over_all_val = false;
    }
    if(current_password != ''){
      $.ajax({
        type: "GET",
        url: baseurl+'/check_pass?current_pass=' + current_password,
        success: function(response) {
          if(response == 'false'){
            $('.current_pass_error').css(error).html('Please Enter Current Password');
            over_all_val = false;
            e.preventDefault();
          }
          if(response == 'true' && over_all_val==true){
            var  formdata=$( ".change_password_form" ).serialize();
            $.ajax({
              url :  baseurl+'/setting/update_password',
              method:'post',
              data:formdata,
              success : function (response) {
              $('div.changepasswordalert').text(response).show();
              setTimeout(function(){$('.changepasswordalert').fadeOut();}, 2000);
              },
              error:function(error){
                console.log(error);
              }
            });
          }
        },
      error: function(message) {
        alert(message);
      }
    });
  }else{
    return false;
  }
  });

  var path = window.location.href;
  var setting_url = path.split("#");
  if(setting_url[1] == 'bulk-add-users'){
    $('#bulk_add_users').css('display','block');
  }
});
  $(document).on('click','#bulk-invite-export',function(){
    $('.mail-content,.bulk-invite-mail').hide();
    $('.bulk-invite-export').show();    
  });
  $(document).on('click','#bulk-invite-mail',function(){
    $('.mail-content,.bulk-invite-mail').show();
     $('.bulk-invite-export').hide();
  });  