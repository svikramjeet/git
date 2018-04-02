var comment_post_id;

function pullPostId(post_id){
	post_id = $('.comment-area:focus').closest('.post-wrap').attr('id');
	return post_id.replace('post_', '');
}

function mentionsComment(element, post_id){
	$(element).mentionsInput({
        source:baseurl+'/mention_user?post_id='+post_id,
        showAtCaret: true
    });
	$(element).mentionsInput('editReady', element);
}

$(document).on('click', 'div.comment-area:not(.edit-comment-area)', function(){
	if(comment_post_id == pullPostId($(this).closest('.post-wrap').attr('id'))) return;
	comment_post_id = pullPostId($(this).closest('.post-wrap').attr('id'));
	mentionsComment($(this), comment_post_id);
});