
data "archive_file" "AWS-Weather" {
  type = "zip"
  source_dir = "src/WeatherAPI"
  output_path = "dist/WeatherAPI.zip"
}

resource "aws_lambda_function" "WeatherAPI" {
  function_name = "AWS-Weather"
  role          = var.role_arn
  handler       = "app.lambdaHandler"
  filename      = "dist/WeatherAPI.zip"
  runtime       = "nodejs14.x"
  source_code_hash = "${filebase64sha256("dist/WeatherAPI.zip")}"
  environment {
    variables = {
      "API_KEY_WEATHER" = "8c3f07acf22d4e18045114794371122f"
    }
  }
}


