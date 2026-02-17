# Update Lambda Environment Variables Script
# This updates your Lambda function with plain text environment variables
# Removes dependency on AWS Secrets Manager (saves ~$3-5/month)

# IMPORTANT: Update these valores before running:
# 1. BASE_URL - Set to your actual Lambda Function URL
# 2. GOOGLE_CALLBACK_URL - Set to your Lambda URL + /auth/google/callback  
# 3. FRONTEND_URL - Set to your actual frontend URL
# 4. JWT_SECRET - Use a strong production secret (NOT the dev one!)

aws lambda update-function-configuration `
    --function-name Nestjs-QuickCRM-backend `
    --environment "Variables={
    MONGODB_URI=mongodb+srv://cta102938:cta102938@cluster0.qesx1ag.mongodb.net/QuickCRM_PROD?retryWrites=true&w=majority&appName=Cluster0,
    MAIL_USER=cta102938@gmail.com,
    MAIL_PASS=ngzg ngho eedw qpdi,
    REDIS_HOST=redis-13149.crce206.ap-south-1-1.ec2.cloud.redislabs.com,
    REDIS_PORT=13149,
    REDIS_PASSWORD=lfiEQpryW5ymgVjJftPOKwKgG6oYy1wP,
    GOOGLE_CLIENT_ID=87200062511-re48c8pdle5ae4s38g4pl8l0g2ig8dva.apps.googleusercontent.com,
    GOOGLE_CLIENT_SECRET=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,
    GOOGLE_CALLBACK_URL=https://YOUR_LAMBDA_URL/auth/google/callback,
    JWT_SECRET=CHANGE_THIS_TO_A_SUPER_SECRET_LONG_STRING_FOR_PROD,
    JWT_EXPIRATION=7d,
    FRONTEND_URL=https://YOUR_FRONTEND_URL,
    BASE_URL=https://YOUR_LAMBDA_URL
  }"

# After running this command:
# 1. Test your Lambda function to ensure it still works
# 2. Go to AWS Secrets Manager Console and delete any CRM-related secrets
# 3. Verify charges drop in the next billing cycle
