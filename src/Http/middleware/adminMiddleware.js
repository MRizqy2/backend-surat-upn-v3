const { Users } = require("../../models"); // Adjust the path to fit your project structure

module.exports = async function isAdmin(req, res, next) {
  try {
    const user = await Users.findOne({ where: { id: req.token.id } });

    if (user && user.role_id === 1) {
      next();
    } else {
      res.status(403).json({ error: "User is not an admin" });
    }
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ error: error.message });
  }
};
