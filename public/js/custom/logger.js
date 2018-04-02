function mixpanelLogger(data,async=true) {
  $.ajax({
    type: "POST",
    async : async,
    url: baseurl+'/mixPannelInitial',
    data: data
  });
}

$(document).ready(function(){
	$('ul.categories li').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Filter feed by category',
			'metadata' : {'category': $(this).find('.chip span').html()}
		})
	});

	$('li.top_post_seller').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Filter top post Seller'
		})
	});

	$('li.top_post_buyer').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Filter top post Buyer'
		})
	});

	$('.last-month, .next-month').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Change month top posts'
		})
	});

	$('.executive-file').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Open exec summary file'
		})
	});

	$('ul.company-dropdown li').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Switch share'
		}, false)
	});

	$('.findmedia ').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Open post attachment'
		})
	});

	$('a.endrose ').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Like post'
		})
	});

	$('a.s-everyone').on('click', function(){ 
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Change post visibility'
		})
	});

	$(document).on('click', 'a.edit-post-cog', function () {
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Edit post'
		})
	});

	$(document).on('click', 'a.minimize-post', function () {
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Minimize post'
		})
	});


	$('a.profile_popup').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Open profile'
		})
	});

	$('a.ic_search').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Search'
		})
	});

	$(document).on('click', 'ul.search-dropdown li', function () {
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Search result'
		}, false)
	});

	$('a.remove_badge').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Check Notifications'
		})
	});

	$(document).on('click', 'ul.notificationdropdwon li', function () {
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Open Notification'
		}, false)
	});

	$('li.domain_inp_delete').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Delete domain'
		})
	});

	$('li.domain_inp_edit').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Edit domain'
		})
	});

	$('div.pending-eye-wrap ').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'View invite history'
		})
	});

	$('.download_feedback_pdf').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Download feedback'
		}, false)
	});

	$('.year_filter, .month_filter').on('change', function(){
		mixpanelLogger({
			'space_id': sess_space_id,
			'event_tag':'Change analytics year/month'
		})
	});

	$('.share_main_cb').on('change', function(){
		mixpanelLogger({
			'space_id': sess_space_id,
			'event_tag':'Select share analytics'
		})
	});

	$('.top-post-ajax-div div.box').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id,
			'event_tag':'Open top post'
		})
	});

	$('a.single-share-report').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id,
			'event_tag':'Download individual analytics'
		})
	});

	$('input.share_buyer').on('change', function(){
		mixpanelLogger({
			'space_id': sess_space_id,
			'event_tag':'Select buyer analytics'
		})
	});

	$('input.share_seller').on('change', function(){
		mixpanelLogger({
			'space_id': sess_space_id,
			'event_tag':'Select seller analytics'
		})
	});

	$('.feed-button').on('click', function(){
		mixpanelLogger({
			'space_id': sess_space_id, 
			'event_tag':'Feed'
		}, false)
	});
	
});