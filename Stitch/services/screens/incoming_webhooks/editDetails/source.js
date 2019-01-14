
// Try running in the console below.
  
exports = async function(payload,response) {
  var regupdate = payload.query;
  //var jreg = JSON.parse(regupdate);
  var id = payload.query.id;
  regupdate.secret = regupdate.devicesecret;
  delete regupdate.devicesecret;
  delete regupdate.id;
  
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  await conn.updateOne({_id:BSON.ObjectId(id)}, {$set: regupdate});
  
  response.setStatusCode(301);
  response.setHeader("Location", "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/digisign-ywoti/service/screens/incoming_webhook/details?docid="+id);
};


