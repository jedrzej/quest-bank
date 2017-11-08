'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';

import slack from "serverless-slack";

import CreateQuestCommand from './commands/CreateQuestCommand';
import IndexQuestsCommand from './commands/IndexQuestsCommand';
import DestroyQuestCommand from './commands/DestroyQuestCommand';
import CompleteQuestCommand from './commands/CompleteQuestCommand';
import JoinQuestCommand from "./commands/JoinQuestCommand";
import LeaveQuestCommand from "./commands/LeaveQuestCommand";
import UpdateSettingsCommand from "./commands/UpdateSettingsCommand";

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const questsService = new DynamoDBService(dynamoDbClient, process.env.QUESTS_TABLE_NAME);
const userSettingsService = new DynamoDBService(dynamoDbClient, process.env.USER_SETTINGS_TABLE_NAME);

new CompleteQuestCommand(slack, questsService, userSettingsService);
new CreateQuestCommand(slack, questsService);
new DestroyQuestCommand(slack, questsService);
new IndexQuestsCommand(slack, questsService);
new JoinQuestCommand(slack, questsService);
new LeaveQuestCommand(slack, questsService);
new UpdateSettingsCommand(slack, userSettingsService);

export const handler = slack.handler.bind(slack);
