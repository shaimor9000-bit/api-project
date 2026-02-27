const jwt = require("jsonwebtoken"); 
// Import JWT library

module.exports = function auth(req, res, next) {


  try {
    const header = req.headers.authorization || "";
    // Get Authorization header

    const [type, token] = header.split(" ");
    

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing token" });
    }
    

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Verify token using secret key

    req.user = payload; 
   

    next();
    // Continue to route
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
    
  }
};