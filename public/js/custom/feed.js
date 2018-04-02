path_name = 'clientshare';

function getLandingpagePosts(){
    if(single_post_view) return;
    category = extractUrlParam(window.location.href, 'tokencategory');
    category = category?'&tokencategory='+category:'';
    $.ajax({
        type: "GET",
        dataType: "html",
        url: baseurl+'/get_ajax_posts/'+$('.space_id_hidden').val()+'?limit=0'+category,
        beforeSend:function(){
            $('.show_puff').show();
        },
        success: function(response) {
            $(window).scrollTop($(window).scrollTop()-2);
            if(response == ""){
              $('#load_more').hide();
              $('.show_puff').hide();
              content_found = false;
            }else{
              $('#load_more').show();
            }
            $('#load_more').before(response);

            $('.load_ajax_new_posts').val(0);
            video_player_log_bind();
            onYouTubeIframeAPIReady();
            postsLoadedSuccessfully();
            /* url_preview_formatting();*/

        },
        error: function(xhr, status, error) {
            $('.load_ajax_new_posts').val(0);
            $('.show_puff').hide();
        },
        complete:function(){
            $('.show_puff').hide();
            $('.lazy-loading.post').hide();
        }
    });
}


function getTopPost(){
    var date = new Date();
    $.ajax({
      type: "GET",
      url: baseurl+'/gettopthreepost?month='+ (date.getMonth()+1) +'&year='+ date.getFullYear()+'&company=',
      success: function( response ) {
        $('.top-post-ajax-div').html(response);
        $('.top-post-front, .lazy-loading.top-post').toggleClass('hidden');
      }
    });
}


/* Initial scripts */

getLandingpagePosts();
getTopPost();

if(!window.location.pathname.includes(path_name)) 
	window.history.pushState(null, null, '/clientshare/'+current_space_id);