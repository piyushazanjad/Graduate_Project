var express = require("express");
var app = express();
var router = express.Router();
var bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(express.static('.'));



var MongoClient = require('mongodb').MongoClient
var URL = 'mongodb://localhost:27017/mydb'
var count;

app.get("/movie", function(request, response) {

    MongoClient.connect(URL, function(err, db) {
        var collection = db.collection('movies');
        collection.find().toArray(function(err, docs) {
            console.log(docs);
            response.send(docs);
            db.close();
        });
    });
});




app.post("/users", function(request, response) {

    MongoClient.connect(URL, function(err, db) {
        if (err) return
        var collection = db.collection('users');
        collection.insert(request.body, function(err, result) {

  });
                collection.find().toArray(function(err, docs) {
                    console.log(docs);
                    response.send(docs);
                    db.close();
                });          
        });

});

app.post("/movie", function(request, response) {

console.log(request.body.showtime);

var ticket = request.body.ticket;
console.log(ticket);
console.log(ticket.movieName);
console.log(ticket.theater);
console.log(ticket.showtime);
    
    MongoClient.connect(URL, function(err, db) {
        if (err) return
        var collection = db.collection('movies');
        collection.findAndModify( 
            {   "movie_title": ticket.movieName, 
            "theaters.theater_name": ticket.theater,
            "theaters.show_timings.time": ticket.showtime 
        } ,  [], 
     
         { $set : { "theaters.$.show_timings": request.body.showtime }},
          { new:true } , function(err, result) {
      response.send(result);
            });
        });
        
        
 
});


app.get("/user_login/:username", function(request, response) {

//console.log(request.params._id);
//console.log(request.body);
    MongoClient.connect(URL, function(err, db) {
        var collection = db.collection('users');
        collection.find({"username":request.params.username}).toArray(function(err, docs) {
            console.log(docs);
           
            db.close();
            response.send(docs);
           // response.send()
        });
    });
});

app.post("/movies", function(request, response) {

    MongoClient.connect(URL, function(err, db) {
        if (err) return
        var collection = db.collection('movies');
        collection.insert(request.body, function(err, result) {

  });
                collection.find().toArray(function(err, docs) {
                    console.log(docs);
                    response.send(docs);
                    db.close();
                });          
        });

});


app.listen(3000, function() {
    console.log("Example app listening on port 3000");
});