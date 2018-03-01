'use strict';

import moment from 'moment-timezone';

export default class {
  constructor(questsService, userSettingsService) {
    this.questsService = questsService;
    this.userSettingsService = userSettingsService;
  }

  async execute() {
    const secondsInDay = 24 * 3600;
    const params = {
      FilterExpression: 'isComplete = :isComplete AND needsReminder = :needsReminder AND endDate <= :plusOneDay',
      ExpressionAttributeValues: {
        ':isComplete': false,
        ':plusOneDay': moment().unix() + secondsInDay,
        ':needsReminder': true
      }
    };

    const questsThatExpireIn24hours = await this.questsService.index(params);
    const userSettings = {};

    return questsThatExpireIn24hours.forEach(async quest => {
      quest.participants.foreach(async userId => {
        if (typeof userSettings[userId] === 'undefined') {
          const currentUserSettings = await this.userSettingsService.get(userId);

          userSettings[userId] = currentUserSettings.enableNotifications;
        }

        if (userSettings[userId]) {
          // Notify user
        }
      });
      await this.questsService.update(quest.id, 'SET needsReminder = :needsReminder', { ':needsReminder': false });
    });
  }
}
