var get_url_xhr = null;
var url_validate_var;
var edit_post_category_previous_state = "";
var uploaded_file_aws = new Array();
var filesUploaded = [];
var cached_url = '';
var s3_executive = new Array();
var is_mouse_inside_tour = true;
var executive_summary_max_length = 300;
var show_feedback = false;


/* initials scripts */
if($('.edit-post-dropdown').find('li').length <= 0) $('.edit-post-dropdown').parent().hide();


function postFormListReset(visibility_list, alert_list ){
    $(visibility_list).find('input:checkbox').prop('checked', false);
    $(visibility_list).find('input:checkbox').parent().removeClass('active');

    $(alert_list).find('input:checkbox').prop('checked', false);
    $(alert_list).find('input:checkbox').parent().removeClass('active');
    $(alert_list).find('input:checkbox').parent().addClass('disable_check');
}

function postVisiblityUser(element, selector) {
    $(element).closest('.dropdown-wrap').addClass('open');
    $(element).parent().toggleClass('active', $(element).prop('checked'));

    if(!$(element).prop('checked') && $('input:checkbox:checked.visibility_group').length ) getGroupByUser($(element).val());

    label = postDropDownLabel(selector.find('input:checkbox.visiblity-checkbox' ).length, selector.find('input:checkbox:checked.visiblity-checkbox').length);
    selector.find('.post-visiblity-label').text(label.text);
    selector.find('.post-visiblity-checkbox').prop('checked', label.master_box_check).parent().toggleClass('active', label.master_box_check);
    post_alert_selector = selector.find('.alert-drop').find('input:checkbox[value="'+$(element).val()+'"]');
    post_alert_selector.parent().toggleClass('disable_check',!$(element).prop('checked'));

    selector.find('.post-alert-checkbox').parent()
        .toggleClass('disable_check', !selector.find('input:checkbox:checked.visiblity-checkbox').length);

    postAlertUser(post_alert_selector, $(element).prop('checked'), selector);
}

function postAlertUser(element, is_selected, selector) {
    element.prop('checked', is_selected);
    $(element).parent().toggleClass('active', is_selected);

    label = postDropDownLabel(selector.find('.alert-drop').find('input:checkbox.alert-checkbox').length, selector.find('.alert-drop').find('input:checkbox:checked.alert-checkbox').length);
    selector.find('.post-alert-label').text(label.text);

    label = postDropDownLabel(selector.find('.alert-drop').find('input:checkbox.alert-checkbox').parent().not('.disable_check').length, selector.find('.alert-drop').find('input:checkbox:checked.alert-checkbox').length);
    selector.find('.post-alert-checkbox').prop('checked', label.master_box_check).parent().toggleClass('active', label.master_box_check);
}

/* Video player click bink for log */
function video_player_log_bind() {
    $('video').bind('play', function (e) {
        parent_div = $(this).parent().closest('.post-wrap');
        post_id = parent_div.attr('id');
        if(!post_id) return;
        post_id = post_id.replace('post_', '');
        media_src = parent_div.find('input[name="url_src"]').val();
        content_id = parent_div.find('.for_download').attr('href').split('/').pop();
        data = {
            'description': 'View Attachment',
            'action': 'view',
            'content_id': content_id,
            'content_type': 'App\PostMedia',
            'metadata': {'media_src': media_src, 'post_id': post_id}
        };
        custom_logger(data);

        $.ajax({
            async: false,
            type: "GET",
            url: baseurl + '/view_file?post_id=' + post_id,
        });
    });
}

function get_preview_url() {
    autosize(document.querySelectorAll('textarea.t2-resize'));
    var thumbcheck = $('#thumbcheck').val();

    if ($(this).val()) {

        data = $(this).val().replace(/\n/g, " ");
        data = data.replace('#', " ");
        url = filter_url(data);
        data = encodeURIComponent(data);

        if (url === false) {
            console.log('url false');
            return true;
        }
        if (cached_url != '' && cached_url == url) {
            console.log('cached url');
            return true;
        }

        cached_url = url;
        get_url_xhr = $.ajax({
            type: "GET",
            url: baseurl + '/get_url_data?q=' + data,
            processData: false,
            contentType: false,
            beforeSend: function () {
                if (get_url_xhr != null) {
                    get_url_xhr.abort();
                    get_url_xhr = null;
                }
            },
            success: function (data) {

                if (data != 0) {

                    if ($('#ytd_iframe').length && typeof (data.metatags) != 'undefined' && ($('#ytd_iframe').attr('src') == data.metatags["twitter:player"])) {
                        return 0;
                    }

                    html = '<img class="url_embed_trigger" src="/images/ic_highlight_removegray.svg"/>';
                    html = html + '<div class="outer-block">';
                    html = html + '<div class="inner-block">';

                    if (data.metatags["twitter:player"]) {
                        html = html + '<div class="thumbnail-block iframe-content ">';
                        html = html + '<iframe id="ytd_iframe" allowfullscreen="allowfullscreen" width="420" height="345" src=' + data.metatags["twitter:player"] + '></iframe>';
                    } else {
                        html = html + '<div class="thumbnail-block">';
                        img_class = data.thumbnail_img ? "thumbnail-img" : "";
                        html = html + '<img src="'+baseurl+'/file_loading?url=' + data.favicon + '" class="url-favicon ' + img_class + '" onerror="this.src=\'http://' + data.domain + '/favicon.ico\';">';
                    }

                    html = html + '</div>';

                    html = html + '<div class="description-block"><div>';
                    //html = html+'<h5><img src="'+data.favicon+'"/>'+data.domain+'</h5>';
                    var title = data.title ? data.title : data.title[0];
                    if (data.full_url.search('http') < 0) {
                        html = html + '<a target="_blank" href=http://' + data.full_url + ' title=' + title + '> <img src="https://www.google.com/s2/favicons?domain=' + data.url + '"/>' + data.title + '</a>';
                    } else {
                        html = html + '<a target="_blank" href=' + data.full_url + ' title=' + data.title + '> <img src="https://www.google.com/s2/favicons?domain=' + data.url + '"/>' + data.title + '</a>';
                    }
                    if (data.description) {
                        html = html + '<p>' + data.description + '</p>';
                    }
                    /* Descroption block close*/
                    html = html + '</div></div>';

                    /* Outer - Innner block close */
                    html = html + '</div></div>';

                    $('.url_embed_div').empty();
                    $('.url_embed_div').append(html);
                    $('input[name=url_embed_toggle]').val(1);
                    $('input[name=url_preview_data_json]').val(JSON.stringify(data));
                    $('#thumbcheck').val(1);
                } else {
                    $('.url_embed_div').empty();
                }
            },
            error: function (xhr, status, error) {

            }
        });
    } else {
        $('#thumbcheck').val(0);
    }
}


function filter_url(data) {
    regex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    response = data.match(regex);
    if (response && response.length > 0) {
        return response[0];
    }
    return false;
}

function url_embed_enable(ele) {
    if ($(ele).hasClass('fa-toggle-on')) {
        $(ele).removeClass('fa-toggle-on');
        $(ele).addClass('fa-toggle-off');
        $('input[name=url_embed_toggle]').val(0);
        $('.url_embed_div').find('.outer-block').hide();
    } else {
        $(ele).addClass('fa-toggle-on');
        $(ele).removeClass('fa-toggle-off');
        $('input[name=url_embed_toggle]').val(1);
        $('.url_embed_div').find('.outer-block').show();

    }
}

