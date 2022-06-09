/*
 * moleculer-correlation
 * Copyright (c) 2022 Adam McCormick (https://github.com/adam_mccormick/moleculer-correlation)
 * MIT Licensed
 */

"use strict";

const { AsyncLocalStorage } = require("async_hooks");
const { Middlewares } = require("moleculer");
const storage = new AsyncLocalStorage();

const CorrelationMiddleware = {
	name: "Correlation",

	localAction(handler) {
		return ctx => storage.run(ctx, () => handler(ctx));
	},

	localEvent(handler) {
		return ctx => storage.run(ctx, () => handler(ctx));
	},

	newLogEntry(type, args) {
		const ctx = storage.getStore();
		args.unshift(`[${ctx ? ctx.requestID : "NO CONTEXT"}] `);
	}
};

Middlewares.Correlation = CorrelationMiddleware;

module.exports = {
	CorrelationMiddleware
};
