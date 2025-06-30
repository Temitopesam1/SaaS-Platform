require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./src/models');
const router = express.Router();
const { ssoAzure, ssoOkta } = require('./src/controllers/authController');


// SSO endpoints
router.post('/azure', ssoAzure);
router.post('/okta', ssoOkta);

module.exports = router;

app.use(express.json());

db.sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));

app.use('/users', require('./src/routes/userRoutes'));
app.use('/webhooks', require('./src/routes/webhookRoutes'));
app.use('/integrations', require('./src/routes/integrationRoutes'));
app.use('/organizations', require('./src/routes/organizationRoutes'));
app.use('/auth', require('./src/routes/authRoutes'));
app.use('/audit-logs', require('./src/routes/auditRoutes'));
app.use('/sso', router);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
