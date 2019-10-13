$(document).ready(function() {
  $("#add-beer-btn").on("click", () => {
    cwindow.location.replace("/admin/addBeer");
  });
  $(".add-Beer-btn").on("click", () => {
    event.preventDefault();
    console.log("click");
    let dataObj = {
      name: $("#beer-name").val(),
      type: $("#beer-type").val(),
      description: $("#beer-description").val(),
      brewrey: $("#brewrey").val()
    };
    postBeer(dataObj);
    window.location.href = "/";
  });
  $(".find-Beer-btn").on("click", () => {
    let beerId = $("#delete-options").val();
    $.get("/api/beer/" + beerId, result => {
      $(".warning-text").detach();
      if (result === null) {
        $(".warning-text").remove();
        let domString = "<p class='warning-text'> InvalidItem</p>";
        $(domString).appendTo(".main-body");
      } else {
        appendBeer(result);
      }
    });
  });
  $(".search-zone").on("click", "#delete-confirm", () => {
    warningDiv();
  });
  $(".search-zone").on("click", "#delete-no", () => {
    window.location.href = "/";
  });
  $(".search-zone").on("click", "#delete-yes", () => {
    deleteBeer($(".search-zone").data("beerId"));
    $(".search-zone").empty();
    let domString = "<p class='warning-text'> Item removed returning home!</p>";
    $(domString).appendTo(".search-zone");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  });
});
function postBeer(modalObj) {
  $.post("/api/beer", modalObj);
}
function appendBeer(beer) {
  //wanted to try out template literals
  let domString = `<div class="row">
                    <div class="col s12">
                        <div class="beer-info">
                            <div class="beer-body" data-id=${beer.id}>
                                <p><strong>Beer Name: </strong>${beer.beer_name}<br>
                                    <strong>Type: </strong>${beer.beer_type}<br></p>
                                <p><strong>Average Rating: </strong>
                                    <div class="stars"></div>
                                </p>
                                <p>${beer.beer_description}</p>
                            </div>
                        </div>
                        <a id="delete-confirm" class="waves-effect waves-light btn-small">Delete This!</a>
                    </div>
                </div>`;
  $(domString).appendTo(".search-zone");
  $(".search-zone").data("beerId", beer.id);
}
function warningDiv() {
  console.log("click");
  let domString = `<div class="row">
                        <div class="col s12">
                            <div class="beer-info">
                                <p class="warning-text"><strong>WARNING YOU ARE ABOUT TO DELETE THIS ITEM FROM
                                OUR DATABASE ARE YOU SURE YOU WANT TO CONTINUE?                            
                            </div>
                        <a id="delete-no" class="waves-effect waves-light btn-small">GO BACK</a>
                        <a id="delete-yes" class="waves-effect waves-light btn-small">DELETE</a>
                        </div>
                    </div>`;
  $(".search-zone").empty();
  $(domString).appendTo(".search-zone");
}
function deleteBeer(id) {
  $.ajax({
    url: "/api/beer/" + id,
    method: "DELETE"
  }).then(result => {});
}
