'use strict';

import slack from "serverless-slack";

export default class {
  constructor(questsService) {
    this.questsService = questsService;

    slack.on('/quest-list', async (msg, bot) => {
      try {
        await this.execute();
        bot.replyPrivate('Quest list!');
      } catch (e) {
        bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  async execute(status) {
    const params = {};

    switch (status) {
      case 'active':
        params.FilterExpression = 'isComplete = :isComplete';
        params.ExpressionAttributeValues = {':isComplete': false};
        break;
      case 'complete':
        params.FilterExpression = 'isComplete = :isComplete';
        params.ExpressionAttributeValues = {':isComplete': true};
        break;
    }

    return this.questsService.index(params);
  }
}