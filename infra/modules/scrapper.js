const https = require('https');

export const getProductData = (slug) => {
    return new Promise(function(resolve, reject) {
        const options = {
            hostname: 'www.unrealengine.com',
            port: 443,
            path: '/marketplace/api/assets/asset/' + slug,
            method: 'GET'
        }
        let body = [];
        const req = https.request(options, (res) => {
            res.on('data', (d) => {
                body.push(d);
            })
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(removeEmptyStringElements(body.data.data));
            });
        })

        req.on('error', (error) => {
            reject(error);
        })

        req.end()
    });
};

const removeEmptyStringElements = (obj) => {
    for (var prop in obj) {
      if (typeof obj[prop] === 'object') {// dive deeper in
        removeEmptyStringElements(obj[prop]);
      } else if(obj[prop] === '') {// delete elements that are empty strings
        delete obj[prop];
      }
    }
    return obj;
  }
