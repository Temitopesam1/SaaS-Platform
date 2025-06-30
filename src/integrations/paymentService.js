const express = require('express');
const external_api_responses = require('../data/external_api_responses.json');
const app = express();
app.use(express.json());


const { payment_service_api } = external_api_responses;

app.get('/subscriptions/:id', (req, res) => {
  const { get_subscription } = payment_service_api;
  if (req.params.id === get_subscription.success_response.data.subscription_id) {
    return res.json(get_subscription.success_response);
  }
});

app.get('/usage/customer/:id', (req, res) => {
  const { get_customer_usage } = payment_service_api;
  if (req.params.id === get_customer_usage.success_response.data.customer_id) {
    return res.json(get_customer_usage.success_response);
  }
});

app.listen(4002, () => console.log('Mock Payment Service running on port 4002'));