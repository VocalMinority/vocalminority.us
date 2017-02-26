(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-88115838-1', 'auto');
ga('send', 'pageview');

$(document).foundation();

// Setup FAQ item toggling
$('.toggle').on('click', function() { $(this).toggleClass('closed'); });

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function addErrorMessage($elem, message) {
  $elem.addClass('mce_inline_error').attr({'aria-invalid': true});
  $elem.parents('.mc-field-group').append('<div class="mce_inline_error">' + message + '</div>');
}

function validateEmailField($email) {
  var email = $email.val();
  if(email.length) {
    if(validateEmail(email)) {
      return true;
    } else {
      addErrorMessage($email, "Invalid email address, please double check and try again.");
    }
  } else {
    addErrorMessage($email, "This field is required.");
  }
  return false;
}

function validateAmountField($amount) {
  if(($amount).is(':checked')) {
    return true;
  } else {
    addErrorMessage($amount, "This field is required.");
    return false;
  }
}

function clearValidation($elem) {
  $elem.removeClass('mce_inline_error').attr({'aria-invalid': false});
  $elem.parents('.mc-field-group').find('div.mce_inline_error').detach();
  return true;
}

function validateForm($form) {
  var $email = $form.find('[type="email"]');
  var $amount = $form.find('input[name="AMOUNT"]');
  var valid = true;

  clearValidation($email) && clearValidation($amount);
  valid = validateEmailField($email);
  valid = validateAmountField($amount) && valid;

  if (!valid) {
    ga('send', 'event', {
      eventCategory: 'subscription',
      eventAction: 'validationError',
      eventLabel: 'join flow',
      nonInteraction: true,
    });
  }

  return valid;
}

// Pulled straight from http://s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js
function getAjaxSubmitUrl() {
  var url = $("form#mc-embedded-subscribe-form").attr("action");
  if(url) {
    url = url.replace("/post?u=", "/post-json?u=");
    url += "&c=?";
  }
  return url;
}

$('#mc-submit-button').click(function(event) {
  event.preventDefault();
  event.stopPropagation();
  mcFormAjaxSubmit(function(resp){ onMailchimpSuccess(resp, paypalSubscription) });
});

$('#mc-one-time-submit-button').click(function(event) {
  event.preventDefault();
  event.stopPropagation();
  mcFormAjaxSubmit(function(resp){ onMailchimpSuccess(resp, paypalOneTimeDonation) });
});

function mcFormAjaxSubmit(callback) {
  $("#mc-embedded-subscribe-form").ajaxSubmit({
    beforeSubmit: function(arr, $form, options) {
      var $email = $form.find('input[type="email"]');
      ga('send', 'event', {
        eventCategory: 'subscription',
        eventAction: 'submit',
        eventLabel: 'join flow',
      });
      if ($email.val()) {
        mixpanel.identify($email.val());
        mixpanel.people.set({ "$email": $email.val() });
      }
      mixpanel.track('submit');

      return validateForm($form);
    },
    url: getAjaxSubmitUrl(),
    type: 'GET',
    dataType: 'json',
    success: callback
  });
}

function paypalOneTimeDonation() {
  window.location = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=MJWWTPT76CQ5J';
}

function paypalSubscription(amount) {
  if (amount) {
    var level = $('#mc-embedded-subscribe-form input[name="AMOUNT"]:checked').data("paypal-level");
    $('#paypal-subscribe-form input[name="os0"]').val(level);
  }

  $('#paypal-subscribe-form').submit();
}

function onMailchimpSuccess(resp, paypalAction) {
  var $email = $('#mc-embedded-subscribe-form input[type="email"]');
  if(resp.result === 'error') {
    if(resp.msg.match(/is already subscribed/)) {
      // No-op for emails that are already subscribed
    } else {
      addErrorMessage($email, resp.msg)
      window.scrollTo(0, $('#mc-embedded-subscribe-form').offset().top - 30);

      ga('send', 'event', {
        eventCategory: 'subscription',
        eventAction: 'submissionError',
        eventLabel: 'join flow',
        nonInteraction: true,
      });

      return;
    }
  }

  var amount = $('input[name="AMOUNT"]:checked').val();
  $('#mc-submit-button').text("Loading...");

  ga('send', 'event', {
    eventCategory: 'subscription',
    eventAction: 'success',
    eventLabel: 'join flow',
    nonInteraction: true,
  });
  mixpanel.identify($email.val());
  mixpanel.people.set({ "$email": $email.val() });
  mixpanel.track('mailchimp success');

  paypalAction(amount);
}

// Pre-fill form values
function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

$(function() {
  var email, firstName, lastName, amount;
  if (email = getUrlParameter('email')){
    $('input[name=EMAIL]').val(email).prop('readonly', true);
  }
  if (amount = getUrlParameter('amount')){
    $('input[value='+amount+']').selected(true);
  }
  if (firstName = getUrlParameter('first_name')){
    $('input[name=MERGE1]').val(firstName).prop('readonly', true);
    $('#greeting-first-name').html(firstName);
  }
  if (lastName = getUrlParameter('last_name')){
    $('input[name=MERGE2]').val(lastName).prop('readonly', true);
  }

  if (email && firstName && lastName && amount) {
    $('.alert-message.existing-members').removeClass('hide');
    $('.alert-message.all-members').addClass('hide');
  }
})
