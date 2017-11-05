'use strict';

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute() {
    return this.questsService.getAll();
  }
}