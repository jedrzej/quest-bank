'use strict';

import moment from "moment-timezone";

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute() {

    try {
      await this.t("64f739a0-c33b-11e7-acd1-a982cbbd5675", "U123");
      console.log('You just left a quest!');
      return;

      //bot.replyPrivate('You just joined a quest!');
    } catch (e) {
      console.log(e);
      //bot.replyPrivate((typeof e === 'string') ? e : 'Whoops! There\'s been an error!');
      console.log((typeof e === 'string') ? e : 'Whoops! There\'s been an error!');
      return;
    }





    const params = {
      FilterExpression: 'isComplete = :isComplete AND endDate <= :now',
      ExpressionAttributeValues: {':isComplete': false, ':now': moment().unix()}
    };

    const expiringQuests = await this.questsService.index(params);

    return expiringQuests.forEach(quest => {
      quest.isComplete = true;
      this.questsService.update(quest.id, 'SET isComplete = :isComplete', {':isComplete': true});
    });
  }

  async t(questId, userId) {
    const quest = await this.questsService.get(questId);
    if (!quest) {
      throw "Invalid questId";
    }

    quest.participants = quest.participants || [];

    if (!quest.participants.includes(userId)) {
      throw "You are not on this quest!";
    }

    const updatedParticipants = quest.participants.filter(participantId => participantId !== userId);

    return this.questsService.update(
      questId,
      'SET participants = :updatedParticipants',
      {
        ':updatedParticipants': quest.updatedParticipants,
        ':participants': quest.participants
      },
      'participants = :participants',
    );
  }
}