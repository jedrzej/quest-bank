'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';

import ExpireQuestsCommand from './commands/ExpireQuestsCommand';
import RemindAboutQuestsCommand from './commands/RemindAboutQuestsCommand';

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const questsService = new DynamoDBService(dynamoDbClient, process.env.QUESTS_TABLE_NAME);
const userSettingsService = new DynamoDBService(dynamoDbClient, process.env.USER_SETTINGS_TABLE_NAME);

export async function expireQuests(event, context, callback) {
  const expireQuestsCommand = new ExpireQuestsCommand(questsService, userSettingsService);

  try {
    const data = await expireQuestsCommand.execute();

    callback(null, { statusCode: 200, body: data });
  } catch (e) {
    console.log(e);
    callback(null, { statusCode: 500 });

  }
}

export async function remindAboutQuests(event, context, callback) {
  const remindAboutQuestsCommand = new RemindAboutQuestsCommand(questsService, userSettingsService);

  try {
    const data = await remindAboutQuestsCommand.execute();

    callback(null, { statusCode: 200, body: data });
  } catch (e) {
    console.log(e);
    callback(null, { statusCode: 500 });

  }
}
