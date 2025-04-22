Jobs Queue
Payload's Jobs Queue gives you a simple, yet powerful way to offload large or future tasks to separate compute resources which is a very powerful feature of many application frameworks.

Example use cases
Non-blocking workloads

You might need to perform some complex, slow-running logic in a Payload Hook but you don't want that hook to "block" or slow down the response returned from the Payload API. Instead of running this logic directly in a hook, which would block your API response from returning until the expensive work is completed, you can queue a new Job and let it run at a later date.

Examples:

Create vector embeddings from your documents, and keep them in sync as your documents change
Send data to a third-party API on document change
Trigger emails based on customer actions
Scheduled actions

If you need to schedule an action to be run or processed at a certain date in the future, you can queue a job with the waitUntil property set. This will make it so the job is not "picked up" until that waitUntil date has passed.

Examples:

Process scheduled posts, where the scheduled date is at a time set in the future
Unpublish posts at a given time
Send a reminder email to a customer after X days of signing up for a trial
Periodic sync or similar scheduled action

Some applications may need to perform a regularly scheduled operation of some type. Jobs are perfect for this because you can execute their logic using cron, scheduled nightly, every twelve hours, or some similar time period.

Examples:

You'd like to send emails to all customers on a regular, scheduled basis
Periodically trigger a rebuild of your frontend at night
Sync resources to or from a third-party API during non-peak times
Offloading complex operations

You may run into the need to perform computationally expensive functions which might slow down your main Payload API server(s). The Jobs Queue allows you to offload these tasks to a separate compute resource rather than slowing down the server(s) that run your Payload APIs. With Payload Task definitions, you can even keep large dependencies out of your main Next.js bundle by dynamically importing them only when they are used. This keeps your Next.js + Payload compilation fast and ensures large dependencies do not get bundled into your Payload production build.

Examples:

You need to create (and then keep in sync) vector embeddings of your documents as they change, but you use an open source model to generate embeddings
You have a PDF generator that needs to dynamically build and send PDF versions of documents to customers
You need to use a headless browser to perform some type of logic
You need to perform a series of actions, each of which depends on a prior action and should be run in as "durable" of a fashion as possible
How it works
There are a few concepts that you should become familiarized with before using Payload's Jobs Queue. We recommend learning what each of these does in order to fully understand how to leverage the power of Payload's Jobs Queue.

Tasks
Workflows
Jobs
Queues
All of these pieces work together in order to allow you to offload long-running, expensive, or future scheduled work from your main APIs.

Here's a quick overview:

A Task is a specific function that performs business logic
Workflows are groupings of specific tasks which should be run in-order, and can be retried from a specific point of failure
A Job is an instance of a single task or workflow which will be executed
A Queue is a way to segment your jobs into different "groups" - for example, some to run nightly, and others to run every 10 minutes



Tasks
A "Task" is a function definition that performs business logic and whose input and output are both strongly typed.

You can register Tasks on the Payload config, and then create Jobs or Workflows that use them. Think of Tasks like tidy, isolated "functions that do one specific thing".

Payload Tasks can be configured to automatically retried if they fail, which makes them valuable for "durable" workflows like AI applications where LLMs can return non-deterministic results, and might need to be retried.

Tasks can either be defined within the jobs.tasks array in your Payload config, or they can be defined inline within a workflow.

Defining tasks in the config
Simply add a task to the jobs.tasks array in your Payload config. A task consists of the following fields:

Option

Description

slug

Define a slug-based name for this job. This slug needs to be unique among both tasks and workflows.

handler

The function that should be responsible for running the job. You can either pass a string-based path to the job function file, or the job function itself. If you are using large dependencies within your job, you might prefer to pass the string path because that will avoid bundling large dependencies in your Next.js app. Passing a string path is an advanced feature that may require a sophisticated build pipeline in order to work.

inputSchema

Define the input field schema - Payload will generate a type for this schema.

interfaceName

You can use interfaceName to change the name of the interface that is generated for this task. By default, this is "Task" + the capitalized task slug.

outputSchema

Define the output field schema - Payload will generate a type for this schema.

label

Define a human-friendly label for this task.

onFail

Function to be executed if the task fails.

onSuccess

Function to be executed if the task succeeds.

retries

