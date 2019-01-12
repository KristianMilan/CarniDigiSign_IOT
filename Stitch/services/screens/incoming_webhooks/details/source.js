// Try running in the console below.
  
exports = async function(payload,response) {
  var mac = payload.query.mac || '';
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  var r = '';
  
  var doc = await conn.findOne({"mac":mac});
  
  r = r + "<html><body>";
  r = r+ "<h1>Device Inventory Details</h1><table>";
  r = r + "<tr><th>MAC</th><td>"+doc.mac+"</td>";
  r = r + "<tr><th>Token</th><td>"+doc.token+"</td>";
  r = r + "<tr><th>Feed</th><td>"+doc.feed+"</td>";
  r = r + "<tr><th>URL</th><td>"+doc.baseurl+"</td>";
  r = r + "<tr><th>Secret</th><td>Redacted</td>";
  r = r + "<tr><th>Last Reg Reqeust</th><td>"+doc.lastseen+"</td>";
  r = r + "</table></body></html>";
  
  //console.log(r);
  response.setHeader("Content-Type", "text/html");
  
  response.setBody(r);

};