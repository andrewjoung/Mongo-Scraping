const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

const db = require('./models');

let PORT = process.env.PORT || 9800;

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.get('/scrape', function(req, res) {

    axios.get("https://www.seattletimes.com").then(function(response) {

        let $ = cheerio.load(response.data);
        
        //console.log($);
        $("div.top-story-content").each(function(i, element) {
            let result = {};

            result.title = $(this).children('h2.top-story-title').children('a').text();
            result.link = $(this).children('h2.top-story-title').children('a').attr('href');

            console.log("alsdjflkaf");

            db.Article.find({title: result.title}).then(function(articles) {

                console.log("found articles1 :" + articles);

                if(articles.length === 0) {
                    db.Article.create(result).then(function(dbArticle) {
                        console.log(dbArticle);
                    }).catch(function(err) {
                        if (err) throw err;
                    });
                }

            }).catch(function(err){
                if (err) throw err;
            });
        });

        $("div.story-list").children('ul').children('li').each(function(i, element) {
            let result = {}

            result.title = $(this).children('a').text();
            result.link = $(this).children('a').attr('href');

            db.Article.find({title: result.title}).then(function(articles) {

                console.log("found articles:" + articles);

                if(articles.length === 0) {
                    db.Article.create(result).then(function(dbArticle) {
                        console.log(dbArticle);
                    }).catch(function(err) {
                        if (err) throw err;
                    });
                }

            }).catch(function(err) {
                if (err) throw err;
            });
        });
    });
});

app.get('/articles', function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});