require('dotenv').config();
const { processQueue, processWebhook } = require('./src/jobs/queue');

processQueue(processWebhook);
