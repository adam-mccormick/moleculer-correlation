"use strict";

const greeterService = function (opts) {
	return {
		name: "greeter",
		actions: {
			greet: {
				async handler(ctx) {
					opts.requestID = ctx.requestID;
					this.logger.info(`Creating a greeting for ${ctx.params.name}`);
					const formatted = await ctx.call("formatter.format", { name: ctx.params.name });
					return `Hello ${formatted}`;
				}
			}
		},
		methods: {
			getRequestID: () => {
				return opts.requestID;
			}
		}
	};
};

exports.greeterService = greeterService;
