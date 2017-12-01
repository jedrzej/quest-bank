'use strict';

import Logger from '../utils/Logger';

export default class {
  constructor(slack, questsService) {
    this.questsService = questsService;
    this.logger = new Logger('JoinQuestCommand');

    slack.on('/quest-join', async (msg, bot) => {
      this.logger.log('Processing message', msg.text);
      const matches = msg.text.trim().match(/[a-z\d-]+/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      const questId = matches[0];

      try {
        await this.execute(questId, msg.user_id);
        return bot.replyPrivate('You just joined a quest!');
      } catch (e) {
        this.logger.error(e);
        return bot.replyPrivate(e.message);
      }
    });
  }

  async execute(questId, userId) {
    const quest = await this.questsService.get(questId);

    if (!quest) {
      throw new Error('Invalid questId');
    }

    if (quest.participants.includes(userId)) {
      throw new Error('You are already on this quest!');
    }

    quest.participants.push(userId);

    return this.questsService.update(questId, 'SET participants = :participants', {':participants': quest.participants});
  }
}
