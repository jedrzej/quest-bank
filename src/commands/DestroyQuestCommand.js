'use strict';

import slack from "serverless-slack";

export default class {
  constructor(questsService) {
    this.questsService = questsService;

    slack.on('/quest-delete', async (msg, bot) => {
      try {
        await this.execute("5");
        bot.replyPrivate('Quest deleted!');
      } catch (e) {
        bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });

  }

  async execute(id) {
    return this.questsService.delete(id);
  }
}