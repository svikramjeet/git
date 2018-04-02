var uploaded_file_aws_unik;
var check_share_active;
var s3_upload_xhr = new Array();
var month_names = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var direct_upload_s3_data = [];
var get_all_share_notifications, notification_count, activity_notification;

$.ajax({
  async: false,
  type: "GET",
  url: baseurl + '/check_login?_=' + new Date().getTime(),
  success: function(response){ if(!response.is_login) window.location = baseurl; },
  error: function(){ window.location = baseurl;}
});

function errorOnPage(xhr, status, error){
  alert('Error: Please refresh the page');
}

function signedUrl(url, loader){
  var signed_Url;
  $.ajax({
    type: "GET",
    async: false,
    url: baseurl + '/url_validate?q=' + url,
    beforeSend:function(request){
      loader.show();
    },
    success: function (response) {
      signed_Url = response;
    },
    complete:function(){
      loader.hide();
    }
  });
  return signed_Url;
}

function getQueryVariable(param) {
  var query = window.location.search.substring(1);
  var url_parameters = query.split("&");
  for (var i=0;i<url_parameters.length;i++) {
    var pair = url_parameters[i].split("=");
    if (pair[0] == param) {
      return pair[1];
    }
  }
  return null;
}

function extractUrlParam(url, param){
  return getQueryVariable(param);
}

function arrayValueFrequence(value_array){
  var array_value_count = {};
  jQuery.each(value_array, function(key,value) {
    if (!array_value_count.hasOwnProperty(value)) {
      array_value_count[value] = 1;
    } else {
      array_value_count[value]++;
    }
  });
  return array_value_count;
}

function getSort(unsorted){
  var sortable = [];
  for (var key in unsorted) {
    sortable.push([key, unsorted[key]]);
  }

  sortable.sort(function(a, b) {
    return a[1] - b[1];
  });

  return sortable;
}

function postDropDownLabel(list, selected) {
  switch(list-selected) {
    case 0:
      return {text: 'Everyone', master_box_check: true};
    case list:
      return {text: 'Nothing Selected', master_box_check: false};
    default:
      return {text: selected+' Member(s)', master_box_check: false};
  }
}

function getParameterByName(required_parameter) {
  var url = decodeURIComponent(window.location.search.substring(1)),
    url_parameter = url.split('&'),
    parameter_name;

  for (var index = 0; index < url_parameter.length; index++) {
    parameter_name = url_parameter[index].split('=');
    if (parameter_name[0] === required_parameter) {
      return parameter_name[1] === undefined ? true : parameter_name[1];
    }
  }
  return null;
};

