/*
 * moleculer-correlation
 * Copyright (c) 2022 Adam McCormick (https://github.com/adam_mccormick/moleculer-correlation)
 * MIT Licensed
 */

"use strict";

const { AsyncLocalStorage } = require("async_hooks");
const { Middlewares } = require("moleculer");
const storage = new AsyncLocalStorage();

const CorrelationMiddleware = function (opts) {
	opts = {
		...{
			addToLogMsg: true,
			addToBindings: true,
			idName: "logRelID",
			emptyContextStr: "No Context"
		},
		...opts
	};

	return {
		name: "Correlation",

		localAction(handler) {
			return ctx =>
				storage.run(ctx, () => {
					addRelIdToMeta(ctx);
					return handler(ctx);
				});
		},

		localEvent(handler) {
			return ctx =>
				storage.run(ctx, () => {
					addRelIdToMeta(ctx);
					return handler(ctx);
				});
		},

		newLogEntry(type, args, bindings) {
			const ctx = storage.getStore();
			const id =
				ctx && ctx.meta && ctx.meta[opts.idName]
					? ctx.meta[opts.idName]
					: opts.emptyContextStr;
			if (id && opts.addToBindings) {
				bindings[opts.idName] = id;
			}
			if (id && opts.addToLogMsg) {
				args.unshift(`[${id}] `);
			}
		}
	};

	function addRelIdToMeta(ctx) {
		if (!ctx) {
			// No context => nothing to do
			return;
		}
		if (!ctx.meta) {
			// No meta => add one
			ctx.meta = {
				[opts.idName]: ""
			};
		}
		if (ctx && ctx.parentCtx && ctx.parentCtx.meta && ctx.parentCtx.meta[opts.idName]) {
			// sub call? => use the parent logRelID
			ctx.meta[opts.idName] = ctx.parentCtx.meta[opts.idName];
		}
		if (ctx && ctx.meta && !ctx.meta[opts.idName]) {
			// no logRelID => add the requestID as logRelID
			ctx.meta[opts.idName] = ctx.requestID;
		}
	}
};

Middlewares.Correlation = CorrelationMiddleware;

module.exports = {
	CorrelationMiddleware
};
