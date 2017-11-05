'use strict';
import moment from "moment-timezone";

export default class {
  constructor(questsService) {
    this.questsService = questsService;
  }

  async execute(id, name, detailsLink, endDate) {
    if (endDate !== undefined) {
      endDate = moment.tz(endDate, 'Pacific/Pago_Pago').hours(23).minutes(59).second(59).unix();
    }

    const quest = {
      id,
      name,
      detailsLink,
      endDate
    };

    return this.questsService.put(quest);
  }
}