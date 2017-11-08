'use strict';

import moment from "moment-timezone";

export default class {
  constructor(questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;
  }

  async execute() {
    const params = {
      FilterExpression: 'isComplete = :isComplete AND endDate <= :now',
      ExpressionAttributeValues: {':isComplete': false, ':now': moment().unix()}
    };

    const expiringQuests = await this.questsService.index(params);
    const userSettings = {};

    return expiringQuests.forEach(quest => {
      quest.isComplete = true;
      this.questsService.update(quest.id, 'SET isComplete = :isComplete', {':isComplete': true});

      quest.participants.foreach(async userId => {
        if (userSettings[userId] === undefined) {
          const currentUserSettings = await this.userSettingsService.get(userId);
          userSettings[userId] = currentUserSettings.enableNotifications;
        }

        if (userSettings[userId]) {
          // notify user
        }
      });
    });
  }
}