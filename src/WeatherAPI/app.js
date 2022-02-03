const axios = require('axios')

let response;
const API_KEY_WEATHER = process.env.API_KEY_WEATHER

exports.lambdaHandler = async (event, context) => {
    try {

        await validate_data(event)

        const city_name = event.queryStringParameters.city

        let url = `api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY_WEATHER}`

        const data = await axios(url);

        response = {
            "city": "Oslo",
            "temperature": 14,
            "weatherCondition": {
                "type": "Drizzle",
                "pressure": 1012
                "humidity": 81
            },
            "wind": {
                "speed": 4.1,
                "direction": "NE"
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response

    async function validate_data(event){
        if(Object.keys(event).length == 0) throw Error("Data is empty")

        if(event.queryStringParameters.hasOwnProperty('city'))
            throw Error('City is not defined')

    }
};