function onYouTubeIframeAPIReady() {
    $('iframe.youtube_iframe').each(function () {
        v_id = $(this).attr('id').split('_');
        new YT.Player($(this).attr('id'), {
            videoId: v_id.pop(),
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    });
}

function onPlayerStateChange(event) {
    if (event.data == 1) {
        parent_div = $('#' + event.target.a.id).parent().closest('.post-wrap');

        post_id = parent_div.attr('id');
        post_id = post_id.replace('post_', '');
        media_src = event.target.a.src;
        content_id = post_id;
        data = {
            'description': 'viewed youtube video ' + media_src,
            'action': 'view embedded url',
            'content_id': post_id,
            'content_type': 'App\\Post',
            'metadata': {'media_src': media_src, 'post_id': post_id}
        };
        
        mixpanelLogger({
            'space_id': sess_space_id, 
            'event_tag':'View embedded video'
        });
        custom_logger(data);

        $.ajax({
            async: false,
            type: "GET",
            url: baseurl + '/view_file?space_id=' + sess_space_id + '&post_id=' + post_id,
            success: function (response) {
                view_cout = $('.viewpostsuser' + post_id).children().attr('view-count');
                total_count = parseInt(view_cout) + 1;
                if (total_count > 1) {
                    var view_text = 'views';
                } else {
                    var view_text = 'view';
                }
                $('.viewpostsuser' + post_id).find('.view_eye_content').html(total_count + ' ' + view_text);
                $('.viewpostsuser' + post_id).children().attr('view-count', total_count);
            }
        });
    }
}

function autoCapitalize(element){
    var start = element.selectionStart, end = element.selectionEnd;
    element.value = sentenceCase(element.value);
    element.setSelectionRange(start, end);
}

function sentenceCase(strval) {
    var re = /(^|[.!?]\s+)([a-z])/g;
    var fstring = strval.replace(re, function (m, $1, $2) {
        return $1 + $2.toUpperCase()
    });
    return fstring;
}

function readURL(input, file_ext, id) {
    $('.upload_file_name').html(file_ext);
    var extension = file_ext.substr((file_ext.lastIndexOf('.') + 1));
    extension = extension.toLowerCase();

    if (extension == 'png' || extension == 'gif' || extension == 'jpg' || extension == 'jpeg') {

        if (input.files && input.files[0]) {
            var reader = new FileReader();
            $('.post_categories_maincontent' + id).show();
            $('.post_categories_file' + id).show();
            $('.post_categories' + id).show();
            $('#post_button' + id).show();

            reader.onload = function (e) {
                $('#blah' + id).show();
                $('#blah' + id).attr('src', e.target.result)
                    .height('auto');
            }

            reader.readAsDataURL(input.files[0]);
            $('.upload_file_name').parent().find('img').attr('src', '../images/ic_IMAGE.svg');
            $('.upload_file_name').html(file_ext);
        }
    } 
    else if (extension == 'pdf') {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('.upload_file_name').parent().find('img').attr('src', '../images/ic_PDF.svg');
        $('.upload_file_name').html(file_ext);
    } 
    else if (extension == 'mp4' || extension == 'mp3' || extension == 'avi' || extension == 'mkv') {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('.upload_file_name').parent().find('img').attr('src', '../images/ic_VIDEO.svg');
        $('.upload_file_name').html(file_ext);
    } 
    else if (extension == 'doc' || extension == 'docs' || extension == 'docx') {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('.upload_file_name').parent().find('img').attr('src', '../images/ic_WORD.svg');
        $('.upload_file_name').html(file_ext);
    } 
    else if (extension == "xlsx") {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('.upload_file_name').parent().find('img').attr('src', '../images/ic_EXCEL.svg');
        $('.upload_file_name').html(file_ext);
    } 
    else if (extension == "xls") {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('.upload_file_name').parent().find('img').attr('src', '../images/ic_EXCEL.svg');
        $('.upload_file_name').html(file_ext);
    } 
    else if (extension == "csv") {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('.upload_file_name').parent().find('img').attr('src', '../images/ic_EXCEL.svg');
        $('.upload_file_name').html(file_ext);
    } 
    else if (extension == 'ppt' || extension == 'pptx') {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('.upload_file_name').parent().find('img').attr('src', '../images/ic_PWERPOINT.svg');
        $('.upload_file_name').html(file_ext);
    }
}

function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

/*--------- preview_before_upload_aws start ---------- */
function preview_before_upload_aws() {
    data = JSON.parse($('input[name="uploaded_file_aws"]').val());
    if ($('.upload-content.post_attachment').length == 1 && data.length == 1 && $('.edit_media_div #view_file').length == 0) {
        if (data[0].mimeType.indexOf('image') > -1) {
            $.ajax({
                type: "GET",
                async: false,
                url: baseurl + '/url_validate?q=' + data[0].url,
                success: function (response) {
                    $('.upload-content.post_attachment').find('#blah').attr('src', response.cloud);
                    $('.upload-content.post_attachment').find('#blah').show();
                }
            });
        }
    } else {
        /* remove single image in post preview if there is more than 1 file */
        $('img#blah').hide();
        $('.edit_media_div .img-responsive').hide();
    }
}
/*---------- preview_before_upload_aws end --------------- */

/* */
function preview_before_upload(ele) {
    $('.post_categories_file_temp').remove();
    $('.post_file').each(function (index) {
        var file_type = "";

        var video_ext = ['mp4', ];
        var image_ext = ['jpeg', 'png', 'jpg'];
    });
}

function close_preview_general_s3(ele) {
    s3_upload_xhr[$(ele).attr('id')].abort();
    $(ele).remove();
}

function close_preview(ele) {
    data = JSON.parse($('input[name="uploaded_file_aws"]').val());
    for (i = 0; i < data.length; i++) {
        filename = data[i].s3_name.split('/');
        if (filename[1].split('.')[0] + "_uid" == $(ele).attr('id')) {
            data.splice(i, 1);
        }
    }

    $('input[name="uploaded_file_aws"]').val(JSON.stringify(data, null, 2));
    filesUploaded=data;
    s3_upload_xhr[$(ele).attr('id')].abort();

    if ($(ele).attr('id') == "")
        $(ele).attr('id', 0);
    $('#post_file_' + $(ele).attr('id')).remove();
    if ($(ele).parent().parent().hasClass('post_categories_file'))
        $(ele).parent().parent().remove();
    else
        $(ele).parent().parent().remove();
    if ($('.post_file').length == 1) {
        $('.remove-all').hide();
    }
    preview_before_upload_aws();
    if ($('.direct-upload').fileupload('progress').loaded == $('.direct-upload').fileupload('progress').total) {
        $('.post_btn').attr('disabled', false);
    }
}

function close_preview_edit(ele) {
    if ($(ele).attr('id') == "")
        $(ele).attr('id', 0);
    $('#post_file_d_' + $(ele).attr('id')).remove();
    if ($(ele).parent().parent().hasClass('post_categories_file_edt'))
        $(ele).parent().parent().hide();
    else
        $(ele).parent().parent().remove();
    if ($(".edit_remove_all img:visible").length == 1) {
        $('.remove-all').hide();
    }
    var edit_deleted_files = $('.edit_deleted_files').val();
    var del_files_id = $(ele).attr('fileid');

    if (jQuery.type(del_files_id) === 'undefined') {
    } else {
        if (del_files_id != 0) {
            if (edit_deleted_files == '') {
                $('.edit_deleted_files').val(del_files_id);
            } else {
                $('.edit_deleted_files').val(edit_deleted_files + ',' + del_files_id);
            }
        }
    }
}

/*----------- Add input box------------ */

function readFileName(input, file_ext) {
    var extension1 = file_ext.substr((file_ext.lastIndexOf('.') + 1));
    if (extension1 == 'pdf') {
        $('#upload_video_name').html(file_ext);
    } else {
        $('#upload_video_name').html(file_ext);
    }
}


function readFileName2(input, file_ext) {
    var extension1 = file_ext.substr((file_ext.lastIndexOf('.') + 1));
    if (extension1 == 'pdf') {
        $('#upload_pdf_name').html(file_ext);
    } else {
        $('#upload_pdf_name').html(file_ext);
    }
}

function iframe_load(iframe, url) {
    $(iframe).on('load', function () {
        $('.modal-loader').hide();
    });

    if (url) {
        url_validate_var = setTimeout(function () {
            $.ajax({
                type: "GET",
                url: baseurl + '/url_validate?viewer_st=false&q=' + url,
            });
        }, 40000);
    }
}

function validate(file) {
    var ext = file.split(".");
    ext = ext[ext.length - 1].toLowerCase();
    var arrayExtensions = ["pdf", "mp4", "ppt", "pptx", "docx", "doc", "xls", "xlsx", "csv", "flv", "3gp", "mkv"];
    if (arrayExtensions.lastIndexOf(ext) == -1) {
        alert("Wrong extension type. Please upload pdf, docx, ppt, pptx, mp4, doc, xls, xlsx, csv Files");

        var check = $("#upload_pdf_file").val();
        var ext1 = check.split(".");
        ext1 = ext1[ext1.length - 1].toLowerCase();
        if (arrayExtensions.lastIndexOf(ext1) == -1) {
            $("#upload_pdf_file").val("");
        }
        var check1 = $("#upload_video_file").val();
        var ext2 = check1.split(".");
        ext2 = ext2[ext2.length - 1].toLowerCase();
        if (arrayExtensions.lastIndexOf(ext2) == -1) {
            $("#upload_video_file").val("");
        }
    }
}

function dimlight() {
    if ($('#tour2').hasClass('highlight')) {
        var postvalue = $('.main_post_ta').val();
        var postsubject = $('.post_subject').val();
        var filevalue = $('.post_file').length;

        if (postvalue != '' || postsubject != '' || filevalue > 1) {
            $('#discardModal').modal('show');
        } else {
            resetVisibiltyAlers($('.post_subject'));
            $('#discard').trigger('click');
            $(".dp-input").find('.error-msg').remove();
            $(".post_subject").attr("placeholder", "Click here to add text, files, links etc.");
        }
    }
}


function edit_category(event, ele) {
    $(ele).hide();
    var spaceid = $(ele).attr('spaceid');

    $.ajax({
        type: "GET",
        async: false,
        url: baseurl + '/editcategory_ajax?spaceid=' + spaceid,
        success: function (response) {
            edit_post_category_previous_state = $(".categories").html();
            $(".categories").html(response);
        }, error: function (message) {
            console.log(message);
        }
    });
}

function save_edit_cat(event, ele) {
    var action = $(ele).attr('action');
    var spaceid = $(ele).attr('spaceid');
    if (action != 'cancel') {
        var flag = true;
        if ($('.cat_2').val() != '') {
            var cat_2 = $('.cat_2').val();
        } else {
            flag = false;
        }

        if ($('.cat_3').val() != '') {
            var cat_3 = $('.cat_3').val();
        } else {
            flag = false;
        }
        if ($('.cat_4').val() != '') {
            var cat_4 = $('.cat_4').val();
        } else {
            flag = false;
        }
        if ($('.cat_5').val() != '') {
            var cat_5 = $('.cat_5').val();
        } else {
            flag = false;
        }
        if ($('.cat_6').val() != '') {
            var cat_6 = $('.cat_6').val();
        } else {
            flag = false;
        }
        if (flag == true) {
            document.forms["edit_post_form"].submit();
        } else {
            $('.cat_error').show();
            $('.cat_error').html('Category should not be blank.');
        }
    } else {
        $.ajax({
            type: "GET",
            url: baseurl + '/cancel_editcategory_ajax?spaceid=' + spaceid + '&cat_2=' + cat_2 + '&cat_3=' + cat_3 + '&cat_4=' + cat_4 + '&cat_5=' + cat_5 + '&cat_6=' + cat_6 + '&action=' + action,
            success: function (response) {
                //location.reload();
                $(".categories").html('');
                $(".categories").html(response);
                $('.edit-cat').show();
            }, error: function (message) { }
        });
    }
}

function countCharEditCat(val, cls) {
    $('.letter-count').hide();
    $('.' + cls).show();
    var len = val.value.length;
    if (len <= 25) {
        $('.' + cls).text(len + '/25');
    }
}

function cancel_edit_post() {
    var postid = $('.editing_post_id').val();
    $('#post_edit_' + postid).html('');
    $('#post_' + postid).show();
    $(".black-overlay").css('display', 'none');

    return false;
}

function get_edited_post_data(postid) {
    var profile_image = $('#post_' + postid).find('span').eq(0).attr('style');
    var usrename = $('#post_' + postid).find('a').eq(0).html();
    var category = $('#post_' + postid).find('input').eq(0).val();
    var subject = $('#post_' + postid).find('h3').eq(0).html();
    var body = $('#post_' + postid).find('p').eq(3).text().trim();

    $('#post_' + postid).find('.findmedia').each(function (index) {
        var m_id = $(this).find('img').attr('media-id');
        m_id = m_id ? m_id : $(this).find('video').attr('media-id');
        if (m_id != '') {
            var clone_data = $(this).clone();
            var clone = clone_data;
            file_orig_name = "";
            if ($('#post_' + postid).find('input[name=img_original_name]').length) {
                file_orig_name = $('#post_' + postid).find('input[name=img_original_name]').val();
                $('#post_edit_' + postid).find('.edit_media_div').append("<div class='upload-content post_categories edit_media_div_container' style=''><span class='close'><img src=" + baseurl + "/images/ic_deleteBlue.svg id='' class='edit_file_del' fileid='" + m_id + "' onclick='close_preview_edit(this)'></span><div class='upload-text'><h3> <img src=" + baseurl + "/images/ic_IMAGE.svg alt=''><span class='upload_file_name'>" + file_orig_name + " </span></h3><p></p></div></div>");
            } else {
                $('#post_edit_' + postid).find('.edit_media_div').append("<div class='upload-content post_categories edit_media_div_container' style=''><span class='close'><img src=" + baseurl + "/images/ic_deleteBlue.svg id='' class='edit_file_del' fileid='" + m_id + "' onclick='close_preview_edit(this)'></span></div>");
            }

            $(clone).find('video').replaceWith('<img style="margin-right: 20px;" src="' + baseurl + '/images/ic_VIDEO.svg" viewfile="' + m_id + '" id="view_file" media-id="2"><span style="display: inline-block; overflow-wrap: break-word; width: 86%;">' + $('#post_' + postid).find('input[name=file_orignal_name]').val() + '</span>');
            $('#post_edit_' + postid).find('.edit_media_div').find('.edit_media_div_container').eq(index).append(clone);
            $('.remove_all_trigger').show();
        }
    });

    $('.edit_post_form').find('.editing_post_id').val(postid);
    $('.edit_post_form').find('span').eq(0).attr({"style": profile_image});
    $('.edit_post_form').find('textarea').eq(0).val(subject);
    $('.edit_post_form').find('textarea').eq(1).val(body);

    autosize(document.querySelectorAll('textarea.t1-resize'));
    autosize(document.querySelectorAll('textarea.t2-resize'));

    /*22-02-2017*/
    var visibility = $('#post_' + postid).find('.post_visible_user').val();
    var value = visibility.replace(" ", "");
    var visible_user_count = value.split(",").length - 1;
    $('.visibility_alert_count').val(visible_user_count);

    $('#visibilty_count').val(visible_user_count);

    var visibility_all_count = 0;
    $('#post_edit_' + postid).find('.edit-post-checkbox').each(function (index) {
        var visible_all = $(this).val();

        if (visibility.indexOf(visible_all) > -1 || visibility.toLowerCase().indexOf("all") > -1) {
            $(this).parent('label').addClass('active');
            $(this).prop('checked', 'checked');
            visibility_all_count = visibility_all_count;
        } else {
            $(this).parent('label').removeClass('active');
            $(this).prop('checked', '');
        }

    });

    /*check if all exiist then add active to everyone*/
    if (visibility.indexOf("All") >= 0 || $('#post_edit_' + postid).find('.edit-post-checkbox').length == visibility.split(',').length-1) {
        $('#post_edit_' + postid).find(".edit_selection_visibility").text("Everyone");
        $('#post_edit_' + postid).find('.hidden_edit_everyone_box').val('true');
        $('#post_edit_' + postid).find('.select_all_visibility_edt').attr('checked', 'checked');
        $('#post_edit_' + postid).find('.select_all_visibility_edt').parent().addClass('active');
    } else {
        $('#post_edit_' + postid).find('.hidden_edit_everyone_box').val('false');
        $('#post_edit_' + postid).find('.select_all_visibility_edt').checked = false;
        $('#post_edit_' + postid).find('.select_all_visibility_edt').parent().removeClass('active');
        $('#post_edit_' + postid).find(".edit_selection_visibility").text(visible_user_count + " Member(s)");
    }
    if (visible_user_count == visibility_all_count) {
        $('.select_all_visibility_edit').prop('checked', 'checked');
        $('.select_all_visibility_edit').parent().addClass('active');
        $('.select_all_visibility_edit').parent().text('Everyone');
        $('.hidden_edit_everyone_box').val('true');


    }
    /*category selected */
    $('#post_edit_' + postid).find('.cat_id_edtt').each(function (index) {
        var cate_all = $(this).val();
        if (category == cate_all) {
            $(this).parent().parent().parent().addClass('active');
            $('.category_heading').text($(this).attr('catgoryname'));
            $('.editcategory').val(category);
        }
    });

    $('.main_post_ta2').trigger('paste');
    $('#post_edit_' + postid).find('.url_embed_trigger').css('display', 'none');
    return {profile_image: profile_image, usrename: usrename, category: category, subject: subject, body: body, visibility: visibility};
}

function d_edig() {
    $("#upload").trigger('click');
}

function readURL_edtt(input, file_ext, id) {
    $('.upload_file_name_edtt').html(file_ext);
    var extension = file_ext.substr((file_ext.lastIndexOf('.') + 1));

    if (extension == 'png' || extension == 'gif' || extension == 'jpg' || extension == 'jpeg') {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            $('.post_categories_file_edt' + id).show();
            $('.post_categories_edit' + id).show();
            $('#post_button' + id).show();

            reader.onload = function (e) {
                $('#blah_edit' + id).show();
                $('#blah_edit' + id).attr('src', e.target.result)
                    .height('auto');
            }

            reader.readAsDataURL(input.files[0]);
            $('.upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_IMAGE.svg');
            $('.upload_file_name_edtt').html(file_ext);
        }
    }
}

function preview_before_upload_edita(ele, thisid) {
    $('#' + thisid + ' .post_categories_file_temp_edit').remove();
    $('#' + thisid + ' .post_file_edtt').each(function (index) {
        var file_type = "image";
        if ($(this)[0].files[0].type.indexOf('image') >= 0)
            file_type = 'image';
        if ($(this)[0].files[0].type.indexOf('video') >= 0)
            file_type = 'video';
      
        var clone = $('#' + thisid + ' .post_categories_file_edt').eq(0).clone();
        file_ext = $(this)[0].files[0].name.split('.');
        var extension = file_ext.pop();
        file_ext = file_ext.join('.');
        clone.find('.upload_file_name_edtt').html(file_ext.toString());

        if (file_type == 'video')
            clone.find('img').eq(1).attr('src', '../images/ic_VIDEO.svg');
        if (file_type == 'image')
            clone.find('img').eq(1).attr('src', '../images/ic_IMAGE.svg');
        if (extension == 'ppt' || extension == 'pptx')
            clone.find('img').eq(1).attr('src', '../images/ic_PWERPOINT.svg');
        if (extension == 'csv' || extension == 'xls' || extension == 'xlsx')
            clone.find('img').eq(1).attr('src', '../images/ic_EXCEL.svg');
        if (extension == 'pdf')
            clone.find('img').eq(1).attr('src', '../images/ic_PDF.svg');
        if (extension == 'doc' || extension == 'docx')
            clone.find('img').eq(1).attr('src', '../images/ic_WORD.svg');

        clone.find('img').eq(2).hide();
        clone.find('img').eq(0).attr('id', index);
        clone.removeClass('post_categories_file_edt');
        clone.addClass('post_categories_file_temp_edit');
        $('#' + thisid + ' .post_categories_file_edt').after(clone);
        $('#' + thisid + ' .post_categories_file_edt').hide();
        clone.show();
    });
}

function readURL_edit(input, file_ext, id, thisid) {
    $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);
    var extension = file_ext.substr((file_ext.lastIndexOf('.') + 1));
    if (extension == 'png' || extension == 'gif' || extension == 'jpg' || extension == 'jpeg') {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            $('.post_categories_maincontent' + id).show();
            $('.post_categories_file' + id).show();
            $('.post_categories' + id).show();
            $('#post_button' + id).show();
            reader.onload = function (e) {
                $('#blah' + id).show();
                $('#blah' + id).attr('src', e.target.result)
                    .height('auto');
            }

            reader.readAsDataURL(input.files[0]);
            $('#' + thisid + ' .upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_IMAGE.svg');
            $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);
        }
    } else if (extension == 'pdf') {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('#' + thisid + ' .upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_PDF.svg');
        $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);

    } else if (extension == 'mp4' || extension == 'mp3' || extension == 'avi' || extension == 'mkv') {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('#' + thisid + ' .upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_VIDEO.svg');
        $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);
    } else if (extension == 'doc' || extension == 'docs' || extension == 'docx') {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('#' + thisid + ' .upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_WORD.svg');
        $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);
    } else if (extension == "xlsx") {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('#' + thisid + ' .upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_EXCEL.svg');
        $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);
    } else if (extension == "xls") {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('#' + thisid + ' .upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_EXCEL.svg');
        $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);
    } else if (extension == "csv") {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('#' + thisid + ' .upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_EXCEL.svg');
        $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);
    } else if (extension == 'ppt' || extension == 'pptx') {
        $('.post_categories_maincontent' + id).show();
        $('.post_categories_file' + id).show();
        $('.post_categories' + id).show();
        $('#post_button' + id).show();
        $('#' + thisid + ' .upload_file_name_edtt').parent().find('img').attr('src', '../images/ic_PWERPOINT.svg');
        $('#' + thisid + ' .upload_file_name_edtt').html(file_ext);
    }
    return false;
}

