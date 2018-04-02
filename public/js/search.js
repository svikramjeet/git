var timer;
var execute_search = null;
function up(spaceId,userId){
	timer = setTimeout(function()
	{		
		var keywords = $('#search-input').val();
		if(keywords.length > 2){
			$('#search-results').show();
			$('.search-dropdown-wrap').show();

            if (execute_search != null) {
                execute_search.abort();
                execute_search = null;
            }
			execute_search = $.get(baseurl+'/executeSearch', {keywords: keywords,spaceId:spaceId,userId:userId,counter:1}, function(markup)
			{				
             repl(keywords,markup);
			});
		}else{
			$('#search-results').hide();
			$('.search-dropdown-wrap').hide();
		}
	},500 );
}

function load(spaceId,userId,counter,event){ 
			event.stopPropagation();
			var keywords=$("#search-input").val();
			$('.search-dropdown-wrap').show();
			if(keywords == "")
			{
				var keywords=$("#msearch-input").val();
				$('.search-dropdown-wrap1').show();
			}
			
           $.get(baseurl+'/executeSearch', {keywords: keywords,spaceId:spaceId,userId:userId,counter:counter}, function(markup)
			{				
			var keywords=$("#search-input").val();
			if(keywords == "")
			{
				var keywords=$("#msearch-input").val();
				replm(keywords,markup);
			}
			else
			{
				 repl(keywords,markup);
			}
			});
		}
function repl(keywords,markup){
	var re = new RegExp( "(" + keywords + ")", "gi" );           
             var  template = "<span style='font-weight:bold;color:#0d47a1;'>$1</span>";
             var  markup = markup.replace( re, template );		
				$('#search-results').html(markup);
}

function adddiv(){
	$("body").addClass("hide_bootstrap_popup_blackout");
}

function replm(keywords,markup){
	var re = new RegExp( "(" + keywords + ")", "gi" );           
             var  template = "<span style='font-weight:bold;color:#0d47a1;'>$1</span>";
             var  markup = markup.replace( re, template );		
				$('#msearch-results').html(markup);
}


    function upm(spaceId,userId){
	timer = setTimeout(function()
	{		
		var keywords = $('#msearch-input').val();
		if(keywords.length > 2){
			$('#msearch-results').show();
			$('.search-dropdown-wrap1').show();
			$.get(baseurl+'/executeSearch', {keywords: keywords,spaceId:spaceId,userId:userId,counter:1}, function(markup)
			{				
             replm(keywords,markup);
			});
		}else{
			$('#msearch-results').hide();
			$('.search-dropdown-wrap1').hide();
		}
	},500 );
}
function downm(){

}