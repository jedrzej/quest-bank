'use strict';

import Logger from '../utils/Logger';

const logger = new Logger('UpdateSettingsCommand');

export default class {
  constructor(slack, userSettingsService) {
    this.userSettingsService = userSettingsService;

    slack.on('/quest-notify', async (payload, client) => {
      if (payload.token !== process.env.SLACK_VERIFICATION_TOKEN) {
        logger.log('Forbidden');
        return;
      }

      this.client = client;

      try {
        await this.handleCommand(payload)
      } catch (e) {
        logger.log('ERROR', e.message);
      }
    });

    slack.on('*', async (payload, client) => {
      if (payload.token !== process.env.SLACK_VERIFICATION_TOKEN) {
        logger.log('Forbidden');
        return;
      }

      this.client = client;

      try {
        await this.handleResponse(payload)
      } catch (e) {
        logger.log('ERROR', e.message);
      }
    });
  }

  async handleCommand(payload) {
    const matches = payload.text.trim().match(/(on|off)/);
    if (!matches) {
      return this.client.replyPrivate('Invalid option value');
    }

    const enableNotifications = matches[1] === 'on';
    await this.updateEnableNotificationsSetting(payload.user_id, enableNotifications);
    return bot.replyPrivate(`Notifications have been ${enableNotifications ? 'enabled' : 'disabled'}`);
  }

  async handleResponse(payload) {
    if (payload.type === 'interactive_message' && payload.actions.length && payload.actions[0].name === 'disable_notifications') {
      await this.updateEnableNotificationsSetting(payload.user.id, false);
      return bot.replyPrivate('Notifications have been disabled');
    } else if (payload.type === 'interactive_message' && payload.actions.length && payload.actions[0].name === 'enable_notifications') {
      await this.updateEnableNotificationsSetting(payload.user.id, true);
      return bot.replyPrivate('Notifications have been false');
    }
  }

  updateEnableNotificationsSetting(userId, enableNotifications) {
    return this.userSettingsService.put({
      id: userId,
      enableNotifications
    });
  }
}
