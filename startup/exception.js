const { traceModule } = require('../config/log.type');

global.Exception = class Exception extends Error {
    constructor(message, type) {
        super(message);
        this._init(type);
    }

    _init(type) {
        this.type = type || traceModule.default;
    }
};
