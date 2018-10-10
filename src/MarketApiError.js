"use strict";

/**
 * API error
 */
class MarketApiError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
    }
};

module.exports = MarketApiError;
