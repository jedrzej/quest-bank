'use strict';

import Logger from '../utils/Logger';
import isAdmin from '../utils/isAdmin';

const logger = new Logger('IndexQuestCommand');

export default class {
  constructor(slack, questsService) {
    this.questsService = questsService;

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

    if (quests.length) {
      const message = this.buildQuestListForUser(quests, payload.user_id, payload.channel_id);

      message.trigger_id = payload.trigger_id;

      logger.log('SENDING', message);
      this.client.send('chat.postMessage', message).catch(e => {
        throw new Error(e.error);
      });
    }
  }

  buildQuestListForUser(quests, user_id, channel_id) {
    return {
      channel: channel_id,
      token: process.env.OAUTH_ACCESS_TOKEN,
      text: 'Available quests',
      attachments: JSON.stringify(this.getAttachmentsForQuestsAndUser(quests, user_id))
    };
  }

  getAttachmentsForQuestsAndUser(quests, user_id) {
    const attachments = [];

    quests.forEach(quest => {
      const questAttachment = {
        callback_id: quest.id,
        title: quest.name,
        title_link: quest.detailsLink,
        text: quest.description,
        fallback: quest.name,
        color: quest.participants.includes(user_id) ? 'good' : 'danger',
        footer: quest.parsedEndDate ? 'Ends on:' : null,
        ts: quest.parsedEndDate,
        actions: [
          {
            'name': quest.participants.includes(user_id) ? 'leave' : 'join',
            'text': quest.participants.includes(user_id) ? 'Leave quest' : 'Join quest',
            'type': 'button',
            'value': quest.id,
          }
        ]
      };

      if (isAdmin({ user_id })) {
        questAttachment.actions = questAttachment.actions.concat([
          {
            'name': 'complete',
            'text': 'End quest',
            'type': 'button',
            'value': quest.id,
            'style': 'danger',
            'confirm': {
              'title': 'Are you sure?',
              'text': 'Once quest is ended, it cannot be undone',
              'ok_text': 'Yes',
              'dismiss_text': 'No'
            }
          },
          {
            'name': 'delete',
            'text': 'Delete quest',
            'type': 'button',
            'value': quest.id,
            'style': 'danger',
            'confirm': {
              'title': 'Are you sure?',
              'text': 'Once quest is deleted, it cannot be undone',
              'ok_text': 'Yes',
              'dismiss_text': 'No'
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
