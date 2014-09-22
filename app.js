/* *****************************
 ==== Configure Express
 */
var express = require('express');
var errorHandler = require('errorhandler');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(errorHandler({dumpExceptions: true}));

app.get("/", function (req, res) {
    res.redirect("/index.html");
});


/* *****************************
 ==== Create The Cylon Robot
 */

var cylonPi = require('./server/cylonpi.js');


/* *****************************
 ==== Set up Twitter
 */

var tweetMeter = require('./server/tweets.js');

/* *****************************
 ==== Start a Socket.IO Server
 */

var http = require('http').Server(app);
var io = require('socket.io')(http);
var decayInterval = 3 * 60 * 1000;

io.on('connect',function(socket){
    socket.on('connect',function(){
        console.log("Client Connected");
    });

    socket.on('setAngle', function(angle) {
        cylonPi.setAngle(angle);
    });

    socket.on('setDecayInterval', function(interval){
        if(interval > 0) {
            decayInterval = interval * 1000;
        }
    });

    socket.on('setTweetTerm', function(term) {
        cylonPi.setAngle(30);
        tweetMeter.setTweetTerm(term);
    });
});

cylonPi.on('ready',function(data){
    io.emit('cylonPiReady',data);

    // Initialize angle to 30;
    cylonPi.setAngle(30);

    // This will run on every 'tweet' for the given word
    tweetMeter.init('hackmemphis', function(tweetText){
        var currentAngle = cylonPi.getAngle();
        console.log('Got Tweet');
        if(currentAngle < 150) {
            console.log('Increasing Angle');
            currentAngle = currentAngle + 10;
            cylonPi.setAngle(currentAngle);
            resetDecay(true);
        }
        io.emit('newTweet', {tweetText:tweetText, servoAngle:currentAngle});
    });


});

var myIntervalID;

function resetDecay(isInit){
    console.log('Resetting Decay');
    if(myIntervalID) {
        clearInterval(myIntervalID);
    }
    myIntervalID = setInterval(function(){
        console.log('Called setInterval ' + isInit);
        var currentAngle = cylonPi.getAngle();
        if( currentAngle > 30 && !isInit ) {
            console.log('Decaying Pointer');
            currentAngle = currentAngle - 5;
            cylonPi.setAngle(currentAngle);
        }
        isInit = false;
    },decayInterval);
}

// Start the t
cylonPi.initRobot();
http.listen(3000);