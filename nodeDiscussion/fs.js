const fs = require('fs');
const path = require('path');

// create a file
// fs.writeFile( 'file.txt', 'hello world', (err) => {
//     if(err) throw err;
//     console.log("data written to file");
// })
// // add content to the file
// fs.appendFile('file.txt', 'some more text', (err) => {
//     if(err) throw err;
//     console.log("data appended to file");
// })
// // read the file
// fs.readFile('file.txt', (err, data) => {
//     if(err) throw err;
//     console.log(data.toString());
// })
// // create a directory
// fs.mkdir('newDir', (err) => {
//     if(err) throw err;
//     console.log("Directory created");
// })
// // create another directory
// fs.mkdir(path.join(__dirname,'newDir2'), (err) => {
//     if(err) throw err;
//     console.log("Directory created");
// })

// copy files from modules folder in the current folder
// const copyFrom = path.join(__dirname,'../','models','bookingModel.js');
// const destPath = path.join(__dirname,'bookingModelCopy.js');

// fs.copyFile(copyFrom, destPath, (err) => {
//     if(err) throw err;
//     console.log("File copied");
// })

const filePath = path.join(__dirname,'big.file');
console.log(filePath);
const readableSteam = fs.createReadStream(filePath);
const writableStream = fs.createWriteStream('anotherCopyOfBig.file');
// readableSteam.on('data', (chunk) => {
//     console.log(`Received ${chunk.length} bytes of data.`)
//     // console.log(chunk.toString());
//     writableStream.write(chunk);
// })
// readableSteam.on('end', () => {
//     writableStream.end();
//     console.log("Finsihed reading and writing the file");
// })
readableSteam.pipe(writableStream);

readableSteam.on('error', (err) => {
    console.log("error while reading",err);
})
writableStream.on('error', (err) => {
    console.log("error while writing",err);
})