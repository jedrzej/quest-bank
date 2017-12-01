'use strict';

import moment from 'moment-timezone';
import uuid from 'uuid';
import Logger from '../utils/Logger';

export default class {
  constructor (slack, questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;
    this.logger = new Logger('CreateQuestCommand');

    slack.on('/quest-add', async (msg, bot) => {
      this.logger.log('Processing message', msg.text);
      const matches = msg.text.trim().match(/([a-z\d-]+)\s+(https?[^\s]+)\s*(\d\d\d\d-\d\d-\d\d)?/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      this.logger.log('Matches', matches);

      const name = matches[1];
      const detailsLink = matches[2];
      const endDate = matches[3];

      try {
        await this.execute(name, detailsLink, endDate);
        bot.replyPrivate('Quest added!');
      } catch (e) {
        this.logger.error(e);
        bot.replyPrivate('Whoops! There\'s been an error!');
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

    usersToNotify.forEach(user => {
      // Notify user
    });

    return quest;
  }
}
