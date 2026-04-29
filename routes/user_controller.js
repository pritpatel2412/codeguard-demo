const userService = require('../services/user_service');

async function getUser(req, res) {
  // SOURCE: User input from query parameter 'id'
  const userId = req.query.id; 
  const user = await userService.fetchUserRecord(userId);
  res.json(user);
}

module.exports = { getUser };
// Test Purpose
