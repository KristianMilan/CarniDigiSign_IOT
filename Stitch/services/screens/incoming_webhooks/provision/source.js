// Try running in the console below.
  
exports = async function(payload,response) {
  var token = payload.query.token || '';
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  var r = '';
  if(token.length > 0) {
    var docs = await conn.findOne({"token":token});
  } 
  
  if (docs) {
    r = JSON.stringify(docs);
  } else {
    await conn.insertOne({"token":token});
    r = JSON.stringify({"error":"not yet registered."});
  }
  
  //console.log(r);
  response.setHeader("Content-Type", "application/json");
  response.setBody(r);

};