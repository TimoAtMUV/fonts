// ======================================================== //
// USAGE:                                                   //
//    $ node fnt2xml.js 'path/to/font.fnt'                  //
//      Converts the specified file to a fnt xml            //
//                                                          //
//    $ node fnt2xml.js 'path/to/fonts/dir'                 //
//      Converts all the .fnt files to fnt xml              //
// ======================================================== //


const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.log('You must provide a file');
  return;
}

const inputPath = process.argv[2];
const stat = fs.lstatSync(inputPath);

if (stat.isDirectory())
  fs.readdirSync(inputPath)
    .filter(file => file.endsWith('.fnt') && !file.endsWith('.xml.fnt'))
    .forEach(file => convert(path.join(inputPath, file)));
else if (stat.isFile())
  convert(inputPath);
else
  console.log('Give path is not a directory nor a file');

console.log('done');

// == END OF THE SCRIPT == //


function convert(file) {
  let buffer = fs.readFileSync(file, { encoding: 'utf-8' });
  buffer = buffer.replace(/=([^"\s]+)/gm, `="$1"`);

  lines = buffer.split('\n');
  let result = '<font>\n';
  lines.forEach(line => {
    line = line.trim();
    if (line.length <= 0) return;
    if (line.startsWith('page')) {
      result += '<pages>\n<' + line + '/>\n</pages>\n'
      return;
    }

    if (line.startsWith('chars')) {
      result += '<' + line + '>\n';
      return;
    }
    result += '<' + line + '/>\n';
  });

  result += '</chars>\n</font>'

  fs.writeFileSync(file.replace('.fnt', '.xml.fnt'), result, { encoding: 'utf-8' });
}