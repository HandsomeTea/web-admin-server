const { traceId } = require('../../utils');
const { traceType } = require('../../conf');

module.exports = (req, res, next) => {
    if (!req.headers['x-b3-traceid']) {
        req.headers['x-b3-traceid'] = traceId();
        req.headers['x-b3-spanid'] = traceId();
    }

    req.trace = (_module = traceType.default) => trace(_module, { traceId: req.headers['x-b3-traceid'], spanId: req.headers['x-b3-spanid'], parentSpanId: req.headers['x-b3-parentspanid'] });
    next();
};