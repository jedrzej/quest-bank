'use strict';
import moment from 'moment-timezone';

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute(id) {
    return this.questsService.update(id, 'SET isComplete = :isComplete', { ':isComplete': true});
  }
}