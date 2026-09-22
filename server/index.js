const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`  CareerVerify Backend API Server Running `);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`===========================================`);
});
