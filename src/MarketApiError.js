"use strict";

module.exports = MarketApiError;

/**
 * API error
 */
class MarketApiError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
    }
};
