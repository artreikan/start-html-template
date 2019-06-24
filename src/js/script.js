$(document).ready(function() {
  $(".hamburger").on("click", function(e) {
    e.preventDefault();
    $(this).toggleClass("hamburger--active");
    $(this)
      .parent()
      .find(".menu__list")
      .toggleClass("menu__list--active");
  });
});
