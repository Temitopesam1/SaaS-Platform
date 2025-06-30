const express = require('express');
const app = express();
app.use(express.json());


const payment_service = {
  "get_subscription": {
    "success_response": {
      "status": "success",
      "data": {
        "subscription_id": "sub_enterprise_456",
        "customer_id": "cust_67890",
        "plan": "enterprise",
        "status": "active",
        "current_period_start": "2024-02-01T00:00:00Z",
        "current_period_end": "2024-03-01T00:00:00Z",
        "amount": 999.99,
        "currency": "USD",
        "payment_method": "card_ending_1234"
      }
    }
  },
  "get_customer_usage": {
    "success_response": {
      "status": "success",
      "data": {
        "customer_id": "cust_67890",
        "billing_period": "2024-02",
        "usage_metrics": {
          "api_calls": 45000,
          "storage_gb": 125.5,
          "compute_hours": 89.2
        },
        "overage_charges": 150.00,
        "total_amount": 1149.99
      }
    }
  }
}

app.get('/subscriptions/:id', (req, res) => {
  const { get_subscription } = payment_service;
  if (req.params.id === get_subscription.success_response.data.subscription_id) {
    return res.json(get_subscription.success_response);
  }
});

app.get('/usage/customer/:id', (req, res) => {
  const { get_customer_usage } = payment_service;
  if (req.params.id === get_customer_usage.success_response.data.customer_id) {
    return res.json(get_customer_usage.success_response);
  }
});

app.listen(4002, () => console.log('Mock Payment Service running on port 4002'));