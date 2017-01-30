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

//$('#mc-embedded-subscribe-form input[type="email"]').on('change', function() {
//  var $email = $(this);
//  clearValidation($email) && validateEmailField($email);
//});
//$('#mc-embedded-subscribe-form input[name="AMOUNT"]').on('change', function() {
//  var $amount = $('#mc-embedded-subscribe-form input[name="AMOUNT"]');
//   clearValidation($amount) && validateAmountField($amount);
//});

$("#mc-embedded-subscribe-form").ajaxForm({
  beforeSubmit: function(arr, $form, options) {
    ga('send', 'event', {
      eventCategory: 'subscription',
      eventAction: 'submit',
      eventLabel: 'join flow',
    });

    return validateForm($form);
  },
  url: getAjaxSubmitUrl(),
  type: 'GET',
  dataType: 'json',
  success: function(resp) {
    if(resp.result === 'error') {
      var $email = $('#mc-embedded-subscribe-form input[type="email"]');
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
    var amount = $('input[name="AMOUNT"]:checked').val();
    $('#amount-to-donate').text('$' + amount);
    $('#mc-embedded-subscribe-form').addClass('hide');
    $('#confirmation').removeClass('hide').hide().fadeIn();
    window.scrollTo(0, $('#confirmation').offset().top - 30);

    ga('send', 'event', {
      eventCategory: 'subscription',
      eventAction: 'success',
      eventLabel: 'join flow',
      nonInteraction: true,
    });
  }
});
