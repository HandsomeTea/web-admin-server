import { Request, Response, NextFunction } from 'express';
import httpContext from 'express-http-context';

import { traceId, trace } from '../configs';

const filteNotAllown = (str?: string): string | void => {
    if (str) {
        str = str.trim();
        if (str && str !== 'undefined' && str !== 'null') {
            return str;
        }
    }
};
const getRequestIp = (request: Request): string | undefined => {
    const ipStr = request.headers['x-forwarded-for'] ||
        request.ip ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress || '';

    let ip = '';

    if (typeof ipStr === 'string' && ipStr.split(',').length > 0) {
        ip = ipStr.split(',')[0];
    }

    return /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.exec(ip)?.toString();
};

/**
 * 服务器接收到请求的相关处理
 */
export default (req: Request, _res: Response, next: NextFunction): void => {

    let _datas = ` header=>${JSON.stringify(req.headers)}`;

    if (Object.getOwnPropertyNames(req.body).length > 0) {
        _datas += ` body=>${JSON.stringify(req.body)}`;
    }
    if (Object.getOwnPropertyNames(req.query).length > 0) {
        _datas += ` query=>${JSON.stringify(req.query)}`;
    }
    if (Object.getOwnPropertyNames(req.params).length > 0) {
        _datas += ` params=>${JSON.stringify(req.params)}`;
    }

    httpContext.set('ip', getRequestIp(req));
    httpContext.set('traceId', filteNotAllown(req.get('x-b3-traceid')) || traceId());
    httpContext.set('parentSpanId', filteNotAllown(req.get('x-b3-parentspanid')) || '');
    httpContext.set('spanId', filteNotAllown(req.get('x-b3-spanid')) || traceId());

    trace({
        traceId: httpContext.get('traceId'),
        spanId: httpContext.get('spanId'),
        parentSpanId: httpContext.get('parentSpanId')
    }, 'receive-request').debug(`[${httpContext.get('ip')}(${req.method}): ${req.protocol}://${req.get('host')}${req.originalUrl}] request parameter :${_datas || ' no parameter'} .`);

    next();
};