function xmlToJson(xml) {
  var obj = {};
  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {
      };
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }
  if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
    obj = xml.childNodes[0].nodeValue;
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof (obj[nodeName]) == 'undefined') {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof (obj[nodeName].push) == 'undefined') {
          var old = obj[nodeName];
          obj[nodeName] = [
          ];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

function readURL55(input) {
  if (input.files && input.files[0]) {
    var fileinput = document.getElementById('img_show');
    if (!fileinput)
     return "";
    var filename = fileinput.value;
    if (filename.length == 0)
      return "";
    var dot = filename.lastIndexOf(".");
    if (dot == -1)
      return "";
    var extension = filename.substr(dot, filename.length);
    var file_ext = extension.toLowerCase();
    var allowed_extensions = [".jpg", ".png", ".bmp", ".gif", ".jpeg"];
    var a = allowed_extensions.indexOf(file_ext);
    if(a < 0){
      $('#img_show').val('');
      alert('Please Select Image');
      return false;
    }else{
      var reader = new FileReader();
      //reader.onload = function (e) {
      reader.onload = (function(e) { 
      /*********************New Code Start********************/
        var img = new Image(); 
        img.src = e.target.result;
        img.onload = function() { 
          function _base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64.split(",")[1]);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
              bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
          }

          var exif = EXIF.readFromBinaryFile(_base64ToArrayBuffer(this.src));
          var canvas = document.createElement("canvas");
          canvas.width = this.width; 
          canvas.height = this.height;
          var ctx = canvas.getContext("2d");
          var x = 0;
          var y = 0;
          ctx.save(); 
          if (typeof exif.Orientation != "undefined") {
            switch (exif.Orientation) {
              case 2:
                // horizontal flip
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                break;
              case 3:
                // 180° rotate left
                ctx.translate(canvas.width, canvas.height);
                ctx.rotate(Math.PI);
                break;
              case 4:
                // vertical flip
                ctx.translate(0, canvas.height);
                ctx.scale(1, -1);
                break;
              case 5:
                // vertical flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
              case 6:
                // 90° rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(0, -canvas.height);
                break;
              case 7:
                // horizontal flip + 90 rotate right
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(canvas.width, -canvas.height);
                ctx.scale(-1, 1);
                break;
              case 8:
                // 90° rotate left
                ctx.rotate(-0.5 * Math.PI);
                ctx.translate(-canvas.width, 0);
                break;
            }

            ctx.drawImage(img, x, y);
            ctx.restore();
            var finalImage = canvas.toDataURL("image/jpeg", 1.0);
            var result =  finalImage;
          } else { 
           var result = this.src;
          }
          $('#blah55').css('background', 'url(' + result + ') no-repeat scroll center center / cover');
        };
      });
      reader.readAsDataURL(input.files[0]);
      $(".show_image").hide();
      $("#show_change_image").show();
      $("#blah55").show();
    }
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var fileinput = document.getElementById('img_show');
    if (!fileinput)
      return "";
    var filename = fileinput.value;
    if (filename.length == 0)
      return "";
    var dot = filename.lastIndexOf(".");
    if (dot == -1)
      return "";
    var extension = filename.substr(dot, filename.length);
    //alert(extension);
    var file_ext = extension.toLowerCase();
    var allowed_extensions = [".jpg", ".png", ".bmp", ".gif"];
    var a = allowed_extensions.indexOf(file_ext);
    if(a < 0){
      $('#img_show').val('');
      alert('Please Select Image');
      return false;
    }else{
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#blah')
         .attr('src', e.target.result)
         .width(200)
         .height(auto);
      };
      reader.readAsDataURL(input.files[0]);
      $("#show_image_pop").hide();
      $("#show_change_image_pop").show();
      $("#blah").show();
    }
  }
}


/* Custom logger */
function custom_logger(data) {
  $.ajax({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    type: "POST",
    url: baseurl+'/custom_logger',
    data: data
  });
}

/* */
function extension_wise_img(ext) {
  ext = ext.toLowerCase();
  ext_img = null;
  if(ext == 'mp4')
      ext_img = baseurl+'/images/ic_VIDEO.svg';
  if(ext == 'png' || ext == 'jpg' || ext == 'jpeg')
      ext_img = baseurl+'/images/ic_IMAGE.svg';
  if (ext == 'ppt' || ext == 'pptx') 
      ext_img = baseurl+'/images/ic_PWERPOINT.svg';
  if (ext == 'csv' || ext == 'xls' || ext == 'xlsx' || ext == 'xlsm') 
      ext_img = baseurl+'/images/ic_EXCEL.svg';
  if (ext == 'pdf') 
      ext_img = baseurl+'/images/ic_PDF.svg';
  if (ext == 'doc' || ext == 'docx') 
      ext_img = baseurl+'/images/ic_WORD.svg';

  return ext_img;
}

/* get file info */
function file_info( ele ){
  var control = $(ele);
  control.addEventListener("change", function(event) {
      // When the control has changed, there are new files
      var files = control.files;
      for (var i = 0; i < files.length; i++) {
          console.log("Filename: " + files[i].name);
          console.log("Type: " + files[i].type);
          console.log("Size: " + files[i].size + " bytes");
      }
  }, false);
}

