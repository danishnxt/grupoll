var plantuml = require('node-plantuml');
var fs = require('fs');
 
var gen = plantuml.generate("test.graph");
gen.out.pipe(fs.createWriteStream("output-file.png");