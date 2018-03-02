'use strict';

import AWS from 'aws-sdk';
import DynamoDBService from './services/DynamoDBService';

import slack from 'serverless-slack';

import CreateQuestCommand from './commands/CreateQuestCommand';
import IndexQuestsCommand from './commands/IndexQuestsCommand';
import DeleteQuestCommand from './commands/DeleteQuestCommand';
import CompleteQuestCommand from './commands/CompleteQuestCommand';
import JoinQuestCommand from './commands/JoinQuestCommand';
import LeaveQuestCommand from './commands/LeaveQuestCommand';
import UpdateSettingsCommand from './commands/UpdateSettingsCommand';

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const questsService = new DynamoDBService(dynamoDbClient, process.env.QUESTS_TABLE_NAME);
const userSettingsService = new DynamoDBService(dynamoDbClient, process.env.USER_SETTINGS_TABLE_NAME);

new CompleteQuestCommand(slack, questsService, userSettingsService);
new CreateQuestCommand(slack, questsService, userSettingsService);
new DeleteQuestCommand(slack, questsService);
new IndexQuestsCommand(slack, questsService, userSettingsService);
new JoinQuestCommand(slack, questsService);
new LeaveQuestCommand(slack, questsService);
new UpdateSettingsCommand(slack, userSettingsService);

slack.on('*', msg => {
  console.log('MSG', msg);
});

export const handler = slack.handler.bind(slack);
