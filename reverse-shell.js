const args = process.argv.slice(2);

const io = require('socket.io-client')
const { execSync, exec } = require('child_process');

const client =  io.connect(args[0])


client.listeners('command',(data)=>{
    console.log(data)
})

client.on('command',(data)=>{
    exec(data.toString(),(error,stdout,stderr)=>{
        if(error)  client.emit('response','- '+error.message)
        if(stdout) client.emit('response',stdout.trim().split('\n').map((e,i,a)=> "+ "+e).join('\n'))
        if(stderr) client.emit('response',': '+stderr)
    })

    // client.emit('response',execSync(data).toString())
})
