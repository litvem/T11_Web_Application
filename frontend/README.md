# DIT356 H22 Team 11

## Getting started with frontend

### Your broker must support websockets sothat the browsercan connect to it
### If you are using Mosquitto, be aware that it does not support websockets by default 
- To use websocket with mosquitto mosquitto.conf file

```
listener 1883
protocol mqtt
listener 9001
protocol websockets
allow_anonymous true
```
- To run mosquitto with these configurations use: 
```
mosquitto -c mosquitto.conf -v
```

### After clonning the repo and open the terminal in your local machine:
- cd to the frontend folder
- install dependencies with: 
```
npm install
```
- to run the application:
```
npm run dev
```