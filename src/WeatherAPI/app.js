const axios = require('axios');
const redis = require('redis');
import { Buffer } from 'buffer';
let AWS = require('aws-sdk');

let response;

const region = "us-east-1";

const API_KEY_WEATHER = await getSecret('API_KEY_WEATHER')

const REDIS = await getSecret('REDIS')

exports.lambdaHandler = async (event, context) => {
    try {
        await validate_data(event);

        const city_name = event.queryStringParameters.city;

        const redis_client = redis.createClient(REDIS);
        await redis_client.connect();

        const cachedResult =  await redis_client.get(city_name)
        if (!cachedResult) {

            let url = `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=metric&appid=${API_KEY_WEATHER}`;

            const data = await axios(url).then(res=>res.data);

            response = {
                'city': city_name,
                'temperature': data.main.temp,
                'weatherCondition': {
                    'type': data.weather[0].main,
                    'pressure': data.main.pressure,
                    'humidity': data.main.humidity,
                },
                'wind': {
                    'speed': data.wind.speed,
                    'direction': data.wind.deg,
                },
            };

            await redis_client.set(city_name)

        } else return cachedResult

    } catch (err) {
        console.log(err);
        return err;
    }

    return response;

    async function validate_data(event) {
        if (Object.keys(event).length == 0) throw Error('Data is empty');

        if (!event.queryStringParameters.city) throw Error('City is not defined');

    }

};

async function getSecret(secretName){
    let aws_client = new AWS.SecretsManager({
        region: region
    });

    aws_client.getSecretValue({SecretId: secretName}, function(err, data) {
        if (err) {
            if (err.code === 'DecryptionFailureException')
                // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InternalServiceErrorException')
                // An error occurred on the server side.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InvalidParameterException')
                // You provided an invalid value for a parameter.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'InvalidRequestException')
                // You provided a parameter value that is not valid for the current state of the resource.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
            else if (err.code === 'ResourceNotFoundException')
                // We can't find the resource that you asked for.
                // Deal with the exception here, and/or rethrow at your discretion.
                throw err;
        }
        else {
            // Decrypts secret using the associated KMS CMK.
            // Depending on whether the secret is a string or binary, one of these fields will be populated.
            if ('SecretString' in data) {
                return data.SecretString;
            } else {
                let buff = new Buffer(data.SecretBinary, 'base64');
                return buff.toString('ascii');
            }
        }
    });

}
