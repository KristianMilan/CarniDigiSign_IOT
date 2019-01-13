// Try running in the console below.
  
exports = async function(payload,response) {
  var mac = payload.query.mac || '';
  var token = payload.query.token || '';
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  var r = '';
  
  if(mac.length>0) {
    var doc = await conn.findOne({"mac":mac});
  }
  else if (token.length>0) {
    var doc = await conn.findOne({"token":token});
  }
  
  if(doc) {
    var thisUrl = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/digisign-ywoti/service/screens/incoming_webhook/details?mac="+doc.mac;
    
    var baseurl = doc.baseurl|| '';
    
    r = r + "<html><head><title>Device Inventory Details</title></head>";
    r = r +'<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">';
    r = r + '<link rel="stylesheet" href="https://getbootstrap.com/docs/4.2/examples/sign-in/signin.css">';
    r = r + '<style>td,th { padding:5px; } .form-signin { max-width:600px !important; width: 100 !important%; } </style>';
    r = r + "<body style='text-center'><table class='form-signin table table-striped'>";
    r = r + "<tr><th colspan='2'><h3>Device Inventory Details</h3></th></tr>";
    r = r + "<tr><th>MAC</th><td><code>"+doc.mac|| ''+"</code></td>";
    r = r + "<tr><th>Token</th><td><code>"+doc.token|| ''+"</code></td>";
    r = r + "<tr><th>Friendly Name</th><td>"+doc.name|| ''+"</td>";
    r = r + "<tr><th>Location</th><td>"+doc.location|| ''+"</td>";
    r = r + "<tr><th>Model</th><td>"+doc.model|| ''+"</td>";
    r = r + "<tr><th>Feed</th><td>"+doc.feed|| ''+"</td>";
    r = r + "<tr><th>URL</th><td><a href='"+baseurl+"'>"+baseurl+"</a></td></tr>";
    r = r + "<tr><th>Secret</th><td>Redacted</td>";
    r = r + "<tr><th>Last Reg Reqeust</th><td>"+doc.lastseen|| ''+"</td>";
    r = r + "<tr><th>QR Code</th><td style='background-color:#ffffff; text-align:center;'><img src='https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl="+encodeURI(thisUrl)+"'/></td>";
    r = r + "</table></body></html>";
  }
  else {
    r = r + "<html><body><h1>Device Inventory Details</h1><h2>Info not found!</h2></body></html>";
  }
  

  response.setHeader("Content-Type", "text/html");
  response.setBody(r);

};