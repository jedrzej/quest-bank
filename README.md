# Quest Bank
Quest Bank is a Slack application that lets users track available quests.

## Available commands

### Add quest
Create a new quest. Users with notifications turned on will get be notified.

Command: `/quest-add <name> <link> <endDate>`

Arguments:
  - name - must be a single word (for now!)
  - link - a Slack link to a post with quest details
  - endDate - optional date when quest ends, in YYYY-MM-DD format


### Delete quest
Delete an existing quest.

Command: `/quest-delete <id>`

Arguments:
  - id - quest ID

### Mark quest as complete
Mark an existing quest as complete. Users with notifications turned on will get be notified.

Command: `/quest-complete <id>`

Arguments:
  - id - quest ID

### List active quests
Show a list of all active quests.

Command: `/quest-list`

### Join quest
Join an active quest. Users participating in a quest with notifications turned on will be reminded one day before a quest ends.

Command: `/quest-join <id>`

Arguments:
  - id - quest ID

### Leave quest
Leave a previously joined quest.

Command `/quest-leave <id>`

Arguments:
  - id - quest ID

### Manage notifications
Enable/disable notifications.

Command: `/quest-notify <value>`

Arguments:
  - value - `on` or `off`
  
Notifications sent by the application:
  - new quest is created - sent to everyone
  - quest has completed - sent to quest participants
  - quest reminder - sent to quest participants one day before quest's end date
