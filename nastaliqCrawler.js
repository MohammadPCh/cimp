var fs = require('fs');
var path = require('path')
var Crawler = require('Crawler')
 
// const PATH = path.join(__dirname,'raws')

var c = new Crawler({
    encoding:null,
    jQuery:false,   // set false to suppress warning message.
    method: "POST",
    formData : {
        text: "\r\nسلام|خوبی؟\r\nقربانت|توخوبی؟",
        size: 50,
        coli: 0,
        png: 1,
        rgb: "#000000",
        tazhiblist:	0,
        x:	120,
        y:	1,
    },
    callback:function(err, res, done){
        if(err){
            console.error(err.stack);
        }else{
            fs.createWriteStream(path.join(__dirname,'raws',res.options.filename)).write(res.body);
        }
        
        done();
    }
});
 
c.queue({
    uri:"http://nastaliqonline.ir/NastaliqOnline.ir.aspx",
    filename:"1.png"
});