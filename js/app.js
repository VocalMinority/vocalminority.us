$(document).foundation();


if(window.mc) {
  // Wrap mailchimp callback
  window.mc.ajaxOptions = {
    url: mc.getAjaxSubmitUrl(),
    type: 'GET',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: function(resp) {
      resp.msg = "Thanks for joining! Check your inbox to confirm your membership. If you don't get one in the next few minutes, email hello@vocalminority.us and we'll get you on the list.";
      mc.mce_success_cb(resp);
      $('[data-hide-on-success]').hide();
    }
  };
}
