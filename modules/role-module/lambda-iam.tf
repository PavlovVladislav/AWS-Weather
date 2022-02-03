
resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role   = "${aws_iam_role.lambda_role.id}"

  policy = "${file("/modules/role-module/iam/lambda-policy.json")}"
}

resource "aws_iam_role" "lambda_role" {
  name = "LambdaRole"

  assume_role_policy = "${file("/modules/role-module/iam/lambda-assume-policy.json")}"
}

output "role-output" {
  value = aws_iam_role.lambda_role.arn
}