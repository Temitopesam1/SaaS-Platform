const axios = require('axios');
const CircuitBreaker = require('opossum');

function createBreaker(options = {}) {
  return new CircuitBreaker(
    (config) => axios(config),
    {
      timeout: 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
      ...options
    }
  );
}

const breaker = createBreaker();

// Log circuit breaker state changes
breaker.on('open', () => {
  console.warn('[CircuitBreaker] State: OPEN - External service unavailable');
});
breaker.on('halfOpen', () => {
  console.info('[CircuitBreaker] State: HALF-OPEN - Testing service recovery');
});
breaker.on('close', () => {
  console.info('[CircuitBreaker] State: CLOSED - Service healthy');
});

async function httpRequest(config) {
  try {
    const response = await breaker.fire(config);
    return response.data;
  } catch (err) {
    if (breaker.opened) {
      // Handle circuit breaker open state
      console.error('[CircuitBreaker] Request blocked: circuit is OPEN');
      throw new Error('External service unavailable (circuit breaker open)');
    }
    throw err;
  }
}

module.exports = { httpRequest, breaker };