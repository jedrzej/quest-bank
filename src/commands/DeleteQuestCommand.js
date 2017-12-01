'use strict';

import Logger from '../utils/Logger';

export default class {
  constructor(slack, questsService) {
    this.questsService = questsService;
    this.logger = new Logger('DeleteQuestCommand');

    slack.on('/quest-delete', async (msg, bot) => {
      this.logger.log('Processing message', msg.text);
      const matches = msg.text.trim().match(/[a-z\d-]+/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      const questId = matches[0];

      try {
        await this.execute(questId);
        return bot.replyPrivate('Quest deleted!');
      } catch (e) {
        this.logger.error(e);
        return bot.replyPrivate(e.message);
      }
    });

  }

  async execute(questId) {
    const quest = await this.questsService.get(questId);

    if (!quest) {
      throw new Error('Invalid questId');
    }

    return this.questsService.delete(questId);
  }
}
