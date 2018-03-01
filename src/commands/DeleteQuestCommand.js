'use strict';

import Logger from '../utils/Logger';
import IndexQuestsCommand from './IndexQuestsCommand';
import isAdmin from '../utils/isAdmin';

const logger = new Logger('DeleteQuestCommand');

export default class {
  constructor(slack, questsService) {
    this.questsService = questsService;

    slack.on('*', async (payload, client) => {
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

  async handle(payload) {
    if (payload.type === 'interactive_message' && payload.actions.length && payload.actions[0].name === 'delete') {

      if (!isAdmin(payload)) {
        return;
      }

      const quest = await this.questsService.get(payload.callback_id);

      if (quest) {
        await this.deleteQuest(quest);
      }

      const indexQuestsCommand = new IndexQuestsCommand(null, this.questsService);
      const quests = await indexQuestsCommand.getAvailableQuests();

      if (quests.length) {
        const message = indexQuestsCommand.buildQuestListForUser(quests, payload.user.id, payload.channel.id);

        message.trigger_id = payload.trigger_id;
        message.message_ts = payload.message_ts;

        logger.log('SENDING', message);
        this.client.send('chat.postMessage', message).catch(e => {
          throw new Error(e.error);
        });
      }
    }
  }

  deleteQuest(quest) {
    return this.questsService.delete(quest.id);
  }
}