function toggleSelectAll(control) {
   var allOptionIsSelected = (control.val() || []).indexOf("All") > -1;
   function valuesOf(elements) {
       return $.map(elements, function(element) {
           return element.value;
       });
   }
   if (control.data('allOptionIsSelected') != allOptionIsSelected) {
       // User clicked 'All' option
       if (allOptionIsSelected) {
           // Can't use .selectpicker('selectAll') because multiple "change" events will be triggered
           control.selectpicker('val', valuesOf(control.find('option')));
       } else {
           control.selectpicker('val', []);
       }
   } else {
       // User clicked other option
       if (allOptionIsSelected && control.val().length != control.find('option').length) {
           // All options were selected, user deselected one option
           // => unselect 'All' option
           control.selectpicker('val', valuesOf(control.find('option:selected[value!=All]')));
           allOptionIsSelected = false;
       } else if (!allOptionIsSelected && control.val().length == control.find('option').length - 1) {
           // Not all options were selected, user selected all options except 'All' option
           // => select 'All' option too
           control.selectpicker('val', valuesOf(control.find('option')));
           allOptionIsSelected = true;
       }
   }
   control.data('allOptionIsSelected', allOptionIsSelected);
}
function addhttp(url) {
  if (!/^(f|ht)tps?:\/\//i.test(url)) {
    url = "http://" + url;
  }
  return url;
} 
function liked_info(element){
  if($(element).parent().hasClass('comment-area')) return;
  var userid = $(element).attr('data-id');
  $.ajax({
    type: "GET",
    dataType: "json",
    url: baseurl+'/get_liked_user_info?uid='+userid,
    success: function(data) {  
      $.each( data, function( key, val ) {
      if(val.user.profile_image_url!=null){
        $('.community-member-detail').find('.modal_image_section').html('<span style="background-image:url('+val.user.profile_image_url+')"></span>');
      }else{
        var imng= baseurl+'/images/dummy-avatar-img.svg';
            $('.community-member-detail').find('.modal_image_section').html('<span style="background-image:url('+imng+')">');
      }
      if(val.metadata.user_profile.user.contact.linkedin_url!=""){
        var linked = addhttp(val.metadata.user_profile.user.contact.linkedin_url);
      }else{
        var linked = "";
      }
          
      $('.community-member-detail').find('.member_info').find('h4').html(val.user.first_name.substr(0, 1).toUpperCase() + val.user.first_name.substr(1) +' '+ val.user.last_name.substr(0, 1).toUpperCase() + val.user.last_name.substr(1));
      $('.community-member-detail').find('.member_info').find('h5').html(val.metadata.user_profile.job_title);
      if(val.sub_company_id != '00000000-0000-0000-0000-000000000000' && val.sub_company_id != '00000000-0000-0000-0000-000000000001' ){
        $('.community-member-detail').find('.member_info').find('h6').eq(0).html(val.sub_comp.company_name);    
      } else{   
        $('.community-member-detail').find('.member_info').find('h6').eq(0).html(val.company_name);   
      }
      $('.community-member-detail').find('.member_info').find('p').html(val.metadata.user_profile.bio);
      if(val.metadata.user_profile.user.contact.linkedin_url!=""){
        $('.linkedin-link').show();
        $('.community-member-detail').find('.linkedin-link').html('<a target="_blank" href="'+linked+'">'+linked+'</a>');
      }else{
        $('.linkedin-link').hide();
      }
      $('.community-member-detail').find('.email-link').html('<a href="mailto:'+val.user.email+'">'+val.user.email+'</a>');
      $('.community-member-detail').find('.call-link').html(val.metadata.user_profile.user.contact.contact_number);        
      }); 
      $('#member_info_modal').modal('show');
    },
    error: function(xhr, status, error) {
          $('.load_ajax_new_posts').val(0);
          var err = eval("(" + xhr.responseText + ")");
          alert(err.Message);
    }
  });
}

