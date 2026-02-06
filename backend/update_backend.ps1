# Build the Docker image for linux/amd64 (required for Lambda)
docker buildx build --platform linux/amd64 --provenance=false --no-cache -t 020087759950.dkr.ecr.ap-south-1.amazonaws.com/quick-crm-backend:latest . --load

# Push the image to ECR
docker push 020087759950.dkr.ecr.ap-south-1.amazonaws.com/quick-crm-backend:latest

# Update the Lambda function to use the new image
aws lambda update-function-code --function-name Nestjs-QuickCRM-backend --image-uri 020087759950.dkr.ecr.ap-south-1.amazonaws.com/quick-crm-backend:latest
