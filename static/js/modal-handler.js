$(document).ready(function() {
  // When the user clicks on the link, show the modal.
  $("#myLink").click(function(event) {
      alert('clicked')
    event.preventDefault(); // Prevents the link from navigating to a new page
    $("#myModal").show();
  });

  // When the user clicks on the <span> (x), hide the modal.
  $(".close").click(function() {
    $("#myModal").hide();
  });

  // When the user clicks anywhere outside of the modal, hide it.
  $(window).click(function(event) {
    if ($(event.target).is("#myModal")) {
      $("#myModal").hide();
    }
  });
});