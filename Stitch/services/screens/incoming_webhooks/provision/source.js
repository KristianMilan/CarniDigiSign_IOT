// Try running in the console below.
  
exports = async function(payload,response) {
  var token = payload.query.token || '';
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  var r = '';
  var d = new Date(Date.now());
  
  if(token.length > 0) {
    var docs = await conn.findOne({"token":token});
  } 
  
  if (docs) {
    if(docs.hasOwnProperty("baseurl")) {
      r = JSON.stringify(docs);
      conn.updateOne({"token":token},{ $set:{lastseen:d}});
    } else {
      r = JSON.stringify({"error":"registration request pending"});
      conn.updateOne({"token":token},{ $set:{lastseen:d}});
    }
  } else {
    try {
      await conn.insertOne({"token":token, lastseen:d, firstseen:d});
      r = JSON.stringify({"error":"not yet registered"});
    } catch (err) {
      r = JSON.stringify({"error":"registration request pending"});
    }
  }
  
  //console.log(r);
  response.setHeader("Content-Type", "application/json");
  response.setBody(r);

};