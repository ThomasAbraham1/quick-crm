
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure } from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import * as cookieParser from 'cookie-parser';

let server: Handler;

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

        // Enable cookie parser for Lambda
        app.use(cookieParser());

        // Do NOT enable CORS here for Lambda - AWS Lambda Function URL handles it
        // This prevents duplicate CORS headers

        await app.init();

        const expressApp = app.getHttpAdapter().getInstance();
        return configure({ app: expressApp });
    } catch (error) {
        console.error('SERVER BOOTSTRAP FAILED:', error);
        throw error;
    }
}

// Export Helper for AWS Lambda
export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
    try {
        server = server ?? (await bootstrap());
        return server(event, context, callback);
    } catch (error) {
        console.error('LAMBDA HANDLER ERROR:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error',
                error: error.message,
            }),
        };
    }
};

// Local Development Support (Runs only if NOT in Lambda)
if (!process.env.LAMBDA_TASK_ROOT) {
    async function runLocal() {
        const app = await NestFactory.create(AppModule);

        // Enable cookie parser for local dev
        app.use(cookieParser());

        app.enableCors({ origin: 'http://localhost:3003', credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE'],  });
        console.log('Backend starting locally...');
        await app.listen(3002);
        console.log('Backend is running on http://localhost:3002');
    }
    runLocal();
}
