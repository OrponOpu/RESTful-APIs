const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// Getting, creating, deleting all articles 

app.route("/article")

.get(function(req,res){
    Article.find(function(err, foundItems){
        if(!err){
            res.send(foundItems);
        }else{
            res.send("Successfully founded");
        }
    });
})

.post(function(req,res){

    const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
    });

        newArticle.save(function(err){
            if(!err){
                res.send("Successfully done it");
            }else{
                res.send(err);
            }
        });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deteled");
        }else{
            res.send(err);
        }
    });
});

// Getting, updating by put/patch, deleting single articles 

app.route("/article/:articleTitle")

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle}, function(err, articleOne){
        if(articleOne){
            res.send(articleOne);
        }else{
            res.send("No articles found");
        }
    });
})

.put(function(req,res){
    Article.replaceOne(
        {title: req.params.articleTitle},  //condition
        {title: req.body.title, content: req.body.content}, //update
        function(err){
            if(!err){
                res.send("Successfully updated");
            }else{
                res.send(err);
            }
        }
    );
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        req.body,
        function (err) { 
            if(!err){
                res.send("Successfully updated one document");
            }else{
                res.send(err);
            }
         }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted one item");
            }else{
                res.send(err);
            }
        }
    );
});

app.listen(3000, function(){
    console.log("Successfully connected to server 3000");
});