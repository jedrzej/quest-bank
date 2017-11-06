'use strict';

import slack from "serverless-slack";

export default class {
  constructor(questsService) {
    this.questsService = questsService;

    slack.on('/quest-join', async (msg, bot) => {
      const matches = msg.trim().match(/[a-z\d\-]+/i);
      if (!matches) {
        return bot.replyPrivate("Invalid questId");
      }

      const questId = matches[0];

      try {
        await this.execute(questId, msg.user_id);
        bot.replyPrivate('You just joined a quest!');
      } catch (e) {
        bot.replyPrivate((typeof e === 'string') ? e : 'Whoops! There\'s been an error!');
      }
    });
  }

  async execute(questId, userId) {
    const quest = await this.questsService.get(questId);
    if (!quest) {
      throw "Invalid questId";
    }

    quest.participants = quest.participants || [];

    if (quest.participants.includes(userId)) {
      throw "You are already on this quest!";
    }

    quest.participants.push(userId);

    return this.questsService.update(questId, 'SET participants = :participants', {':participants': quest.participants});
  }
}