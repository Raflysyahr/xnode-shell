const server = require('http').createServer();
const { Server } = require('socket.io')
const util = require('util');
const rd = require('readline');

const io = new Server(server);

// readline interface
const rl = rd.createInterface({
    input: process.stdin,
    output: process.stdout
});


// question prompt
const question = util.promisify(rl.question).bind(rl);

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf-8');


io.on('connection', client => {
    console.log('client connected => ',client.id)
    client.on('response',(data)=> console.log(data))
    client.on('send',(data)=> console.log(data))
});


question('» ').then((cmd)=>{
    
   io.emit('command',cmd)
   console.log('wait a response')
})


process.stdin.on('data',(key) => {

    if(key === '\r'){

        setTimeout(async()=>{
            console.log('pl')
            const cmd = await question('» ');
            io.emit('command',cmd);
            console.log('wait a response')
            
        },500)
        
    }else if (key === '\u0003') {
        console.log('out')
        process.exit();
    }

});

server.listen(3000,()=> console.log('Running on port',3000));
