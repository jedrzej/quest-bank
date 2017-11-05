'use strict';

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute(id) {
    return this.questsService.delete(id);
  }
}