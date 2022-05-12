resource "aws_secretsmanager_secret" "WeatherAPIKey" {
  name = "API_KEY_WEATHER"
}