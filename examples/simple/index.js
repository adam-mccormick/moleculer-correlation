"use strict";

const { ServiceBroker } = require("moleculer");
const { CorrelationMiddleware } = require("../../index");

// Create broker
const a = new ServiceBroker({
	nodeID: "NODE_A",
	logger: "console",
	transporter: "fake",
	middlewares: [CorrelationMiddleware]
});

// Load my service
a.createService({
	name: "greeter",
	actions: {
		greet: {
			async handler(ctx) {
				this.logger.info("Something in context");
				const formatted = await ctx.call("formatter.format", { name: ctx.params.name });
				return `Hello ${formatted}`;
			}
		}
	}
});

const b = new ServiceBroker({
	nodeID: "NODE_B",
	logger: "console",
	transporter: "fake",
	middlewares: [CorrelationMiddleware]
});

a.createService({
	name: "formatter",

	actions: {
		format: {
			handler(ctx) {
				this.logger.info(`Formatting name ${ctx.params.name}`);
				return `${ctx.params.name}!`;
			}
		}
	}
});

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Start server
Promise.all([a.start(), b.start(), delay(3000)]).then(() => {
	// Call action
	a.call("greeter.greet", { name: "John Doe" }).catch(a.logger.error);
});
