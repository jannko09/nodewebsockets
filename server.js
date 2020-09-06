const path = require("path");
const express = require("express");
const WebSocket = require("ws");
const app = express();

const WS_PORT = 8888;
const HTTP_PORT = 8080;

const wsServer = new WebSocket.Server({port: WS_PORT}, () =>console.log(`Ws server is listening in ${WS_PORT}`));

let connectedClients = [];

wsServer.on("connection", (ws, req) => {
    console.log("connection established");
    connectedClients.push(ws);

    ws.on("message", data => {
        connectedClients.forEach((ws, i)=> {
            if(ws.readyState === ws.OPEN){
                ws.send(data);
            } else {
                connectedClients.splice(i, 1);
            }
        })
    });
})

app.get("/client", (req,res) => 
    res.sendFile(path.resolve(__dirname, "./client.html")));
app.listen(HTTP_PORT, ()=> console.log(`HTTP Server Listening at ${HTTP_PORT}`))

