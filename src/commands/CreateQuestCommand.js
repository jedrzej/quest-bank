'use strict';

import uuid from "uuid";

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute(name, detailsLink) {
    const quest = {
      id: uuid.v1(),
      name,
      detailsLink
    };

    return this.questsService.put(quest);
  }
}