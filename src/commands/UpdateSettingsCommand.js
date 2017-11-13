'use strict';

export default class {
  constructor (slack, userSettingsService) {
    this.userSettingsService = userSettingsService;

    slack.on('/quest-notify', async (msg, bot) => {
      const matches = msg.trim().match(/(on|off)/);

      if (!matches) {
        return bot.replyPrivate('Invalid option value');
      }

      const enableNotifications = matches[1] === 'on';

      try {
        await this.execute(msg.user_id, enableNotifications);
        return bot.replyPrivate(`Notifications have been ${enableNotifications ? 'enabled' : 'disabled'}`);
      } catch (e) {
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
