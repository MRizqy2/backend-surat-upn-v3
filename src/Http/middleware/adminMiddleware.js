// const { Users } = require("../../models"); // Adjust the path to fit your project structure

// module.exports = async function (req, res, next) {
//   try {
//     const user = await Users.findOne({ where: { id: req.token.id } });

//     if (user && user.role_id.name === 1) {
//       next();
//     } else {
//       res.status(403).json({ error: "User is not an admin" });
//     }
//   } catch (error) {
//     console.error("Error in  middleware:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
