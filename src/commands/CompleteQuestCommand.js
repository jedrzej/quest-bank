'use strict';

import slack from "serverless-slack";

export default class {
  constructor(questsService) {
    this.questsService = questsService;

    slack.on('/quest-complete', async (msg, bot) => {
      const matches = msg.trim().match(/[a-z\d\-]+/i);
      if (!matches) {
        return bot.replyPrivate("Invalid questId");
      }

      const questId = matches[0];

      try {
        await this.execute(questId);
        bot.replyPrivate('Quest was marked as complete!');
      } catch (e) {
        bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  execute(questId) {
    return this.questsService.update(questId, 'SET isComplete = :isComplete', {':isComplete': true});
  }
}