function validateForm() { 
    if((document.forms['f']['devicesecret'].value.length>0)&&(document.forms['f']['secret'].value.length>0)) { 
        return true; 
    } else {
         alert('You must enter both secrets!'); return false;
    }
}

function del(rootUrl,id) { 
    if(document.forms['f']['secret'].value.length>0) { 
        s = document.getElementById('secret').value; 
        window.location = rootUrl+"deleteRegistration?id="+id+"&secret="+s;
    } else {
        alert('You must enter the secret.'); return false;
    }
}