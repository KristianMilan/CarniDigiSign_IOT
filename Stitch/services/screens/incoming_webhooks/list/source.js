// Try running in the console below.
  
exports = async function(payload,response) {
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  var r = '';
  
  
  
  r = r + "<html><head><title>Device Inventory Details</title></head>";
  r = r +'<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">';
  r = r + '<style>td,th { padding:5px; } .form-signin { max-width:70% !important; text-align:center; width:70%;margin-left:15%; } body { padding-top: 40px;  padding-bottom: 40px;  background-color: #f5f5f5; height:100%; width:100%;} </style>';
  r = r + "<body><h1 class='form-signin'>Registered Devices</h1><table class='form-signin table table-striped'>";
  r = r + "<thead class='thead-dark'><tr><th>MAC</th><th>Token</th><th>Location</th><th>Last Seen</th><th>Link</th></tr></thead><tbody>";
  
  let docs = await conn.find().toArray();
  
  for(var i = 0; i < docs.length; i++) {
    r = r + "<tr>";
    r = r + "<td><code>"+docs[i].mac|| ''+"</code></td>";
    r = r + "<td><code>"+docs[i].token|| ''+"</code></td>";
    r = r + "<td>"+docs[i].location|| ''+"</td>";
    var url = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/digisign-ywoti/service/screens/incoming_webhook/details?token="+docs[i].token;
    r = r + "<td>"+docs[i].lastseen|| ''+"</td>";
    r = r + "<td><a href='"+url+"'>Link</a></td>";
    r = r + "</tr>";
  };
  
  r = r + "</tbody></table></body></html>";
 
  response.setHeader("Content-Type", "text/html");
  response.setBody(r);

};