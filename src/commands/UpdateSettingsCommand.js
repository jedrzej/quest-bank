'use strict';

import Logger from '../utils/Logger';

export default class {
  constructor (slack, userSettingsService) {
    this.userSettingsService = userSettingsService;
    this.logger = new Logger('UpdateSettingsCommand');

    slack.on('/quest-notify', async (msg, bot) => {
      this.logger.log('Processing message', msg.text);
      const matches = msg.text.trim().match(/(on|off)/);

      if (!matches) {
        return bot.replyPrivate('Invalid option value');
      }

      this.logger.log('Matches', matches);

      const enableNotifications = matches[1] === 'on';

      try {
        await this.execute(msg.user_id, enableNotifications);
        return bot.replyPrivate(`Notifications have been ${enableNotifications ? 'enabled' : 'disabled'}`);
      } catch (e) {
        this.logger.error(e);
        return bot.replyPrivate('Whoops! There\'s been an error!');
      }
    });
  }

  execute (userId, enableNotifications) {
    return this.userSettingsService.put({
      id: userId,
      enableNotifications
    });
  }
}
