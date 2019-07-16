const AWS = require('aws-sdk');
const crypto = require('crypto');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

export const getLists = async (event, context, callback) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }
    const userData = JSON.parse(event.requestContext.authorizer.user);
    let response = {};
    let params = {
        TableName: process.env.listsTableName,
        KeyConditionExpression: "#userId = :userIdValue",
        ExpressionAttributeNames:{
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ":userIdValue": userData.userId,
        }
    };

    try {
        let lists = await docClient.query(params).promise();

        if (lists.Count === 0) {
            let newList = {
                Item: {
                    userId: userData.userId,
                    listId: crypto.createHash('md5').update(Date.now() + userData.userId).digest('hex'),
                    listName: 'Wishlist',
                    items: docClient.createSet(['empty']),
                },
                TableName: process.env.listsTableName,
            };
            await docClient.put(newList).promise();
            lists = await docClient.query(params).promise();
        }

        response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(lists),
        };
    } catch(e) {
        response = {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify(e),
        };
    }
    callback(null, response);
}
export const addToList = async (event, context, callback) => {
    const { slug, listId } = JSON.parse(event.body)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }
    const userData = JSON.parse(event.requestContext.authorizer.user);
    let response = {};
    try {
        let newProduct = {
            ExpressionAttributeNames: {
                "#items": "items"
            },
            ExpressionAttributeValues: {
                ":item": docClient.createSet([slug])
            },
            Key: {
                listId: listId,
                userId: userData.userId,
            },
            UpdateExpression: "ADD #items :item",
            TableName: process.env.listsTableName,
        };
        await docClient.update(newProduct).promise();

        response = {
            statusCode: 200,
            headers: headers,
        };
    } catch(e) {
        console.log(e),'ERROR';
        response = {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify(e),
        };
    }
    callback(null, response);
};

export const removeFromList = async (event, context, callback) => {
    const { slug, listId } = JSON.parse(event.body)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }
    const userData = JSON.parse(event.requestContext.authorizer.user);
    let response = {};
    try {
        let newProduct = {
            ExpressionAttributeNames: {
                "#items": "items"
            },
            ExpressionAttributeValues: {
                ":item": docClient.createSet([slug])
            },
            Key: {
                listId: listId,
                userId: userData.userId,
            },
            UpdateExpression: "DELETE #items :item",
            TableName: process.env.listsTableName,
        };
        await docClient.update(newProduct).promise();

        response = {
            statusCode: 200,
            headers: headers,
        };
    } catch(e) {
        console.log(e),'ERROR';
        response = {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify(e),
        };
    }
    callback(null, response);
};