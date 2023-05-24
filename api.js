const app = require('express')();
const http = require('http').Server(app);
const cors = require('cors');
const Dalai = require("dalai")
const dalai = new Dalai();
app.use(cors()); // Use this line to use cors globally

//Please note , that alpaca 7B has been separately downloaded ,
// Following this link : https://stackoverflow.com/questions/76258667/dalai-alpaca-install-failing-to-run-invalid-model-file-models-7b-ggml-model-q4

const io = require('socket.io')(http, {
    allowEIO3: true,
    transports : ['websocket','polling','flashsocket'],
    cors: {
        origin: ('http://localhost:8000'),
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('requestToken', prompt => {
        dalai.request({
            model: "alpaca.7B",
            prompt: prompt,
        }, (token) => {
            socket.emit('token', token);
        })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

http.listen(3000, () => {
    console.log("server started")
})
