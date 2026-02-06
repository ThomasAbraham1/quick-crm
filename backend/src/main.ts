
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure } from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

        // Configure CORS to work with AWS Lambda Function URL
        app.enableCors({
            origin: true, // Reflect the request origin (works with Lambda Function URL)
            credentials: true,
        });

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
        app.enableCors();
        console.log('Backend starting locally...');
        await app.listen(3000);
        console.log('Backend is running on http://localhost:3000');
    }
    runLocal();
}
