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

if( view_data.data_id ){
  window[view_data.data_id+'graph_data'] = view_data[view_data['data_id']];
}

jQuery.fn.outerHTML = function(s) {
  return (s) ? this.before(s).remove():jQuery("<svg />").append(this.eq(0).clone()).html();
}

var comm_x_label = '';
graph_color_code = ['#046380','#E74C3C','#3498DB','#468966','#FF9800','#8A0917','#FF358B','#57385C','#714C36','#FFED75','#A3CD39'];

window[view_data.data_id+'_share_name'] = Array();

for(j=0; j<window[view_data.data_id+'graph_data'].length; j++) {
  for(i=0; i<=Object.keys(window[view_data.data_id+'graph_data'][j]).length; i++) {
    if(Object.keys(window[view_data.data_id+'graph_data'][j])[i] != 'month' && typeof(Object.keys(window[view_data.data_id+'graph_data'][j])[i]) !='undefined' ){
      window[view_data.data_id+'_share_name'].push(Object.keys(window[view_data.data_id+'graph_data'][j])[i]);
    }
  }
}


window[view_data.data_id+'_distinct_share_name'] = window[view_data.data_id+'_share_name'].unique();


for(i=0; i<window[view_data.data_id+'_distinct_share_name'].length; i++){
  if(window[view_data.data_id+'_distinct_share_name'][i] =='n/a' ) continue;
  var color_index = window[view_data.data_id+'_share_name'].indexOf(window[view_data.data_id+'_distinct_share_name'][i])%graph_color_code.length;
  var color = graph_color_code[color_index];
  $('.'+view_data["graph_legends_class"]).append('<li style="color: '+color+';"><span style="background: '+color+';"></span>'+window[view_data.data_id+'_distinct_share_name'][i]+'</li>');
}

window[view_data.data_id+'_graph_global'] = Morris.Line({
  element: view_data["graph_div_id"],
  data: window[view_data.data_id+'graph_data'],
  xkey: 'month',
  ykeys: window[view_data.data_id+'_share_name'],
  labels: [''],
  xLabels: comm_x_label,
  xLabelFormat: function(x) {
    var month = graph_months[x.getMonth()];
    return month;
  },
  yLabelFormat: function(x) { // <--- x.getMonth() returns valid index
    if(x % 1 === 0){
      return x;  
    }
    return '';
  },
  dateFormat: function(x) {
    var month = graph_months[new Date(x).getMonth()];
    return month;
  },
  grid:true,
  smooth:false,
  goals:[0],
  eventLineColors:['black'],
  goalLineColors:['black'],
  lineColors: graph_color_code,
  hideHover:true,
  hoverCallback: function (index, options, content, row) {
    var data_point_date = new Date( options.data[index].month );
    var month = graph_months[data_point_date.getMonth()];

    html = '<div class="graph-tooltip-wrap"><span class="graph-tooltip-small">'+month+'</span>';
    pop_html='';

    for(i=0; i<=Object.keys(row).length;i++) {
      if(Object.keys(row)[i] != 'month' && typeof(Object.keys(row)[i]) !='undefined'){
        if(i<=popup_list_limit){
          html += '<span class="graph-tooltip-big">'+Object.keys(row)[i]+': <b>'+options.data[index][Object.keys(row)[i]]+'</b></span>';
        }
        pop_html += '<li>'+Object.keys(row)[i]+': <b>'+options.data[index][Object.keys(row)[i]]+'</b></li>';
      }
    }
    
    if(Object.keys(row).length > popup_list_limit){
     html += '<a data-toggle="modal" data-target="#view-more-shares" class="graph-show-more">Show more</a>';
    }
    $('.data_point_modal_header').html(month);
    $('.data_point_modal_data').html(pop_html);
    return html;    
  }
});

dataPointArrange();