Specify the number of times that this step should be retried if it fails. If this is undefined, the task will either inherit the retries from the workflow or have no retries. If this is 0, the task will not be retried. By default, this is undefined.

The logic for the Task is defined in the handler - which can be defined as a function, or a path to a function. The handler will run once a worker picks picks up a Job that includes this task.

It should return an object with an output key, which should contain the output of the task as you've defined.

Example:

export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        // Configure this task to automatically retry
        // up to two times
        retries: 2,

        // This is a unique identifier for the task

        slug: 'createPost',

        // These are the arguments that your Task will accept
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],

        // These are the properties that the function should output
        outputSchema: [
          {
            name: 'postID',
            type: 'text',
            required: true,
          },
        ],

        // This is the function that is run when the task is invoked
        handler: async ({ input, job, req }) => {
          const newPost = await req.payload.create({
            collection: 'post',
            req,
            data: {
              title: input.title,
            },
          })
          return {
            output: {
              postID: newPost.id,
            },
          }
        },
      } as TaskConfig<'createPost'>,
    ],
  },
})
In addition to defining handlers as functions directly provided to your Payload config, you can also pass an absolute path to where the handler is defined. If your task has large dependencies, and you are planning on executing your jobs in a separate process that has access to the filesystem, this could be a handy way to make sure that your Payload + Next.js app remains quick to compile and has minimal dependencies.

Keep in mind that this is an advanced feature that may require a sophisticated build pipeline, especially when using it in production or within Next.js, e.g. by calling opening the /api/payload-jobs/run endpoint. You will have to transpile the handler files separately and ensure they are available in the same location when the job is run. If you're using an endpoint to execute your jobs, it's recommended to define your handlers as functions directly in your Payload Config, or use import paths handlers outside of Next.js.

In general, this is an advanced use case. Here's how this would look:

payload.config.ts:

import { fileURLToPath } from 'node:url'
import path from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  jobs: {
    tasks: [
      {
        // ...
        // The #createPostHandler is a named export within the `createPost.ts` file
        handler:
          path.resolve(dirname, 'src/tasks/createPost.ts') +
          '#createPostHandler',
      },
    ],
  },
})
Then, the createPost file itself:

src/tasks/createPost.ts:

import type { TaskHandler } from 'payload'

export const createPostHandler: TaskHandler<'createPost'> = async ({
  input,
  job,
  req,
}) => {
  const newPost = await req.payload.create({
    collection: 'post',
    req,
    data: {
      title: input.title,
    },
  })
  return {
    output: {
      postID: newPost.id,
    },
  }
}
Configuring task restoration
By default, if a task has passed previously and a workflow is re-run, the task will not be re-run. Instead, the output from the previous task run will be returned. This is to prevent unnecessary re-runs of tasks that have already passed.

You can configure this behavior through the retries.shouldRestore property. This property accepts a boolean or a function.

If shouldRestore is set to true, the task will only be re-run if it previously failed. This is the default behavior.

If shouldRestore this is set to false, the task will be re-run even if it previously succeeded, ignoring the maximum number of retries.

If shouldRestore is a function, the return value of the function will determine whether the task should be re-run. This can be used for more complex restore logic, e.g you may want to re-run a task up to X amount of times and then restore it for consecutive runs, or only re-run a task if the input has changed.

Example:

export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        slug: 'myTask',
        retries: {
          shouldRestore: false,
        },
        // ...
      } as TaskConfig<'myTask'>,
    ],
  },
})
Example - determine whether a task should be restored based on the input data:

export default buildConfig({
  // ...
  jobs: {
    tasks: [
      {
        slug: 'myTask',
        inputSchema: [
          {
            name: 'someDate',
            type: 'date',
            required: true,
          },
        ],
        retries: {
          shouldRestore: ({ input }) => {
            if (new Date(input.someDate) > new Date()) {
              return false
            }
            return true
          },
        },
        // ...
      } as TaskConfig<'myTask'>,
    ],
  },
})
Nested tasks
You can run sub-tasks within an existing task, by using the tasks or ìnlineTask arguments passed to the task handler function:

