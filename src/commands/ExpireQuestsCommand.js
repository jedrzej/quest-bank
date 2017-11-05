'use strict';

import moment from "moment-timezone";

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute() {
    const params = {
      FilterExpression: 'isComplete = :isComplete AND endDate <= :now',
      ExpressionAttributeValues: {':isComplete': false, ':now': moment().unix()}
    };

    const expiringQuests = await this.questsService.index(params);

    expiringQuests.forEach(quest => this.questsService.update(quest.id, 'SET isComplete = :isComplete', {':isComplete': true}));
  }
}