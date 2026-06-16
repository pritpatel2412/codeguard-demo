const db = require('../db');

async function findById(id) {
  // SINK: Dangerous string concatenation in a SQL query
  // This is a CRITICAL SQL Injection vulnerability
  const query = "SELECT * FROM users WHERE id = " + id;
  return await db.execute(query);
}

module.exports = { findById };
//Test 2
