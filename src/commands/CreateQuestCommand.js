'use strict';

import uuid from 'uuid';
import moment from 'moment-timezone';

export default class {
  constructor(questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;

    slack.on('/quest-add', async (msg, bot) => {
      const matches = msg.trim().match(/([a-z\d\-]+)\s+(https?[^\s]+)\s*(\d\d\d\d\-\d\d\-\d\d)?/i);
      if (!matches) {
        return bot.replyPrivate("Invalid questId");
      }

      try {
        await this.execute(name, detailsLink, endDate);
        bot.replyPrivate('Quest added!');
      } catch (e) {
        bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  async execute(name, detailsLink, endDate) {
    if (endDate !== undefined) {
      endDate = moment.tz(endDate, 'Pacific/Pago_Pago').hours(23).minutes(59).second(59).unix();
    }

    const quest = await this.questsService.put({
      id: uuid.v1(),
      name,
      detailsLink,
      endDate,
      isComplete: endDate <= moment().unix(),
      needsReminder: endDate !== undefined && (endDate - moment().unix() > 24*3600)
    });

    const usersToNotify = await this.userSettingsService.index({
      FilterExpression: 'enableNotifications = :enableNotifications',
      ExpressionAttributeValues: {':enableNotifications': true}
    });

    usersToNotify.foreach(user => {
      // notify user
    });

    return quest;
  }
}