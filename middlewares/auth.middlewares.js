const jwt = require("jsonwebtoken");
let { JWT_SECRET_KEY } = process.env;

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization){
    return res.status(401).json({
        status: false,
        message: 'you\re not authorized!',
        data: null
    })
  }

  jwt.verify(authorization, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
        return res.status(401).json({
            status: false,
            message: 'you\re not authorized!',
            data: null
        })
    }
    req.user = decoded
    next()
  })
};

// module.exports = {
//     restrict: (req, res, next) => {
//         if (req.isAuthenticated()) return next()
//         res.redirect('/api/v1/login')
//     }
// }
