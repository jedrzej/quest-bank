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

  async execute() {
    return this.questsService.index({
      FilterExpression: 'isComplete = :isComplete',
      ExpressionAttributeValues: {':isComplete': false}
    });
  }
}