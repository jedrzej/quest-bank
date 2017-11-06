'use strict';

import uuid from 'uuid';
import moment from 'moment-timezone';

export default class {
  constructor(slack, questsService) {
    this.questsService = questsService;

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

  execute(name, detailsLink, endDate) {
    if (endDate !== undefined) {
      endDate = moment.tz(endDate, 'Pacific/Pago_Pago').hours(23).minutes(59).second(59).unix();
    }

    const quest = {
      id: uuid.v1(),
      name,
      detailsLink,
      endDate,
      isComplete: endDate <= moment().unix()
    };

    return this.questsService.put(quest);
  }
}