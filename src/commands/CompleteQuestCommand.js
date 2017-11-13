'use strict';

import slack from 'serverless-slack';

export default class {
  constructor (questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;

    slack.on('/quest-complete', async (msg, bot) => {
      const matches = msg.trim().match(/[a-z\d-]+/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      const questId = matches[0];

      try {
        await this.execute(questId);
        return bot.replyPrivate('Quest was marked as complete!');
      } catch (e) {
        return bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  async execute (questId) {
    const quest = await this.questsService.update(questId, 'SET isComplete = :isComplete', { ':isComplete': true });

    const userSettings = {};

    quest.participants.foreach(async userId => {
      if (typeof userSettings[userId] === 'undefined') {
        const currentUserSettings = await this.userSettingsService.get(userId);

        userSettings[userId] = currentUserSettings.enableNotifications;
      }

      if (userSettings[userId]) {
        // Notify user
      }
    });

    return quest;
  }
}
