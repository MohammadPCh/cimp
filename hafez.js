const fs = require('fs');
const path = require('path');
var Crawler = require("crawler");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const mongo = MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });
 
var c = new Crawler({
    maxConnections : 5,

    preRequest: function(options, done) {
      // 'options' here is not the 'options' you pass to 'c.queue', instead, it's the options that is going to be passed to 'request' module 
      console.log(new Date(),'Request Sent:',options.uri);
      // when done is called, the request will start
      done();
    },
    // rateLimit: 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {      
        let uri = res.options.uri
        console.log(new Date(),"Response Recieved:", uri);
        const url_temp = uri.split('/');
        const temp_id = url_temp[url_temp.length-2];
        const id = temp_id.substring(2);
        // console.log('url_temp :', url_temp);

        if(error){
            mongo.then(db=>{
              var dbo = db.db("hafez");
              let sher = {};
              sher.id=id;
              dbo.collection("losts").insertOne(sher, function(err, res) {
                // if (err) throw err;
                console.log(new Date(),'sher error :', uri);
                done();
                // db.close();
              });
            });
        }else{
            let sher = {};
            sher.beyts = [];
            var $ = res.$;

            sher.id=id;

            const details = $('article .b')

            details.each(function(i, elem) {

              const beyt = $(this).text();
              // console.log('beyt :', beyt);
              const mesra1 = $('.m1 p', this).text();
              // console.log('mesra1 :', mesra1);
              const mesra2 = $('.m2 p', this).text();
              // console.log('mesra2 :', mesra2);

              sher.beyts.push([mesra1,mesra2])

            });


            // console.log('sher :', sher);

            if (sher.title === "") {
              mongo.then(db=>{
                var dbo = db.db("hafez");
                dbo.collection("empty").insertOne(sher, function(err, res) {
                  // if (err) throw err;
                  console.log(new Date(),'sher empty :', uri);
                  // db.close();
                  done();
                });
              });
            } else {
              mongo.then(db=>{
                var dbo = db.db("hafez");
                dbo.collection("shers").findOne({id}).then(b=>{
                  if (b) {
                    sher.updateTime = new Date();
                    dbo.collection("shers").updateOne({id}, { $set:sher }, function(err, res) {
                      if (err) throw err;
                      console.log(new Date(),'sher updated :', uri);
                      done();
                    });
                  } else {
                    sher.addTime = new Date();
                    dbo.collection("shers").insertOne(sher, function(err, res) {
                      // if (err) throw err;
                      if (err) {
                        console.log('err :', err);
                      }else {
                        console.log(new Date(),'sher inserted :', uri);
                      }
                      // db.close();
                      done();
                    });
                  }
                });
              }); 
            }
            // console.log('sher', sher)
        }
    }
});

c.queue('https://ganjoor.net/hafez/ghazal/sh1/');



c.on('drain',function(){
  console.log('#############################FINISH#############################');

  // For example, release a connection to database.
  mongo.then(db=>{
    db.close();// close connection to MySQL
  });
})
const tasks =[];
const j = 0;
for (let i = 1; i < 496; i++) {
  tasks[i] = `https://ganjoor.net/hafez/ghazal/sh${i+j}/`
}
c.queue(tasks);