const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk')
const crypto = require('crypto')
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

// eslint-disable-next-line import/prefer-default-export
export const user = (event, context, callback) => {
    const { email, password } = JSON.parse(event.body)
    let passwordHashed = crypto.createHash('md5').update(password + process.env.secretsalt).digest('hex')
    let params = {
        TableName: process.env.profileTableName,
        FilterExpression: '#email = :emailValue and #password = :passwordValue',
        ExpressionAttributeNames: {
            '#email': 'Email',
            '#password': 'Password',
        },
        ExpressionAttributeValues: {
            ':emailValue': email,
            ':passwordValue': passwordHashed
        }
    };

    docClient.scan(params, function (err, data) {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
        let response = {};
        if (err) {
            response = {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({error: err.message}),
            };
        } else if (data.Count !== 1) {
            response = {
                statusCode: 401,
                headers: headers,
                body: JSON.stringify({error: 'Bad email/password combination'}),
            };
        } else {
            const token = jwt.sign({userId: data.Items[0].userId}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            response = {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify({userToken: token}),
            };
        }
        callback(null, response);
    })
};
