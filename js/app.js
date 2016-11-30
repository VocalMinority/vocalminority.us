(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-88115838-1', 'auto');
ga('send', 'pageview');

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

