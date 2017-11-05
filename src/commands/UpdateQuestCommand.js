'use strict';

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute(id, name, detailsLink) {
    const quest = {
      id,
      name,
      detailsLink
    };

    return this.questsService.put(quest);
  }
}