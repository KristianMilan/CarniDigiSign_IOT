// Try running in the console below.
  
exports = async function(payload,response) {
  var feed = payload.query.feed || '';
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("screens");
  var r = '';
  var docs = await conn.find({"$or": [{"feed":feed}, {"feed":'all'}]}).toArray()
  r = JSON.stringify(docs);
  
  //console.log(r);
  response.setHeader("Content-Type", "application/json");
  response.setBody(r);

};