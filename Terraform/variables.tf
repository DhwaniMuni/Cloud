variable "project_name" {
  type    = string
  default = "ignite2-dhwani"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "aws_region" {
  type    = string
  default = "us-west-2"
}

variable "image_tag" {
  type    = string
  default = "v1"
}

variable "container_port" {
  type    = number
  default = 80
}

variable "vpc_cidr" {
  type    = string
  default = "10.10.48.0/20"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.10.48.0/24", "10.10.49.0/24"]
}

locals {
  name = "${var.project_name}-${var.environment}"
}