/* Find unique data from array */
Array.prototype.contains = function(v) {
  for(var i = 0; i < this.length; i++) {
      if(this[i] === v) return true;
  }
  return false;
};

Array.prototype.unique = function() {
  var arr = [];
  for(var i = 0; i < this.length; i++) {
      if(!arr.contains(this[i])) {
          arr.push(this[i]);
      }
  }
  return arr; 
}

function set_linkedin_session(){
  if( $('#tested123').length ) {
      var company = $('#tested123').val();
  }else{
      var company = '';
  }
  if( $('.sub_comp_input').length ) {
      var sub_company = $('.sub_comp_input').val();
  }else{
      var sub_company = '';
  }
  var company_status = 0;
  if( $('.buyer_info_hidden').length ) {
    var buyer_company_hidden_id = $('.buyer_info_hidden').attr('buyer-id');
    var buyer_company_hidden_name = $('.buyer_info_hidden').val();
    var buyer_company_id = $('.company_admin').find(":selected").val();
    var buyer_company = $('.company_admin').find(":selected").text();
    if (buyer_company_hidden_id == buyer_company_id && buyer_company_hidden_name == buyer_company) {
      var company_status = 1;
    }
  }
  var job_title = $('#jobtitletxt').val();
  var biotext = $('#biotextarea').val();
  var linkedin_link = $('#linkedin_link').val();
  if( $('.ph_number').length ) {
   var phone_no = $('.ph_number').val();
  }else{
   var phone_no = '';
  }  
  if (company != '' || sub_company != '' || job_title !='' || biotext !='' || linkedin_link !='' || phone_no !=''){
    $.ajax({
      type: "GET",
      cache:false,
      async:true,
      url: baseurl+'/set_linkedin_session',
      data : {company:company,sub_company:sub_company,job_title:job_title,
          biotext:biotext,linkedin_link:linkedin_link,phone_no:phone_no,company_status:company_status},
      success: function(data) {
        window.location = baseurl + "/auth/linkedin";
      },
      error: function(error) {
        console.log(error);
      }
    });
  }else{
    window.location = baseurl + "/auth/linkedin";
  }
}

function set_dynamic_img( inp ){
  var reader = new FileReader();
  reader.onload = function (e) {
  $('#file_profile_img')
    .attr('src', e.target.result)
    .width('80%')
    .height('auto');
  };
  reader.readAsDataURL(inp.files[0]);
}

function session_expired(error){
  if(error=='Unauthorized'){
    //$('.session_exp_msg').show();
  }
}

function change_company(element){
  var userId = $(element).attr('user-id');
  var companyId = $(element).val();
  $('.modal_title').html( "Change "+$(element).closest('.tablerow').find('.mem_name').html().trim()+"'s Company " );
  $('.modal_text').html( "Are you sure you want to change "+$(element).closest('.tablerow').find('.mem_name').html().trim()+"'s selected Company? " );
  $('.hidden_company_id').val(companyId);
  $('.hidden_user_id').val(userId);
  $('#editcompany').modal('show');
}

function submit_company_form(element){
  var company_id = $('.hidden_company_id').val();
  var user_id = $('.hidden_user_id').val();
  $.ajax({
    type: "GET",
    url:  baseurl+'/companyupdate?company_id='+company_id+ '&user_id=' + user_id+'&space_id='+current_space_id ,
    success: function(response) {
     location.reload(true);
    $('#editcompany').modal('hide');
    $('.user'+user_id).find('.companyNameEdit').hide();
    $('.user'+user_id).find('.companyName').show();
    $('.user'+user_id).find('.companyName').html($('.user'+user_id).find(".select_company_n option[value='"+company_id+"']").text());
    },error: function(message) {  }
  });
}

