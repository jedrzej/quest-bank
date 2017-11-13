'use strict';

export default class {
  constructor (slack, questsService) {
    this.questsService = questsService;

    slack.on('/leave-join', async (msg, bot) => {
      const matches = msg.trim().match(/[a-z\d-]+/i);

      if (!matches) {
        return bot.replyPrivate('Invalid questId');
      }

      const questId = matches[0];

      try {
        await this.execute(questId, msg.user_id);
        return bot.replyPrivate('You just left a quest!');
      } catch (e) {
        return bot.replyPrivate(e.message);
      }
    });
  }

  async execute (questId, userId) {
    const quest = await this.questsService.get(questId);

    if (!quest) {
      throw new Error('Invalid questId');
    }

    quest.participants = quest.participants || [];

    if (!quest.participants.includes(userId)) {
      throw new Error('You are not on this quest!');
    }

    const updatedParticipants = quest.participants.filter(participantId => participantId !== userId);

    return this.questsService.update(
      questId,
      'SET participants = :updatedParticipants',
      {
        ':updatedParticipants': updatedParticipants,
        ':participants': quest.participants
      },
      'participants = :participants',
    );
  }
}
