const express = require('express');

const app = express();

exports.sendNotificationViaOneSignal = function(data) {
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic YWE3ZGMxYTMtOGFhMi00NzJiLTk3N2EtZGQ1ZTUwY2MyYzFk"
    };
    
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    
    var https = require('https');
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  };
  // let jobdesc = 'TorchCode company is looking for Python backend developer' +
  // 'who has the ability to work hard and implement a complex design patterns that serve alot of people'
  // var message = { 
  //   app_id: "50c8ad6e-b20b-4f8e-a71a-219c4f4ce74e",
  //   contents: {"en": jobdesc},
  //   headings:{"en":"وظيفة مبرمج"},
  //   subtitle:{"en":"please karrar fuck me harder"},
  //   include_player_ids: ["bcce43f2-3072-46f0-b2c6-ba7832fcd410"]
  // };
  
  // sendNotification(message);

// app.listen(3000,() => console.log('Server is running ...'));