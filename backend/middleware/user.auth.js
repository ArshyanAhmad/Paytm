import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
   const jwtToken = req.headers.authorization;

   if (!jwtToken || !jwtToken.startsWith("Bearer")) {
      return res.status(403).json({
         success: false,
         message: "Token not provided, Invalid input",
      });
   }

   const token = jwtToken.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);

      if (decoded.userId) {
         req.userId = decoded.userId;
         next();
      } else {
         return res.status(403).json({
            success: false,
            message: "User not found, Invalid input",
         });
      }
   } catch (error) {
      return res.status(403).json({
         success: false,
         message: "Invalid inputs",
      });
   }
};
