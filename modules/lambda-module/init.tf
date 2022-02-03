module "src" {
  source = "Lambdas"
  role_arn = var.role_arn
  output_path = local.lambda_zip_location
}
