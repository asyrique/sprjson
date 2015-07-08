//Hardcoded Vars for the request
var queryUrl = process.env.QUERY_URL || "http://daftarj.spr.gov.my/DAFTARJ/DaftarjBM.aspx";
var requestUrl = process.env.REQUEST_URL || 'http://daftarj.spr.gov.my/DAFTARJ';

var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var app     = express();
var port    = process.env.PORT || 8080;

//Routes
app.get('/', function(req, res){
    res.status(200).json({'api': 'SPR-JSON', 'version': '1.0', 'status': 'healthy' });
});

app.get('/ic/:icNum', function(req, res){ //TODO -- FIX CALLBACK HELL. Implement promises
    //Create the Form vars
    var requestForm = {};
    request.get(requestUrl, function(err, response, body){
        var keys = {};
        getKeys(err, response, body, res, keys);
        requestForm = {
            'Semak': "Semak",
            '__EVENTVALIDATION': keys["eventValidation"],
            '__VIEWSTATE': keys["viewState"],
            'txtIC': req.params.icNum
        };

        request.post({
            url: queryUrl,
            form: requestForm,
            },
            function(err, response, body){
                processForm(err, response, body, res);
            }
        );
    });
});


//Begin server listening
var server = app.listen(port, function(){
    console.log("server listening on port %s", port);
});


function processForm(err, response, body, res){
    if (err){
        res.status(500).json({'error': err});
    } else if (body.indexOf('Record not found.') !== -1){
        res.status(404).json({'error': 'Record not found'});
    } else{
        var $ = cheerio.load(body);
        var userData = {};

        //Insert userdata
        userData["newIC"] = $("#LabelIC")[0]["children"][0]["data"];
        userData["oldIC"] = ($("#LabelIClama")[0]["children"][0] === undefined) ? '' : $("#LabelIClama")[0]["children"][0]["data"]; //TOFIX -- This doesn't parse because the OldIC span is empty
        userData["name"] = $("#Labelnama")[0]["children"][0]["data"];
        birthdate = $("#LabelTlahir")[0]["children"][0]["data"];
        userData['birthdateISO'] = new Date(birthdate.substr(birthdate.length - 4) + "-" + userData["newIC"].substr(2,2) + "-" + userData["newIC"].substr(4,2));
        if ($("#Labeljantina")[0]["children"][0]["data"] == 'LELAKI'){
            userData['gender'] = 'male';
        } else{
            userData['gender'] = 'female';
        }
        userData['locality'] = $("#Labellokaliti")[0]["children"][0]["data"];
        userData['votingDistrict'] = $("#Labeldm")[0]["children"][0]["data"];
        userData['DUN'] = $("#Labeldun")[0]["children"][0]["data"];
        userData['parliament'] = $("#Labelpar")[0]["children"][0]["data"];
        userData['state'] = $("#Labelnegeri")[0]["children"][0]["data"];
        //Unknown function for now
        userData['status'] = $("#LABELSTATUSDPI")[0]["children"][0]["data"];

        res.status(200).json(userData);
    }
}

function getKeys(err, response, body, res, keys){
    if (err){
        res.status(500).json({'error': err});
    } else{
        var $ = cheerio.load(body);
        keys['viewState'] = $("#__VIEWSTATE").attr('value');
        keys['eventValidation'] = $("#__EVENTVALIDATION").attr('value');
    }
}