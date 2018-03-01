export default payload => {
    const isAdmin = userId => process.env.SLACK_ADMINS.split(',').indexOf(userId) > -1;

    return isAdmin(payload.user_id) || payload.user && isAdmin(payload.user.id);
}
