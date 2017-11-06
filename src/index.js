'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';

import ExpireQuestsCommand from "./commands/ExpireQuestsCommand";

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const questsService = new DynamoDBService(dynamoDbClient, process.env.QUESTS_TABLE_NAME);

export async function expireQuests(event, context, callback) {
  const expireQuestsCommand = new ExpireQuestsCommand(questsService);

  try {
    const data = await expireQuestsCommand.execute();
    callback(null, {statusCode: 200, body: data});
  } catch (e) {
    console.log(e);
    callback(null, {statusCode: 500});

  }
}