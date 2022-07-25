const getJWTFromUser = (user, res) => {
  const token = user.generateJWT();
  const { JWT_COOKIE, NODE_ENV } = process.env;
  return res
    .status(200)
    .cookie("accessToken", token, {
      httpOnly: true,
      expeires: new Date(Date.now() + parseInt(JWT_COOKIE) * 60),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      token: token,
      email: user.email,
    });
};

const checkIfTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
  );
  
};

const getJWTFromHeader = (req) => {
  const auth = req.headers.authorization;
  const token = auth.split(" ")[1];
  return token;
};

module.exports = {
  getJWTFromHeader,
  getJWTFromUser,
  checkIfTokenIncluded,
};
