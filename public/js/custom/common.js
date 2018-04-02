var constants;
$.ajax({
  type: "GET",
  url: baseurl+'/public_constants',
  success: function( response ) {
    constants = response;
  }
});