'use strict';

import Logger from '../utils/Logger';

export default class {
  constructor (slack, questsService) {
    this.questsService = questsService;
    this.logger = new Logger('CreateQuestCommand');

    slack.on('/quest-delete', async (msg, bot) => {
      this.logger.log('Processing message', msg.text);
      const matches = msg.text.trim().match(/[a-z\d-]+/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      this.logger.log('Matches', matches);

      const questId = matches[0];

      try {
        await this.execute(questId);
        return bot.replyPrivate('Quest deleted!');
      } catch (e) {
        this.logger.error(e);
        return bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });

  }

  execute (questId) {
    return this.questsService.delete(questId);
  }
}
