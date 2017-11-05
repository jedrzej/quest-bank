'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';
import { success, failure } from "./utils/helpers";

import CreateQuestCommand from './commands/CreateQuestCommand';
import UpdateQuestCommand from "./commands/UpdateQuestCommand";
import ShowQuestCommand from "./commands/ShowQuestCommand";
import IndexQuestsCommand from "./commands/IndexQuestsCommand";
import DestroyQuestCommand from "./commands/DestroyQuestCommand";

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

export async function updateQuest(event, context, callback) {
  const updateQuestCommand = new UpdateQuestCommand(questsService);

  try {
    const data = await updateQuestCommand.execute(event.pathParameters.id, event.body.name, event.body.detailsLink);
    success(data, callback);
  } catch (e) {
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
    const data = await indexQuestCommand.execute();
    success(data, callback);
  } catch (e) {
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