$( document ).ready(function() {

  // SUBMIT FORM
    $("#customerForm").submit(function(event) {
    // Prevent the form from submitting via the browser.
    event.preventDefault();
    ajaxPost();
  });


    function ajaxPost(){

      // PREPARE FORM DATA
      var formData = {
        firstname : $("#timeStart").val(),
        lastname :  $("#timeEnd").val()
      }

      // DO POST
      $.ajax({
      type : "POST",
      contentType : "application/json",
      url : window.location + "/sendTime",
      data : JSON.stringify(formData),
      dataType : 'json',
      success : function(timetest) {
        $("#postResultDiv").html("Post Successfully! <br>" +
          "--->" + JSON.stringify(timetest)+ "</p>");
      },
      error : function(e) {
        alert("Error!")
        console.log("ERROR: ", e);
      }
    });

      // Reset FormData after Posting
      resetData();

    }

    function resetData(){
      $("#timeStart").val("");
      $("#endStart").val("");
    }
})
