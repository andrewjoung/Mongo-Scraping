// // Grab the articles as a json
// $.getJSON("/articles", function(data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//       // Display the apropos information on the page
//       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><a href='" + data[i].link+ "'>"+ data[i].link + "</a></p>");
//     }
//   });

  $(document).ready(function(){

    $.ajax("/scrape", {method: "GET"}).then(function(data) {
       // Grab the articles as a json
       console.log("scraping");

        $.getJSON("/articles", function(data) {
            // For each one
            for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
                $("#articles").append("<p class='articleTitles' data-id='" + data[i]._id + "'>" + data[i].title + "<br /><a href='" + data[i].link+ "'>"+ data[i].link + "</a></p>");
            }

        });

    });

    $(document).on('click', '.articleTitles', function() {

        $("#comments").empty();

        let articleId = $(this).attr('data-id');

        $.ajax({
            method: "GET",
            url:"/articles/" + articleId
        }).then(function(data) {
            console.log(data);

            $("#comments").append("<h2>" + data.title + "</h2>");
            $("#comments").append("<hr />");
            
            $("#comments").append("<div id='commentDiv'></div>")
            $("#comments").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#comments").append("<button class='btn btn-primary' data-id='" + data._id + "' id='saveComment'>Save Comment</button>");

            if(data.comments) {
                let commentTitle = $("<p>");
                commentTitle.text("Title: " + data.comments.title);
                commentTitle.addClass("commentTitle");

                let commentBody = $("<p>");
                commentBody.text(data.comments.body);

                $("#commentDiv").append(commentTitle).append(commentBody);
            }
        });
    });

    $(document).on('click', "#saveComment", function() {
        var articleId = $(this).attr("data-id");

        $.ajax({
            method:"POST",
            url:"/articles/" + articleId,
            data: {
                title: $("#titleinput").val(),
                body:$("#bodyinput").val()
            }
        }).then(function(data) {
            console.log(data);

            let commentTitle = $("<p>");
            commentTitle.text("Title: " + data.comments.title);
            commentTitle.addClass("commentTitle");

            let commentBody = $("<p>");
            commentBody.text(data.comments.body);

            $("#commentDiv").append(commentTitle).append(commentBody);

            $("#comments").empty();

        });
    })

    $("#titleinput").val("");
    $("#bodyinput").val("");


  });