const AWS = require('aws-sdk')
const crypto = require('crypto')
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

// eslint-disable-next-line import/prefer-default-export
export const user = (event, context, callback) => {
    const { first_name, last_name, email, password } = JSON.parse(event.body)
    let passwordHashed = crypto.createHash('md5').update(password + process.env.secretsalt).digest("hex")
    let userId = crypto.createHash('md5').update(Date.now() + email + 'somesecret').digest('hex');
    let response = {};
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }
    let params = {
        Item: {
            userId: userId,
            Date: Date.now(),
            FirstName: first_name,
            LastName: last_name,
            Email: email,
            Password: passwordHashed,
        },
        TableName: process.env.profileTableName,
    };

    docClient.put(params, function (err, data) {
        if (err) {
            response = {
                statusCode: 400,
                headers: headers,
                body: JSON.stringify({error: err.message}),
            };
        } else {
            response = {
                statusCode: 200,
                headers: headers,
                body: JSON.stringify(data),
            };
        }
        callback(null, response);
    })
};
