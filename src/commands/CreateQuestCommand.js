'use strict';

import moment from 'moment-timezone';
import uuid from 'uuid';
import Logger from '../utils/Logger';
import isAdmin from '../utils/isAdmin';
import notify from '../utils/notify';

export default class {
  constructor(slack, questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;
    this.logger = new Logger('CreateQuestCommand');

    slack.on('/quest-add', async (msg, bot) => {
      if (!isAdmin(msg)) {
        return bot.replyPrivate('Only admins are allowed to create quests.');
      }

      this.logger.log('Processing message', msg.text);
      const matches = msg.text.trim().match(/([a-z\d-]+)\s+(https?[^\s]+)\s*(\d{4}-\d{2}-\d{2})?/i);

      if (!matches) {
        return bot.replyPrivate('Invalid command format.');
      }

      this.logger.log('Matches', matches);

      const name = matches[1];
      const detailsLink = matches[2];
      const endDate = matches[3];

      try {
        const quest = await this.execute(name, null, detailsLink, endDate);

        this.logger.log(`Created quest ${quest.id}`, quest);
        bot.replyPrivate(`Quest added! ID: ${quest.id}`);
      } catch (e) {
        this.logger.error(e);
        bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  async execute(name, description, detailsLink, endDate) {
    let parsedEndDate;

    if (typeof endDate !== 'undefined') {
      parsedEndDate = moment.tz(endDate, 'Pacific/Pago_Pago').hours(23).minutes(59).second(59).unix();
    }

    const quest = {
      id: uuid.v1(),
      name,
      description,
      detailsLink,
      parsedEndDate,
      isComplete: Boolean(parsedEndDate && parsedEndDate <= moment().unix()),
      needsReminder: Boolean(parsedEndDate && parsedEndDate - moment().unix() > 24 * 3600),
      participants: []
    };

    await this.questsService.put(quest);

    const usersToNotify = await this.userSettingsService.index({
      FilterExpression: 'enableNotifications = :enableNotifications',
      ExpressionAttributeValues: { ':enableNotifications': true }
    });

    usersToNotify.forEach(user => {
      notify(user.id, `Quest "${quest.name}" was just created.`);
    });

    return quest;
  }
}
