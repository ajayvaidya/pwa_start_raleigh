var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, '/')));
var myText = "";
var name = "";

app.set('view engine', 'ejs');
app.enable('trust proxy');

//comment out to test on localhost

app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
});
console.log("UNCOMMENT HTTP STUFF BEFORE PUSHING");


const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

/*const toneAnalyzer = new ToneAnalyzerV3({
	version: '',
	username: '',
	password: '',
	url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
});*/

var text_tone = {
	name: name,
	doc_tone : "",
	sentences : []
};
var curr_docs = {};
var Cloudant = require('@cloudant/cloudant');

cloudant = Cloudant("https://d4b14d76-1fe5-462e-889f-cc236f8a6af2-bluemix:0d06cd6fc47769f7b9940f09218a59e49bf86b2c9c1938fc0e7db65d23b34ae7@d4b14d76-1fe5-462e-889f-cc236f8a6af2-bluemix.cloudantnosqldb.appdomain.cloud");
mydb = cloudant.db.use('test');
 
mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
    	curr_docs = body.rows;
    	console.log(JSON.stringify(curr_docs[0].doc));
    }
});
var test_res_tone = {};
app.get('/myform', function(req, res){ 
    myText = req.query.mytext; //mytext is the name of your input box
    name = req.query.name;
    text_tone.name = name;
    const toneParams = {
    	tone_input: { 'text': myText },
    	content_type: 'application/json',
    };

	/*toneAnalyzer.tone(toneParams, function(req, res2){
        test_res_tone = res2;
        console.log(test_res_tone);
        try{
		  text_tone.doc_tone =  res2.document_tone.tones[0].tone_name;
        }
        catch(e){
            text_tone.doc_tone = 'NA';
        }
        try{
    		text_tone.sentences = res2.sentences_tone;
    		var words = [];
    		for(i =0; i< text_tone.sentences.length; ++i){
    			words.push(text_tone.sentences[i].text);
    		}
    		text_tone.sentences = words;
        }
        catch(e){
            text_tone.sentences = ["no sentences found"];
        }
		res.render('tones',{text_tone:text_tone});
		mydb.insert(text_tone);
		console.log(text_tone);
	});*/
}); 

app.get('/', function(req, res) {
    res.render('index', {mytext:myText});
});

app.get('/comments', function(req, res) {
    res.render('comments', {curr_docs:curr_docs});
});

app.get('/tones', function(req, res) {
    res.render('tones', {text_tone:text_tone});
});
app.listen(8080);



