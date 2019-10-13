$(window).on("load", () => {
  $("#signupbutton").on("click", function(event) {
    event.preventDefault();
    function validateForm() {
      var isValid = true;
      $(".validate").each(function() {
        if ($(this).val() === "") {
          isValid = false;
        }
      });
      return isValid;
    }

    if (validateForm()) {
      var newUser = {
        username: $("#username").val(),
        email: $("#useremail").val(),
        password: $("#userpassword").val()
      };
      $.post("/api/newUser", newUser, function(result) {
        window.location.href = "/";
      }).catch(() => {
        $(".warning-text").remove();
        let err = "<p class='warning-text'>INVALID CREDTENTIALS PLEASE REVIEW</p>";
        $(err).appendTo(".signup");
      });
    } else {
      $(".warning-text").remove();
      let err = "<p class='warning-text'>PLEASE FILL OUT ALL FIELDS!</p>";
      $(err).appendTo(".signup");
    }
  });
});
