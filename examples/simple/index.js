"use strict";
const casual = require("casual");
const { ServiceBroker } = require("moleculer");
const { CorrelationMiddleware } = require("../../index");

// Create broker
let broker = new ServiceBroker({
	logger: "console",
	middlewares: [CorrelationMiddleware]
});

// Load my service
broker.createService({
	name: "greeter",
	actions: {
		greet: {
			async handler(ctx) {
				this.logger.info(`Creating a greeting for ${ctx.params.name}`);
				const formatted = await ctx.call("formatter.format", { name: ctx.params.name });
				return `Hello ${formatted}`;
			}
		}
	}
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

broker.createService({
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
			await delay(Math.floor(Math.random() * 5000));
			this.logger.info(`Request id in method for name ${name}`);

			return `${name}!`;
		}
	}
});

// Start server
broker
	.start()
	.then(() => {
		// Call action
		return Promise.all(
			Array.from({ length: 10 }).map(() =>
				broker.call("greeter.greet", { name: casual.name })
			)
		);
	})
	.then(() => broker.stop());
