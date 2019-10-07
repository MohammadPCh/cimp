var Jimp = require('jimp');
var path = require('path')

// Jimp.read(path.join(__dirname,'crops','1-full.png'), (err, sher) => {
//         Jimp.read('template.jpg', (err,template ) => {
//             template
//             .composite(sher.autocrop().contain(1400,2000), 535,465, [Jimp.BLEND_DESTINATION_OVER, 0.2, 0.2])
//             .write(path.join(__dirname,'finals','1-final.png'));
//     });
// });

var async = require('async');

const arr = [];

for (let i = 1; i < 496; i++) {
  arr.push(i);
}

async.eachLimit(arr,1, (item, cb) => {
    Jimp.read(path.join(__dirname,'crops',`${item}-full.png`), (err, sher) => {
        Jimp.read('template1.jpg', (err,template ) => {
            Jimp.read('logo.png', (err,logo ) => {
                template
                .composite(sher.autocrop().contain(1920,2500, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_TOP ), 270,670, [Jimp.BLEND_DESTINATION_OVER, 0.2, 0.2])
                .contain(900,1280)
                .composite(logo.contain(50,50), 425,1180, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                    opacitySource: 0.8,
                    opacityDest: 1
                })
                .quality(60)
                .writeAsync(path.join(__dirname,'finals',`${item}-final1.png`)).then(d=>{
                    console.log(`${item} finished`);
                    cb();
                });
            });
        });
    });
}, (err) => {
    if (err) {
        console.log('err :', err);
    }
    console.log('finish ');
})