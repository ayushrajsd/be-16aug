// console.log(global)
// console.log("dir name",__dirname,"file name",__filename)

// console.log(process)
const fs = require('fs');

// // Generate random content
// const content = Math.random().toString(36).repeat(10000000); // Approximately 470MB

// // Write content to file
// fs.writeFileSync('/Users/scaler/Documents/BEAug16/be-16aug/nodeDiscussion/big.file', content);

const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
    // fs.readFile('./big.file', (err, data) => {
    //     if(err) throw err;
    //     res.end(data);
    // })
    const src = fs.createReadStream('./big.file');
    src.pipe(res);
})

server.listen(3000, () => {
    console.log("Server started at 3000")
})