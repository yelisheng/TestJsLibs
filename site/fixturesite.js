/// <reference path="../../lib/typings/colors.d.ts" />
/// <reference path="../../lib/typings/nodePackages.d.ts" />
//fixture site default port 18000
var express = require('express');
var fs = require("fs");
var path = require("path");
require("colors");
var qs = require("querystring");
var FixtureSite = (function () {
    function FixtureSite(listenPort) {
        this.listenPort = listenPort;
        this.initExpressSite();
    }
    FixtureSite.prototype.initExpressSite = function () {
        var app = express();
        app.use(function (req, res, next) {
            var data = '';
            req.setEncoding('utf8');
            req.on('data', function (chunk) {
                data += chunk;
                //console.log("post data:"+chunk);
            });
            req.on('end', function () {
                req.body = data;
                next();
            });
        });
        var logReqUrl = function (url) {
            reqExecuteCounter++;
            console.log(reqExecuteCounter + " " + new Date().toISOString() + " " + url);
        };
        //test response time
        app.get('/wait/:waitMs', function (req, res) {
            var waitMs = parseInt(req.params.waitMs);
            setTimeout(function () {
                res.send('wait MS: ' + waitMs);
            }, waitMs);
        });
        //heavy calculate
        app.get('/prime/:max', function (req, res) {
            var max = parseInt(req.params.max);
            var getPrimes = function (max) {
                var sieve = [], i, j, primes = [];
                for (i = 2; i <= max; ++i) {
                    if (!sieve[i]) {
                        // i has not been marked -- it is prime
                        primes.push(i);
                        for (j = i << 1; j <= max; j += i) {
                            sieve[j] = true;
                        }
                    }
                }
                return primes;
            };
            var primes = getPrimes(max);
            res.send('get primes: ' + primes[0] + "... size:" + primes.length);
        });
        //statu code definition http://wenku.baidu.com/view/751430c19ec3d5bbfd0a741c.html
        app.get('/code/:status', function (req, res) {
            var status = parseInt(req.params.status);
            var statusContent = fs.readFileSync(path.resolve(__dirname, "./static/http_status_code.txt"));
            res.writeHead(status, { "Content-Type": "text/html", charset: 'utf-8' });
            res.write('http send status code: ' + status);
            res.write('\n\n');
            res.write(statusContent, "utf-8");
            ////res.status(status);
            //res.status(status);
            res.end();
        });
        //app.get('/loadstorm-40908.html', function (req,res) {
        //})
        //返回任意指定长度大小的 response
        app.get('/size/:size', function (req, res) {
            var size = parseInt(req.params.size);
            var buf = new Buffer(size);
            buf.fill("t");
            res.setHeader("Content-Length", String(size));
            res.setHeader("Content-Type", "text/html");
            res.write(buf);
            res.end();
            //logReqUrl(" size/" + size);
        });
        var reqExecuteCounter = 0;
        //返回任意指定长度大小的 response
        app.get('/request/:count', function (req, res) {
            var count = parseInt(req.params.count);
            var imgStr = "";
            for (var n = 0; n < count; n++) {
                var url = makeid();
                imgStr += "<link rel='stylesheet' type='text/css' href= '/notfound/" + url + "' / >";
            }
            var s = "\
    <html>\
      <head>" + imgStr + "</head>\
    <body></body></html>";
            res.write(s);
            res.end();
            logReqUrl(" response /request/" + count);
        });
        //返回任意指定长度大小的 response,不设置 Content-Length
        app.get('/size_nolength/:size', function (req, res) {
            var size = parseInt(req.params.size);
            var buf = new Buffer(size);
            buf.fill("t");
            res.setHeader("Content-Type", "text/html");
            res.write(buf);
            res.end();
        });
        app.get('/timeout/:timeout', function (req, res) {
            var timeout = parseInt(req.params.timeout);
            setTimeout(function () {
                res.send('Time out:' + timeout, 408);
            }, timeout);
        });
        app.get('/testform', function (req, res) {
            res.setHeader("Content-Type", "text/html");
            res.write("<html><body><form id='test' action='/formpost' method='post'>\
<input name='text1' type='text' />\
<input name='checkbox1' type='checkbox' />\
<input name='color1' type='color' />\
<input name='date1' type='date' />\
<input name='datetime1' type='datetime' />\
<input name='datetime2' type='datetime-local' />\
<input name='email1' type='email' />\
<input name='image1' type='image' />\
<input name='month1' type='month' />\
<input name='number1' type='number' />\
<input name='password1' type='password' />\
<input name='radio1' type='radio' value=1 />\
<input name='radio1' type='radio' value=2 />\
<input name='range1' type='range' />\
<input name='tel1' type='tel' />\
<input name='time1' type='time' />\
<input name='url1' type='url' />\
<input name='week' type='week' />\
<select name='select1' ><option>1</option><option>2</option></select>\
</form></body></html>");
            res.end();
        });
        app.post('/formpost', function (req, res) {
            res.write(JSON.stringify(qs.parse(req.body)));
            res.end();
        });
        app.post('/post/test', function (req, res) {
            //    var body = JSON.stringify(req.body);
            var body = "The following is your post\n size:" + req.body.length;
            res.send(body, 200);
        });
        //app.get('/', function (req, res) {
        //    res.send('hello world');
        //});

        app.use(express.static(path.resolve(__dirname, '../static')));
        app.listen(this.listenPort);
        console.log("Starting up fixture http - server, serving on port: ".yellow, this.listenPort);
        console.log("Hit CTRL - C to stop the server");
        return app;
    };
    return FixtureSite;
})();
exports.FixtureSite = FixtureSite;
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 255; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
