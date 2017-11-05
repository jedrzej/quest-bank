'use strict';

import uuid from "uuid";
import moment from "moment-timezone";

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute(name, detailsLink, endDate) {
    if (endDate !== undefined) {
      endDate = moment.tz(endDate, 'Pacific/Pago_Pago').hours(23).minutes(59).second(59).unix();
    }

    const quest = {
      id: uuid.v1(),
      name,
      detailsLink,
      endDate
    };

    return this.questsService.put(quest);
  }
}