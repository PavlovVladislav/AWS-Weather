

provider "aws" {
  access_key = "access_key"
  secret_key = "secret_key"
  region     = "us-east-1"
}

module "iam-role" {
  source = "./modules/role-module"
}

module "lambdas" {
  source   = "./modules/lambda-module"
  role_arn = module.iam-role.role-output
}