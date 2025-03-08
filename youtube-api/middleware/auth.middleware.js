import jwt from "jsonwebtoken";

export const checkAuth = async (req, resizeBy, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token is provided" });
    }

    const decodedUser = jwt.verify(token, process.env.JWT_TOKEN);

    req.user = decodedUser;
    next();
  } catch (error) {
    console.error("error in checkAuth : ", error);
    return res.status(500).json({ error: "Server error" });
  }
};
