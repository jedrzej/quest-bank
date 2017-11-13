'use strict';

import moment from 'moment-timezone';
import slack from 'serverless-slack';
import uuid from 'uuid';

export default class {
  constructor (questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;

    slack.on('/quest-add', async (msg, bot) => {
      console.log(msg);
      const matches = msg.trim().match(/([a-z\d-]+)\s+(https?[^\s]+)\s*(\d\d\d\d-\d\d-\d\d)?/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      console.log(matches);

      const name = matches[1];
      const detailsLink = matches[2];
      const endDate = matches[3];

      try {
        await this.execute(name, detailsLink, endDate);
        return bot.replyPrivate('Quest added!');
      } catch (e) {
        return bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  async execute (name, detailsLink, endDate) {
    let parsedEndDate;

    if (typeof endDate !== 'undefined') {
      parsedEndDate = moment.tz(endDate, 'Pacific/Pago_Pago').hours(23).minutes(59).second(59).unix();
    }

    const quest = await this.questsService.put({
      id: uuid.v1(),
      name,
      detailsLink,
      parsedEndDate,
      isComplete: parsedEndDate && parsedEndDate <= moment().unix(),
      needsReminder: parsedEndDate && parsedEndDate - moment().unix() > 24 * 3600
    });

    const usersToNotify = await this.userSettingsService.index({
      FilterExpression: 'enableNotifications = :enableNotifications',
      ExpressionAttributeValues: { ':enableNotifications': true }
    });

    usersToNotify.foreach(user => {
      // Notify user
    });

    return quest;
  }
}
