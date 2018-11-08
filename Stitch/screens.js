// Try running in the console below.
  
exports = async function(payload,response) {
    var id = payload.query.id || '';
    var conn = context.services.get("mongodb-atlas").db("digisign").collection("screens");
    var r = '';
    if(id.length > 0) {
      var docs = await conn.findOne({_id:BSON.ObjectId(id)});
    } else {
      //var docs = await conn.find({});
      var docs = await conn.find().toArray()
    }
    r = JSON.stringify(docs);
    
    //console.log(r);
    response.setHeader("Content-Type", "application/json");
    response.setBody(r);
  
  };