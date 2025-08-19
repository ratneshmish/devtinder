const jwt = require('jsonwebtoken');
const User = require("../models/user");

const UserAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Please Login");
    }

   
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { _id } = decoded;

    
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("Error: " + err.message);
  }
};

module.exports = { UserAuth };