if( 'nps_view_data' == view_data.data_id ) {
  data_point_diff = (($('#'+view_data["graph_div_id"]).width()-75) / (window[view_data.data_id+'graph_data'].length-1));
  frequent_data_point_cx = Math.round(getPathStartPoint(view_data["graph_div_id"]));
  $($('#'+view_data["graph_div_id"]).find('.custom_graph_class').get().reverse()).each(function(index){
    $(this).attr('x', frequent_data_point_cx);
    frequent_data_point_cx += data_point_diff;
  });
}


function getPathStartPoint(div_id){
  return $('#'+div_id).find('path[stroke="#000000"]').attr('d').split(',')[0].replace(/[^-\d\.]/g,'');  
}

function dataPointArrange() {
  window[view_data.data_id+'_graph_global_cx'] = new Array();
  $('#'+view_data["graph_div_id"]+' circle').each(function(){
    window[view_data.data_id+'_graph_global_cx'].push($(this).attr('cx'));
  });
  window[view_data.data_id+'_graph_global_cx'] = window[view_data.data_id+'_graph_global_cx'].unique();

  window[view_data.data_id+'_graph_global_cx_new'] = window[view_data.data_id+'_graph_global_cx'].sort(function(a, b){return a - b});

  var comm_month_arr = Array();
  window[view_data.data_id+'_graph_global_increment']=0;
  $($('#'+view_data["graph_div_id"]+' text[text-anchor=middle]').get().reverse()).each(function() {
    if(comm_month_arr.indexOf($(this).find('tspan').context.textContent)>=0) {
        $(this).hide();
        $(this).addClass('custom_graph_class_remove');
        $(this).find('tspan').context.textContent = graph_months[window[view_data.data_id+'graph_data'][window[view_data.data_id+'graph_data'].length-1]['month'].split('-')[1]-1];
    } else {
      $(this).attr('x', window[view_data.data_id+'_graph_global_cx'][window[view_data.data_id+'_graph_global_increment']]);
      $(this).addClass('custom_graph_class');
      comm_month_arr.push($(this).find('tspan').context.textContent);
      window[view_data.data_id+'_graph_global_increment']++;
    }
  });

  length = $('#'+view_data["graph_div_id"]+' .custom_graph_class').length;
  if($('#'+view_data["graph_div_id"]+' .custom_graph_class').length >= window[view_data.data_id+'graph_data'].length)
    $('#'+view_data["graph_div_id"]+' text[text-anchor=middle]').eq(length).remove();

  if($('#'+view_data["graph_div_id"]+' .custom_graph_class').length < window[view_data.data_id+'graph_data'].length){
    clone = $('#'+view_data["graph_div_id"]+' text[text-anchor=middle].custom_graph_class_remove').eq(0).clone();
    clone.addClass('custom_graph_class');
    clone.attr('x', $('#'+view_data["graph_div_id"]+'').css('width').replace(/[^-\d\.]/g, '')-25);
    clone.find('tspan').html(graph_months[window[view_data.data_id+'graph_data'][window[view_data.data_id+'graph_data'].length-1]['month'].split('-')[1]-1]);
    clone.show();
    $('#'+view_data["graph_div_id"]+' text[text-anchor=middle]').eq(length-1).after(clone);
  }

  var unaligned_label;
  var value_array =Array();
  $('#'+view_data["graph_div_id"]+' .custom_graph_class').each(function(index){
    diff = $(this).attr('x') - $('#'+view_data["graph_div_id"]+' .custom_graph_class').eq(index+1).attr('x');
    value_array.push(diff);
    if(diff == 0)
      unaligned_label = $('#'+view_data["graph_div_id"]+' .custom_graph_class').eq(index+1);
  });

  if(unaligned_label){
    label_count = arrayValueFrequence(value_array);
    label_count = getSort(label_count);
    unaligned_label.attr('x', Math.round(parseInt(unaligned_label.attr('x'))-label_count[label_count.length-1][0]));
  }
}