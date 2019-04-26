const aws = require('aws-sdk');
const request = require('request-promise');

aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: process.env.AWSSecretKey,
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: process.env.AWSAccessKeyId,
    region: 'us-west-2' // region of your bucket
});

const s3 = new aws.S3();

exports.uploadFromUrl = async (url, name, RequestHeaders) => {
  return new Promise(async function(resolve, reject) {
    try {
      const { headers, body } = await request({ url, encoding: null, resolveWithFullResponse: true, headers: RequestHeaders });
      mimetype = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
      }
      console.log(body);
      const imgType = headers['content-type'];
      const filetype = imgType in mimetype ? mimetype[imgType] : '.png';
      const result = await s3.upload({
        Bucket: 'tcliberry',
        Key: `${name}${filetype}`,
        Body: body, // buffer
        ACL: 'public-read',
      }).promise();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}