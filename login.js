var jwt = require('jsonwebtoken');
var secureRandom = require('secure-random');
var bcrypt = require('bcrypt')

//client sends username/password combination to the server
const username = "username"; // get from user
const password = "password"; // get from user

//server validates the authentication
const validateAuthentication = (password) => {

  hash = getHashedPassword();

  //updated with promises
  bcrypt.compare(password, hash, function(res) {
    return res;
  });
};

const getHashedPassword = () => {
  //get hashed pw from server
  return "kjdfhkdjsf"
}

//create signing key
const getSigningKey = () => {
  const signingKey = secureRandom(256, {type: 'Buffer'});
  return signingKey;
};

//if authentication is successful, the server creates a JWT token
//else establishes an error response
const createToken = (signingKey) => {

  var payload = {
    "username": username
  };

  var token = jwt.sign(payload, signingKey, { expiresIn: "1h", header: { "alg": "HS256", "typ": "JWT"}});

  console.log(token);

  return token;
};

//on successful authentication, the client gets JWT token in the response body


//client stores that token in local storage or session storage


//server upon receiving the JWT validates it and sends the successful response else error
const verifyToken = (token, signingKey) => {
  try {
    verifiedJwt = jwt.verify(token, signingKey);
    console.log(verifiedJwt);
  } catch(err) {
    console.log(err); //TODO: Log this error intelligently to the user.
  }
}

//export methods to other modules so they can verify user tokens before exposing data
module.exports = {
  verifyToken: verifyToken
};
