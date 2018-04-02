var edit_comment_area = true;

function discard_comment_confirm(element) {
    var commentid = $(element).attr('id');
    $('#cmt_inr_wrap_' + commentid).find('.title').show();//show username
    $('#cmt_inr_wrap_' + commentid).find('.time').show();//show time
    $('#cmt_inr_wrap_' + commentid).find('span').eq(0).show();
    var oldval = $('#cmt_inr_wrap_' + commentid).find('span').eq(0).html();
    $('#cmt_inr_wrap_' + commentid).find('span').eq(0).html(oldval);    // show old comment after discard
    $('.edit-comment-area, .save_comment').remove(); //remove edit textare
    $('.edit-comment').addClass('hover-dropdown'); //show edit icon
    $('.edit_comment_open').val(0);
    $("#discardModalcomment").modal('hide');
}

function update_comment(element, comment_id) {
    var newvalue = $('#cmt_inr_wrap_'+comment_id).find('.edit-comment-area').html();
    $.ajax({
        type: 'POST',
        dataType: 'JSON',
        url: baseurl + '/comments/'+comment_id,
        data: {
            _method: 'PATCH',
            _token: $('meta[name="csrf-token"]').attr('content'),
            'comment': newvalue
        },
        success: function (response) {
            $('#cmt_inr_wrap_' + comment_id).find('.title').show();
            $('#cmt_inr_wrap_' + comment_id).find('.time').show();
            $('#cmt_inr_wrap_' + comment_id +' .save_comment, span.comment_edited').remove();
            $('.edit-comment-area[id='+comment_id+']').remove();
            $('#cmt_inr_wrap_' + comment_id).find('.time').append('<span class="comment_edited">(edited)</span>');
            $('.post-comment-text[id='+comment_id+']').show();
            $('.post-comment[id='+comment_id+']').show();
            $('.post-comment-text[id='+comment_id+']').html(response.comment.comment_after_process);
            if(response.show_more_less) $('.post-comment[id='+comment_id+']').parent().find('.comment-show-less').show();
            else $('.post-comment[id='+comment_id+']').parent().find('.comment-show-less').hide();
        },
        error: function (message) {
            alert('Error: Please refresh the page');
        }
    });
}

function getComment(comment_id){
    var comment = 'Please wait..';
    $.ajax({
        type: 'GET',
        dataType: 'json',
        async : false,
        url: baseurl + '/comments/'+comment_id,
        success: function (response) {
            comment = response;
        },
        error: function (xhr, status, error) {
            errorOnPage(xhr, status, error);
        }
    });
    return comment.comment;
}

function edit_comment(element) {
	var comment_id = $(element).attr('commentid');
	comment = getComment(comment_id);
	div = '<div contenteditable="true" class="form-control no-border edit-comment-area comment-area" id="'+comment_id+'" data-placeholder="Write a comment..." areaid="'+comment_id+'" style="border: 2px solid red; min-height:30px;width:200px">'+comment+'</div><button type="button" class="invite-btn right save_comment"  style="position: relative;" onclick="return update_comment(this,\'' + comment_id + '\')">Save</button>';

    $('#cmt_inr_wrap_' + comment_id).find('.title').hide();
    $('#cmt_inr_wrap_' + comment_id).find('.time').hide();
    $('.post-comment[id='+comment_id+']').hide();
    $('#cmt_inr_wrap_' + comment_id).find('.comment-show-less').hide();
    $('.post-comment-text[id='+comment_id+']').hide();
	$('#cmt_inr_wrap_' + comment_id).append(div);

    var post_id = $('#cmt_inr_wrap_'+comment_id).closest('.post-wrap').attr('id');
    post_id = post_id.replace('post_', '');

    mentionsComment($('#cmt_inr_wrap_' + comment_id+' .edit-comment-area'), post_id);
}

function addComment(comment_data){
	$.ajax({
	    type: 'POST',
	    dataType: 'html',
        'async': false,
        data: {
            'post_id': comment_data['postid'] ,
            'user_id': comment_data['userid'] ,
            'space_id': comment_data['spaceid'],
            'comment': comment_data['comment'],
            'commentlimit': comment_data['commentlimit'] ,
            'morecheck': comment_data['morecheck'] ,
            'view_more': 0,
            _token: $('meta[name="csrf-token"]').attr('content')
        },
	    url: baseurl + '/comments',
	    success: function (response) {
            $('#post_'+comment_data['postid']).find('.comment-wrap').html(response);
            comment_post_id = null;
	    },
	    error: function (message) {
	        alert('Error: Please refresh the page');
	    }
	});
}

function showComments(comment_data, comments){
    $('#post_'+comment_data['post_id']).find('.comment-wrap').html(comments)
    $('#comment_input_area' + comment_data['post_id']).val('');
    $("#deleteModalcomment").modal('hide');
    comment_post_id = null;
}

function getCommentViewerInfo(element){
    return {
        'post_id': $(element).attr('datapostid'),
        'space_id': $(element).attr('spaceid'),
    };
}

function commentViewer(comment_data){
    var comments = 'Please wait..';
    $.ajax({
        type: 'GET',
        dataType: 'html',
        'async': false,
        url: baseurl + '/comments?post_id=' + comment_data['post_id'] + '&space_id=' + comment_data['space_id'] + '&view_more=' + comment_data['view_more'],
        success: function (response) {
            comments = response;
        },
        error: function(xhr, status, error) {
            errorOnPage(xhr, status, error);
        }
    });
    return comments;
}


$(document).on({
    mouseenter: function () {
        edit_comment_area = true;
    },
    mouseleave: function () {
        edit_comment_area = false;
    }
}, '.single-cmt-wrap, ul.ui-autocomplete');

$(document).on('click', '.comment-show-less', function(){
    if($(this).hasClass('show-more')){
        $(this).parent().find('.post-comment').css('max-height', '100%');
        $(this).html('Show Less');
        $(this).toggleClass('show-more', 'show-less');
    } else {
        $(this).parent().find('.post-comment').css('max-height', '50px');
        $(this).html('Show More');
        $(this).toggleClass('show-more', 'show-less');
    }
});

$('body').mouseup(function () {
    if (edit_comment_area == false && $('.edit-comment-area').length) {
        $('#discardModalcomment').modal('show');
        $('.discard_comment').attr('id', $('div.edit-comment-area').attr('id'));
        return false;
    }
});

$(document).on('click', '.send_comment', function (e) {
    var tag = $(this);
    var postid = $(this).attr('datapostid');
    var userid = $(this).attr('datauserid');
    var commentlimit = $(this).attr('commentlimit');
    var spaceid = $(this).attr('spaceid');
    var comment = $('#comment_input_area' + postid).html();
	var more_check = 'false';
	var view_more = 'false';
    if(!($('#comment_input_area' + postid).text().trim().length)) return ;
    
    addComment({
    	'postid' : postid,
    	'userid' : userid,
		'comment' : comment,
		'commentlimit' : commentlimit,
		'morecheck' : more_check,
		'view_more' : view_more,
		'spaceid' : spaceid
    });
});

$(document).on('click','a.view-more-comments', function(){
    var comment_data = getCommentViewerInfo(this);
    comment_data['view_more'] = 1;
    showComments(comment_data, commentViewer(comment_data));
});

$(document).on('click','a.view-less-comments', function(){
    var comment_data = getCommentViewerInfo(this);
    comment_data['view_more'] = 0;
    showComments(comment_data, commentViewer(comment_data));
});