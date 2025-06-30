require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');
const router = express.Router();
const { ssoAzure, ssoOkta } = require('./controllers/authController');


// SSO endpoints
router.post('/azure', ssoAzure);
router.post('/okta', ssoOkta);

module.exports = router;

app.use(express.json());

db.sequelize.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.error('Database connection error:', err));

app.use('/users', require('./routes/userRoutes'));
app.use('/webhooks', require('./routes/webhookRoutes'));
app.use('/integrations', require('./routes/integrationRoutes'));
app.use('/organizations', require('./routes/organizationRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/audit-logs', require('./routes/auditRoutes'));
app.use('/sso', router);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
