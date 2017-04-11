// Convention: look up DOM elements by classnames prefixed with `vm-js-`, so we
// can easily see where and how the Javascript hooks into the HTML, as well as
// making those classnames easily searchable (no conflicts with other names).

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-88115838-1', 'auto');
ga('send', 'pageview');

$(document).foundation();

// Setup FAQ item toggling
$('.vm-js-faq-toggle').on('click', function() { $(this).toggleClass('vm-faq__list-item--opened'); });

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function addErrorMessage($elem, message) {
  $elem.addClass('vm-join__input-with-error').attr({'aria-invalid': true});
  $elem.parents('.vm-js-mc-error-container').append('<div class="vm-join__inline-error vm-js-mc-inserted-error">' + message + '</div>');
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
  if($amount.is(':checked')) {
    return true;
  } else {
    addErrorMessage($amount, "This field is required.");
    return false;
  }
}

function clearValidation($elem) {
  $elem.removeClass('vm-join__input-with-error').attr({'aria-invalid': false});
  $elem.parents('.vm-js-mc-error-container').find('.vm-js-mc-inserted-error').detach();
  return true;
}

function validateForm($form) {
  var $email = $form.find('.vm-js-mc-email');
  var $amount = $form.find('.vm-js-mc-amount');
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
  var url = $(".vm-js-mc-embedded-subscribe-form").attr("action");
  if(url) {
    url = url.replace("/post?u=", "/post-json?u=");
    url += "&c=?";
  }
  return url;
}

$('.vm-js-mc-submit-button').click(function(event) {
  event.preventDefault();
  event.stopPropagation();
  mcFormAjaxSubmit(function(resp){ onMailchimpSuccess(resp, paypalSubscription) });
});

$('.vm-js-mc-one-time-submit-button').click(function(event) {
  event.preventDefault();
  event.stopPropagation();
  mcFormAjaxSubmit(function(resp){ onMailchimpSuccess(resp, paypalOneTimeDonation) });
});

function mcFormAjaxSubmit(callback) {
  $(".vm-js-mc-embedded-subscribe-form").ajaxSubmit({
    beforeSubmit: function(arr, $form, options) {
      var $email = $form.find('.vm-js-mc-email');
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
    var level = $('.vm-js-mc-amount:checked').data('paypal-level');
    $('.vm-js-paypal-level').val(level);
  }

  $('.vm-js-paypal-subscribe-form').submit();
}

function onMailchimpSuccess(resp, paypalAction) {
  var $email = $('.vm-js-mc-email');
  if(resp.result === 'error') {
    mixpanel.track('mailchimp submit error', {message: resp.msg});

    if(resp.msg.match(/is already subscribed/) ||
       resp.msg.match(/too many recent signup requests/)) {
      // No-op for emails that are already subscribed
    } else {
      addErrorMessage($email, resp.msg)
      window.scrollTo(0, $('.vm-js-mc-embedded-subscribe-form').offset().top - 30);

      ga('send', 'event', {
        eventCategory: 'subscription',
        eventAction: 'submissionError',
        eventLabel: 'join flow',
        nonInteraction: true,
      });

      return;
    }
  }

  var amount = $('.vm-js-mc-amount:checked').val();
  $('.vm-js-mc-submit-button').text("Loading...");

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
    $('.vm-js-mc-email').val(email).prop('readonly', true);
  }
  if (amount = getUrlParameter('amount')){
    $('.vm-js-mc-amount[value='+amount+']').selected(true);
  }
  if (firstName = getUrlParameter('first_name')){
    $('.vm-js-mc-first-name').val(firstName).prop('readonly', true);
    $('.vm-js-mc-greeting-first-name').html(firstName);
  }
  if (lastName = getUrlParameter('last_name')){
    $('.vm-js-mc-last-name').val(lastName).prop('readonly', true);
  }

  if (email && firstName && lastName && amount) {
    $('.vm-js-mc-existing-members').removeClass('hide');
    $('.vm-js-mc-all-members').addClass('hide');
  }
})
