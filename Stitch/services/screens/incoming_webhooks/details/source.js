// Try running in the console below.

function d(val) {
  if ((val == "undefined") || (val == null) || (val == undefined)) {
    return '';
  } else {
    return val;
  }
}
  
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
    r = r + '<link rel="stylesheet" href="https://stitch-statichosting-prod.s3.amazonaws.com/5be43cf3fdc7289932fcad43/details.css">';
    r = r + "<body style='text-center'>";
    r = r + "<form method='get' action='"+postUrl+"' class='form-signin' onsubmit='return validateForm()' id='f' name='f'>";
    r = r + "<h3 class='form-signin'>Device Inventory Details</h3>";
    r = r + "<small class='form-signin'><a href='"+rootUrl+"list'>Back to list</a></small>";
    r = r + "<table class='form-signin table table-striped'>";
    r = r + "<tr><th>ID</th><td><input type='text' name='id' class='form-control-plaintext no-print' value='"+doc._id+"' readonly='true' /><code class='printonly'>"+doc._id+"</code></td></tr>";
    r = r + "<tr><th>Initial Req Request</th><td>"+doc.firstseen|| ''+"</td></tr>";
    r = r + "<tr><th>Last Reg Reqeust</th><td>"+doc.lastseen|| ''+"</td></tr></tr>";r = r + "<tr><th>MAC</th><td><input type='text' name='mac' class='form-control-plaintext no-print' value='"+d(doc.mac)+"' /><code class='printonly'>"+d(doc.mac)+"</code></td></tr>";
    r = r + "<tr><th>IP</th><td><input type='text' name='ip' class='form-control-plaintext no-print' value='"+d(doc.ip)+"' /><code class='printonly'>"+d(doc.ip)+"</code></td></tr>";
    r = r + "<tr><th>Token</th><td><code>"+doc.token|| ''+"</code></td></tr>";
    r = r + "<tr><th>Friendly Name</th><td><input type='text' name='name' class='form-control-plaintext' value='"+d(doc.name)+"' /></td></tr>";
    r = r + "<tr><th>Location</th><td><input type='text' name='location' class='form-control-plaintext' value='"+d(doc.location)+"' /></td></tr>";
    r = r + "<tr><th>Model</th><td><input type='text' name='model' class='form-control-plaintext' value='"+d(doc.model)+"' /></td></tr>";
    r = r + "<tr><th>Feed</th><td><input type='text' name='feed' class='form-control-plaintext no-print' value='"+d(doc.feed)+"' /><code class='printonly'>"+d(doc.feed)+"</code></td></tr>";
    r = r + "<tr><th>URL</th><td><input type='text' name='baseurl' class='form-control-plaintext no-print' value='"+d(doc.baseurl)+"' /><code class='printonly'>"+d(doc.baseurl)+"</code></td></tr></tr>";
    
    if(doc.hasOwnProperty('kvp')) {
      r = r + "<tr><th>KVP</th><td>";
      for(var i = 0; i < doc.kvp.length; i++) {
        r = r + "<input type='text' name='kvpkey[]' class='form-control-plaintext' value='"+doc.kvp[i].key+"' style='width:45%;float:left;margin-right:5%;' />"
        r = r + "<input type='text' name='kvpval[]' class='form-control-plaintext' value='"+doc.kvp[i].value+"' style='width:45%;float:left;' /><br/>"
      }
      r = r + "</td></tr>";
    }
    
    r = r + "<tr class='table-warning no-print'><th>Secret</th><td><input type='text' name='devicesecret' class='form-control-plaintext' value='' placeholder='REDACTED, REENTER!' /></td></tr>";
    r = r + "<tr class='table-warning no-print'><td colspan='2'><input type='password' class='form-control' id='secret' name='secret' placeholder='SECRET'></td></tr>";
    r = r + "<tr class='no-print'><td colspan='2' style='text-align:center;'><button type='submit' class='btn btn-warning'>Save</button></td></tr>";
    r = r + "<tr><th>QR Code</th><td style='background-color:#ffffff; text-align:center;'><img src='https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl="+encodeURI(thisUrl)+"'/></td>";
    r = r + "<tr class='table-danger no-print'><td colspan='2' style='text-align:center;'><button onclick='del(\""+rootUrl+"\", \""+doc._id+"\")' type='button' class='btn btn-danger'>Delete Registration</button></td></tr>";
    r = r + "</table></form>";
    r = r + "<script src='https://stitch-statichosting-prod.s3.amazonaws.com/5be43cf3fdc7289932fcad43/details.js'></script>";
    r = r + "</body></html>";
  }
  else {
    r = r + "<html><body><h1>Device Inventory Details</h1><h2>Info not found!</h2></body></html>";
  }
  

  response.setHeader("Content-Type", "text/html");
  response.setBody(r);

};