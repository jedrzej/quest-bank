'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';

import slack from "serverless-slack";

import CreateQuestCommand from './commands/CreateQuestCommand';
import IndexQuestsCommand from './commands/IndexQuestsCommand';
import DestroyQuestCommand from './commands/DestroyQuestCommand';
import CompleteQuestCommand from './commands/CompleteQuestCommand';

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const questsService = new DynamoDBService(dynamoDbClient, process.env.QUESTS_TABLE_NAME);

new CreateQuestCommand(slack, questsService);
new IndexQuestsCommand(slack, questsService);
new DestroyQuestCommand(slack, questsService);
new CompleteQuestCommand(slack, questsService);

export const handler = slack.handler.bind(slack);
