$( document ).ready(function() {

  // GET REQUEST
  $("#allCustomers").click(function(event){
    event.preventDefault();
    ajaxGet();
  });

  // DO GET
  function ajaxGet(){
    $.ajax({
      type : "GET",
      url : window.location + "/sendTime1",
      success: function(result){
        $('#getResultDiv ul').empty();
        var custList = "";
        $.each(result, function(i, timetest){
          $('#getResultDiv .list-group').append(timetest.timeStart + " " + timetest.timeEnd + "<br>")
        });
        console.log("Success: ", result);
      },
      error : function(e) {
        $("#getResultDiv").html("<strong>Error</strong>");
        console.log("ERROR: ", e);
      }
    });
  }
})
