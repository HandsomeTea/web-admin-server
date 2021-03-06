import { Request, Response, NextFunction } from 'express';
import { JWT } from '../service';
import { errorType } from '../configs/http.error.type';

/**
 * 验证json web token
 */
export default (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers.authorization) {
        const _array = req.headers.authorization.split(' ');
        const authToken = _array[1];
        const authType = _array[0];
        const result = JWT.verify(authToken);

        if (authType !== 'JWT' || result.allowed === false) {
            res.status(400).send(`Bad request(wrong Authorization)! Refused. ${result.info}`);
        } else {
            next();
        }
    } else {
        res.status(400).send({
            code: 400,
            type: errorType.BAD_REQUEST,
            error: {
                info: 'Bad request(no Authorization)! Refused.',
                reason: [],
                source: [process.env.SERVER_NAME]
            }
        });
    }
};
