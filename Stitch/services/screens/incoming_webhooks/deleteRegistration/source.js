
// Try running in the console below.
  
exports = async function(payload,response) {
  var id = payload.query.id;
  
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  await conn.deleteOne({_id:BSON.ObjectId(id)});
  
  response.setStatusCode(301);
  response.setHeader("Location", "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/digisign-ywoti/service/screens/incoming_webhook/list");
};


