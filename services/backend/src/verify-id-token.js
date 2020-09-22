const _ = require('lodash');
const { dynamoUtils, secretUtils } = require('@logan/aws');
const { OAuth2Client } = require('google-auth-library');
const auth = require('../utils/auth');

async function verifyIdToken(req, res) {
    const { clientId } = await secretUtils.getSecret('logan/web-google-creds');

    // Verify the ID token from the request body
    const { idToken } = req.body;
    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
    });

    const { name, email } = ticket.getPayload();

    // Check if the user already exists in DynamoDB
    const response = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.USERS,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
    });

    if (_.isEmpty(response.Items)) {
        // User does not exist
        res.json({
            exists: false,
            meta: { name, email },
            token: await auth.generateBearerToken({ action: auth.UNAUTHORIZED_ACTIONS.CREATE_USER }, 'web'),
        });
    } else {
        // User exists
        const user = _.first(response.Items);
        res.json({
            exists: true,
            user,
            token: await auth.generateBearerToken({ uid: user.uid }, 'web'),
        });
    }
}

module.exports = {
    verifyIdToken,
};
