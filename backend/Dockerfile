FROM public.ecr.aws/lambda/nodejs:22 as builder

WORKDIR /usr/app

COPY package.json package-lock.json ./

# Install dependencies for building
RUN npm ci

COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ---

FROM public.ecr.aws/lambda/nodejs:22

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled JavaScript from builder stage (NOT main.ts)
COPY --from=builder /usr/app/dist ./

# Set Environment Variables (From .env)
ENV MONGODB_URI="mongodb+srv://cta102938:cta102938@cluster0.qesx1ag.mongodb.net/QuickCRM?retryWrites=true&w=majority&appName=Cluster0"
ENV MAIL_USER="cta102938@gmail.com"
ENV MAIL_PASS="ngzg ngho eedw qpdi"
ENV REDIS_HOST="redis-13149.crce206.ap-south-1-1.ec2.cloud.redislabs.com"
ENV REDIS_PORT="13149"
ENV REDIS_PASSWORD="lfiEQpryW5ymgVjJftPOKwKgG6oYy1wP"

# Set the CMD to your compiled handler
CMD [ "main.handler" ]
