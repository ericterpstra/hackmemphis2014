Hack Memphis 2014 Tweet-O-Meter
===============

My Hack Memphis Raspberry Pi Servo Meter Project.

Please be aware that this code is a F'ing mess. It was written in a hurry, and partly with beer in hand.

Clone this onto a Raspberry Pi (model B or B+).

Run: 

```
npm install
npm install cylon-raspi
bower install
```

Add a servo to PIN 7 (GPIO4) of your Raspberry Pi

Run
```
node app.js
```

Visit `http://your.pi.ip.address:3000` for a diagnostic dashboard and `http://your.pi.ip.address:3000/#/dash` for a simple 'meter' background.
