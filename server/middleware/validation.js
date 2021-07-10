var jwt = require("jsonwebtoken");
require('dotenv').config()
const secretToken = process.env.SECRET_TOKEN || "lr4j32900f239rr32p0rr39rp2"

//should be only on login
function verifyToken(req, res, next) {
  console.log('here we are inside varify token');
  
  const bearerHeader = req.headers["authorization"];
  //formatted as Bearer <token>
  if (typeof bearerHeader !== "undefined") {
    console.log('varify token passed the exam');
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    next();
  } else {
    console.log('varify token failed the exam');
    res.status(403).json("wrong info");
  }
}


function validateJwt(req, res, next) {
  console.log('here we are inside varify jwt');
  jwt.verify(req.token, secretToken, async (error, data) => {
    if (error) {
      console.log('varify jwt failed the exam');
      res.status(403).json({
        error: error
      });
    } else {
      console.log('varify jwt passed the exam');
      req.data = data;
      console.log(data);
      console.log('****************************************************** the data above is from token');
      
      
      next();
    }
  });
}

module.exports = { verifyToken, validateJwt, secretToken };