export default buildConfig({
  // ...
  jobs: {
    // It is recommended to set `addParentToTaskLog` to `true` when using nested tasks, so that the parent task is included in the task log
    // This allows for better observability and debugging of the task execution
    addParentToTaskLog: true,
    tasks: [
      {
        slug: 'parentTask',
        inputSchema: [
          {
            name: 'text',
            type: 'text',
          },
        ],
        handler: async ({ input, req, tasks, inlineTask }) => {
          await inlineTask('Sub Task 1', {
            task: () => {
              // Do something
              return {
                output: {},
              }
            },
          })

          await tasks.CreateSimple('Sub Task 2', {
            input: { message: 'hello' },
          })

          return {
            output: {},
          }
        },
      } as TaskConfig<'parentTask'>,
    ],
  },
})



Workflows
A "Workflow" is an optional way to combine multiple tasks together in a way that can be gracefully retried from the point of failure.

They're most helpful when you have multiple tasks in a row, and you want to configure each task to be able to be retried if they fail.

If a task within a workflow fails, the Workflow will automatically "pick back up" on the task where it failed and not re-execute any prior tasks that have already been executed.

Defining a workflow
The most important aspect of a Workflow is the handler, where you can declare when and how the tasks should run by simply calling the runTask function. If any task within the workflow, fails, the entire handler function will re-run.

However, importantly, tasks that have successfully been completed will simply re-return the cached and saved output without running again. The Workflow will pick back up where it failed and only task from the failure point onward will be re-executed.

To define a JS-based workflow, simply add a workflow to the jobs.workflows array in your Payload config. A workflow consists of the following fields:

Option

Description

slug

Define a slug-based name for this workflow. This slug needs to be unique among both tasks and workflows.

handler

The function that should be responsible for running the workflow. You can either pass a string-based path to the workflow function file, or workflow job function itself. If you are using large dependencies within your workflow, you might prefer to pass the string path because that will avoid bundling large dependencies in your Next.js app. Passing a string path is an advanced feature that may require a sophisticated build pipeline in order to work.

inputSchema

Define the input field schema - Payload will generate a type for this schema.

interfaceName

You can use interfaceName to change the name of the interface that is generated for this workflow. By default, this is "Workflow" + the capitalized workflow slug.

label

Define a human-friendly label for this workflow.

queue

Optionally, define the queue name that this workflow should be tied to. Defaults to "default".

retries

You can define retries on the workflow level, which will enforce that the workflow can only fail up to that number of retries. If a task does not have retries specified, it will inherit the retry count as specified on the workflow. You can specify 0 as workflow retries, which will disregard all task retry specifications and fail the entire workflow on any task failure. You can leave workflow retries as undefined, in which case, the workflow will respect what each task dictates as their own retry count. By default this is undefined, meaning workflows retries are defined by their tasks

Example:

export default buildConfig({
  // ...
  jobs: {
    tasks: [
      // ...
    ]
    workflows: [
      {
        slug: 'createPostAndUpdate',

        // The arguments that the workflow will accept
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],

        // The handler that defines the "control flow" of the workflow
        // Notice how it uses the `tasks` argument to execute your predefined tasks.
        // These are strongly typed!
        handler: async ({ job, tasks }) => {

          // This workflow first runs a task called `createPost`.

          // You need to define a unique ID for this task invocation
          // that will always be the same if this workflow fails
          // and is re-executed in the future. Here, we hard-code it to '1'
          const output = await tasks.createPost('1', {
            input: {
              title: job.input.title,
            },
          })

          // Once the prior task completes, it will run a task
          // called `updatePost`
          await tasks.updatePost('2', {
            input: {
              post: job.taskStatus.createPost['1'].output.postID, // or output.postID
              title: job.input.title + '2',
            },
          })
        },
      } as WorkflowConfig<'updatePost'>
    ]
  }
})
Running tasks inline
In the above example, our workflow was executing tasks that we already had defined in our Payload config. But, you can also run tasks without predefining them.

To do this, you can use the inlineTask function.

The drawbacks of this approach are that tasks cannot be re-used across workflows as easily, and the task data stored in the job will not be typed. In the following example, the inline task data will be stored on the job under job.taskStatus.inline['2'] but completely untyped, as types for dynamic tasks like these cannot be generated beforehand.

Example:

