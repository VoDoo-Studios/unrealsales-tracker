const jwt = require('jsonwebtoken');

const buildIAMPolicy = (userId, effect, resource, context) => {
    const policy = {
      principalId: userId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
      context,
    };
  
    return policy;
};
/**
  * Authorizer functions are executed before your actual functions.
  * @method authorize
  * @param {String} event.authorizationToken - JWT
  * @throws Returns 401 if the token is invalid or has expired.
  * @throws Returns 403 if the token does not have sufficient permissions.
  */
export const handler = (event, context, callback) => {
  const token = event.authorizationToken.split(' ')[1];;

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const effect = 'Allow';
    const userId = decoded.userId;
    const authorizerContext = { user: JSON.stringify(decoded) };
    // Return an IAM policy document for the current endpoint
    const policyDocument = buildIAMPolicy(userId, effect, event.methodArn, authorizerContext);

    callback(null, policyDocument);
  } catch (e) {
    callback('Unauthorized'); // Return a 401 Unauthorized response
  }
};