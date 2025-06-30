require('dotenv').config();
const { processQueue } = require('./jobs/queue');
const { processWebhook } = require('./jobs/webhookProcessor');

processQueue(processWebhook);
