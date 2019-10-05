var Jimp = require('jimp');
var path = require('path')

Jimp.read(path.join(__dirname,'crops','1-cp.png'), (err, sher) => {
        Jimp.read('template.jpg', (err,template ) => {
            template
        .composite(sher, 50,-200, [Jimp.BLEND_DESTINATION_OVER, 0.2, 0.2])
        .write(path.join(__dirname,'finals','1-final.png'));
    });
});