<h1 align="center"/>ROOM <sup></h1>
<p align="center">
  A communication service based on Express and Socket.io is a real-time messaging service that allows real-time communication between clients and servers using the Express framework and the Socket.io library.
</p>

## Table of Contents

- [Requirements](#Requirements)
- [Deployment](#Deployment)
  - [pm2](#pm2)
  - [docker](#docker)
- [Documentation](#documentation)
  - [Http Methods](#http)
  - [Socket Methods](#socket)

## Requirements
- node >= 14.0.0
## Deployment
### pm2 Deployment<a id="pm2"></a>
1. To install PM2, you can use the following command: ```npm install pm2 -g```
1. To start a project using: ```pm2 start pm2.production.json```
### Docker Deployment<a id="docker"></a>
1. checkout source: ```git clone https://github.com/shzjj8882/room.git```
1. start container: ```docker-compose up -d```
   
## Documentation
### Http Methods<a id="http"></a>
- Url：`/room/generate`
- Method：`GET`
- Response: `{ code: "05652b0173f841018d9cc6ce5a182b90"}`

### Socket Methods<a id="socket"></a>
- Event: `join-room`
- Arg: `string`
- ArgName: `RoomId`
- Method: `emit`
---
- Event: `server-broadcast`
- Arg: `string`
- ArgName: `RoomId`
- Arg: `ArrayBuffer`
- ArgName: `encryptedData`
- Arg: `Uint8Array`
- ArgName: `iv`
- Method: `emit`
---
- Event: `new-user`
- Arg: `string`
- ArgName: `socket.id`
- Method: `on`
---
- Event: `room-user-change`
- Arg: `Array`
- ArgName: `Array<socket.id>`
- Method: `on`
---
- Event: `client-broadcast`
- Arg: `ArrayBuffer`
- ArgName: `encryptedData`
- Arg: `Uint8Array`
- ArgName: `iv`
- Method: `emit`
- Method: `on`
