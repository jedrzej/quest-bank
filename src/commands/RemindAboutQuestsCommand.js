'use strict';

import moment from "moment-timezone";

export default class {
  constructor(questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;
  }

  async execute() {
    const params = {
      FilterExpression: 'isComplete = :isComplete AND isReminded != :isReminded AND endDate <= :plusOneDay',
      ExpressionAttributeValues: {
        ':isComplete': false,
        ':plusOneDay': moment().unix() + 24*3600,
        ':isReminded': true
      }
    };

    const questsThatExpireIn24hours = await this.questsService.index(params);
    const userSettings = {};

    return questsThatExpireIn24hours.forEach(async quest => {
      quest.participants.foreach(async userId => {
        if (userSettings[userId] === undefined) {
          const currentUserSettings = await this.userSettingsService.get(userId);
          userSettings[userId] = currentUserSettings.enableNotifications;
        }

        if (userSettings[userId]) {
          // notify user
        }
      });
      await this.questsService.update(quest.id, 'SET isReminded = :isReminded', {':isReminded': true});
    });
  }
}