require('dotenv').config();
const app    = require('./src/app');
const { PORT = 5000 } = process.env;

app.listen(PORT, () => {
  console.log(`\n🚀 PediVault API running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Docs: http://localhost:${PORT}/api/health\n`);
});
