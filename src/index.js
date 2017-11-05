'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';
import CreateQuestCommand from './commands/CreateQuestCommand';

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const questsService = new DynamoDBService(dynamoDbClient, process.env.QUESTS_TABLE_NAME);

function success(data, callback) {
  return response(data, callback, 200);
}

function failure(data, callback) {
  return response(data, callback, 500);
}

function response(data, callback, statusCode) {
  return callback(null, {
    statusCode,
    body: data && JSON.stringify(data)
  });
}

export async function createQuest(event, context, callback) {
  const createQuestCommand = new CreateQuestCommand(questsService);

  try {
    const data = await createQuestCommand.execute(event.body.name, event.body.detailsLink);
    success(data, callback);
  } catch (e) {
    failure(null, callback);
  }
}