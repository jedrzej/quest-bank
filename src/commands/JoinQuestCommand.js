'use strict';

import slack from 'serverless-slack';

export default class {
  constructor (questsService) {
    this.questsService = questsService;

    slack.on('/quest-join', async (msg, bot) => {
      const matches = msg.trim().match(/[a-z\d-]+/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      const questId = matches[0];

      try {
        await this.execute(questId, msg.user_id);
        return bot.replyPrivate('You just joined a quest!');
      } catch (e) {
        return bot.replyPrivate(e.message);
      }
    });
  }

  async execute (questId, userId) {
    const quest = await this.questsService.get(questId);

    if (!quest) {
      throw new Error('Invalid questId');
    }

    quest.participants = quest.participants || [];

    if (quest.participants.includes(userId)) {
      throw new Error('You are already on this quest!');
    }

    quest.participants.push(userId);

    return this.questsService.update(questId, 'SET participants = :participants', { ':participants': quest.participants });
  }
}
