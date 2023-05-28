const s = require('child_process');
const util = require('util');
const rd = require('readline');
const dgram = require('dgram');

// Membuat socket UDP
const server = dgram.createSocket('udp4');

// Mengirim pesan UDP
const serverPort = 1234;
const serverAddress ='127.0.0.1';



// readline interface
const rl = rd.createInterface({
    input: process.stdin,
    output: process.stdout
});


// question prompt
const question = util.promisify(rl.question).bind(rl);

// set raw and handle input
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf-8');


const clientConnect = [];



question('» ').then((cmd)=>{
    
    if(clientConnect.length !== 0){
        clientConnect.map((e,i,a)=>{
            server.send(cmd, e.port, e.address, (error) => {
                if(error) console.error(error);
                else console.log('wait for response...')
            })

        })
    }
})


server.on('message',(msg,rinfo)=>{

    if(msg == 'connect' && !clientConnect.some((e,i,a)=> e.port === rinfo.port)) (clientConnect.push(rinfo),console.log(`port ${rinfo.port} connected`))
    else console.log(msg.toString())

})

process.stdin.on('data',(key) => {

    if(key === '\r'){

        setTimeout(async()=>{
            const cmd = await question('» ');

            if(clientConnect.length !== 0){
                clientConnect.map((e,i,a)=>{
                    server.send(cmd, e.port, e.address, (error) => {
                        if(error) console.error(error);
                        else console.log('wait for response...')
                    })
                })
            }
              
        },500)
        
    }else if (key === '\u0003') {
        console.log('out')
        process.exit();
    }

});


server.bind(serverPort, "127.0.0.1" ,() => {
    console.log(`UDP server listening on ${serverAddress}:${serverPort}`);
});
