const app = require('../app');
const db = require('../db');
db.connection();
app.listen('9999','0.0.0.0');

