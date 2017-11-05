'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';
import CreateQuestCommand from './commands/CreateQuestCommand';
import { success, failure } from "./utils/helpers";

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const questsService = new DynamoDBService(dynamoDbClient, process.env.QUESTS_TABLE_NAME);

export async function createQuest(event, context, callback) {
  const createQuestCommand = new CreateQuestCommand(questsService);

  try {
    const data = await createQuestCommand.execute(event.body.name, event.body.detailsLink);
    success(data, callback);
  } catch (e) {
    failure(null, callback);
  }
}