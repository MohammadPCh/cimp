var Jimp = require('jimp');
var path = require('path')

 
// open a file called "lenna.png"
Jimp.read(path.join(__dirname,'raws','1.png'), (err, lenna) => {
  if (err) throw err;
  console.log(lenna.bitmap.width);
  
  lenna
    .crop(0,20,lenna.bitmap.width,lenna.bitmap.height-20)
    .write(path.join(__dirname,'crops','1-cp.png')); // save
});