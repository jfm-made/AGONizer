# AGONizer - WIP
Author: Julius F. Martin  
Licence: MIT

AGONizer should become a web based tool to organize CS:GO matches on LAN or remote events. It can handle lists of:
- Players (nickname, first name, last name, skill level 1-10)
- Teams (of 5 players)
- Matches (of teams)
It will (atm it is not) be capable of automatically create teams by average skill level of the players. Also it will generate a match plan. Details follow

## Build, run, develop
You need node.js to be already installed and a running MongoDB.
To install dependencies run ```npm i```.
On development you can run ```npm run dev```.  
To build the application run ```npm run build``` and find the files inside of _./build_.  
To run it in _production_ I recommend using [pm2](http://pm2.keymetrics.io/). Just start it after building and installing dependencies with the available _ecosystem.config.js_ file and ```pm2 start```. Or simply use ```node build/server/index.js```.

## Configuration
See ```./config/default.json``` and check out the package [config on npm](https://www.npmjs.com/package/config).


## Warning
This is a private after work project which is meant to be uses **LOCALLY ONLY**. None of the API routes are secured. Database is configured to be accessible without auth. There are no deeper validations or checks. See this piece of copy-pasted code as a prototype. Anyway I have the plan to make it stable enough to be used for your event.  
Do not use this software exposed to the outer world (which we call the internet)!

## Technology stack
- [node.js](https://nodejs.org/) [ES6](https://en.wikipedia.org/wiki/ECMAScript) with [Babel 7](https://babeljs.io/)
- [express](https://expressjs.com), [mongoose](https://mongoosejs.com/), [WebSockets](https://www.npmjs.com/package/ws) ... all the stuff you like
- [React](https://reactjs.org/) and [Webpack](https://webpack.js.org/)
- [ant.design](https://ant.design/), [SASS](https://sass-lang.com/)
- [MongoDB](https://www.mongodb.com/)

## MongoDB
I recommend starting a local DB without authentication on [Docker](https://www.docker.com/) as follows
```
docker run -n mongo -p 27017:27017 -d mongo:latest
```


## Status

### What is currently working
Honestly? Not much yet.

- Players
   - Add
   - Delete
   - Display with automatic updates (one client only)
- Teams
   - Add
   - Delete
   - Display with automatic updates (one client only)
   - Auto calculate skill level sum

### What is to be done next
- Auto generate balanced teams
- Auto generate balanced match plans (Round robin for even and odd number of teams)
- Enter, save and display match results
- Generate live time leader board
- add a screenshot to the readme because you guys hate to read
- Add hot reload for front end development
- Gimp-shop-paint a 1337 logo.png and a favicon
- ~~complete the readme~~

I wish to also have motivation to implement the following:
- Multi client support (WebSockets updates on every database change to all connected clients)
- Auto export results from CS:GO Server
- Player steam id binding to gather profile images and further information
- Dark theme (Man this white antd standard is ugly. Don't ever switch to it from a dark themed IDE)
- Add Dockerfile and compose for application and database
- Add and use eslint
- Add PostMan-collection for all possible requests