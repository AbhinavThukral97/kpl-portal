$(document).ready(function() {
  var menu = false;
  $(".menu").click(function() {
    if (menu) {
      $("header .links").css("max-height", "0px");
      menu = false;
    } else {
      $("header .links").css("max-height", "calc(100vh - 85px)");
      menu = true;
    }
  });

  $(".contact").click(function() {
    var i = $("footer").offset().top;
    $("body,html").animate({ scrollTop: i - 80 }, 1000);
  });
});
