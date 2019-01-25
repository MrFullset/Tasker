function CreateRequest()
{
    var Request = false;

    if (window.XMLHttpRequest)
    {
        //Gecko-совместимые браузеры, Safari, Konqueror
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
        alert("Невозможно создать XMLHttpRequest");
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
                  //ВОТ ТУТ НАДО ОБРАБОТАТЬ ОТВЕТ ОТ СЕРВЕРА
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
