$('.mail_body').autosize()
   $(document).ready(function(){
    $(".search_form").hide();
    $("#search_auto").show();
        $("form").validate();
        $(document).on('submit', '.search_form', function () {
          $("#search_auto").rules("add", {
            required: true,
            messages: {
                required: "Search field can not be empty"
            }
        });
        if (!$("form").valid()) {
            return false;
        }
        });
        $("#myModalInvite").on('hide.bs.modal', function(){
          location.reload();
        });
        $("input[name=first_name]").on('change, keyup paste input',function() {
              $(".mailbody").find('span').eq(0).show();
              $(".mailbody").find('span').eq(1).html(' '+$(this).val()+',' );
         });
         $(".mailbody").on('focus', function() {
           $('.mail_body').get(0).selectionStart = $('.mail_body').html().length;
           $('.mail_body').get(0).selectionEnd = $('.mail_body').html().length;
           $('.mail_body').focus();
         });
        });
   $(".invite-btn").click(function() {
   $(".mail_body").height(140);
});
   
   
   $(window).bind('scroll', function() {
       if($(window).scrollTop() >= $('.community_inner_content').offset().top + $('.community_inner_content').outerHeight() - window.innerHeight) {
   /*if($(window).scrollTop() + $(window).height() == $(document).height()) {*/
         //alert($(window).scrollTop() + $(window).height());
   
         var next_div_id = $("#next_div").val();
         //alert(next_div_id);
         $("."+next_div_id).fadeIn(); 
         var div_explode = next_div_id.split("_");
         var upcoming_div_count = parseInt(div_explode[1]) + parseInt(1);
         //alert(upcoming_div_count);
         var upcoming_div_class = "show_"+upcoming_div_count;
         $("#next_div").val(upcoming_div_class);
      }
   });

   $( ".search_icon_blue" ).on( "click", function() {
     $( ".search_form" ).toggle();
     $("#search_auto").focus();
   });

   $('#myModal0').on('shown.bs.modal', function () {
   $('#myInput').focus()
   });

   !function(e){var t=function(t,n){this.$element=e(t),this.type=this.$element.data("uploadtype")||(this.$element.find(".thumbnail").length>0?"image":"file"),this.$input=this.$element.find(":file");if(this.$input.length===0)return;this.name=this.$input.attr("name")||n.name,this.$hidden=this.$element.find('input[type=hidden][name="'+this.name+'"]'),this.$hidden.length===0&&(this.$hidden=e('<input type="hidden" />'),this.$element.prepend(this.$hidden)),this.$preview=this.$element.find(".fileupload-preview");var r=this.$preview.css("height");this.$preview.css("display")!="inline"&&r!="0px"&&r!="none"&&this.$preview.css("line-height",r),this.original={exists:this.$element.hasClass("fileupload-exists"),preview:this.$preview.html(),hiddenVal:this.$hidden.val()},this.$remove=this.$element.find('[data-dismiss="fileupload"]'),this.$element.find('[data-trigger="fileupload"]').on("click.fileupload",e.proxy(this.trigger,this)),this.listen()};t.prototype={listen:function(){this.$input.on("change.fileupload",e.proxy(this.change,this)),e(this.$input[0].form).on("reset.fileupload",e.proxy(this.reset,this)),this.$remove&&this.$remove.on("click.fileupload",e.proxy(this.clear,this))},change:function(e,t){if(t==="clear")return;var n=e.target.files!==undefined?e.target.files[0]:e.target.value?{name:e.target.value.replace(/^.+\\/,"")}:null;if(!n){this.clear();return}this.$hidden.val(""),this.$hidden.attr("name",""),this.$input.attr("name",this.name);if(this.type==="image"&&this.$preview.length>0&&(typeof n.type!="undefined"?n.type.match("image.*"):n.name.match(/\.(gif|png|jpe?g)$/i))&&typeof FileReader!="undefined"){var r=new FileReader,i=this.$preview,s=this.$element;r.onload=function(e){i.html('<img src="'+e.target.result+'" '+(i.css("max-height")!="none"?'style="max-height: '+i.css("max-height")+';"':"")+" />"),s.addClass("fileupload-exists").removeClass("fileupload-new")},r.readAsDataURL(n)}else this.$preview.text(n.name),this.$element.addClass("fileupload-exists").removeClass("fileupload-new")},clear:function(e){this.$hidden.val(""),this.$hidden.attr("name",this.name),this.$input.attr("name","");if(navigator.userAgent.match(/msie/i)){var t=this.$input.clone(!0);this.$input.after(t),this.$input.remove(),this.$input=t}else this.$input.val("");this.$preview.html(""),this.$element.addClass("fileupload-new").removeClass("fileupload-exists"),e&&(this.$input.trigger("change",["clear"]),e.preventDefault())},reset:function(e){this.clear(),this.$hidden.val(this.original.hiddenVal),this.$preview.html(this.original.preview),this.original.exists?this.$element.addClass("fileupload-exists").removeClass("fileupload-new"):this.$element.addClass("fileupload-new").removeClass("fileupload-exists")},trigger:function(e){this.$input.trigger("click"),e.preventDefault()}},e.fn.fileupload=function(n){return this.each(function(){var r=e(this),i=r.data("fileupload");i||r.data("fileupload",i=new t(this,n)),typeof n=="string"&&i[n]()})},e.fn.fileupload.Constructor=t,e(document).on("click.fileupload.data-api",'[data-provides="fileupload"]',function(t){var n=e(this);if(n.data("fileupload"))return;n.fileupload(n.data());var r=e(t.target).closest('[data-dismiss="fileupload"],[data-trigger="fileupload"]');r.length>0&&(r.trigger("click.fileupload"),t.preventDefault())})}(window.jQuery)