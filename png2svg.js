const ImageTracer = require("imagetracerjs");
const fs = require("fs");

// This example uses https://github.com/arian/pngjs
// , but other libraries can be used to load an image file to an ImageData object.
var PNGReader = require("pngjs");

// Input and output filepaths / URLs
var infilepath = "./src/styles/images/airlines/";
var outfilepath = "./public/images/airlines/";

fs.readdir(infilepath, (err, files) => {
  files.forEach(file => {
    fs.readFile(
      infilepath + file,

      function(err, bytes) {
        // fs.readFile callback
        if (err) {
          console.log(err);
          throw err;
        }

        var reader = new PNGReader(bytes);
        var fileName = file.split(".");
        reader.parse(function(err, png) {
          // PNGReader callback
          if (err) {
            console.log(err);
            throw err;
          }

          // creating an ImageData object
          var myImageData = {
            width: png.width,
            height: png.height,
            data: png.pixels
          };

          // tracing to SVG string
          var options = { scale: 5 }; // options object; option preset string can be used also

          var svgstring = ImageTracer.imagedataToSVG(myImageData, options);

          // writing to file
          fs.writeFile(outfilepath + fileName[0] + ".svg", svgstring, function(
            err
          ) {
            if (err) {
              console.log(err);
              throw err;
            }
            console.log(outfilepath + " was saved!");
          });
        }); // End of reader.parse()
      } // End of readFile callback()
    ); // End of fs.readFile()
  });
});
