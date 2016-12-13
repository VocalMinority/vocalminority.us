$(document).foundation();


if(window.mc) {
  // Wrap mailchimp callback
  window.mc.ajaxOptions = {
    url: mc.getAjaxSubmitUrl(),
    type: 'GET',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    success: function(resp) {
      var amount = $('input[name="AMOUNT"]:checked').val();
      $('#amount-to-donate').text('$' + amount);
      $('#mc-embedded-subscribe-form').addClass('hide');
      $('#confirmation').removeClass('hide').hide().fadeIn();
      window.scrollTo(0, $('#confirmation').offset().top - 30);
    }
  };
}
