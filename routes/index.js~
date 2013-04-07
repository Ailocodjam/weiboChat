
/*
 * GET home page.
 */
var fs = require('fs');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.getPerson = function(req,res){
   fs.readFile("friends.json",'utf-8',function(error,data){
   	console.log('fridents_data:'+data);
  		res.send(data);
  });
};
exports.getChat = function(req,res){
   fs.readFile("jmChat.json",'utf-8',function(error,data){
		console.log('char_data:'+data);  		
  		res.send(data);
  });
}