/*-------------DELETE COMMENTS START-------------*/
function delete_comment(element) {
    $('.del_comment').attr('id', $(element).attr('id'));
    $('.del_comment').attr('commentid', $(element).attr('commentid'));
    $('.del_comment').attr('spaceid', $(element).attr('spaceid'));
    $("#deleteModalcomment").modal('show');
}

function delete_comment_confirm(element) {
    var postid = $(element).attr('id');
    var commentid = $(element).attr('commentid');
    var userid = '';
    var spaceid = $(element).attr('spaceid');
    var commentlimit = '';
    var comment = '';
    var morecheck = $('.checkclickedviewmore' + postid).val();
    var view_more = 'false';
    $.ajax({
        type: "GET",
        url: baseurl + '/add_comments?postid=' + postid + '&userid=' + userid + '&comment=' + comment + '&commentlimit=' + commentlimit + '&morecheck=' + morecheck + '&view_more=' + view_more + '&spaceid=' + spaceid + '&commentid=' + commentid + '&action=delete',
        success: function (response) {
            $('.comments' + postid).html(response);
            $('#comment_input_area' + postid).val('');
            $("#deleteModalcomment").modal('hide');
        },
        error: function (message) {
            alert('Error: Please refresh the page');
        }
    });
}

function textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (25 + o.scrollHeight) + "px";
}

function selectComp(val) {
    $(".sub_comp_input").val(val);
    $("#suggesstion-box").hide();
}



function upload_executive_file_error() {
    $('.save_executive_btn').prop('disabled', false);
}

function upload_executive_file() {
    if (($('.upload-preview-wrap .s3_running_process').length + $('.upload-preview-wrap .executive_file_s3').length + $('.upload-preview-wrap .remove_executive_file').length) >= 2) {
        alert('You can upload a maximum of 2 files to the executive summary. Please remove an existing file.');
        return 0;
    }
    direct_upload_s3_data.push({
        'storage': 's3_executive',
        'progress_element_class': 's3_progress',
        'form_field_class': 'executive_aws_files_data',
        'done_callback': 'executive_file_preview',
        'error_callback': 'upload_executive_file_error',
        'allowed_extension': ['pdf', 'docx', 'ppt', 'pptx', 'mp4', 'doc', 'xls', 'xlsx', 'csv'],
        'progress_bar_ele': '.upload-preview-wrap'
    });
    $('.save_executive_btn').prop('disabled', true);
    $('#upload_s3_file').trigger('click');

}

function executive_file_preview(file_data) {
    html = '<div class="executive_file_s3 pdf_list_file"><span>' + file_data.originalName + '</span><a id="' + file_data.uid + '" class="remove_executive_s3_file" href="#!"><img src="https://uat-clientspace.herokuapp.com/images/ic_highlight_remove.svg" alt="" id="" class=""></a></div>';
    $('.upload-preview-wrap').append(html);
    $('.' + file_data.uid).remove();
    
    if( !$('.s3_running_process').length )
        $('.save_executive_btn').prop('disabled', false);

    if (($('.upload-preview-wrap').find('.remove_executive_file').length + $('.upload-preview-wrap').find('.remove_executive_s3_file').length) >= 2) {
        $('span.fileupload-new').show();
        $('i.fa-upload').show();
    }
}

function make_form_post_ready(ele) {
    $('.body').trigger('click');
    $(ele).parent().parent().removeClass('post-sbj');
    $(".post_categories_maincontent").show();
    $('#save_post_btn_new').show();
    $(".post_categories").show();
    $(".black-overlay").show();
    $("#tour2").addClass("highlight");
    $(".subject_class").show();
    $(".subject_text").show();
    $(".post_subject").css('padding-top', '5px');
    $(".post_subject").attr("placeholder", "Add a subject"); 
    return;
}

function reset_addpost_upload_section() {
    $('.post_categories_file').hide();
    $('.post_categories_file_temp').remove();
    $('.post_categories_file_edt').hide();
    $('.post_categories_file_temp_edit').remove();
    $('.post_file').each(function () {
        if ($(this).attr('id') == 'upload')
            $(this).hide();
        else
            $(this).remove();
    });
    $('.post_file_edtt').each(function () {
        if ($(this).attr('id') == 'upload_edtt')
            $(this).hide();
        else
            $(this).remove();
    });

    del_old_files = "";
    $('.edit_file_del').each(function (index) {
        $(this).trigger('click');

    });
    $('.remove-all').hide();
    return true;
}

function reset_form_post_ready(ele) {
    $('.post_show_hidden').val(0);
    $('.post-wrap').remove();
    $('.body').trigger('click');
    $(ele).parent().parent().addClass('post-sbj');
    $(".post_categories_maincontent").hide();
    $('#save_post_btn_new').hide();
    $(".post_categories").hide();
    $(".black-overlay").hide();
    $("#tour2").removeClass("highlight");
    $(".subject_class").hide();
    $(".subject_text").hide();
    $(".post_subject").css('padding-top', '5px');
    $(".post_subject").attr("placeholder", "");
    $('.add_post_form').find('.form-submit-loader').hide();
    $('.url_embed_trigger').trigger('click');
    $('.remove_all_trigger').trigger('click');
    $('input[name="uploaded_file_aws"]').val('');
    uploaded_file_aws = new Array();
    filesUploaded = [];
    $(document).trigger('scroll');

    /* sec1 */
    $('.category_drop_share').hide();
    $('.category_drop').show();

    $('.visibilty-drop-wrap-share').hide();
    $('.visibilty-drop-wrap').show();

    $('.alert-drop-wrap-share').hide();
    $('.alert-drop-wrap').show();
    $('.share-drop-wrap').hide();
    $('.post_categories_maincontent').removeClass('share-box');
    $('.category-drop').multiselect('rebuild');
    /* reset Visibility drop down start */
    $('ul.visibilty-drop').find('input[type="checkbox"]').each(function () {
        $(this).attr('checked', false);
        $(this).parent().removeClass('active');
    });
    $('ul.visibilty-drop').find('input[name="visibility[]"]').each(function () {
        $(this).attr('checked', 'checked');
        $(this).parent().addClass('active');
    });
    $('.select_all_visibility').attr('checked', 'checked');
    $('.select_all_visibility').parent().addClass('active');
    $('span.selection_visibility').html('Everyone');
    $('ul.alert-drop').find('input[name="alert[]"]').each(function () {
        $(this).attr('checked', 'checked');
        $(this).parent().addClass('active');
    });
    $('.select_all_alert').attr('checked', 'checked');
    $('.select_all_alert').parent().addClass('active');
    $('span.selection_alert').html('Everyone');
    /* reset Alert drop down end */

    /* reset "choose share" drop down start */
    $('ul.multishare').find('input[name="share[]"]').each(function () {
        $(this).attr('checked', false);
        $(this).parent().removeClass('active');
    });
    $('.multiselect-all').attr('checked', false);
    $('.select_all_alert').parent().removeClass('active');
    $('.choose_share').html('Choose');

    $('.post_subject').attr('placeholder', 'Click here to add text, files, links etc.');
    return;
}

function add_attachment_post(ele) {
    $("#upload").trigger('click');
    return;
}

function prepareViewerURL(signed_url){
    if(['pdf'].indexOf(signed_url.file_ext) > -1){
        url = baseurl+'/pdf_viewer/web/viewer.html?file='+signed_url.file_url;
    } else if((['ppt', 'pptx', 'doc', 'docx'].indexOf(signed_url.file_ext)) > -1){
        url = 'https://view.officeapps.live.com/op/embed.aspx?src='+signed_url.file_url+'&wdAr=1.3333333333333333';
    } else {
        url = signed_url.file_url;
    }
    return url;
}

function updateExecutiveFileURL(file_div, signed_url){
    if($(file_div).find('.executive-file-modal').length){
        modal_id = $(file_div).find('.executive-file-modal').attr('data-target');
        $(modal_id).find('iframe').attr('src', prepareViewerURL(signed_url));
        $(modal_id).find('source').attr('src', signed_url.cloud);
        $(modal_id).find('video').load();
        $(modal_id).find('video')[0].play();
    } else {
        $(file_div).find("input[name='url_src']").val(signed_url.cloud);
    }
}

function postsLoadedSuccessfully(){
    // this section run after posts load
    return; 
}
/*-------------End jQuery Functions----------------*/


$('.executive-file').on('click', function(){
    updateExecutiveFileURL(this,signedUrl($(this).find("input[name='url_src']").val(), $(this).find('.loader')));
});

window.reset = function (e) {
    e.wrap('<form>').closest('form').get(0).reset();
    document.getElementById("upload_video_name").innerHTML = "";
    e.unwrap();
}
    /*FEEDBACK FORM VALIDATION START*/
$(".feedback_form").on('submit', function(){

    if(!$('.rating').is(':checked')) {
       $('.rating-wrap').parent().find('.error-msg').remove();
       $('.rating-wrap').after('<span class="error-msg error-body text-left rating-error" style="text-align: left;">Rating is mandatory</span>');
       error = 1;
    }else{
       error = 0;
    }
    if( error ){
       return false;
    } else {
       return true;
    }
});

/*FEEDBACK FORM VALIDATION END*/
function getSuggeCount(texVal){
   var texlen = texVal.length;
   $('.subButton').attr("disabled", false);
   $('.subButton').removeClass('disabled');
   $(".suggCount").text(texlen+'/500');

}
function getCommCount(texVal){
   var texlen = texVal.length;
   $('.subButton').attr("disabled", false);
   $('.subButton').removeClass('disabled');
   $(".commCount").text(texlen+'/500');
   
}

