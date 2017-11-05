'use strict';

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute(status) {
    const params = {};

    switch (status) {
      case 'active':
        params.FilterExpression = 'isComplete = :isComplete';
        params.ExpressionAttributeValues = {':isComplete': false};
        break;
      case 'complete':
        params.FilterExpression = 'isComplete = :isComplete';
        params.ExpressionAttributeValues = {':isComplete': true};
        break;
    }

    return this.questsService.index(params);
  }
}