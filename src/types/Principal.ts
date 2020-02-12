import { createParamDecorator } from '@nestjs/common';

/**
 * Custom decorator for adding principal to request object.
 *
 * @type {(...dataOrPipes: Type<PipeTransform> | PipeTransform | any[]) => ParameterDecorator}
 */
export const Principal = createParamDecorator((data: string, req) => {

    return req.principal;

});
