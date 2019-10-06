var Jimp = require('jimp');
var path = require('path')
var async = require('async');

const arr = [];

for (let i = 1; i < 496; i++) {
  arr.push(i);
}

async.eachLimit(arr,1, (item, cb) => {
  Jimp.read(path.join(__dirname,'raws',`${item}-top.png`), (err, top) => {
    if (err) throw err;
    Jimp.read(path.join(__dirname,'raws',`${item}-right.png`), (err, right) => {
      if (err) throw err;
      Jimp.read(path.join(__dirname,'raws',`${item}-bottom.png`), (err, bottom) => {
        if (err) throw err;
        Jimp.read(path.join(__dirname,'raws',`${item}-left.png`), (err, left) => {
          if (err) throw err;
          const newwidth = left.bitmap.width + right.bitmap.width;
          const newHeight = Math.max(left.bitmap.height , right.bitmap.height) + top.bitmap.height + bottom.bitmap.height - 30;
          new Jimp(newwidth, newHeight , (err, image) => {
            if (err) throw err;
            image
            .blit(top,(newwidth-top.bitmap.width)/2,0)
            .blit(left.crop(0,10, left.bitmap.width, left.bitmap.height-10),0,top.bitmap.height)
            .blit(right.crop(0,10, right.bitmap.width, right.bitmap.height-10),left.bitmap.width,top.bitmap.height)
            .blit(bottom.crop(0,10, bottom.bitmap.width, bottom.bitmap.height-10),(newwidth-bottom.bitmap.width)/2,Math.max(left.bitmap.height , right.bitmap.height)+top.bitmap.height)
            .crop(0,10,newwidth,newHeight-10)
            .writeAsync(path.join(__dirname,'crops',`${item}-full.png`)).then(d=>{
              console.log(`${item} is finished`);
              cb();
            }); // save
          })
        });
      });
    });
  });
}, (err) => {
  console.log('finish ');
})