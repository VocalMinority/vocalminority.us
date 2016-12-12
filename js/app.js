$(document).foundation();


if(window.mc) {
  // Wrap mailchimp callback
  window.mc.ajaxOptions = {
    url: mc.getAjaxSubmitUrl(),
    type: 'GET',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: function(resp) {
      var amount = $('input[name="AMOUNT"]').val();
      window.location = '/donate.html?amount=' + amount;
    }
  };
}
