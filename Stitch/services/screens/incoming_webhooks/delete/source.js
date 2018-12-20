
// Try running in the console below.
  
exports = async function(payload,response) {
    var id = payload.query.id;
    var conn = context.services.get("mongodb-atlas").db("digisign").collection("screens");
    await conn.deleteOne({_id:BSON.ObjectId(id)});
  };