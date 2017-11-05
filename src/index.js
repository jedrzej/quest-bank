'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';
import { success, failure } from './utils/helpers';

import CreateQuestCommand from './commands/CreateQuestCommand';
import ShowQuestCommand from './commands/ShowQuestCommand';
import IndexQuestsCommand from './commands/IndexQuestsCommand';
import DestroyQuestCommand from './commands/DestroyQuestCommand';
import CompleteQuestCommand from './commands/CompleteQuestCommand';
import ExpireQuestsCommand from "./commands/ExpireQuestsCommand";

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const questsService = new DynamoDBService(dynamoDbClient, process.env.QUESTS_TABLE_NAME);

export async function createQuest(event, context, callback) {
  const createQuestCommand = new CreateQuestCommand(questsService);

  try {
    const data = await createQuestCommand.execute(event.body.name, event.body.detailsLink, event.body.endDate);
    success(data, callback);
  } catch (e) {
    failure(null, callback);
  }
}

export async function completeQuest(event, context, callback) {
  const completeQuestCommand = new CompleteQuestCommand(questsService);

  try {
    const data = await completeQuestCommand.execute(event.pathParameters.id);
    success(data, callback);
  } catch (e) {
    console.log(e)
    failure(null, callback);
  }
}

export async function showQuest(event, context, callback) {
  const showQuestCommand = new ShowQuestCommand(questsService);

  try {
    const data = await showQuestCommand.execute(event.pathParameters.id);
    success(data, callback, data ? 200 : 404);
  } catch (e) {
    failure(null, callback);
  }
}

export async function indexQuests(event, context, callback) {
  const indexQuestCommand = new IndexQuestsCommand(questsService);

  try {
    const data = await indexQuestCommand.execute(event.pathParameters.status);
    success(data, callback);
  } catch (e) {
    console.log(e)
    failure(null, callback);
  }
}

export async function expireQuests(event, context, callback) {
  const expireQuestsCommand = new ExpireQuestsCommand(questsService);

  try {
    const data = await expireQuestsCommand.execute();
    success(data, callback);
  } catch (e) {
    console.log(e)
    failure(null, callback);
  }
}

export async function destroyQuest(event, context, callback) {
  const destroyQuestCommand = new DestroyQuestCommand(questsService);

  try {
    const data = await destroyQuestCommand.execute(event.pathParameters.id);
    success(data, callback);
  } catch (e) {
    failure(null, callback);
  }
}