// Try running in the console below.
  
exports = async function(payload,response) {
  var mac = payload.query.mac || '';
  var token = payload.query.token || '';
  var docid = payload.query.docid || '';
  var conn = context.services.get("mongodb-atlas").db("digisign").collection("registration");
  var r = '';
  
  if(mac.length>0) {
    var doc = await conn.findOne({"mac":mac});
  }
  else if (token.length>0) {
    var doc = await conn.findOne({"token":token});
  } else if (docid.length>0) {
    var doc = await conn.findOne({"_id":BSON.ObjectId(docid)});
  }
  
  if(doc) {
    var rootUrl = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/digisign-ywoti/service/screens/incoming_webhook/";
    var thisUrl = rootUrl+"details?docid="+doc._id;
    var postUrl = rootUrl+"editDetails?id="+doc._id;
    
    r = r + "<html><head><title>Device Inventory Details</title></head>";
    r = r +'<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">';
    r = r + '<link rel="stylesheet" href="https://getbootstrap.com/docs/4.2/examples/sign-in/signin.css">';
    r = r + '<style>td,th { padding:5px; } .form-signin { max-width:700px !important; width: 700 !important%; } </style>';
    r = r + "<body style='text-center'>";
    r = r + "<form method='get' action='"+postUrl+"' class='form-signin'>";
    r = r + "<h3 class='form-signin'>Device Inventory Details</h3>"
    r = r + "<table class='form-signin table table-striped'>";
    r = r + "<tr><th>ID</th><td><input type='text' name='id' class='form-control-plaintext' value='"+doc._id+"' readonly='true' /></td></tr>";
    r = r + "<tr><th>MAC</th><td><input type='text' name='mac' class='form-control-plaintext' value='"+doc.mac+"' /></td></tr>";
    r = r + "<tr><th>Token</th><td><code>"+doc.token|| ''+"</code></td></tr>";
    r = r + "<tr><th>Friendly Name</th><td><input type='text' name='name' class='form-control-plaintext' value='"+doc.name+"' /></td></tr>";
    r = r + "<tr><th>Location</th><td><input type='text' name='location' class='form-control-plaintext' value='"+doc.location+"' /></td></tr>";
    r = r + "<tr><th>Model</th><td><input type='text' name='model' class='form-control-plaintext' value='"+doc.model+"' /></td></tr>";
    r = r + "<tr><th>Feed</th><td><input type='text' name='feed' class='form-control-plaintext' value='"+doc.feed+"' /></td></tr>";
    r = r + "<tr><th>URL</th><td><input type='text' name='baseurl' class='form-control-plaintext' value='"+doc.baseurl+"' /></td></tr></tr>";
    r = r + "<tr><th>Secret</th><td><input type='text' name='devicesecret' class='form-control-plaintext' value='' placeholder='REDACTED, REENTER!' /></td></tr>";
    r = r + "<tr><th>Initial Req Request</th><td>"+doc.firstseen|| ''+"</td></tr>";
    r = r + "<tr><th>Last Reg Reqeust</th><td>"+doc.lastseen|| ''+"</td></tr></tr>";
    r = r + "<tr><td colspan='2'><input type='password' class='form-control' id='secret' name='secret' placeholder='SECRET'></td></tr>";
    r = r + "<tr><td colspan='2' style='text-align:center;'><button type='submit' class='btn btn-primary'>Save</button></td></tr>";
    r = r + "<tr><th>QR Code</th><td style='background-color:#ffffff; text-align:center;'><img src='https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl="+encodeURI(thisUrl)+"'/></td>";
    r = r + "</table></form></body></html>";
  }
  else {
    r = r + "<html><body><h1>Device Inventory Details</h1><h2>Info not found!</h2></body></html>";
  }
  

  response.setHeader("Content-Type", "text/html");
  response.setBody(r);

};