/**
This is an interface to make AJAX requests and handle responses from server.
Compatible with Internet Explorer

Internal method:
  CreateRequest() - Creates correct AJAX request object.
Method:
  SendRequest(r_method, r_path, r_args, r_handler) - Sends requests and throws
    response to r_handler.
    Arguments:
      r_method - type of method ("post" || "get")
      r_path - handler location
      r_args - variables to transfer ("var1=1&var2=2")
      r_handler - function that handles response


**/


function CreateRequest()
{
    var Request = false;

    if (window.XMLHttpRequest)
    {
        Request = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        //Internet explorer
        try
        {
             Request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (CatchException)
        {
             Request = new ActiveXObject("Msxml2.XMLHTTP");
        }
    }

    if (!Request)
    {
        alert("Unable to create XMLHttpRequest");
    }

    return Request;
}


function SendRequest(r_method, r_path, r_args, r_handler)
{
    var Request = CreateRequest();
    if (!Request)
    {
        return NULL;
    }

    Request.onreadystatechange = function()
    {
          if (Request.readyState == 4)
          {
              if (Request.status == 200)
              {
                  //handling server response
                  r_handler(Request.responseText);
              }
              else
              {
                  //ERROR ALERT
              }
          }
          else
          {
              //OK ALERT
          }
    }

    //ifGet
    if (r_method.toLowerCase() == "get" && r_args.length > 0)
    r_path += "?" + r_args;

    //init
    Request.open(r_method, r_path, true);

    //ifPost
    if (r_method.toLowerCase() == "post")
    {
        Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
        Request.send(r_args);
    }
    else
    {
        //andIfGet
        Request.send(null); //nullRequest
    }
}


function ParseJSON(raw_text){
  return JSON.parse(raw_text);
}
