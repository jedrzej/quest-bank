'use strict';

import slack from "serverless-slack";

export default class {
  constructor(questsService) {
    this.questsService = questsService;

    slack.on('/quest-complete', async (msg, bot) => {
      try {
        await this.execute("5");
        bot.replyPrivate('Quest was marked as complete!');
      } catch (e) {
        bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  execute(id) {
    return this.questsService.update(id, 'SET isComplete = :isComplete', {':isComplete': true});
  }
}