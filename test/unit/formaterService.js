"use strict";
// Service to ensure that calls to other services from greeter-service will get the same correlationID
const formaterService = {
	name: "formatter",

	actions: {
		format: {
			handler(ctx) {
				this.logger.info(`Formatting name ${ctx.params.name}`);
				return this.format(ctx.params.name);
			}
		}
	},

	methods: {
		async format(name) {
			name = name || "Anonymous";
			//await delay(Math.floor(Math.random() * 5000));
			this.logger.info(`Request id in method for name ${name}`);

			return `${name}!`;
		}
	}
};
exports.formaterService = formaterService;
