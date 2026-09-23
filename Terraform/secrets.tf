resource "aws_secretsmanager_secret" "client_id" {
  name                    = "${local.name}/CLIENT_ID"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "client_id" {
  secret_id     = aws_secretsmanager_secret.client_id.id
  secret_string = "placeholder-replaced-outside-terraform"

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "aws_iam_role_policy" "secrets_access" {
  name = "${local.name}-secrets-access"
  role = aws_iam_role.task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = "secretsmanager:GetSecretValue"
      Resource = aws_secretsmanager_secret.client_id.arn
    }]
  })
}
