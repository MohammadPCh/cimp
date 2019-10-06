var fs = require('fs');
var path = require('path')
var Crawler = require('crawler')
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";
const mongo = MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true });

 
// const PATH = path.join(__dirname,'raws')

var c = new Crawler({
    encoding:null,
    jQuery:false,   // set false to suppress warning message.
    method: "POST",
    rateLimit: 5,

    callback:function(err, res, done){
        if(err){
            console.error(err.stack);
        }else{
            fs.createWriteStream(path.join(__dirname,'raws',res.options.filename)).write(res.body);
        }
        
        done();
    }
});
 
// c.queue({
//     uri:"http://nastaliqonline.ir/NastaliqOnline.ir.aspx",
//     filename:"1.png",
//     formData : {
//         text: "\r\nسلام|خوبی؟\r\nقربانت|توخوبی؟",
//         size: 50,
//         coli: 0,
//         png: 1,
//         rgb: "#000000",
//         tazhiblist:	0,
//         x:	120,
//         y:	1,
//     },
// });

function findDocuments(db, callback) {
    // Get the documents collection
    const collection = db.collection('shers');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
    //   assert.equal(err, null);
    //   console.log("Found the following records");
    //   console.log(docs)
      callback(docs);
    });
  }


function print(docs) {
    const tasks = [];
    // console.log('docs :', docs);
    for (let i = 0; i < docs.length; i++) {
        const sher = docs[i];
        if (sher.beyts.length < 1 ) {
            continue;
        }
        // const matn = sherToMatn(sher);
        const matn = sherTo2ColAnd1(sher);
        console.log('matn :', matn);
        tasks.push({
            uri:"http://nastaliqonline.ir/NastaliqOnline.ir.aspx",
            filename: `${sher.id}-top.png`,
            formData : {
                text: matn.top,
                size: 50,
                coli: 0,
                png: 1,
                rgb: "#000000",
                tazhiblist:	0,
                x:	120,
                y:	1,
            },
        })
        tasks.push({
                uri:"http://nastaliqonline.ir/NastaliqOnline.ir.aspx",
                filename: `${sher.id}-right.png`,
                formData : {
                    text: matn.right,
                    size: 50,
                    coli: 0,
                    png: 1,
                    rgb: "#000000",
                    tazhiblist:	0,
                    x:	120,
                    y:	1,
                },
            })
        tasks.push({
            uri:"http://nastaliqonline.ir/NastaliqOnline.ir.aspx",
            filename:`${sher.id}-left.png`,
            formData : {
                text: matn.left,
                size: 50,
                coli: 0,
                png: 1,
                rgb: "#000000",
                tazhiblist:	0,
                x:	120,
                y:	1,
            },
        })
        tasks.push({
            uri:"http://nastaliqonline.ir/NastaliqOnline.ir.aspx",
            filename: `${sher.id}-bottom.png`,
            formData : {
                text: matn.bottom,
                size: 50,
                coli: 0,
                png: 1,
                rgb: "#000000",
                tazhiblist:	0,
                x:	120,
                y:	1,
            },
        })
    }

    c.queue(tasks);
}


mongo.then(db=> {
    var dbo = db.db("hafez");
    findDocuments(dbo,print);
})

function sherToMatn({beyts, id}) {
    const matn = beyts.reduce((acc,beyt)=>{
        return acc + '\r\n' + beyt[0] + '|' + beyt[1]
    },`\r\nغزل شماره ${toPerNummber(id)}`)
    // console.log('matn :', matn);
    return matn;
}

function sherTo2Col({beyts, id}) {
    const right = beyts.reduce((acc,beyt)=>{
        return acc + '\r\n' + beyt[0] + '/'
    },'')
    const left = beyts.reduce((acc,beyt)=>{
        return acc + '\r\n' + beyt[1] + '/'
    },'')
    // console.log('matn :', matn);
    return {right,left};
}


function sherTo2ColAnd1({beyts, id}) {
    const top = `\r\nغزل شماره ${toPerNummber(id)}/`;
    const end = beyts.pop();
    const right = beyts.reduce((acc,beyt)=>{
        return acc + '\r\n' + beyt[0] + '/'
    },'')
    const left = beyts.reduce((acc,beyt)=>{
        return acc + '\r\n' + beyt[1] + '/'
    },'')
    const bottom = end[0] + '/' +'\r\n' + end[1] + '/' + '\r\n';
    // console.log('matn :', matn);
    return {top, right, left, bottom};
}

function toPerNummber(str) {
    let sign = 1;
    if (str < 0) {
       sign = -1; 
    }
    const res = toPerNum(sign * str);
    return sign == 1 ? res : '-'+res;

}

function toPerNum(str) {
    const perNum = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
    let num = +str;
    if (num < 10) {
        return perNum[num]
    } else {
        return toPerNum(Math.floor(num/10)) + perNum[num%10];
    }
}

c.on('drain',function(){
    console.log('#############################FINISH#############################');
  
    // For example, release a connection to database.
    mongo.then(db=>{
      db.close();// close connection to MySQL
    });
  })