const express = require('express');
const external_api_responses = require('../data/external_api_responses.json');

const app = express();
app.use(express.json());

const { user_service_api } = external_api_responses;

app.get('/users/:id', (req, res) => {
  const { get_user } = user_service_api;
  if (req.params.id === get_user.success_response.data.user_id) {
    return res.json(get_user.success_response);
  }
  res.status(404).json(get_user.error_response);
});

app.get('/users', (req, res) => {
  const { list_users } = user_service_api;
  return res.json(list_users.success_response);

});

app.listen(4001, () => console.log('Mock User Service running on port 4001'));