function func_edit_company(element){
  var userid = $(element).attr('userid');
  $('.companyName').show();
  $('.companyNameEdit').hide();
  $('.user'+userid).find('.companyName').hide();
  $('.user'+userid).find('.companyNameEdit').show();
  $('.user'+userid).find('.bootstrap-select').prop('selectedIndex',0);//reset selec box
}

function add_domain_input(ele) {
  var clone  = $(ele).parent().parent().find('.input-group').eq(0).clone();
  clone.find('input').val('');
  clone.removeClass('has-error');
  clone.append('<span onclick="$(this).parent().remove();" class="close fa fa-times-circle"></span>');
  $(ele).parent().before(clone);
}


function getAllShareNotifications(){
  $totalNotificaions= 0;
  if(get_all_share_notifications != null || get_all_share_notifications == 'error') return;

  get_all_share_notifications = $.ajax({
    type: "GET",
    url: baseurl+'/get_all_share_notifications?spaceid='+current_space_id,
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      $.each(response, function(i, item){
        if(item.count>0){
          $('#shareNoti_'+item.space_id).show();
          $('#shareNoti_'+item.space_id).html(item.count);
        }
        $totalNotificaions= $totalNotificaions+item.count;
      });
      if($totalNotificaions>0){
        $('.allnotifications').show();
      }
      get_all_share_notifications = null;
    },
    error:function(){
      get_all_share_notifications = 'error';
    }
  });
}

function notificationCount(){
  if(notification_count != null || notification_count == 'error') return;
  notification_count = $.ajax({
    type: "GET",
    url: baseurl+'/notification_count?space_id='+current_space_id,
    success: function (response) {
      if(response > 0)
        $('.notification_count').html('<span>'+response+'</span>');
      notification_count = null;
    },
    error: function (xhr, status, error) {
      notification_count = 'error';
    }
  });
}

function activityNotification(){
  if(activity_notification != null || activity_notification == 'error') return;
  var notification_limit = $('.notification_limit').val();
  if(notification_limit==0){
    notification_limit='6';
  }
  var notification_offset = $('.notification_offset').val();
  var notification_header = '1';
  activity_notification = $.ajax({
    type: "GET",
    url: baseurl+'/activity_notification?space_id='+current_space_id+'&limit='+notification_limit+'&offset='+notification_offset+'&notification_header='+notification_header,
    success: function (response) {
      if(response==''){
        $('.notifications').html('<li class="header">Notifications</li><li><a href="javascript:void(0)"> No notification found</a></li>');
      }else{
        $('.notifications').html(response);
      }
      activity_notification = null;
    },
    error: function (xhr, status, error) {
      activity_notification = 'error';
      if(error=='Unauthorized'){
        session_expired(error);
        clearInterval(notification_run);
      }
    }
  });
}


$(document).on('click', '.tourlink_yes_linkedin', function () {
  $('.profile_loader').show();
  set_linkedin_session();   
});

$(document).on('click', '.tourlink_no_linkedin', function () {
  $(".profile_linkedin_wrap").hide();
  $(".linked_hide_overlay").hide();
  $(".disable-overlay").hide();
  $('.bio_blue_popup_linkedin').remove();
  var job_title_val = $("#jobtitletxt").val();
  $('#jobtitletxt').focus().val("").val(job_title_val);
});

autosize(document.querySelectorAll('textarea.mail_body'));

$(document).on('click', '.invite-btn,.modelinvite', function () {
  $(".mail_body").height(140);
});

$(document).on('click', '.invite-icon,.modelinvite', function () {
  $(".mail_body").height(140);
});

