const userModel = require('../models/user_model');

async function fetchUserRecord(id) {
  console.log(`Fetching record for user: ${id}`);
  // PROPAGATION: Passing the tainted 'id' to the data layer
  return await userModel.findById(id);
}

module.exports = { fetchUserRecord };

