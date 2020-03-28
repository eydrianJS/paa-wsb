const storage = require('azure-storage')
const retryOperations = new storage.ExponentialRetryPolicyFilter();
function LoggingFilter() {
  this.handle = (requestOptions, next) => {
    console.log("requestOptions: ")
    console.log(requestOptions)
    next(requestOptions, (returnObject, finalCallback, next) => {
      if(next) {
      	next(requestOptions, (returnObject, finalCallback, next))
      } else {
        finalCallback(returnObject);
      }
    })
  }
}
const logging = new LoggingFilter();
const service = storage.createTableService()
		.withFilter(retryOperations)
		.withFilter(logging);

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

const listTasks = async () => (
  new Promise((resolve, reject) => {
    const query = new storage.TableQuery()
      .select(['title'])
      .where('PartitionKey eq ?', 'task')

    service.queryEntities(table, query, null, (error, result, response) => {
      !error ? resolve(result.entries.map((entry) => ({
        title: entry.title._
      }))) : reject()
    })
  })
)

module.exports = {
  init,
  createTask,
  listTasks
}
