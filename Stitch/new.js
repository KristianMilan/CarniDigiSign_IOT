
// Try running in the console below.
  
exports = async function(payload,response) {
    var sign = payload.body.text();
    var conn = context.services.get("mongodb-atlas").db("digisign").collection("screens");
    await conn.insertOne(JSON.parse(sign));
  };