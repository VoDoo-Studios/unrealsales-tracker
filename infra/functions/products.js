const AWS = require('aws-sdk');
import { getProductData } from '../modules/scrapper';
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

// eslint-disable-next-line import/prefer-default-export
export const addProduct = async (event, context, callback) => {
    const { slug } = JSON.parse(event.body)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    }
    let response = {};
    let params = {
        TableName: process.env.productsTableName,
        KeyConditionExpression: "#slug = :slugValue",
        ExpressionAttributeNames:{
            "#slug": "slug"
        },
        ExpressionAttributeValues: {
            ":slugValue": slug
        }
    };
    try {
        let existingProduct = await docClient.query(params).promise();

        if (existingProduct.Count === 0) {
            let productData = await getProductData(slug)
            let newProduct = {
                Item: {
                    slug: slug,
                    ...productData,
                },
                TableName: process.env.productsTableName,
            };
            await docClient.put(newProduct).promise();
            existingProduct = await docClient.query(params).promise();
        }

        response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(existingProduct),
        };
    } catch(e) {
        response = {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify(e),
        };
    }
    callback(null, response);

};