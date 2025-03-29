const {S3} = require ('@aws-sdk/client-s3')
const endpoint = "https://nyc3.digitaloceanspaces.com";
require('dotenv').config();

const s3Client = new S3 ({
    endpoint,
    region: 'us-east-1',
    credentials:  {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    }
});

module.exports = s3Client;
