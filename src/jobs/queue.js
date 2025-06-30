const queue = [];

async function enqueueWebhookJob(event) {
  queue.push(event);
}

async function processQueue(processorFn) {
  while (true) {
    if (queue.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 200));
      continue;
    }

    const event = queue.shift();
    await processorFn(event);
  }
}

module.exports = { enqueueWebhookJob, processQueue };
