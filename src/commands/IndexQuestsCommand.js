'use strict';

import Logger from '../utils/Logger';
import isAdmin from '../utils/isAdmin';

const logger = new Logger('IndexQuestCommand');

export default class {
  constructor(slack, questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;

    if (slack) {
      slack.on('/quest-list', async (payload, client) => {
        if (payload.token !== process.env.SLACK_VERIFICATION_TOKEN) {
          logger.log('Forbidden');
          return;
        }

        this.client = client;

        try {
          await this.handle(payload)
        } catch (e) {
          logger.log('ERROR', e.message);
        }
      });
    }
  }

  async handle(payload) {
    const quests = await this.getAvailableQuests();

    const message = await this.buildQuestListForUser(quests, payload.user_id, payload.channel_id);

    message.trigger_id = payload.trigger_id;

    logger.log('SENDING', message);
    this.client.send('chat.postMessage', message).catch(e => {
      throw new Error(e.error);
    });
  }

  async buildQuestListForUser(quests, userId, channelId) {
    const userSettings = await this.userSettingsService.get(userId);

    const list = {
      channel: channelId,
      token: process.env.OAUTH_ACCESS_TOKEN,
      text: 'Available quests',
      attachments: this.getAttachmentsForQuestsAndUser(quests, userId)
    };

    if (userSettings.enableNotifications) {
      list.attachments.push({
        callback_id: userId,
        title: 'Notifications',
        text: 'Notifications are enabled. You will be notified about new quests and be reminded before quest expires.',
        fallback: 'Notifications',
        color: 'danger',
        actions: [
          {
            name: 'disable_notifications',
            text: 'Disable',
            type: 'button',
            value: 'disable_notifications',
            style: 'danger',
          }
        ]
      });
    } else {
      list.attachments.push({
        callback_id: userId,
        title: 'Notifications',
        text: 'Notifications are disabled. If you enable notifications, you will be notified about new quests and be reminded before quest expires.',
        fallback: 'Notifications',
        color: 'good',
        actions: [
          {
            name: 'enable_notifications',
            text: 'Enable',
            type: 'button',
            value: 'enable_notifications'
          }
        ]
      });
    }

    list.attachments = JSON.stringify(list.attachments);

    return list;
  }

  getAttachmentsForQuestsAndUser(quests, userId) {
    if (!quests.length) {
      return [{
        text: 'There are no quests available',
        color: 'danger'
      }];
    }

    const attachments = [];

    quests.forEach(quest => {
      const questAttachment = {
        callback_id: quest.id,
        title: quest.name,
        title_link: quest.detailsLink,
        text: quest.description,
        fallback: quest.name,
        color: quest.participants.includes(userId) ? 'good' : 'danger',
        footer: quest.parsedEndDate ? 'Ends on:' : null,
        ts: quest.parsedEndDate,
        actions: [
          {
            name: quest.participants.includes(userId) ? 'leave' : 'join',
            text: quest.participants.includes(userId) ? 'Leave quest' : 'Join quest',
            type: 'button',
            value: quest.id,
          }
        ]
      };

      if (isAdmin({ user_id: userId })) {
        questAttachment.actions = questAttachment.actions.concat([
          {
            name: 'complete',
            text: 'End quest',
            type: 'button',
            value: quest.id,
            style: 'danger',
            confirm: {
              title: 'Are you sure?',
              text: 'Once quest is ended, it cannot be undone',
              ok_text: 'Yes',
              dismiss_text: 'No'
            }
          },
          {
            name: 'delete',
            text: 'Delete quest',
            type: 'button',
            value: quest.id,
            style: 'danger',
            confirm: {
              title: 'Are you sure?',
              text: 'Once quest is deleted, it cannot be undone',
              ok_text: 'Yes',
              dismiss_text: 'No'
            }
          }
        ]);
      }

      attachments.push(questAttachment);
    });

    return attachments;
  }

  getAvailableQuests() {
    return this.questsService.index({
      FilterExpression: 'isComplete = :isComplete',
      ExpressionAttributeValues: { ':isComplete': false }
    });
  }
}
