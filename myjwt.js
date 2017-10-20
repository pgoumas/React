// Short script to generate a basic jwt token and display it in the paragraph "authToken"

// Generates the jwt token from an api key and secret
var token = generateJWT("v2_api_key", "v2_api_secret")
  // please note that any api key and secret from v1 (create.passkit.com) will not work with v2
  // contact us through CherryPie.PassKit.net to find out more.

// The Authorisation header of the HTTP request contains "PKAuth " + token string
document.getElementById("authToken").innerHTML = ("PKAuth " + token).replace(' ', '&nbsp')
  // I replaced the space with a non breaking space purely for format reasons.
document.getElementById("debugLink").href = "https://jwt.io/#id_token=" + token

function generateJWT(key, secret) {
  //header should always contain this information, our v2 api currently only accepts HS256 encryption
  header = {
    "alg": "HS256",
    "typ": "JWT"
  }

  // get the current time in seconds
  var time_now = Math.floor(new Date().getTime() / 1000)
    /* For the expiry time, I've added 30 seconds, maximum allowed by our api is 1 minute, this is to ensure that if someone did intercept your api request, they would only be able to use your authorisation token for up to this time. 
    Feel free to make it shorter, the request should usually reach our system within a few seconds. */
  var exp = time_now + 30

  //the body should only contain the api key and expiry time
  body = {
    "exp": exp,
    "key": key
  }

  //create token variable
  var token = []
    // all parts of the token need to be base 64 url encoded
    // first part is generated from the JSON string of the header object 
  token[0] = base64url(JSON.stringify(header))
    // second part is generated from the JSON string of the body object 
  token[1] = base64url(JSON.stringify(body))
    // thirs part is generated from the hash of token[0] joined with token[1] by a dot "."
  token[2] = genTokenSign(token, secret)

  // the token itself is just the three sections joined with dots "."
  return token.join(".");
  // make sure that the Authorisation header of the HTTP request contains "PKAuth " before the token string
}

function genTokenSign(token, secret) {
  if (token.length != 2) {
    return
  }
  // generate the hash of (token[0] + "." + token[1])
  var hash = CryptoJS.HmacSHA256(token.join("."), secret);
  // convert the hash to base64
  var base64Hash = CryptoJS.enc.Base64.stringify(hash);
  // both of these functions are using google's crypto-js

  // convert the base64 string into an url safe string
  return urlConvertBase64(base64Hash);
}


function base64url(input) {
  // Encode to normal base64
  var base64String = btoa(input);
  // convert the base64 string into an url safe string
  return urlConvertBase64(base64String);
}

function urlConvertBase64(input) {

  // Remove padding equal characters
  var output = input.replace(/=+$/, '');

  // Replace characters according to base64url specifications
  output = output.replace(/\+/g, '-');
  output = output.replace(/\//g, '_');

  return output;
}
