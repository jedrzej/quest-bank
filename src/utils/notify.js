import request from 'request';

export default (userId, message) => request({
    uri: 'https://slack.com/api/chat.postMessage',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OAUTH_ACCESS_TOKEN}`
    },
    json: true,
    body: {
        text: message,
        channel: userId
    }
})
