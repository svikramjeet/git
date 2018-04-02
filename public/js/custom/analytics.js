function maxLimit(){
  selection_limit = constants.ANALYTIC.graph_selection_limit
  return swal({
    title: 'Maximum Selected',
    text: 'A maximum of '+selection_limit+' Client Shares can be selected in Analytics',
    confirmButtonText: 'close',
    customClass: 'simple-alert'
  });
}

$('.single-share-report').on('click', function () {
  element = $(this);
  $.ajax({
    type: 'GET',
    url: baseurl + '/export_xls_file?share_id='+element.find('#share_id').val()+'&month=' + ((new Date().getMonth())+1) + '&year=' + (new Date().getFullYear()),
    async: false,
    beforeSend: function() {
      swal({
        title: 'Download xlsx',
        text: 'A link to download your '+element.find("#share_name").val()+' Client Share analytics data in xlsx format has been emailed to '+$("#user_email").val()+' and will be available shortly.',
        confirmButtonText: 'close',
        customClass: 'simple-alert'
      });
    },
    error: function (message) {
      swal({
        text: 'Something went wrong. Try again later.',
        confirmButtonText: 'close',
        customClass: 'simple-alert'
      });
    }
  });
});

$(document).on('click', '.excel_download_all', function () {
  $.ajax({
    type: 'GET',
    url: baseurl + '/export_xls_file?month=' + ((new Date().getMonth())+1) + '&year=' + (new Date().getFullYear()),
    async: false,
    success: function (response) {
      console.log('success');
    },
    error: function (message) {
      console.log(message);
    }
  });
});

$(document).on('click', '.down-month, .curnt_year', function () {
  if ($('.year-tab').hasClass('open-month')) {
    $('.year-tab').removeClass('open-month');
  } else {
    $('.year-tab').addClass('open-month');
  }
});

/*download_pdf_trigger*/
$(document).on('click', '.download_pdf_trigger', function () {
  var form_data = new FormData($('form.tigger_graph_change_form') [0]);
  var apple_dev = navigator.userAgent.match(/(iPod|iPhone|iPad)/) ? 1 : 0;
  $.ajax({
    type: 'POST',
    url: baseurl + '/graphs',
    data: form_data,
    processData: false,
    contentType: false,
    success: function (data) {
      window.location.href = data + '?apple_dev=' + apple_dev;
    },
    error: function () {
      alert('Please refresh your page.');
    }
  });
});
/*download_pdf_trigger*/



/*Getting ready to update Graph start */
$(document).ready(function(){
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    $('.download-report').hide();
    $('.download_pdf_trigger').hide();
  }

  $('#ex-eventss').selectpicker({   
    style: 'btn-info',    
    size: 4
  });
  $('#ex-eventss').selectpicker('refresh');

  $('#select_all_share').on('change', function(){
    $('input:checkbox.share_main_cb').prop('checked', false);
    $('input:checkbox.share_main_cb:lt('+constants.ANALYTIC.graph_selection_limit+')').prop('checked', this.checked);
    if($('input:checkbox.share_main_cb').length > $('.share_main_cb:checked').length && this.checked) maxLimit();
  });

  $('#select_all_share_buyer').on('change', function(){
    $('input:checkbox.share_buyer').prop('checked', false);    
    $('input:checkbox.share_buyer:lt('+constants.ANALYTIC.graph_selection_limit+')').prop('checked', this.checked);
    if($('input:checkbox.share_buyer').length > $('.share_buyer:checked').length && this.checked) maxLimit();
  });

  $('#select_all_share_seller').on('change', function(){
    $('input:checkbox.share_seller').prop('checked', false);
    $('input:checkbox.share_seller:lt('+constants.ANALYTIC.graph_selection_limit+')').prop('checked', this.checked);
    if ($('input:checkbox.share_seller').length > $('.share_seller:checked').length && this.checked) maxLimit();
  });
  

  /* Trigger graph change request */
  $('#ex-events').on('change', function(){
    html="";
    $.each(date_filter[$(this).val()], function() {
      html += '<option value='+this+'>'+month_names[this-1]+'</option>';
        $('#ex-eventss').html(html);
      
    });
  
    $('#ex-eventss').selectpicker({   
      style: 'btn-info',    
      size: 4  
    });
    $('#ex-eventss').selectpicker('refresh');
  });


function graphLoad(form_data, graph){

    if( window[graph+'_xhr'] != null ) {
      window[graph+'_xhr'].abort();        
    }
    
    window[graph+'_xhr'] = $.ajax({
      type: "POST",
      url: baseurl+'/global_analytics/'+graph,
      data: form_data,
      processData: false,
      contentType: false,
      beforeSend:function(){
        $('.'+graph).parent().find('.graph_loader').show();
      },
      success: function(data) {
        selected_month = $('.month_filter option:selected').val();
        $('.'+graph).html(data[graph]);
        $('.'+graph).parent().find('.graph_loader').fadeOut('fast');
      },
      timeout: 29000,
      error: function(jqXHR, textStatus, errorThrown) {
        if(textStatus==="timeout") {
          graphLoad(form_data, graph);
        } 
      }
    });
  }
  
  $('.tigger_graph_change').on('click', function(){
    selection_limit = constants.ANALYTIC.graph_selection_limit;
    error = false;
    error = $('.share_main_cb:checked').length > selection_limit && this.checked;
    error = error || ($('.share_buyer:checked').length > selection_limit && this.checked);
    error = error || ($('.share_seller:checked').length > selection_limit && this.checked);
    
    if( error ){
      maxLimit();
      return false;
    }
  });

  $('.tigger_graph_change').on('change', function(){
    /* Disable download if no share is selected */
    if( !$('input:checked.tigger_graph_change').length ){
      $('#analytics-download-dropdown').attr('disabled', 'disabled');
    } else {
      $('#analytics-download-dropdown').attr('disabled', false);
    }
    var form_data = new FormData($('form.tigger_graph_change_form')[0]); 
    graphLoad(form_data, 'postintraction_global');
    graphLoad(form_data, 'post_global');
    graphLoad(form_data, 'space_activities');
    graphLoad(form_data, 'nps_graph');
    graphLoad(form_data, 'communitygraph');

  });
  /* Trigger graph change request */

   $('.tigger_graph_change_button').on('change click', function(){
    if( tigger_graph_change_xhr != null ) {
      tigger_graph_change_xhr.abort();        
    }
    var form_data = new FormData($('form.tigger_graph_change_form')[0]); 
    tigger_graph_change_xhr = $.ajax({
      type: "POST",
      url: baseurl+'/graphs',
      data: form_data,
      processData: false,
      contentType: false,
      success: function(data) {
        $('.postintraction_global').html(data.postintraction_global);
        $('.post_global').html(data.post_global);
        $('.communitygraph').html(data.communitygraph);
        $('.nps_graph').html(data.currentMonthMembers);
        $('.space_activities').html(data.csi_global);
      }
    });
  });
   $('#ex-events').selectpicker({
    style: 'btn-info',
    size: 4
  });
});
 