'use strict';

import slack from "serverless-slack";

export default class {
  constructor(questsService) {
    this.questsService = questsService;

    slack.on('/quest-delete', async (msg, bot) => {
      const matches = msg.trim().match(/[a-z\d\-]+/i);
      if (!matches) {
        return bot.replyPrivate("Invalid questId");
      }

      const questId = matches[0];

      try {
        await this.execute(questId);
        bot.replyPrivate('Quest deleted!');
      } catch (e) {
        bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });

  }

  async execute(questId) {
    return this.questsService.delete(questId);
  }
}