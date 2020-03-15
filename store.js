const storage = require('azure-storage')
const retryOperations = new storage.ExponentialRetryPolicyFilter();

const service = storage.createTableService()
		.withFilter(retryOperations);

const uuid = require('uuid');
const table = 'tasks'

const init = async () => (
  new Promise((resolve, reject) => {
    service.createTableIfNotExists(table, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

const createTask = async (title, msg) => (
  new Promise((resolve, reject) => {
    const generator = storage.TableUtilities.entityGenerator
    const task = {
      PartitionKey: generator.String('task'),
      RowKey: generator.String(uuid.v4()),
      title,
      msg
    }

    service.insertEntity(table, task, (error, result, response) => {
      !error ? resolve() : reject()
    })
  })
)

module.exports = {
  init,
  createTask
}