export default buildConfig({
  // ...
  jobs: {
    tasks: [
      // ...
    ]
    workflows: [
      {
        slug: 'createPostAndUpdate',
        inputSchema: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
        ],
        handler: async ({ job, tasks, inlineTask }) => {
          // Here, we run a predefined task.
          // The `createPost` handler arguments and return type
          // are both strongly typed
          const output = await tasks.createPost('1', {
            input: {
              title: job.input.title,
            },
          })

          // Here, this task is not defined in the Payload config
          // and is "inline". Its output will be stored on the Job in the database
          // however its arguments will be untyped.
          const { newPost } = await inlineTask('2', {
            task: async ({ req }) => {
              const newPost = await req.payload.update({
                collection: 'post',
                id: '2',
                req,
                retries: 3,
                data: {
                  title: 'updated!',
                },
              })
              return {
                output: {
                  newPost
                },
              }
            },
          })
        },
      } as WorkflowConfig<'updatePost'>
    ]
  }
})


Jobs
Now that we have covered Tasks and Workflows, we can tie them together with a concept called a Job.

Whereas you define Workflows and Tasks, which control your business logic, a Job is an individual instance of either a Task or a Workflow which contains many tasks.

For example, let's say we have a Workflow or Task that describes the logic to sync information from Payload to a third-party system. This is how you'd declare how to sync that info, but it wouldn't do anything on its own. In order to run that task or workflow, you'd create a Job that references the corresponding Task or Workflow.

Jobs are stored in the Payload database in the payload-jobs collection, and you can decide to keep a running list of all jobs, or configure Payload to delete the job when it has been successfully executed.

Queuing a new job
In order to queue a job, you can use the payload.jobs.queue function.

Here's how you'd queue a new Job, which will run a createPostAndUpdate workflow:

const createdJob = await payload.jobs.queue({
  // Pass the name of the workflow
  workflow: 'createPostAndUpdate',
  // The input type will be automatically typed
  // according to the input you've defined for this workflow
  input: {
    title: 'my title',
  },
})
In addition to being able to queue new Jobs based on Workflows, you can also queue a job for a single Task:

const createdJob = await payload.jobs.queue({
  task: 'createPost',
  input: {
    title: 'my title',
  },
})
Cancelling Jobs
Payload allows you to cancel jobs that are either queued or currently running. When cancelling a running job, the current task will finish executing, but no subsequent tasks will run. This happens because the job checks its cancellation status between tasks.

Cancel a Single Job
To cancel a specific job, use the payload.jobs.cancelByID method with the job's ID:

await payload.jobs.cancelByID({
  id: createdJob.id,
})
Cancel Multiple Jobs
To cancel multiple jobs at once, use the payload.jobs.cancel method with a Where query:

await payload.jobs.cancel({
  where: {
    workflowSlug: {
      equals: 'createPost',
    },
  },
})



Queues
Queues are the final aspect of Payload's Jobs Queue and deal with how to run your jobs. Up to this point, all we've covered is how to queue up jobs to run, but so far, we aren't actually running any jobs.

A Queue is a grouping of jobs that should be executed in order of when they were added.

When you go to run jobs, Payload will query for any jobs that are added to the queue and then run them. By default, all queued jobs are added to the default queue.

But, imagine if you wanted to have some jobs that run nightly, and other jobs which should run every five minutes.

By specifying the queue name when you queue a new job using payload.jobs.queue(), you can queue certain jobs with queue: 'nightly', and other jobs can be left as the default queue.

Then, you could configure two different runner strategies:

A cron that runs nightly, querying for jobs added to the nightly queue
Another that runs any jobs that were added to the default queue every ~5 minutes or so
Executing jobs
As mentioned above, you can queue jobs, but the jobs won't run unless a worker picks up your jobs and runs them. This can be done in four ways:

Cron jobs
You can use the jobs.autoRun property to configure cron jobs:

export default buildConfig({
  // Other configurations...
  jobs: {
    tasks: [
      // your tasks here
    ],
    // autoRun can optionally be a function that receives `payload` as an argument
    autoRun: [
      {
        cron: '0 * * * *', // every hour at minute 0
        limit: 100, // limit jobs to process each run
        queue: 'hourly', // name of the queue
      },
      // add as many cron jobs as you want
    ],
    shouldAutoRun: async (payload) => {
      // Tell Payload if it should run jobs or not.
      // This function will be invoked each time Payload goes to pick up and run jobs.
      // If this function ever returns false, the cron schedule will be stopped.
      return true
    },
  },
})
autoRun is intended for use with a dedicated server that is always running, and should not be used on serverless platforms like Vercel.

