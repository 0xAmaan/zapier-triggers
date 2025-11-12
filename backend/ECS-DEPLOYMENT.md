# ECS Deployment Instructions

## Important Security Note

**DO NOT commit `ecs-task-definition.local.json` to Git!**

This file contains your actual database password and should only exist on your local machine.

## Files

- `ecs-task-definition.json` - Template file (safe to commit, password placeholder)
- `ecs-task-definition.local.json` - Real credentials (NEVER commit, in .gitignore)

## Deploying Updates

When you need to update the ECS task definition:

1. Make changes to `ecs-task-definition.local.json` (the one with real password)
2. Register the updated task definition:
   ```bash
   aws ecs register-task-definition \
     --cli-input-json file://ecs-task-definition.local.json \
     --region us-west-1
   ```
3. Force new deployment:
   ```bash
   aws ecs update-service \
     --cluster zapier-triggers-cluster \
     --service zapier-triggers-service \
     --task-definition zapier-triggers-backend \
     --force-new-deployment \
     --region us-west-1
   ```

## First Time Setup

If you clone this repo on a new machine:

1. Copy the template:
   ```bash
   cp backend/ecs-task-definition.json backend/ecs-task-definition.local.json
   ```
2. Edit `ecs-task-definition.local.json` and replace `YOUR_PASSWORD_HERE` with the actual RDS password
3. Never commit the `.local.json` file!

## Better Alternative: AWS Secrets Manager

For production, you should use AWS Secrets Manager instead of environment variables:

```bash
# Store the password in Secrets Manager
aws secretsmanager create-secret \
  --name zapier-triggers/db-password \
  --secret-string "YOUR_PASSWORD_HERE" \
  --region us-west-1

# Then update task definition to reference the secret
# (see AWS ECS documentation for secrets configuration)
```
