'use strict';
const ipRangeCheck = require('ip-range-check');
const { IpFilter } = require('express-ipfilter');

const { env: $env } = require('process');
const { APP_TOKEN_ALLOWED_IP_LIST = '' } = $env;

const $AllowedIps = APP_TOKEN_ALLOWED_IP_LIST?.split(',').map((i) => i.trim()) || [];

/**
 * Verifica se o IP da requisição está habilitado para realizar requests.
 * Origem do IP: header padrão / header nginx / ip remoto da request
 * Caso venha mais de um IP, deve pegar sempre o mais à esquerda (padrão header x-forwarded-for)
 * @param req {e.Request}
 * @returns {Promise<boolean>}
 */
exports.verifyAllowedIpsRange = async (req) => {
    const remoteAddr = exports.getRemoteClientIp(req);
    // execute the schedules via localhost
    if (isLocalhost()) {
        return true;
    }
    return APP_TOKEN_ALLOWED_IP_LIST?.length && isAllowedIp();

    function isLocalhost() {
        return '127.0.0.1' === remoteAddr;
    }

    function isAllowedIp() {
        return remoteAddr && ipRangeCheck(remoteAddr, $AllowedIps);
    }
};

/**
 * Get the remote client IP.
 *
 * @param req {e.Request}
 * @returns {*}
 */
exports.getRemoteClientIp = (req) => {
    if (req.remoteAddress) {
        return req.remoteAddress;
    }
    const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress;
    const [leftIp] = clientIp?.split(',') || [];
    return leftIp?.replace('::ffff:', '');
};

exports.blockIpsMiddleware = IpFilter($env.APP_BLOCKED_IP_LIST?.split(','), {
    detectIp: exports.getRemoteClientIp,
    mode: 'deny',
    log: true,
    logLevel: 'deny',
});
