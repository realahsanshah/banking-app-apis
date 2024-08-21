import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { responseData } from 'src/common/dto/response.dto';


@Injectable()
export class HttpInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        console.log("**********************************************")
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        console.log(`[${method}] ${url}`);

        return next.handle().pipe(
            map(data => {
                if (typeof data == 'object') {
                    console.log(`[${method}] ${url} completed`);
                    console.log("**********************************************");
                    return new responseData(data);
                } else {
                    console.log(`Error: ${data}`);
                    console.log("**********************************************");
                    let response = new responseData({});
                    response.success = false;
                    response.message = data;
                    throw new Error(data);
                    return response;
                }
                // return new responseData(data);
            }),
        );
    }
}