$(document).ready(function(){

  $('.selectpicker').selectpicker('refresh');

  var $window = $(window), previousScrollTop = 0, scrollLock = false;
  $('.navbar-brand').on('click', function(){
    $('body').toggleClass('body-scroll');
    if ($("body").hasClass("body-scroll")){
      scrollLock = true;
    }else{
      scrollLock = false;
    }
    $window.scroll(function(event) {
      if(scrollLock) {
        $window.scrollTop(previousScrollTop);
      }
      previousScrollTop = $window.scrollTop();
    });
  });

  $(window).click(function() {
    $('body').removeClass('body-scroll');
    scrollLock = false;
    $window.scroll(function(event) {
      if(scrollLock) {
        $window.scrollTop(previousScrollTop);
      }
      previousScrollTop = $window.scrollTop();
    });
  });


  $('.ic_search').click(function(){
    $('.search-input-wrap').show();
    $('.ic_search').hide();
    $('#search-results').show();
    $('#search-input').focus();
  });

  $('.search_close').click(function(){
    $('#search-input').val('');
    $('.search-input-wrap').hide();
    $('.ic_search').show();
    $('#search-results').hide();
    $('#msearch-results').hide();
    $('.search-dropdown-wrap1').hide();
    $('.search-dropdown-wrap').hide();
  });


  $( ".show_image" ).on( "click", function(){
    $( "#img_show" ).trigger( "click" );
  });

  $( "#show_change_image" ).on( "click", function() {
    $( "#img_show" ).trigger( "click" );
  });
  
  $(document).on('click','.remove_badge', function(){
    $.ajax({
      type: "GET",
      url: baseurl + '/notifications_badge_reset/'+current_space_id,
      success: function (response) {
       $('.notification_count').html('');
      }
    });
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
    /* Required field for form field start*/

  $('form').submit(function() {
    $('.client_side_validation_msg').remove();
    var error=false;
    var name_field_max_length = 25;
    $(this).find('.c_side_validation').each(function(){
        if( $(this).is("select") || $(this).is("input") || $(this).is("textarea") ){
            if(!$(this).val().length){
                $(this).parent().addClass('has-error');
                $(this).after('<div class="client_side_validation_msg"><span class="error-msg text-left">Field is Required</span></div>');                
                error=true;
                $('.form_loader').hide();
            }
            if($(this).is("input")) {
                if($(this).val().length > name_field_max_length){
                   var name = $(this).attr('name');
                   var this_field = $(this);
                   name_field_obj = {'first_name': 'First name','last_name': 'Last name'};
                   $.each( name_field_obj, function( key, value ) {
                    if(name ==  key){
                     this_field.parent().addClass('has-error');
                     this_field.after('<div class="client_side_validation_msg"><span class="error-msg text-left">The '+value+' may not be greater than '+name_field_max_length+'</span></div>');                
                     error=true;
                     $('.form_loader').hide();
                    }
                   });
                }
            }
        }
    });
    if(error) return false;
    return true;
  });
    /* Required field for form field end*/

  /* Reset impact of required validation after user typing */
  $(document).on('keydown change', '.c_side_validation', function () {
      $(this).parent().find('.has-error').removeClass('has-error');
      $(this).parent().find('.client_side_validation_msg').remove();
  });

  /* Prevent execute js script in input/textarea for existing element */
  $("input, textarea").on('keyup', function () {
      var str = $(this).val();
      var patt = new RegExp("<[^>]*script");
      if(patt.test(str))
          $(this).val( $(this).val().replace(/</g, "&lt;").replace(/>/g, "&gt;") );
  });

  /* Prevent execute js script in input/textarea for runtime generated */
  

  $(".edit_share_name").on('click', function(e) {
    $(".share_name").hide();
    $(".edit_share").show();
    $(".updated_share").focusEnd();
  });
   
  $(".cancel_edit_share").on('click', function(e) {
    $(".share_name").show();
    $(".edit_share").hide();
  });
   

  /* Prevent user to enter specified charecater start */
  $(document).on('keypress', '.invite_email_inp, input[name=email]', function(e) {
    var block_key = [32,44,59];
    if (block_key.indexOf(e.which) > -1) {
       return false;
    }
  });

    /* Reset impact of required validation after user typing */
    $(document).on('keydown', '.c_side_validation', function () {
        $(this).parent().removeClass('has-error');
        $(this).parent().find('.client_side_validation_msg').remove();
    });
    

    /* Prevent execute js script in input/textarea for runtime generated */
    $(document).on('keyup', 'input, textarea', function () {
        var str = $(this).val();
        var patt = new RegExp("<[^>]*script");
        if(patt.test(str))
            $(this).val( $(this).val().replace(/</g, "&lt;").replace(/>/g, "&gt;") );
    });

    $(function(){
      $('.normal').autosize();
      $('.animated').autosize();
      $('.pro-file').on('click', function() {
        $('.search-dropdown-wrap').hide();
      });
    });

    $('#divRatings').selectpicker().change(function() {
      toggleSelectAll($(this));
    }).trigger('change');
    $(function() {
      $('[data-toggle="popover"]').popover()
    });
    $("#show_image_pop").on("click", function() {
      $("#img_show").trigger("click");
    });
    $("#show_change_image_pop").on("click", function() {
      $("#img_show").trigger("click");
    });
    $('#home a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
    
    /* Upload file at S3*/
    var form_s3 = $('.direct_upload_s3');
    var folders_s3 = ['post_file'];
    form_s3.fileupload({  
      url: form_s3.attr('action'),
      type: form_s3.attr('method'),
      datatype: 'xml',
      add: function (event, data) {
        var file = data.files[0];
        uid = data.files[0]['uid'] = Date.now() + '_' + 'uid';
        var filename = Date.now() + '.' + file.name.split('.').pop();
        if (direct_upload_s3_data[0]['allowed_extension'].indexOf(file.name.split('.').pop()) < 0) {
          alert("Wrong extension type. Please upload " + direct_upload_s3_data[0]['allowed_extension'].toString() + " Files");
          window[direct_upload_s3_data[0]['error_callback']]();
          return 0;
        }

        window.onbeforeunload = function () {
          return 'You have unsaved changes.';
        };
        form_s3.find('input[name="Content-Type"]').val(file.type);
        form_s3.find('input[name="key"]').val((folders_s3.length ? folders_s3.join('/') + '/' : '') + filename);

        // Actually submit to form to S3.
        s3_upload_xhr[uid] = data.submit();

        if (direct_upload_s3_data[0]['progress_bar_ele']) {
          $(direct_upload_s3_data[0]['progress_bar_ele']).append('<div style="width: 0;" onclick="close_preview_general_s3(this);" id="' + uid + '" class="s3_running_process ' + uid + '"><span class="small-del"><img src="' + baseurl + '/images/ic_highlight_remove.svg' + '"></span><div class="progress small"><div class="progress-bar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="" style="width:100%"><span class="sr-only"></span></div></div><span class="close"></div>');
        }
      },
      progress: function (e, data) {
        uid = data.files[0].uid;
        var percent = Math.round((data.loaded / data.total) * 100);
        $('.' + uid).width(percent + '%');
        $('.' + uid).find('.sr-only').html(percent + '%');
      },
      fail: function (e, data) {
        // Remove the 'unsaved changes' message.
        window.onbeforeunload = null;
      },
      done: function (event, data) {
        window.onbeforeunload = null;
        var original = data.files[0];
        var s3Result = xmlToJson(data.result.documentElement);
        var temp_data = {
          "originalName": original.name,
          "s3_name": s3Result.Key,
          "size": original.size,
          "url": s3Result.Location,
          'mimeType': original.type,
          "uid": data.files[0].uid
        };
        (window[direct_upload_s3_data[0]['storage']]).push(temp_data);

        $('input.' + direct_upload_s3_data[0]['form_field_class']).val(JSON.stringify((window[direct_upload_s3_data[0]['storage']]), null, 2));
        window[direct_upload_s3_data[0]['done_callback']](temp_data);
      }
    });
    /* Upload file at S3 end*/
});
/* Document ready end */

