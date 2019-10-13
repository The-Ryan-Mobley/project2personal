$(document).ready(function() {
  //initialize login modal
  $(".modal").modal();
  $(".sidenav-trigger").on("click", () => {
    $(".login-modal").modal("open");
  });
  $(".login-modal-trigger").on("click", () => {
    $(".login-modal").modal("open");
  });
  $(".modal-close").on("click", () => {
    $(".modal").modal("close");
  });
  $(".modal-login").on("click", event => {
    event.preventDefault();
    let userInfo = {
      userName: $("#name").val(),
      password: $("#pass").val()
    };
    $.post("/login", userInfo, (response, status) => {
      $(".modal").modal("close");
      window.location.href = "/";
    }).catch(() => {
      $(".warning-text").remove();
      let err = "<p class='warning-text'>INVALID USERNAME OR PASSWORD</p>";
      $(err).appendTo(".modal");
    });
  });
});
