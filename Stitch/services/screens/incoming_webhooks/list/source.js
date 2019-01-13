// Try running in the console below.
  
exports = async function(payload,response) {
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  var r = '';
  
  
  
  r = r + "<html><head><title>Device Inventory Details</title></head>";
  r = r +'<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">';
  r = r + '<link rel="stylesheet" href="https://getbootstrap.com/docs/4.2/examples/sign-in/signin.css">';
  r = r + '<style>td,th { padding:5px; } .form-signin { max-width:600px !important; width: 100 !important%; } </style>';
  r = r + "<body style='text-center'><table class='form-signin table table-striped'>";
  r = r + "<thead><tr><th>MAC</th><th>Token</th><th>Location</th><th>Link</th></tr></thead><tbody>";
  
  let docs = await conn.find().toArray();
  
  for(var i = 0; i < docs.length; i++) {
    r = r + "<tr>";
    r = r + "<td><code>"+docs[i].mac|| ''+"</code></td>";
    r = r + "<td><code>"+docs[i].token|| ''+"</code></td>";
    r = r + "<td>"+docs[i].location|| ''+"</td>";
    var url = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/digisign-ywoti/service/screens/incoming_webhook/details?token="+docs[i].token;
    r = r + "<td><a href='"+url+"'>Link</a></td>";
    r = r + "</tr>";
  };
  
  r = r + "</tbody></table></body></html>";
 
  response.setHeader("Content-Type", "text/html");
  response.setBody(r);

};