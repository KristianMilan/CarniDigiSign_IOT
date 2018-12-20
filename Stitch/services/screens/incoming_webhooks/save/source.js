
// Try running in the console below.
  
exports = async function(payload,response) {
  var sign = payload.body.text();
  var id = payload.query.id;
  var jsign = JSON.parse(sign);
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("screens");
  await conn.updateOne({_id:BSON.ObjectId(id)}, jsign);
};