$(document).foundation();

$('#mc-embedded-subscribe-form').on('submit', function() {
  $('[data-equalizer]').trigger('resizeme.zf.trigger')
});

// Wrap mailchimp callback to force resize
window.mc.ajaxOptions = {
  url: mc.getAjaxSubmitUrl(),
  type: 'GET',
  dataType: 'json',
  contentType: "application/json; charset=utf-8",
  success: function(resp) {
    mc.mce_success_cb(resp);
    $('[data-equalizer]').trigger('resizeme.zf.trigger')
  }
};