Endpoint
You can execute jobs by making a fetch request to the /api/payload-jobs/run endpoint:

// Here, we're saying we want to run only 100 jobs for this invocation
// and we want to pull jobs from the `nightly` queue:
await fetch('/api/payload-jobs/run?limit=100&queue=nightly', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
This endpoint is automatically mounted for you and is helpful in conjunction with serverless platforms like Vercel, where you might want to use Vercel Cron to invoke a serverless function that executes your jobs.

Vercel Cron Example

If you're deploying on Vercel, you can add a vercel.json file in the root of your project that configures Vercel Cron to invoke the run endpoint on a cron schedule.

Here's an example of what this file will look like:

{
  "crons": [
    {
      "path": "/api/payload-jobs/run",
      "schedule": "*/5 * * * *"
    }
  ]
}
The configuration above schedules the endpoint /api/payload-jobs/run to be invoked every 5 minutes.

The last step will be to secure your run endpoint so that only the proper users can invoke the runner.

To do this, you can set an environment variable on your Vercel project called CRON_SECRET, which should be a random string—ideally 16 characters or longer.

Then, you can modify the access function for running jobs by ensuring that only Vercel can invoke your runner.

export default buildConfig({
  // Other configurations...
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    // Other job configurations...
  },
})
This works because Vercel automatically makes the CRON_SECRET environment variable available to the endpoint as the Authorization header when triggered by the Vercel Cron, ensuring that the jobs can be run securely.

After the project is deployed to Vercel, the Vercel Cron job will automatically trigger the /api/payload-jobs/run endpoint in the specified schedule, running the queued jobs in the background.

Local API
If you want to process jobs programmatically from your server-side code, you can use the Local API:

Run all jobs:

const results = await payload.jobs.run()

// You can customize the queue name and limit by passing them as arguments:
await payload.jobs.run({ queue: 'nightly', limit: 100 })

// You can provide a where clause to filter the jobs that should be run:
await payload.jobs.run({
  where: { 'input.message': { equals: 'secret' } },
})
Run a single job:

const results = await payload.jobs.runByID({
  id: myJobID,
})
Bin script
Finally, you can process jobs via the bin script that comes with Payload out of the box.

npx payload jobs:run --queue default --limit 10
In addition, the bin script allows you to pass a --cron flag to the jobs:run command to run the jobs on a scheduled, cron basis:

npx payload jobs:run --cron "*/5 * * * *"
Processing Order
By default, jobs are processed first in, first out (FIFO). This means that the first job added to the queue will be the first one processed. However, you can also configure the order in which jobs are processed.

Jobs Configuration
You can configure the order in which jobs are processed in the jobs configuration by passing the processingOrder property. This mimics the Payload sort property that's used for functionality such as payload.find().

export default buildConfig({
  // Other configurations...
  jobs: {
    tasks: [
      // your tasks here
    ],
    processingOrder: '-createdAt', // Process jobs in reverse order of creation = LIFO
  },
})
You can also set this on a queue-by-queue basis:

export default buildConfig({
  // Other configurations...
  jobs: {
    tasks: [
      // your tasks here
    ],
    processingOrder: {
      default: 'createdAt', // FIFO
      queues: {
        nightly: '-createdAt', // LIFO
        myQueue: '-createdAt', // LIFO
      },
    },
  },
})
If you need even more control over the processing order, you can pass a function that returns the processing order - this function will be called every time a queue starts processing jobs.

export default buildConfig({
  // Other configurations...
  jobs: {
    tasks: [
      // your tasks here
    ],
    processingOrder: ({ queue }) => {
      if (queue === 'myQueue') {
        return '-createdAt' // LIFO
      }
      return 'createdAt' // FIFO
    },
  },
})
Local API
You can configure the order in which jobs are processed in the payload.jobs.queue method by passing the processingOrder property.

const createdJob = await payload.jobs.queue({
  workflow: 'createPostAndUpdate',
  input: {
    title: 'my title',
  },
  processingOrder: '-createdAt', // Process jobs in reverse order of creation = LIFO
})