$(".suggesResize, .genCommResize, .commentResize").on('click change, focus', function() {
         autosize(document.querySelectorAll('textarea.suggesResize'));
         autosize(document.querySelectorAll('textarea.genCommResize'));
         autosize(document.querySelectorAll('textarea.commentResize'));
});
$('#feedback-popup').on('shown.bs.modal', function () {
});
var d = new Date();
var month_names_array = [ "months","January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
var n = month_names_array[d.getMonth()];
$(document).on("click", ".top_post_add_link", function() {
    $('.add_post_form .post_subject').trigger('click');
});
$(document).ready(function () {

    $('.subButton').addClass('disabled');
    $('.subButton').attr("disabled", true);
     $(document).on("click", ".rating", function() {
         var r = $(this).val();
           if(parseInt(r) >= 0 ){
               $('.subButton').removeClass('disabled');
               $('.subButton').attr("disabled", false);
                 if($('.rating-error').length > 0) {
                     $('.rating-error').hide();
                 }
           }
     });
    /* Show addpost from on anywhere click at post section*/
    $('.add_post_form').on('click', function(){
        make_form_post_ready($('.post_subject'));
    });

    $('.post-button').on('click',function(){
        $('.post_subject').focus();
    });
    $(document).on("click", ".last-month", function() {
    var cur_month = $("#curnt-month").attr("monnum");
    var cur_year = $("#curnt-month").attr("yearnum");
    
    if(cur_month=="1") {
      var prev_month = 12;
      var prev_year  = parseInt(cur_year)-1;
    } else {
      var prev_month = parseInt(cur_month)-1;
      var prev_year  = cur_year;
    }

    var company = '';
    if($(".top_post_buyer").hasClass('active')) {
      var company = $(".top_post_buyer").text();
    } 
    if($(".top_post_seller").hasClass('active')) {
      var company = $(".top_post_seller").text();
    }

    $("#curnt-month").attr("monnum",prev_month);
    $("#curnt-month").attr("yearnum",prev_year);
    var n = month_names_array[prev_month];
    $("#curnt-month").text(n);
    var url = window.location.href;
    var id = url.substring(url.lastIndexOf('/') + 1);
    $.ajax({
          type: "GET",
          async: false,
          url: baseurl+'/gettopthreepost?month='+ $("#curnt-month").attr("monnum") +'&year='+ $("#curnt-month").attr("yearnum")+'&company='+company+'&space_id='+id,
          beforeSend:function() {
          },
          success: function( response ) {
             $('.top-post-ajax-div').html(response);
          }
      });      
   });

    $(document).on("click", ".next-month", function() {
     var cur_month = $("#curnt-month").attr("monnum");
     var cur_year = $("#curnt-month").attr("yearnum");
     if(cur_month=="12")
     {
      var prev_month = 1;
      var prev_year  = parseInt(cur_year)+1;
     }else
     {
      var prev_month = parseInt(cur_month)+1;
      var prev_year  = cur_year;
     }

   var company = '';
    if($(".top_post_buyer").hasClass('active')) {
      var company = $(".top_post_buyer").text();
    }
    if($(".top_post_seller").hasClass('active')) {
      var company = $(".top_post_seller").text();
    }
    if($(this).attr('curr_month') >= prev_month  && $(this).attr('curr_year') >= prev_year ){  
     $("#curnt-month").attr("monnum",prev_month);
      $("#curnt-month").attr("yearnum",prev_year);
      var n = month_names_array[prev_month];
      $("#curnt-month").text(n);
    } else { 
        if($(this).attr('curr_month') <= prev_month  && $(this).attr('curr_year') != prev_year ){  
         $("#curnt-month").attr("monnum",prev_month);
          $("#curnt-month").attr("yearnum",prev_year);
          var n = month_names_array[prev_month];
          $("#curnt-month").text(n);
        }
    }
    var url = window.location.href;
    var id = url.substring(url.lastIndexOf('/') + 1);
     $.ajax({
          type: "GET",
          async: false,
          url: baseurl+'/gettopthreepost?month='+ $("#curnt-month").attr("monnum") +'&year='+ $("#curnt-month").attr("yearnum")+'&company='+company+'&space_id='+id,
          beforeSend:function() {
          },
          success: function( response ) {
             $('.top-post-ajax-div').html(response);
          }
      });

  });
    $.validator.addMethod("defaultInvalid", function(value, element) {
        return !(element.value == element.defaultValue);
    });
    
    //url_preview_formatting();
    $(document).on('click', '#executive_summary_save', function () {
    $(this).validate({
            rules: {
                "space[executive_summary]": {
                    required: true,
                    maxlength: 300
                }
            },
            messages: {
                "space[executive_summary]": {
                    required: "Executive Summary cannot be empty",
                    maxlength: "Executive Summary cannot be greater than "+executive_summary_max_length+" characters"
                }
            }
        });
    });

    $(".main_post_ta").on('change, paste input', get_preview_url);

    $(document).on('change,  paste input', '.main_post_ta2', function () {
        var thumbcheck = $('#thumbcheck').val();
        if ($(this).val()) {
            data = $(this).val().replace(/\n/g, " ");
            data = data.replace('#', " ");
            data = encodeURIComponent(data);
             $(this).next("span").remove();
            get_url_xhr = $.ajax({
                type: "GET",
                url: baseurl + '/get_url_data?q=' + data,
                processData: false,
                contentType: false,
                beforeSend: function () {
                    if (get_url_xhr != null) {
                        get_url_xhr.abort();
                        get_url_xhr = null;
                    }
                },
                success: function (data) {
                    if (data != 0) {
                        if ($('#ytd_iframe').length && typeof (data.metatags) != 'undefined' && ($('#ytd_iframe').attr('src') == data.metatags["twitter:player"])) {
                            return 0;
                        }

                        html = '<img class="url_embed_trigger" src="/images/ic_highlight_removegray.svg"/>';
                        html = html + '<div class="outer-block">';
                        html = html + '<div class="inner-block">'; 

                        if (data.metatags["twitter:player"]) {
                            html = html + '<div class="thumbnail-block test iframe-content ">';
                            html = html + '<iframe id="ytd_iframe" allowfullscreen="allowfullscreen" width="420" height="345" src=' + data.metatags["twitter:player"] + '></iframe>';
                        } else {
                            html = html + '<div class="thumbnail-block">';
                            img_class = data.thumbnail_img ? "thumbnail-img" : "";
                            html = html + '<img src="'+baseurl+'/file_loading?url=' + data.favicon + '" class="url-favicon ' + img_class + '" onerror="this.src=\'http://' + data.domain + '/favicon.ico\'; this.removeClass"thumbnail-img);">';
                        }

                        html = html + '</div>';
                        html = html + '<div class="description-block "><div>';
                        var title = data.title ? data.title : data.title[0];
                        if (data.full_url.search('http') < 0) {
                            html = html + '<a target="_blank" href=http://' + data.full_url + ' title=' + title + '> <img src="https://www.google.com/s2/favicons?domain=' + data.url + '"/>' + data.title + '</a>';
                        } else {
                            html = html + '<a target="_blank" href=' + data.full_url + ' title=' + data.title + '> <img src="https://www.google.com/s2/favicons?domain=' + data.url + '"/>' + data.title + '</a>';
                        }
                        if (data.description) {
                            html = html + '<p>' + data.description + '</p>';
                        }
                    
                        /* Description block close*/
                        html = html + '</div></div>';

                        /* Outer - Innner block close */
                        html = html + '</div></div>';

                        $('.url_embed_div_edit').empty();
                        $('.url_embed_div_edit').append(html);
                        $('input[name=url_embed_toggle]').eq(1).val(1);
                        $('#thumbcheck').val(1);

                    } else {
                        $('.url_embed_div_edit').empty();
                    }
                }
            });
        } else {
            $('#thumbcheck').val(0);
        }
    });

    $(document).on('click', '.url_embed_trigger', function () {
        $('input[name=url_embed_toggle]').val(0);
        $(this).parent().empty();
    });


    $(document).on('click', '.remove', function () {
        var hideval = $(this).find('input').val();
        var index = 0;
        for (i = 1; 1 < postdata.length; i++) {
            if (postdata[i].id == hideval) {
                index = i;
                break;
            }
        }
        postdata.splice(index, 1);
        $('#lbljson').val(JSON.stringify(postdata));

        $(".second_form").prop('disabled', true);
        var numItems = $('.imgpanel').length;
        if (numItems == 1) {
            $(".second_form").prop('disabled', true);
        }
        $(this).parent().parent().parent(".imgpanel").remove();
        var arrayval = "";
        $('.mainimage').each(function () {
            var numItems = $('.imgpanel').length;
            if (numItems == 1) {
                var getval = $(this).attr('value');
                arrayval = getval;
            } else if (numItems > 1) {
                var getval = $(this).attr('value');
                arrayval += getval + ',';
            }
        });
        var newdata = arrayval.slice(0, -1);
        $('#remainingimages').val(newdata);
    });

    $("#cancel_btn").click(function () {
        location.reload();
    });

    $(function () {
        $(".exe_summry[maxlength]").bind('input propertychange', function () {
            var maxLength = $(this).attr('maxlength');
            if ($(this).val().length > maxLength) {
                $(this).val($(this).val().substring(0, maxLength));
            }
        })

        $(".exe_summry").keyup(function (e) {
            while ($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
                $(this).height($(this).height() + 1);
            }
            ;
        });
    });

    /******************If buyer login**********************/
    check_sub_comp_status_buyer = $('.buyer_info_hidden').attr('sub-comp-active');
    if (check_sub_comp_status_buyer == 1) { 
        $('.sub_comp_div').css("display", "block");
        $('.sub_comp_input').attr('name', 'sub_comp');
        $('.sub_comp_input').addClass('c_side_validation');
    }
    /******************If buyer login**********************/
    $('.executive-summary-preview .findmedia').on('click', function () {
        custom_logger({
            'description': 'view executive file',
            'action': 'view executive file'
        });
    });

    $(document).on('keydown', '.post-subject-textarea, .post-description-textarea', function () {
        if(this.value) autoCapitalize(this);
    });

    /* Show more/less for post-attachments start */
    $(document).on('click', '.read-more-trigger', function () {
        if ($("#" + $(this).attr('for')).prop("checked") == false) {
            $(this).find('span').hide();
        } else {
            $(this).find('span').show();
        }
    });

    video_player_log_bind();
    onYouTubeIframeAPIReady();


    /*********************Multiselect Toggle Start*************************/

    $(".add_post_form .post-visiblity-checkbox").change(function () {
        var this_checked = this.checked;
        $(this).prop('checked', this_checked).parent().toggleClass('active', this_checked);
        label = postDropDownLabel(1,this_checked?1:0);
        $('.selection_visibility').text(label.text);

        $('.add_post_form .visibilty-drop .visiblity-checkbox')
            .prop('checked', this_checked)
            .parent().toggleClass('active', this.checked);
        
        $('.add_post_form .alert-drop .alert-checkbox')
            .prop('checked', this_checked)
            .parent().toggleClass('active', this.checked)
            .toggleClass('disable_check', !this.checked);

        $('.add_post_form').find('.post-alert-checkbox').parent()
            .toggleClass('active', this.checked)
            .toggleClass('disable_check', !this.checked);

        $(".select_all_alert").trigger('change');
    });


    $('.visibilty-drop .visiblity-checkbox').change(function () {
        postVisiblityUser(this, $('.add_post_form') );
    });

    //////////////////for child checkboxes handling/////////////////////////////////////
    $(document).on('click', '.checkbox', function () {
        $(this).parent().parent().parent().addClass('open');
    });

    $(document).on('click', '.alert-drop .disable_check', function () {
        return false;
    });

    $('.alert-drop .checkbox2').change(function () {  //any checkbox in child changes
        $(this).closest('.dropdown-wrap').addClass('open');
        postAlertUser($(this), this.checked, $('.add_post_form'));
    });

    // add post start 
    $(".select_all_alert").change(function () {
        $('.add_post_form .alert-drop').find('input:checkbox.checkbox2').parent().not('.disable_check').toggleClass('active', this.checked).find('input:checkbox').prop('checked', this.checked);// toggle all cb

        label = postDropDownLabel($('.add_post_form .alert-drop').find('input:checkbox.checkbox2').length, $('.add_post_form .alert-drop').find('input:checkbox:checked.checkbox2').length);
        $('.selection_alert').text(label.text);

        label = postDropDownLabel($('.add_post_form .alert-drop').find('input:checkbox.checkbox2').parent().not('.disable_check').length, $('.add_post_form .alert-drop').find('input:checkbox:checked.checkbox2').length);
        $('.select_all_alert').parent().toggleClass('active', label.master_box_check);
    });
    // add post start end 


    /* Edit post start */
    $(document).on('change', ".edit_post_form .post-visiblity-checkbox", function () {
        var postid = $('.editing_post_id').val();
        var this_checked = this.checked;
        $(this).prop('checked', this_checked).parent().toggleClass('active', this_checked);
        label = postDropDownLabel(1,this_checked?1:0);
        $('.edit_selection_visibility').text(label.text);

        $('#post_edit_' + postid+' .visibilty-drop .visiblity-checkbox')
            .prop('checked', this_checked)
            .parent().toggleClass('active', this.checked);
        
        $('#post_edit_' + postid+' .alert-drop .alert-checkbox')
            .prop('checked', this_checked)
            .parent().toggleClass('active', this.checked)
            .toggleClass('disable_check', !this.checked);

        $('#post_edit_' + postid).find('.post-alert-checkbox')
            .prop('checked', this_checked)
            .parent().toggleClass('active', this.checked)
            .toggleClass('disable_check', !this.checked);

        $(".edit_post_form .post-alert-checkbox").trigger('change');
    });

    $(document).on('click', '.repost', function () {
        var postid = $('.editing_post_id').val();
        $('#post_edit_' + postid).find('.submit_edit_post').html('Post');
        $(this).parent().parent().find('.edit-alert-bx-disable').toggle(!this.checked);
        $(this).parent().parent().find('.edit-alert-bx').toggle(this.checked);

        $('#post_edit_' + postid).find('.alert-drop .alert-checkbox').attr('checked', false)
            .parent().addClass('disable_check').removeClass('active');

        var visiblity_list = $('#post_edit_' + postid).find('.active .visiblity-checkbox')
            .map(function() {
                return this.value;
            }).get();

        visiblity_list = "input:checkbox[value='" + visiblity_list.join("'],input:checkbox[value='") + "']";
        $('#post_edit_' + postid).find('.alert-drop').find(visiblity_list).attr('checked', true)
            .parent().addClass('active').removeClass('disable_check');
        $(".edit_post_form .post-alert-checkbox").trigger('change');
    });

    $(document).on('change', '.edit-post-alert-checkbox', function () {
        $(this).closest('.dropdown-wrap').addClass('open');
        postAlertUser( $(this), this.checked, $('#post_edit_'+$('.editing_post_id').val()));
    });

    $(document).on('change', '.edit-post-checkbox', function () {
        postVisiblityUser(this, $('#post_edit_'+$('.editing_post_id').val()));
    });

    $(document).on('click','.visibility_group',function(e) {
        var checked = this.checked;
        if( $('.add_post_form').find('input:checkbox:checked.visibility_group').length == 1){
            postFormListReset($('.add_post_form').find('.visibilty-drop'), $('.add_post_form').find('.alert-drop'));
            $(this).prop('checked', true);
        }

        $(this).closest('.visibilty-drop-wrap').addClass('open');
        $(this).parent().toggleClass('active', checked);
        $.ajax({
            type: "GET",
            dataType:"json",
            url: baseurl+'/get_group_members?gid='+$(this).attr('id'),
            success: function(response) {
               $(response).each(function(){
                  user_checkbox = $('.add_post_form').find('.visibilty-drop').find('input:checkbox[value="'+this.space_user.user_id+'"]');
                  user_checkbox.prop('checked', checked);
                  postVisiblityUser(user_checkbox, $('.add_post_form') );
               });
            }
        });
    });

    $(document).on('change', '.edit_post_form .post-alert-checkbox', function () {
        var postid = $('.editing_post_id').val();
        $('#post_edit_' + postid).find('.alert-drop').find('input:checkbox.edit-post-alert-checkbox').parent().not('.disable_check').toggleClass('active', this.checked).find('input:checkbox').prop('checked', this.checked);// toggle all cb

        label = postDropDownLabel($('#post_edit_' + postid).find('.alert-drop').find('input:checkbox.edit-post-alert-checkbox').length, $('#post_edit_' + postid).find('.alert-drop').find('input:checkbox:checked.edit-post-alert-checkbox').length);
        $('#post_edit_' + postid).find('.post-alert-label').text(label.text);

        label = postDropDownLabel($('#post_edit_' + postid).find('.alert-drop').find('input:checkbox.edit-post-alert-checkbox').parent().not('.disable_check').length, $('#post_edit_' + postid).find('.alert-drop').find('input:checkbox:checked.edit-post-alert-checkbox').length);
        $(this).parent().toggleClass('active', this.checked);
    });

    $('.category-drop').multiselect({
        numberDisplayed: 1,
        includeSelectAllOption: true,
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        nonSelectedText: 'NOTHING SELECTED'
    });

    $('.categories-edit-drop').multiselect({
        numberDisplayed: 1,
        includeSelectAllOption: true,
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        nonSelectedText: 'NOTHING SELECTED'
    });

    $('.alert-edit-drop').multiselect({
        numberDisplayed: 1,
        includeSelectAllOption: true,
        enableCaseInsensitiveFiltering: true,
        buttonWidth: '100%',
        nonSelectedText: 'NOTHING SELECTED'
    });

    /*********************End Multiselect Toggle End*************************/
    

    $(".exe_sum_video").on('click', function (e) {
        if($('.modal-dialog').hasClass('full-width-doc')) {
              $('.modal-dialog').removeClass('full-width-doc');
        }
    });


    $('.ph_number').bind('keyup paste', function () {
      position = this.selectionStart;
      this.value = this.value.replace(/[^ 0-9+(),-.]/g, '');
      this.selectionEnd = position;
    });


    $("#upload_link").on('click', function (e) {
        add_attachment_post(this);
    });

    $(".camera-icon").on('click', function (e) {
        $("#img_show").trigger('click');
    });

    $("#myModalInvite").on('hide.bs.modal', function () {
        location.reload();
    });

    $('body').on('hidden.bs.modal', '.modal', function () {
        $('video').trigger('pause');
    });

    /*-------- Get iframe src attribute value i.e. YouTube video url
     and store it in a variable----------*/
    var url = $("#cartoonVideo").attr('src');
    /*-------- Assign empty url value to the iframe src attribute when
     modal hide, which stop the video playing ------------*/
    $("#myModal").on('hide.bs.modal', function () {
        $("#cartoonVideo").attr('src', '');
    });
    /*--------- Assign the initially stored url back to the iframe src
     attribute when modal is displayed again -------*/
    $("#myModal").on('show.bs.modal', function () {
        $("#cartoonVideo").attr('src', url);
    });
    
    $('.white_box_info').on('click', function () {
        $(this).fadeOut('fast');
    });

    /*-----------Remove error-msg from input when value change------------*/
    $("textarea, input").on('change, keyup paste input', function () {
        $(this).parent().removeClass('has-error');
        $(this).parent().find('.error-msg').remove();
    });
    
    $("input[name=first_name]").on('keyup', function () {
        $(".mailbody").find('span').eq(0).show();
        $(".mailbody").find('span').eq(1).html(' ' + $(this).val() + ',');

    });

    $(".mailbody").on('focus', function () {
        $('.mail_body').get(0).selectionStart = $('.mail_body').html().length;
        $('.mail_body').get(0).selectionEnd = $('.mail_body').html().length;
        $('.mail_body').focus();
    });

    
    $(document).on('click', '.addendorse', function () {
        var endorse_id = $(this).attr('add-endorse-id');
        var user_id = $(this).attr('add-endorse-userid');
        var post_honor = $(this).attr('data-honor');
        var space_id = $(this).attr('space-id');
        var liked_by_email = $(this).attr('get-liked-by-email');

        var file_name_index = $(this).find("img").attr('src').lastIndexOf("/") + 1;
        var file_name = $(this).find("img").attr('src').substr(file_name_index);
        if (file_name == 'ic_thumb_up.svg') {
            $(this).find("img").attr('src', baseurl + "/images/ic_thumb_up_grey.svg");
            var like_status = 1; //liked
            var liked_from_email = 0;
        }
        if (file_name == 'ic_thumb_up_grey.svg') {
            $(this).find("img").attr('src', baseurl + "/images/ic_thumb_up.svg");
            var like_status = 0; //disliked
            var liked_from_email = 0;
        }
        if(liked_by_email == 1){
            $(this).find("img").attr('src', baseurl + "/images/ic_thumb_up.svg");
            var like_status = 0; //liked
            var liked_from_email = 1;
        }

        $.ajax({
            type: "GET",
            url: baseurl + '/endorse?endorseid=' + endorse_id + '&userid=' + user_id + '&spaceid=' + space_id + '&posthonor=' + post_honor + '&like_status=' + like_status+'&liked_from_email='+liked_from_email,
            success: function (response) {
                $('.endorsediv_' + endorse_id).html(response);
            },
            error: function (error) {
                custom_logger({
                    'action': 'endorse post',
                    'description': error
                });
                alert('Error: Please refresh the page');
            }
        });
    });

    $(document).on('click', '.endorsed_popup', function () {
        var postid = $(this).attr('endors-poup-post');
        var spaceid = $(this).attr('space-id');
        $.ajax({
            type: "GET",
            url: baseurl + '/endorsepopup_ajax?endorseid=' + postid + '&spaceid=' + spaceid,
            success: function (response) {

                $('.endorse_popup_modal').html(response);
            },
            error: function (message) {
                alert('Error: Please refresh the page');
            }
        });
    });

    $(document).on('click', '.save_edit_visiblity', function () {
        var postid = $(this).attr('ediitvisible');
        var data1 = $(".visiblity_update_" + postid).serialize().replace(/&checkbox%5B%5D=/g, ',');

        var newString = data1.replace(/checkbox%5B%5D=/g, '');
        var str1 = $(this).attr('allvisibleuser');
        var str2 = 'All';

        var visible_to = "";

        if (data1.indexOf("checkboxall=1") > -1) {
            newString = 'All,' + newString;
            newString = newString.replace(/checkboxall=1,/g, '');
            visible_to = 'All';
        }
        //user can not  remove himself and postuser
        var post_logedinuser = $(this).attr('logedin-and-postuser');
        if (newString != '') {
            newString = post_logedinuser + ',' + newString;
        } else {
            newString = post_logedinuser;
        }

        $.ajax({
            type: "GET",
            dataType: "json",
            url: baseurl + '/edit_visibillitypopup_ajax?postid=' + postid + '&visibleuser=' + newString + '&visible_to=' + visible_to,
            success: function (response) {
                mixpanelLogger({
                    'space_id': sess_space_id, 
                    'event_tag':'Change post visibility'
                })
                if (response.user == 'all') {
                    if ($('.now_active_private' + postid).hasClass('active')) {
                        $('.now_active_private' + postid).removeClass('active');
                        $('.now_active_public' + postid).addClass('active');
                        $('.v_image' + postid).removeClass('lock');
                        $('.rest-memb' + postid).css("display", "none");

                    }
                    $('.show-user' + postid).attr('data-content', 'Everyone');
                    $('#post_' + postid).find('.post_visible_user').val(response.user_id);
                    /*22-02-2017*/
                    $('#post_' + postid).find('.post_visible_user_edit').val(response.user_id);
                    /*22-02-2017*/
                } 
                else {
                    if ($('.now_active_public' + postid).hasClass('active')) {
                        $('.now_active_public' + postid).removeClass('active');
                        $('.now_active_private' + postid).addClass('active');
                        $('.v_image' + postid).addClass('lock');
                        $('.rest-memb' + postid).css("display", "block");
                    }
                    $('.show-user' + postid).attr('data-content', response.names);
                    $('#post_' + postid).find('.post_visible_user').val(response.user_id);
                    /*22-02-2017*/
                    $('#post_' + postid).find('.post_visible_user_edit').val(response.user_id);
                    /*22-02-2017*/
                }
            },
            error: function (message) {
            }
        });
    });

    $(document).on('click', '.cancel_visibility', function () {
        $(this).closest('form')[0].reset();
    });

    $(document).on('click', '.s-everyone', function () {
        var postid = $(this).attr('postid');
        var spaceid = $(this).attr('space-id');
        var visible_users = $(this).attr('visibletousers');
        $.ajax({
           type: "GET",
           url: baseurl + '/edit_visibility?postid=' + postid + '&visibleusers=' + visible_users + '&spaceid=' + spaceid,
           success: function (response) {
                if ($('.now_active_private' + postid).hasClass('active')) {
                    $('.now_active_private' + postid).removeClass('active');
                    $('.now_active_public' + postid).addClass('active');
                    $('.v_image' + postid).removeClass('lock');
                    $('.rest-memb' + postid).css("display", "none");
                }

                $('.show-user' + postid).attr('data-content', 'Everyone');
                $('#post_' + postid).find('.post_visible_user').val(response.user_id);
                /*22-02-2017*/
                $('#post_' + postid).find('.post_visible_user_edit').val(response.user_id);
                /*22-02-2017*/
           },
           error: function (message) {
           }
        });
    });

    /*--------REMOVE ADDED FILE TO POST----------*/
    $(document).on('click', '#close_post_file', function () {
        $('.post_categories_file').hide();
        var control = $("#upload");
        control.replaceWith(control = control.clone(true));
    });

    $(document).on('change', '#upload', function () {
        var allow_extention = constants['POST_EXTENSION'];

        var file_ext = this.value;
        file_ext = file_ext.split('.');
        ext = file_ext.pop();

        ext = ext.toLowerCase();
        file_ext = file_ext.join('.');
        if (allow_extention.indexOf(ext) < 0) {
            alert("Only " + allow_extention.toString() + " extensions are allowed");
            return false;
        }

        var clone = $(this).clone();
        clone.removeAttr('id');
        clone.addClass('post_attachment_clone');
        $(this).attr('id', 'post_file_' + ($('.post_file').length - 1));
        $('.direct-upload').after(clone);
        $('.remove-all').show();
    });

    $(document).on('change', '#upload_edita', function () {
        var allow_extention = constants['POST_EXTENSION'];
        var file_ext = document.getElementById("upload_edita").files[0].name;
        file_ext = file_ext.split('.');
        ext = file_ext.pop();
        file_ext = file_ext.join('.');
        if (allow_extention.indexOf(ext) < 0) {
            alert("Only " + allow_extention.toString() + " extensions are allowed");
            return false;
        }

        if ($('.post_file_edita').length == 1) { // preview file if single
            file_ext = document.getElementById("upload_edita").files[0].name;
            var id = '';
            $("#blah").hide();
            readURL(this, file_ext, id);
            file_ext = file_ext.split('.');
            ext = file_ext.pop();
            file_ext = file_ext.join('.');
            $('.upload_file_name').html(file_ext.toString());
        } 
        else { // list preview of files before upload
            preview_before_upload_edit(this);
        }

        var clone = $(this).clone();
        $(this).attr('id', 'post_file_' + ($('.post_file_edita').length - 1));
        $(this).after(clone);
        $('.remove-all').show();
    });

    $('textarea.comment-area').on('click', function () {
        autosize(document.querySelectorAll('textarea.comment-area'));
        $(".send_comment").attr('disabled', false);
    });

   

    /* On Edit Post*/
    $(document).on('click', '#edit_post', function (ev) {

        postid = $(this).attr('editpost');
        var post_by = $(this).attr('postby');
        var active_user = $(this).attr('activeuser');

        if (post_by != active_user) {
            alert('You are not Autorize for this.');
            return false;
        } else {
            $("#post_" + postid).css("display", "none");
            $(".black-overlay").css("display", "block")
            $("#editpost_" + postid).addClass("highlight").css("margin-top", "9px").show();
            $('select[name=selValue]').val(1);
            ev.preventDefault();
            return false;
        }
    });

    /*Edit Share Name*/
    $.fn.focusEnd = function () {
        $(this).focus();
        var tmp = $('<span />').appendTo($(this)),
            node = tmp.get(0),
            range = null,
            sel = null;
        if (document.selection) {
            range = document.body.createTextRange();
            range.moveToElementText(node);
            range.select();
        } else if (window.getSelection) {
            range = document.createRange();
            range.selectNode(node);
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
        tmp.remove();
        return this;
    }

    $(".edit_share_name").on('click', function (e) {
        $(".share_name").hide();
        $(".edit_share").show();
        $(".updated_share").focusEnd();
    });

    $(".cancel_edit_share").on('click', function (e) {
        $(".share_name").show();
        $(".edit_share").hide();
    });
   
   /* Update Post */
    $(document).on('click', '#edit_post_button', function () {
        var postid = $(this).attr('editpostform');
        $("#editpost_" + postid).addClass("test").css("margin-top", "9px").hide();
        $(".black-overlay").css("display", "none");
        $("#post_" + postid).show();
        var form_data = new FormData($(this).closest('form')[0]);

        $.ajax({
            type: "POST",
            url: baseurl + '/updatepost',

            data: form_data,
            processData: false,
            contentType: false,
            success: function (data) {
                $('.change_post_' + postid).html(data);
            },
            error: function (error) {
               console.log(error);
            }
        });
    });

    /* Remove Added File from Edit Post*/
    $(".edit_preview_file").on('click', function (e) {
        var postid = $(this).attr('closeid');
        $('.edit_preview_main' + postid).hide();
        $('#edit_preview_main' + postid).hide();
        $('input.edit_file_url').val('');
        var input = $("#edit_upload_" + postid);
        input = input.val('').clone(true);
    });

    /* Add Attachments to Edit*/
    $(".edit_upload_link").on('click', function (e) {
        e.preventDefault();
        var postid = $(this).attr('editupload');
        $("#edit_upload_" + postid + ":hidden").trigger('click');
        $("#edit_upload_" + postid).change(function () {
            var file_ext = $(this).val();
            readURL(this, file_ext, postid);
            $('.upload_file_name').html(file_ext);
        });
    });

    $('.updated_share').keypress(function (e) {
        if (e.which == 13) {
            return false;
        }
    });

    $(document).on('keypress, keyup', '.domain_name_inp', function (e) {
        var block_key = [64, 32, 44, 59];
        $(this).val($(this).val().toLowerCase());
        if (block_key.indexOf(e.which) > -1) {
            return false;
        }
    });

    $(document).on('keypress', '.invite_email_inp, input[name=email]', function (e) {
        var block_key = [32, 44, 59];
        if (block_key.indexOf(e.which) > -1) {
            return false;
        }
    });

    /* Cancel Button on Edit Post*/
    $(document).on('click', '#edit_cacel_btn', function () {
        var postid = $(this).attr('cancelid');
        var fileurl = $("#file_url_" + postid).attr('filepath');
        var editid = $("#edit_post_id_" + postid).attr('olddata');
        $("#editpost_" + postid).hide();
        $(".black-overlay").css("display", "none");
        $("#post_" + postid).show();
        $('.edit_preview_main' + postid).show();
        $('input.edit_file_url').val(fileurl); // Replacing Old filepath in upload value

        document.getElementById("edit_post_form_" + postid).reset();
        $('textarea.edit_post_area' + postid).text(editid); // Replacing new post value in edit post
        $(".post_categories_file" + postid).css("display", "none");
    });

    $(document).on('click', '#see_community', function () {
        var userid = $(this).attr('userid');
        var space_id = $(this).attr('spaceid');
        $.ajax({
            type: "GET",
            url: baseurl + '/view_community_profile?user_id=' + userid + '&space_id=' + space_id,
            success: function (response) {
                $('.community-mem-detail').modal('show').html(response);
            }
        });
    })

    $("#upload_pdf_file").change(function () {
        var urls = $(this).attr('url');

        if ($('.post-media-data').val() >= 2) {
            $("#upload_pdf_file").val('');
            alert('You can upload a maximum of 2 files to the executive summary. Please remove an existing file.');
            return false;
        }
        if ($(".upload_pdf_hidden").val() != '') {
            $("#upload_pdf_file").val('');
            alert('You can upload a maximum of 2 files to the executive summary. Please remove an existing file');
            return false;
        }
        var fileSize = document.getElementById("upload_pdf_file").files[0];
        var sizeInMb = fileSize.size / 1024;
        var sizeLimit = 1024 * 100;
        var file_ext = document.getElementById("upload_pdf_file").files[0].name;

        if (sizeInMb > sizeLimit) {
            alert("Please upload file of less than 100 mb size");
            $("#upload_pdf_file").val("");
        }
        var file_ext = document.getElementById("upload_pdf_file").files[0].name;
        if (($(".already_uploaded_file").val() == file_ext) || ($(".already_uploaded_video_file").val() == file_ext) || ($(".already_uploaded_pdf_file").val() == file_ext)) {
            $("#upload_pdf_file").val('');
            alert('You have already uploaded same file. Please choose another');
            return false;
        } else {
            $(".already_uploaded_file").val(file_ext);
        }

        readFileName(this, file_ext);
        $('#upload_video_name').html('<span>' + file_ext + '</span>').append("<a><div id='cross'><img src='" + urls + "/images/ic_highlight_remove.svg' alt=''></div></a>");
        $(this).hide();
        $('#upload_video_file').show();
        $(".upload_pdf_hidden").val('true');
        var inc_n = parseInt($('.post-media-data').val()) + parseInt(1);
        $('.post-media-data').val(inc_n);
    });

    $("#upload_video_file").change(function () {
        var urls = $(this).attr('url');
        if ($(".upload_video_hidden").val() != '') {
            $("#upload_video_file").val('');
            alert('You can upload a maximum of 2 files to the executive summary. Please remove an existing file');
            return false;
        }

        if ($('.post-media-data').val() >= 2) {
            $("#upload_video_file").val('');
            alert('You can upload a maximum of 2 files to the executive summary. Please remove an existing file.');
            return false;
        }
        var fileSize = document.getElementById("upload_video_file").files[0];
        var sizeInMb = fileSize.size / 1024;
        var sizeLimit = 1024 * 100;
        var file_ext = document.getElementById("upload_video_file").files[0].name;

        if (sizeInMb > sizeLimit) {
            alert("Please upload file of less than 100 mb size");
            $("#upload_video_file").val("");
        }
        var file_extension = document.getElementById("upload_video_file").files[0].name;
        if (($(".already_uploaded_file").val() == file_extension) || ($(".already_uploaded_video_file").val() == file_extension) || ($(".already_uploaded_pdf_file").val() == file_extension)) {
            $("#upload_video_file").val('');
            alert('You have already uploaded same file. Please choose another');
            return false;
        } else {
            $(".already_uploaded_file").val(file_extension);
        }
        readFileName2(this, file_extension);
        $('#upload_pdf_name').html('<span>' + file_extension + '</span>').append("<a><div id='cross2' style='display: inline-block;margin-left: 10px;'><img src='" + urls + "/images/ic_highlight_remove.svg' alt=''></div></a>");
        $(this).hide();
        $(".upload_video_hidden").val('true');
        var post_media_data = parseInt($('.post-media-data').val()) + 1;
        $('.post-media-data').val(post_media_data);
    });

    /********************Save who view file*************************/
    $(document).on("click", ".findmedia", function (e) {
        var space_id = $('.view_file_spaceid').val();
        var user_id = "";
        var post_id = $(this).find('#view_file,#view_file1').attr('viewfile');
        $.ajax({
            async: false,
            type: "GET",
            url: baseurl + '/view_file?space_id=' + space_id + '&user_id=' + user_id + '&post_id=' + post_id,
            success: function (response) {
                view_cout = $('.viewpostsuser' + post_id).children().attr('view-count');
                total_count = parseInt(view_cout) + 1;
                if (total_count > 1) {
                    var view_text = 'views';
                } else {
                    var view_text = 'view';
                }
                $('.viewpostsuser' + post_id).find('.view_eye_content').html(total_count + ' ' + view_text);
                $('.viewpostsuser' + post_id).children().attr('view-count', total_count);
            }
        });

        ele = $(this);
        viewer_modal_id = $(this).attr('data-target');

        if ($('.modal-dialog').hasClass('full-width-doc')) {
            $('.modal-dialog').removeClass('full-width-doc');
        }

        if (typeof (viewer_modal_id) == 'undefined') {
            return;
        }

        if ($(viewer_modal_id).find('iframe').length) { //if file is in iframe/preveiw mode
            viewer_modal_id = $(this).attr('data-target');

            clearTimeout(url_validate_var);
            $.ajax({
                type: "GET",
                async: false,
                url: baseurl + '/url_validate?doc_viewer=true&q=' + $(ele).find('input[name=url_src]').val(),
                beforeSend: function () {
                    $(viewer_modal_id).find('iframe').attr('src', '');
                    $(viewer_modal_id).find('.modal-loader').show();
                },
                success: function (response) {

                    $(viewer_modal_id).find('.modal-loader').show();
                    var url_temp = '';
                    if (response.file_ext.indexOf('pdf') >= 0 || response.file_ext.indexOf('PDF') >= 0) {
                        url_temp = baseurl + "/pdf_viewer/web/viewer.html?file=" + response.file_url;
                    } else {
                        url_temp = 'https://view.officeapps.live.com/op/embed.aspx?src=' + response.file_url + '&wdAr=1.3333333333333333';
                    }
                    $(viewer_modal_id).find('iframe').attr('src', url_temp);
                    iframe_load($(viewer_modal_id).find('iframe'), $(ele).find('input[name=url_src]').val());
                }
            });
        } else {
            $.ajax({
                type: "GET",
                async: false,
                url: baseurl + '/url_validate?q=' + $(ele).find('input[name=url_src]').val(),
                beforeSend: function () {
                    $(viewer_modal_id).find('.modal-loader').show();
                    $(ele).attr('href', '');
                },
                success: function (response) {
                    var file_url = response.cloud;
                    $(viewer_modal_id).find('.modal-loader').show();
                    $(ele).attr('href', file_url);
                    $(viewer_modal_id).find('.modal-body').find('img').attr('src', file_url);
                    $(viewer_modal_id).find('.modal-body').find('img').attr('src', file_url);
                    if ($(viewer_modal_id).find('.modal-body').find('video').length) {
                        // $(viewer_modal_id).find('.modal-body').find('video').attr('poster', file_url);
                        $(viewer_modal_id).find('.modal-body').find('source').attr('src', file_url);
                        $(viewer_modal_id).find('.modal-body').find('video').load();
                        $(viewer_modal_id).find('.modal-loader').hide();
                    }

                }
            });
        }
        return true;
    });

    /*Add Css if Ios Device*/
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
        $('.bkg').attr('poster', baseurl + '/images/video-poster.jpg');
    }

    $(document).on("click", ".full_screen_toggle", function () {
        $(this).closest('.modal-dialog').toggleClass('full-width-doc');
        $(this).find('i').toggleClass('fa-expand fa-compress');

        if ($(this).closest('.modal-dialog').find('iframe').length > 0) {
            viewer_modal_id = "#" + $(this).closest('.modal-dialog').parent().attr('id');
            clearTimeout(url_validate_var);
            $.ajax({
                type: "GET",
                async: false,
                url: baseurl + '/url_validate?doc_viewer=true&q=' + $(ele).find('input[name=url_src]').val(),
                beforeSend: function () {
                    $(viewer_modal_id).find('iframe').attr('src', '');
                    $(viewer_modal_id).find('.modal-loader').show();
                },
                success: function (response) {

                    $(viewer_modal_id).find('.modal-loader').show();
                    var url_temp = '';
                    if (response.file_ext.indexOf('pdf') >= 0 || response.file_ext.indexOf('PDF') >= 0) {
                        url_temp = baseurl + "/pdf_viewer/web/viewer.html?file=" + response.file_url;
                    } else {
                        url_temp = 'https://view.officeapps.live.com/op/embed.aspx?src=' + response.file_url + '&wdAr=1.3333333333333333';
                    }
                    $(viewer_modal_id).find('iframe').attr('src', url_temp);
                    iframe_load($(viewer_modal_id).find('iframe'), $(ele).find('input[name=url_src]').val());
                }
            });
        }

    });

    $('video').on('loadstart', function (event) {
        $(this).addClass('bkg');
        // $(this).attr("poster", '../images/Loading_bar_temp.svg');
    });

    $('video').on('canplay', function (event) {
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            $('.bkg').attr('poster', baseurl + '/images/video-poster.jpg');
        } else {
            $(this).removeClass('bkg');
            $(this).removeAttr("poster");
        }
    });

    $('video').onloadstart = function () {
        alert("Starting to load video");
    };

    $('.modal').on('hidden.bs.modal', function () {
        $('.modal-loader').show();
    });

    /* Mouseover on view/eye icon on embeded url post */
    $(document).on("mouseover", ".get_view_user_embeded", function () {
        var post_id = $(this).find('img').attr('getViewId');
        if(!!('ontouchstart' in window)){
         $('.viewpostsuser' + post_id).popover('hide');
          }
        $.ajax({
            type: "GET",
            async: false,
            url: baseurl + '/view_url_embeded/' + post_id,

            beforeSend: function () {
                $('.viewpostsuser' + post_id).attr("data-content", '<img src="' + baseurl + '/images/loading_bar1.gif">');
                $('.viewpostsuser' + post_id).popover('show');
            },
            success: function (response) {
                if (response == '') {
                    $('.viewpostsuser' + post_id).attr("data-content", '&nbsp;');
                } else {
                    $('.viewpostsuser' + post_id).attr("data-content", response);
                }
                $('.viewpostsuser' + post_id).popover('hide');

            },
            error: function (response) {
                $('.viewpostsuser' + post_id).attr("data-content", '');
                $('.viewpostsuser' + post_id).popover('show');
            },

        });
        return false;
    });

    $(document).on("mouseover", ".get_view_user", function () {
        var post_id = $(this).find('img').attr('getViewId');
        $.ajax({
            type: "GET",
            async: false,
            url: baseurl + '/view_users_post?post_id=' + post_id,

            beforeSend: function () {
                $('.viewpostsuser' + post_id).attr("data-content", '<img src="' + baseurl + '/images/loading_bar1.gif">');
                $('.viewpostsuser' + post_id).popover('show');
            },
            success: function (response) {
                if (response == '') {
                    $('.viewpostsuser' + post_id).attr("data-content", '&nbsp;');
                } else {
                    $('.viewpostsuser' + post_id).attr("data-content", response);
                }
                $('.viewpostsuser' + post_id).popover('show');
            },
            error: function (response) {
                alert('Something went wrong! Refresh your page.');
            }

        });
        return false;
    });

    $(document).on("click", ".get_view_user_embeded", function () {
        var post_id = $(this).find('img').attr('getViewId');
        var space_id = $(this).find('img').attr('space-id');
        if(!!('ontouchstart' in window)){
         $('.viewpostsuser' + post_id).popover('hide');
          }
        $.ajax({
            type: "GET",
            async: false,
            url: baseurl + '/view_url_embeded_users?post_id=' + post_id,

            beforeSend: function () {

            },
            success: function (response) {
                if (response == '') {

                } else {
                    $('.eye_users_popup').modal('show');
                    $('.eye_users_popup').html(response);
                    $('.viewpostsuser' + post_id).popover('hide');
                }

            },
            error: function (response) {
                alert('something wrong');
            },

        });
        return false;

    });

    $(document).on("click", ".get_view_user", function () {
        var post_id = $(this).find('img').attr('getViewId');
        var space_id = $(this).find('img').attr('space-id');
        $.ajax({
            type: "GET",
            async: false,
            url: baseurl + '/view_eye_users_pop?post_id=' + post_id + '&space_id=' + space_id,

            success: function (response) {
                if (response == '') {

                } else {
                    $('.eye_users_popup').modal('show');
                    $('.eye_users_popup').html(response);
                    $('.viewpostsuser' + post_id).popover('hide');
                }

            },
            error: function (response) {
                alert('Something went wrong! Refresh your page.');
            }

        });
        return false;
    });

    $(document).on("click", "#cross", function () {
        $(".upload_pdf_hidden").val('');
        $('#already_uploaded_file').val('');
        $('#upload_pdf_file').show();
        $('#upload_video_file').hide();
        $("#upload_video_name").empty();
        $(this).hide();
        var control = $("#upload_pdf_file");
        control.replaceWith(control = control.clone(true)); //remove file from input
    });

    $(document).on("click", "#cross2", function () {
        $(".upload_video_hidden").val('');
        $('#already_uploaded_file').val('');
        $('#upload_pdf_file').hide();
        $('#upload_video_file').show();
        $("#upload_pdf_name").empty();
        $(this).hide();
        var control = $("#upload_video_file");
        control.replaceWith(control = control.clone(true)); //remove file from input
    });

    /*Delete saved summary files*/
    $(document).on("click", ".delete_summary_files", function () {
        var delete_file = $(this).attr('id');
        data = $('.delete_summary_files_inp').val();
        if (data.length)
            data = data + "," + delete_file;
        else
            data = delete_file;

        $('.delete_summary_files_inp').val(data);
        $(this).closest('.remove_executive_file').remove();

        $('span.fileupload-new').show();
        $('i.fa-upload').show();
        return false;
    });

    $('#content').on('change keyup keydown paste cut', 'textarea', function () {
        $(this).height(10).height(this.scrollHeight);
    }).find('#exec_textarea').change();

    $("#comment_input_area").on('click', function () {
        make_form_post_ready(this);
        return false;
    });

    $(".remove_border").on('keyup', function () {
        $('.remove_border').removeClass('word-block-error');
    });

    $(".remove_border1").on('keyup', function () {
        $('.remove_border1').removeClass('word-block-error');
    });

    $(".post-wrap").on('touchstart', function (e) {
        var test = e.originalEvent.targetTouches[0].target.className;
        if ($('.r1').find('.dropdown-wrap').hasClass('open')) {
            $('.r1').find('.dropdown-wrap').removeClass('open');
        }

        if (test == 'checkbox blue_check_bx active') {
            if (!$('.r1').find('.dropdown-wrap').hasClass('open')) {
                $('.r1').find('.dropdown-wrap').addClass('open');
            }
        }
        if (test == 'checkbox blue_check_bx') {//|| test!='checkbox blue_check_bx_active' || test!='checkbox blue_check_bx'
            if (!$('.r1').find('.dropdown-wrap').hasClass('open')) {
                $('.r1').find('.dropdown-wrap').addClass('open');
            }
        }

        var touch_control = e.originalEvent.targetTouches[0].target.className;
        if ($('.r2').find('.dropdown-wrap').hasClass('open')) {
            $('.r2').find('.dropdown-wrap').removeClass('open');
        }

        if (touch_control == 'checkbox active') {
            if (!$('.r2').find('.dropdown-wrap').hasClass('open')) {
                $('.r2').find('.dropdown-wrap').addClass('open');
            }
        }
        if (touch_control == 'checkbox') {//|| test!='checkbox blue_check_bx_active' || test!='checkbox blue_check_bx'
            if (!$('.r2').find('.dropdown-wrap').hasClass('open')) {
                $('.r2').find('.dropdown-wrap').addClass('open');
            }

        }
    });

    /* For Ipad Add Background Dim Light*/
    $("#comment_input_area").on('touchstart', function () {
        $(".post_categories_maincontent").show();
        $('html, body').animate({
            scrollTop: $(".add_post_form .shareupdate-wrap").offset().top
        }, 2000);
        $('#comment_input_area').focus();
        $(".post_categories").show();
        $(".black-overlay").show();
        $("#tour2").addClass("highlight");
        $(".subject_class").show();
        $(".subject_text").show();
        $(".post_subject").css('padding-top', '5px');
        $(".post_subject").attr("placeholder", "Add a subject");
        var char = $('.main_post_ta').val().length;
        return false;
    });

    $(".post_subject").on('click change, focus', function () {
        autosize(document.querySelectorAll('textarea.post_subject'));
    });

    $(document).on('click', '#save_post_btn_new', function (ev) {
        ev.preventDefault();
        $('.add_post_form').find('.form-submit-loader').show();
        var error = '';
        var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
        var subject = $('.post_subject').val();
        var body = $('.main_post_ta').val();
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'POST',
            url: baseurl + '/matchwordsubject',
            data: {
                subject: subject,
                body: body,
                _token: CSRF_TOKEN
            },
            dataType: 'json',
            async: false,
            success: function (response) {
                //alert(response.subject); return false;
                if (response != '') {
                    if (response.subject) {
                        var block_word_subject = response.subject.toString().replace(/\,/g, '", "');
                        if (block_word_subject != '') {
                            $('.post_subject').addClass('word-block-error');
                            $('.post_subject').parent().find('.error-msg').remove();
                            $('.post_subject').after('<span class="error-msg error-body text-left" style="text-align: left;">This post contains the following blocked word(s): "' + block_word_subject + '"</br>Please remove any blocked words before adding your post</span>');
                            error = 1;
                        }
                    }
                    if (response.body1) {
                        var block_word_body = response.body1.toString().replace(/\,/g, '", "');
                        if (block_word_body != '') {
                            $('.main_post_ta').addClass('word-block-error');
                            $('.main_post_ta').parent().find('.error-msg').remove();
                            $('.main_post_ta').after('<span class="error-msg error-body text-left" style="text-align: left;">This post contains the following blocked word(s): "' + block_word_body + '"</br>Please remove any blocked words before adding your post</span>');
                            error = 1;
                        }
                    }
                } else {
                    if (!$('.post_subject').val() || !$.trim($('.post_subject').val()).length > 0) {
                        $('.post_subject').parent().find('.error-msg').remove();
                        $('.post_subject').after('<span class="error-msg error-body text-left" style="text-align: left;">Subject is mandatory</span>');
                        error = 1;
                    }
                    if (!$('.main_post_ta').val() || !$.trim($('.main_post_ta').val()).length > 0) {
                        $('.main_post_ta').parent().find('.error-msg').remove();
                        $('.main_post_ta').after('<span class="error-msg error-body text-left" style="text-align: left;">Body is mandatory</span>');
                        error = 1;
                    }
                }
            },
            error: function (error) {
                ev.preventDefault();
            }
        });
        if (error == '') {
            $(this).closest('form').submit();
        } else {
            ev.preventDefault();
        }
        if (error) {
            $('.add_post_form').find('.form-submit-loader').hide();
            return false;
        } else {
            $('.add_post_form').find('.form-submit-loader').show();
            return true;
        }
    });

    var mouse_is_inside = false;

    $('.shareupdate-wrap').hover(function () {
        mouse_is_inside = true;
    }, function () {
            mouse_is_inside = false;
    });

    $('#group_modal').hover(function () {
        mouse_is_inside = true;
    }, function () {
        mouse_is_inside = false;
    });

    var mouse_is_outside_navi = false;
    $('#a_nav').hover(function () {
        mouse_is_outside_navi = true;
    }, function () {
        mouse_is_outside_navi = false;
    });

    $('#tour2').on('mouseenter', function (argument) {
        is_mouse_inside_tour = true;
    });
    $('#tour2').on('mouseleave', function (argument) {
        is_mouse_inside_tour = false;
    });

    $("body").mouseup(function () {
        if (!mouse_is_inside && $('.shareupdate-wrap').length > 1 && !single_post_view) {
            dimlight();
            if ((!mouse_is_outside_navi) && $('#bs-example-navbar-collapse-2').hasClass('in')) {
                $("#bs-example-navbar-collapse-2").removeClass("in");
            }
        }
    });

    var mouse_is_outside = false;
    $('#user_profile').hover(function () {
        mouse_is_outside = true;
    }, function () {
        mouse_is_outside = false;
    });

    $("body").mouseup(function () {
        if (!mouse_is_outside) {
            $('.profile_update_form').trigger("reset");
        }
    });

    $('.profile_popup').on('click', function () {
        $leng = $('.jobtitle_admin').val().length;
        if ($leng > 0){
            $('.jobtitletxt').html("");
        }
    });

    $(document).on("click", "#discard", function () {
        $("#tour2").removeClass("highlight");
        $(".add_post_form .share-inner-wrap").addClass("post-sbj");
        $('#save_post_btn_new').hide();
        //hide multishar post
        $('.category_drop_share').hide();
        $('.category_drop').show();

        $('.visibilty-drop-wrap-share').hide();
        $('.visibilty-drop-wrap').show();

        $('.alert-drop-wrap-share').hide();
        $('.alert-drop-wrap').show();
        $('.share-drop-wrap').hide();
        $('.post_share').parent().removeClass('share-box');
        //hide multishar post
        $(".black-overlay").hide();
        $(".add_post_form")[0].reset();
        $('#catg_id').multiselect('refresh');
        $('#visibility_drop').multiselect('refresh');
        $('#alert_drop').multiselect('refresh');
        $(".post_categories_maincontent").hide();
        $(".post_categories").hide();
        $(".subject_class").hide();
        $(".subject_text").hide();
        $(".error-msg").hide();

        if (get_url_xhr != null) {
            get_url_xhr.abort();
            get_url_xhr = null;
        }
        $('.url_embed_div').empty();
        reset_addpost_upload_section();
    });

    $('.black-overlay').on('touchstart', function () {
        dimlight();
    });

    /*EDIT VISIBILTY POPU START*/
    $(document).on("click", ".checkbox1", function () {
        var toggle_all_id = $(this).attr('visibiliity-toogleall-edit-id');
        $('.visibility_checkbox_popup_' + toggle_all_id).not(this).prop('checked', this.checked);
        $(".save_edit_visiblity").removeClass("disabled-grey");
        $(".save_edit_visiblity").attr('disabled', false);
        $(".cancel_visibility").removeClass("disabled-grey");
        $(".cancel_visibility").attr('disabled', false);
    });

    $(document).on("click", ".visbility_check", function () {
        var id = $(this).attr('postid');
        var numberChecked = $('input.visibility_checkbox_popup_' + id + ':checked').length
        var total_count = $('.hidden_count_visibility_' + id).val();
        if (numberChecked == total_count) {
            $('.chkb1_' + id).not(this).prop('checked', this.checked);
        } else {
            $('.chkb1_' + id).not(this).prop('checked', false);
        }
        $(".save_edit_visiblity").removeClass("disabled-grey");
        $(".save_edit_visiblity").attr('disabled', false);
        $(".cancel_visibility").removeClass("disabled-grey");
        $(".cancel_visibility").attr('disabled', false);
    });

    /*----------------EDIT VISIBILITY POPUP END-----------------*/
    $(document).on('click', '.visibility_setting', function () {
        if ($('.modal-sm').hasClass('active_pop')) {
            $('.active_pop').html('');
        }
        var postid = $(this).attr('setting-id');
        $('#visiblepopup' + postid).html('');
        var spaceid = $(this).attr('space-id');
        $("#visiblepopup" + postid).removeClass("add_scroll");
        $.ajax({
            type: "GET",
            url: baseurl + '/endorse_setting_popup_ajax?endorseid=' + postid + '&spaceid=' + spaceid,
            success: function (response) {

                $('#visiblepopup' + postid).html(response);
                $("#visiblepopup" + postid).addClass("add_scroll");
                $(".save_edit_visiblity").addClass("disabled-grey");
                $(".save_edit_visiblity").attr('disabled', true);
                $(".cancel_visibility").addClass("disabled-grey");
                $(".cancel_visibility").attr('disabled', true);
            },
            error: function (message) {
                alert('Error: Please refresh the page');
            }
        });

    });

    $('body').on('touchstart', function (e) {
        //did not click a popover toggle or popover
        if ($(e.target).data('toggle') !== 'popover'
            && $(e.target).parents('.popover.in').length === 0) {
            $('[data-toggle="popover"]').popover('hide');
        }
    });

    $(document).on('click', '.exe_pencil', function () {
        autosize(document.querySelectorAll('textarea.summary_box'));
        if (($('.upload-preview-wrap').find('.remove_executive_file').length + $('.upload-preview-wrap').find('.remove_executive_s3_file').length) >= 2) {
            $('span.fileupload-new').show();
            $('i.fa-upload').show();
        }
    });



    /*------------EDIT VISITLITY UPDATE FUNCTION END------------------*/

   $(document).on('click', '.post_emb_link', function () {
        parent_div = $(this).parent().closest('.post-wrap');
        post_id = parent_div.attr('id');
        post_id = post_id.replace('post_', '');
        p_id = $(this).parent().parent().attr('post-id');
        $.ajax({
            type: "GET",
            url: baseurl + '/log_post_file_evnt?content_id=' + post_id + '&url=' + $(this).attr('href'),
            success: function (response) {

                view_cout = $('.viewpostsuser' + p_id).children().attr('view-count');
                total_count = parseInt(view_cout) + 1;
                if (total_count > 1) {
                    var view_text = 'views';
                } else {
                    var view_text = 'view';
                }
                $('.viewpostsuser' + p_id).find('.view_eye_content').html(total_count + ' ' + view_text);
                $('.viewpostsuser' + p_id).children().attr('view-count', total_count);
            }
        });
    });


    $(document).on('click', '#temp_id_trigger', function () {
        var char = $('#biotextarea').val().length;
        if (char <= 121) {
            $('#biotextarea').attr('rows', '2');
        } else if (char > 121 && char <= 240) {
            $('#biotextarea').attr('rows', '4');
        } else {
            $('#biotextarea').attr('rows', '5');
        }

        var job_title = $('#jobtitletxt').val().length;

        if (job_title <= 121) {
            $('#jobtitletxt').attr('rows', '2');
        } else if (job_title > 121 && job_title <= 240) {
            $('#jobtitletxt').attr('rows', '4');
        } else {
            $('#jobtitletxt').attr('rows', '5');
        }
    });

    $(document).on('click', '.visibility_setting_more', function () {
        var postid = $(this).attr('setting-id');
        $('#visiblepopup' + postid).html('');
        var spaceid = $(this).attr('space-id');
        $.ajax({
            type: "GET",
            url: baseurl + '/visibility_popupmore_ajax?endorseid=' + postid + '&spaceid=' + spaceid,
            success: function (response) {

                $('#visiblepopup' + postid).html(response);
            },
            error: function (message) {
                alert('Error: Please refresh the page');
            }
        });
    });

    $(document).on('click', '.add_category', function (ev) {
        var d = new Date();
        $(".categories .category_edit_list").append('<li class=""><input name="category_' + d.getTime() + '" class="form-control box cat_val" type="text" maxlength="25" placeholder="Start typing..." value=""><span class="cat-del-icon" onclick="$(this).parent().remove();" aria-hidden="true"></span><span class="letter-count count_cat"></span></li>');
    });

    $(document).on('keyup paste', '.cat_val', function () {
        $(this).removeClass('error');
        $(this).parent().find('p').remove();
        $(this).parent().find('span.cat-del-icon').hide();
        $(this).parent().find('span.count_cat').html($(this).val().length + '/25');

        if ($(this).val().length == 0) {
            $(this).parent().find('span.count_cat').hide();
            $(this).parent().find('span.cat-del-icon').show();
        } else {
            $(this).parent().find('span.count_cat').show();
            $(this).parent().find('span.cat-del-icon').hide();
        }
    });

    /*-------------- Before submit edit/add form----------- */
    $(document).on('submit', '#edit_post_category_form', function (ev) {
        error = 0;
        $(this).find('input').each(function () {
            if (!$(this).val().length) {
                $(this).removeClass('error');
                $(this).parent().find('p').remove();
                $(this).after('<p class="error-msg error-body text-left" style="text-align: left;">This field is mandatory</p>');
                $(this).addClass('error');
                error = 1;
            }
        });
        if (error)
            return false;
    });

    /*--------- Before submit edit/add form end-block------------ */

    $(document).on('click', '#edit_post_btn_new', function (ev) {
        ev.preventDefault();
        var error = '';
        var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
        var subject = $('.subject_validate').val();
        var body = $('.main_post_ta2').val();
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'POST',
            url: baseurl + '/matchwordsubject',
            data: {
                subject: subject,
                body: body,
                _token: CSRF_TOKEN
            },
            dataType: 'json',
            async: false,
            success: function (response) {
                if (response != '') {
                    if (response.subject) {
                        var block_word_subject = response.subject.toString().replace(/\,/g, '", "');
                        if (block_word_subject != '') {
                            $('.subject_validate').addClass('word-block-error');
                            $('.subject_validate').parent().find('.error-msg').remove();
                            $('.subject_validate').after('<span class="error-msg error-body text-left" style="text-align: left;">This post contains the following blocked word(s): "' + block_word_subject + '"</br>Please remove any blocked words before adding your post</span>');
                            error = 1;
                        }
                    }
                    if (response.body1) {
                        var block_word_body = response.body1.toString().replace(/\,/g, '", "');
                        if (block_word_body != '') {
                            $('.main_post_ta2').addClass('word-block-error');
                            $('.main_post_ta2').parent().find('.error-msg').remove();
                            $('.main_post_ta2').after('<span class="error-msg error-body text-left" style="text-align: left;">This post contains the following blocked word(s): "' + block_word_body + '"</br>Please remove any blocked words before adding your post</span>');
                            error = 1;
                        }
                    }
                } else {
                    if (!$('.subject_validate').val() || !$.trim($('.subject_validate').val()).length > 0) {
                        $('.subject_validate').parent().find('.error-msg').remove();
                        $('.subject_validate').after('<span class="error-msg error-body text-left" style="text-align: left;">Subject is mandatory</span>');
                        error = 1;
                    }
                    if (!$('.main_post_ta2').val() || !$.trim($('.main_post_ta2').val()).length > 0) {
                        $('.main_post_ta2').parent().find('.error-msg').remove();
                        $('.main_post_ta2').after('<span class="error-msg error-body text-left" style="text-align: left;">Body is mandatory</span>');
                        error = 1;
                    }
                }
            },
            error: function (error) {
                ev.preventDefault();
            }
        });
        if (error == '') {
            $(this).closest('form').submit();
        } else {
            ev.preventDefault();
        }
        if (error) {
            return false;
        } else {
            $('input[id=upload]').remove();
            $('.edit_post_form').find('.form-submit-loader').show();
            return true;
        }
    });

    $(document).on('click', '.remove_all_trigger', function (e) {
        $('.post_categories_file').hide();
        $('.post_categories_file_temp').remove();
        $('.post_categories_file_edt').hide();
        $('.post_categories_file_temp_edit').remove();
        $('.post_file').each(function () {
            if ($(this).attr('id') == 'upload')
                $(this).hide();
            else
                $(this).remove();
        });
        $('.post_file_edtt').each(function () {
            if ($(this).attr('id') == 'upload_edtt')
                $(this).hide();
            else
                $(this).remove();
        });

        del_old_files = "";
        $('.edit_file_del').each(function (index) {
            $(this).trigger('click');

        });

        $('.remove-all').hide();
    });

    $(document).on('click', '.editpost_data', function (e) {
        edit_popup_skull_clone = $('.edit_popup_skull').find('form').clone();
        edit_popup_skull_clone.addClass('edit_popup_skull_clone');

        var postid = $(this).attr('editpost');
        $('#post_edit_' + postid).html(edit_popup_skull_clone);
        get_edited_post_data(postid);
        $('#post_' + postid).hide();
        $(".black-overlay").show();
        $('.edit_post_form').find('.subject_text').show();
        $('.edit_post_form').find('.subject_class').show();
        $('.edit_post_form').find('.post_categories_maincontent').show();
        e.preventDefault();
    });

    $(document).on('click', '.cat_id_edtt', function () {
        $('.category_heading').text($(this).attr('catgoryname'));
        $('.editcategory').val($(this).val());
    });

    $(document).on('change', '#upload_edtt', function () {
        var allow_extention = constants['POST_EXTENSION'];
        var file_ext = document.getElementById("upload_edtt").files[0].name;
        file_ext = file_ext.split('.');
        ext = file_ext.pop();

        ext = ext.toLowerCase();
        file_ext = file_ext.join('.');
        if (allow_extention.indexOf(ext) < 0) {
            alert("Only " + allow_extention.toString() + " extensions are allowed");
            return false;
        }
        var thisid = $(this).parent().parent().parent().parent().attr('id');
        if ($('#' + thisid + ' .post_file_edtt').length == 1) { // preview file if single
            file_ext = document.getElementById("upload_edtt").files[0].name;
            var id = '';
            $("#blah_edit").hide();
            readURL_edtt(this, file_ext, id);
            file_ext = file_ext.split('.');
            ext = file_ext.pop();
            file_ext = file_ext.join('.');
            $('.upload_file_name_edtt').html(file_ext.toString());
            $('#' + thisid + ' .post_categories_file_edt').show();
        } else { // list preview of files before upload
            preview_before_upload_edita(this, thisid);
        }

        var clone = $(this).clone();
        $(this).attr('id', 'post_file_d_' + ($('#' + thisid + ' .post_file_edtt').length - 1));
        $(this).after(clone);
        $('.remove-all').show();
    });

    $(document).on({
        mouseenter: function () {
            is_mouse_inside_tour = true;
        },
        mouseleave: function () {
            is_mouse_inside_tour = false;
        }
    }, '.single-cmt-wrap, .edit-comment, .save_cmt');
    
    $(document).on('click', '.editpost_data', function () {
        $('.navbar-header .dropdown-toggle,.navbar-header .nav-btn, .navbar-nav .nav-btn').css('pointer-events', 'none');
    });

    $(document).on('click', '.edit_popup_skull_clone button.post_btn', function () {
        $('.navbar-header .dropdown-toggle,.navbar-header .nav-btn, .navbar-nav .nav-btn').css('pointer-events', 'unset');
    });

    $(document).on('click', '.minimize-post', function () {
        var tag = $(this);
        var postid = $(tag).attr('attr-id');

        var userid = $(tag).attr('attr-uid');
        $.ajax({
            type: "GET",
            dataType: "html",
            url: baseurl + '/expandpost?postid=' + postid + '&userid=' + userid + '&type=true',
            success: function (response) {
                $('#post_' + postid).addClass('minimize');
                $('#post_' + postid).find(tag).removeClass('minimize-post');
                $('#post_' + postid).find(tag).addClass('m-collapse');
                $('#post_' + postid).find(tag).html('<span class="dropdown-post-icon"><img src="../images/ic_unfold.svg"></span>' + 'Expand post');
            },
            error: function (message) {
                alert('Error: Please refresh the page');
            }
        });
    });

    $(document).on('click', '.minimize-collapse,.m-collapse', function () {
        var tag = $(this);
        var postid = $(tag).attr('attr-id');
        var userid = $(tag).attr('attr-uid');
        $.ajax({
            type: "GET",
            dataType: "html",
            url: baseurl + '/expandpost?postid=' + postid + '&userid=' + userid + '&type=false',
            success: function (response) {
                $('#post_' + postid).removeClass('minimize');
                $('#post_' + postid).find('.m-collapse').addClass('minimize-post');
                $('#post_' + postid).find('.m-collapse').removeClass('m-collapse');
                $('#post_' + postid).find('.minimize-post').html('<span class="dropdown-post-icon"><img src="../images/ic_unfold_less.svg"></span>' + 'Minimise post');
            },
            error: function (message) {
                alert('Error: Please refresh the page');
            }
        });
    });

    /******* Check buyer or seller selected *********/
    $(document).on('change', '.company_admin', function () {
        var check_sub_comp_status = $('.buyer_info_hidden').attr('sub-comp-active');
        if (check_sub_comp_status == 1) {
            var buyer_company_hidden_id = $('.buyer_info_hidden').attr('buyer-id');
            var buyer_company_hidden_name = $('.buyer_info_hidden').val();
            var buyer_company_id = $(this).find(":selected").val();
            var buyer_company = $(this).find(":selected").text();
            if (buyer_company_hidden_id == buyer_company_id && buyer_company_hidden_name == buyer_company) {
                //$('.comp_lab').html('Community <span class="required-star">&nbsp; *</span>');
                $('.sub_comp_div').css("display", "block");
                $('.sub_comp_input').attr('name', 'sub_comp');
                $('.sub_comp_input').addClass('c_side_validation');

            } else {
                //$('.comp_lab').html('Company <span class="required-star">&nbsp; *</span>');
                $('.sub_comp_input').removeAttr('name');
                $('.sub_comp_div').css("display", "none");
                $('.sub_comp_input').removeClass('c_side_validation');

            }
        }
    });

    $('.company_admin').trigger("change");

    $(document).on('keyup', '.sub_comp_input', function () {
        var sub_comp = $(this).val();
        $(".sub_comp_input .client_side_validation_msg").hide();
        var space_id = $('.hidden_sp_id').val();
        $.ajax({
            type: "GET",
            dataType: "html",
            url: baseurl + '/search_sub_comp?comp=' + sub_comp.trim() + '&space_id=' + space_id,
            success: function (data) {
                $("#suggesstion-box").show();
                $("#suggesstion-box").html(data);

                $(".sub_comp_add_list").html("Add ' " + sub_comp + " '").css("color", '#0D47A1');
                $(".sub_comp_input").css("background", "#FFF");
                var sub_comp_len = $(".sub_comp_hid_input").length;
                if (sub_comp_len == '1') {
                    $(".sub_comp_add_list").hide();
                }
            }
        });
    });

    $(document).on('click', '.sub_comp_add_list', function () {
        $("#suggesstion-box").hide();
    });

    $('.visible_search_in').keyup(function () {
        var valThis = $(this).val().toLowerCase();
        $('.visibilty-drop li label').each(function () {
            var text = $(this).text().toLowerCase();
            var match = text.indexOf(valThis);
            if (match >= 0) {
                $(this).show();
            } else {
                $(this).hide();
                $(this).parent().css('border-bottom', 'none');
            }
        });
    });

    $('.visible_search_in_groups').keyup(function () {
        var valThis = $(this).val().toLowerCase();
        $('.label-wrap label').each(function () {
            var text = $(this).text().toLowerCase();
            var match = text.indexOf(valThis);
            if (match >= 0) {
                $(this).show();
                $(this).parent().css('border-bottom', '1px solid #e0e0e0 ');
            } else {
                $(this).hide();
                $(this).parent().css('border-bottom', 'none');
            }
        });
    });

    $('.visible_search_in_groups_edit').keyup(function () {
        var valThis = $(this).val().toLowerCase();
        $('.label-wrap label').each(function () {
            var text = $(this).text().toLowerCase();
            var match = text.indexOf(valThis);
            if (match >= 0) {
                $(this).show();
                $(this).parent().css('border-bottom', '1px solid #e0e0e0 ');
            } else {
                $(this).hide();
                $(this).parent().css('border-bottom', 'none');
            }
        });
    });

    // Assigned to variable for later use.
    var form = $('.direct-upload');
    // Place any uploads within the descending folders
    // so ['test1', 'test2'] would become /test1/test2/filename
    var folders = ['post_file'];

    form.fileupload({
        url: form.attr('action'),
        type: form.attr('method'),
        datatype: 'xml',
        add: function (event, data) {

            // Show warning message if your leaving the page during an upload.
            window.onbeforeunload = function () {
                return 'You have unsaved changes.';
            };
            $('.post_btn').attr('disabled', true);

            // Give the file which is being uploaded it's current content-type (It doesn't retain it otherwise)
            // and give it a unique name (so it won't overwrite anything already on s3).
            var file = data.files[0];
            uid = data.files[0]['uid'] = Date.now() + '_' + 'uid';
            var filename = Date.now() + '.' + file.name.split('.').pop();
            form.find('input[name="Content-Type"]').val(file.type);
            form.find('input[name="key"]').val((folders.length ? folders.join('/') + '/' : '') + filename);

            // Actually submit to form to S3.
            s3_upload_xhr[uid] = data.submit();

            // Show the progress bar
            // Uses the file size as a unique identifier
            uploaded_file_aws_unik = uid;
            var clone = $('.post_attachment_skull').clone();
            clone.removeClass('post_attachment_skull');
            clone.addClass('post_attachment');

            clone.find('.progress-bar-striped').addClass(uploaded_file_aws_unik);
            clone.find('.upload_file_name').html(file.name.split('.')[0]);
            clone.find('.close_trigger').attr('id', uploaded_file_aws_unik);
            clone.find('img').eq(1).attr('src', extension_wise_img(file.name.split('.').pop()));

            clone.show();
            $('.upload-content').eq($('.upload-content').length - 2).after(clone);


        },
        progress: function (e, data) {
            uid = data.files[0].uid;
            var percent = Math.round((data.loaded / data.total) * 100);
            $('.' + uid).width(percent + '%');
            $('.' + uid).html(percent + '%');
            if (percent == 100)
                $('.' + uid).parent().hide();
        },
        fail: function (e, data) {
            attachment_element = $('.'+uid).parent().closest('.post_attachment');
            attachment_element.addClass('attachment-error');
            attachment_element.find('.progress').hide();
            attachment_element.find('.upload_file_name').html(attachment_element.find('.upload_file_name').html()+'<strong style="color:red"> - file upload failed</strong>');
            window.onbeforeunload = null;
            $('.progress[data-mod="' + data.files[0].size + '"] .bar').css('width', '100%').addClass('red').html('');
            if ($('.direct-upload').fileupload('progress').loaded == $('.direct-upload').fileupload('progress').total) {
                $('.post_btn').attr('disabled', false);
            }
        },
        done: function (event, data) {
            window.onbeforeunload = null;
            var original = data.files[0];
            var s3Result = xmlToJson(data.result.documentElement);
            filesUploaded.push({
                "originalName": original.name,
                "s3_name": s3Result.Key,
                "size": original.size,
                "url": s3Result.Location,
                'mimeType': original.type
            });
            $('#uploaded').html(JSON.stringify(filesUploaded, null, 2));
            uploaded_file_aws.push(JSON.stringify(filesUploaded, null, 2));
            $('input[name="uploaded_file_aws"]').val(JSON.stringify(filesUploaded, null, 2));
            preview_before_upload_aws();
            if ($('.direct-upload').fileupload('progress').loaded == $('.direct-upload').fileupload('progress').total) {
                $('.post_btn').attr('disabled', false);
            }
        }
    });

    var is_ios = /(iPhone)/g.test( navigator.userAgent );

    if(is_ios===true){
        $(".pro_info_member textarea#jobtitletxt").addClass("job-title-text");
        $(".pro_info_member textarea#biotextarea").addClass("job-title-text");
    }

    $(document).on("click", ".top_post_seller", function () {
        var company = $(this).text();
        var url = window.location.href;
        var id = url.substring(url.lastIndexOf('/') + 1);
        $.ajax({
            type: "GET",
            async: false,
            url: baseurl + '/gettopthreepost?month=' + $("#curnt-month").attr("monnum") + '&year=' + $("#curnt-month").attr("yearnum") + '&company=' + company+'&space_id='+id,
            success: function (response) {
                $('.top-post-ajax-div').html(response);
                $('.t_post').removeClass('active');
                $('.top_post_seller').addClass('active');
            }
        });
    });

    $(document).on("click", ".top_post_all", function () {
        $('.t_post').removeClass('active');
        var url = window.location.href;
        var id = url.substring(url.lastIndexOf('/') + 1);
        $.ajax({
            type: "GET",
            async: false,
            url: baseurl + '/gettopthreepost?month=' + $("#curnt-month").attr("monnum") + '&year=' + $("#curnt-month").attr("yearnum")+'&space_id='+id,
            success: function (response) {
                $('.t_post').removeClass('active');
                $('.top_post_all').addClass('active');
                $('.top-post-ajax-div').html(response);
            }
        });
    });

    $(document).on("click", ".top_post_buyer", function () {
        var company = $(this).text();
        var url = window.location.href;
        var id = url.substring(url.lastIndexOf('/') + 1);
        $.ajax({
            type: "GET",
            async: false,
            url: baseurl + '/gettopthreepost?month=' + $("#curnt-month").attr("monnum") + '&year=' + $("#curnt-month").attr("yearnum") + '&company=' + company+'&space_id='+id,
            success: function (response) {
                $('.top-post-ajax-div').html(response);
                $('.t_post').removeClass('active');
                $('.top_post_buyer').addClass('active');
            }
        });
    });

    /* Remove upload file on s3 from executive list */
    $(document).on('click', '.remove_executive_s3_file', function () {
        var uid = $(this).attr('id');
        var temp_arr = new Array();

        $.each(s3_executive, function (key) {
            if (this.uid != uid)
                temp_arr[key] = s3_executive[key];
        });
        delete s3_executive;
        s3_executive = temp_arr;
        $('input.executive_aws_files_data').val(JSON.stringify(s3_executive, null, 2));
        $(this).closest('.executive_file_s3').remove();
        $('span.fileupload-new').show();
        $('i.fa-upload').show();
    });

    $(document).on('click', '.summary_cancel', function () {
        var process = Object.keys(s3_upload_xhr)
        $.each(process, function (key) {
            s3_upload_xhr[process[key]].abort();
            $('#' + process[key]).remove();
            location.reload();
        });

    });

    /* Executive Summary iframe reload/refresh */
    $(document).on('click', '.pdf_list_file', function (event) {
        if ($($(this).find('a').attr('data-target')).find('iframe').length) {
            $($(this).find('a').attr('data-target')).find('.modal-loader').show();
            $($(this).find('a').attr('data-target')).find('iframe').attr('src', $($(this).find('a').attr('data-target')).find('iframe').attr('src'));
            iframe_load($($(this).find('a').attr('data-target')).find('iframe'), '');
        } else {
            $('.modal-loader').hide();
        }
    });

    $(document).on('click', 'i.fa-expand, i.fa-compress', function (event) {
        if ($(this).parent().closest('.modal').find('iframe').length) {
            $($(this).parent().closest('.modal')).find('.modal-loader').show();
            $(this).parent().closest('.modal').find('iframe').attr('src', $(this).parent().closest('.modal').find('iframe').attr('src'));
            iframe_load($(this).parent().closest('.modal').find('iframe'), '');
        } else {
            $('.modal-loader').hide();
        }
    });

    $(".edit_share_name").on('click', function(e) {
        $(".share_name").hide();
        $(".edit_share").show();
        $(".updated_share").focusEnd();
    });
    $(".edit_user_name").on('click', function(e) {
        $(this).hide();
        $(".user_first_last_name").hide();
        $(".edit_user").show();
    });
    $(".cancel_edit_share").on('click', function(e) {
        $(".share_name").show();
        $(".edit_share").hide();
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
   $(document).on('change', '#landing_company', function() { 
                if($(this).val().length){       
                    $(".company_admin .client_side_validation_msg").hide();
                }
   });
   $(document).on('keyup', '.subject_validate', function() {
        var char = $('.subject_validate').val().length;
        if( char > 0){ 
           $(this).next("span").remove();
        }
    });
});

$(document).ready(function(){
    if(extractUrlParam(window.location.href, 'action') == 'reply'){
        $('.comment-area').focus().trigger('click');
    }
});