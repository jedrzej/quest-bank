'use strict';

import uuid from 'uuid';
import moment from 'moment-timezone';

export default class {
  constructor(slack, userSettingsService) {
    this.userSettingsService = userSettingsService;

    slack.on('/quest-notify', async (msg, bot) => {
      const matches = msg.trim().match(/(on|off)/);
      if (!matches) {
        return bot.replyPrivate("Invalid option value");
      }

      const enableNotifications = matches[1] === 'on' ? true : false;

      try {
        await this.execute(msg.user_id, enableNotifications);
        bot.replyPrivate(`Notifications have been ${enableNotifications ? 'enabled' : 'disabled'}`);
      } catch (e) {
        bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  execute(userId, enableNotifications) {
    return this.userSettingsService.put({
      id: userId,
      enableNotifications
    });
  }
}