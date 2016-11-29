$(document).foundation();


if(window.mc) {
  // Wrap mailchimp callback
  window.mc.ajaxOptions = {
    url: mc.getAjaxSubmitUrl(),
    type: 'GET',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: function(resp) {
      resp.msg = "Thanks for joining! Check your email to confirm your membership.";
      mc.mce_success_cb(resp);
      $('[data-hide-on-success]').hide();
    }
  };
}
