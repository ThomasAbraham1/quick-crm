# Build the Docker image for linux/amd64 (required for Lambda)
# Removed --no-cache to use BuildKit caching for faster builds
docker buildx build --platform linux/amd64 --provenance=false -t 020087759950.dkr.ecr.ap-south-1.amazonaws.com/quick-crm-backend:latest . --load

#Login
aws ecr get-login-password --region ap-south-1 --no-cli-pager | docker login --username AWS --password-stdin 020087759950.dkr.ecr.ap-south-1.amazonaws.com

# Push the image to ECR
docker push 020087759950.dkr.ecr.ap-south-1.amazonaws.com/quick-crm-backend:latest

# Update the Lambda function to use the new image
aws lambda update-function-code --function-name Nestjs-QuickCRM-backend --image-uri 020087759950.dkr.ecr.ap-south-1.amazonaws.com/quick-crm-backend:latest --no-cli-pager

# Wait for update to complete
Write-Host "Waiting for Lambda update to complete..."
aws lambda wait function-updated --function-name Nestjs-QuickCRM-backend --no-cli-pager
Write-Host "Lambda update complete!" -ForegroundColor Green
