const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 8080 || process.env.PORT;

const child_process = require('child_process');
app.use(express.static('./public'));

io.on('connection', (socket) => {
    console.log('user connected');
    
    const powershell = child_process.spawn('powershell.exe', [ '-ExecutionPolicy', 'Bypass', '-NoExit' ]);

    powershell.stdout.on('data', (data) => {
        socket.emit('output', data.toString())

        console.log(`[${socket.id}] [info] ${data.toString()}`)
    });

    powershell.stderr.on('data', (data) => {
        socket.emit('outputError', data.toString())

        console.log(`[${socket.id}] [error] ${data.toString()}`)
    });

    powershell.on('close', (code) => {
        socket.emit('outputError', `Process exited with code ${code}`)
        console.log(`[${socket.id}] [info] Process exited with code ${code}`)
    });

    powershell.on('error', (err) => {
        socket.emit('outputError', err.toString())
        console.log(`[${socket.id}] [error] ${err.toString()}`)
    });

    socket.on('input', (data) => powershell.stdin.write(data + '\n'));

    socket.on('disconnect', () => {
        console.log('user disconnected');
        powershell.stdin.destroy();
    });

    // 

});

server.listen(PORT, () => console.log(`server is running on https://localhost:${PORT}`));