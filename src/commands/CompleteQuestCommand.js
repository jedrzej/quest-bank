'use strict';

import Logger from '../utils/Logger';

export default class {
  constructor(slack, questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;
    this.logger = new Logger('CompleteQuestCommand');

    slack.on('/quest-complete', async (msg, bot) => {
      this.logger.log('Processing message', msg.text);
      const matches = msg.text.trim().match(/[a-z\d-]+/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      const questId = matches[0];

      try {
        await this.execute(questId);
        return bot.replyPrivate('Quest was marked as complete!');
      } catch (e) {
        this.logger.error(e);
        return bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  async execute(questId) {
    const quest = await this.questsService.get(questId);
    if (quest && !quest.isComplete) {
      await this.questsService.update(questId, 'SET isComplete = :isComplete', {':isComplete': true});

      quest.participants.forEach(async userId => {
        const userSettings = await this.userSettingsService.get(userId);
        if (userSettings.enableNotifications) {
          // Notify user
        }
      });
    }
  }
}
