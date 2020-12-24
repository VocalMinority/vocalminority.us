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
