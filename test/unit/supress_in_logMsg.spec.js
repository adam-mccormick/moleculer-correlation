"use strict";

const { ServiceBroker } = require("moleculer");
const { CorrelationMiddleware } = require("../../src");
const { greeterService } = require("./greeterService");
const { formaterService } = require("./formaterService");

const logSpy = jest.fn();
let opts = { requestID: "" };

const LogSpyMiddleware = {
	//Needed to catch the logstatements in tests
	name: "LogSpy",
	newLogEntry: logSpy
};

describe("Test MyService", () => {
	const broker = new ServiceBroker({
		middlewares: [CorrelationMiddleware({ addToLogMsg: false }), LogSpyMiddleware]
	});
	const service = broker.createService(greeterService(opts));
	broker.createService(formaterService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	afterEach(() => {
		opts.requestID = undefined;
		logSpy.mockReset();
	});

	it("should be created", () => {
		expect(service).toBeDefined();
	});

	it("should return with 'Hello Anonymous' and add opts.requestID to log statements", () => {
		return broker.call("greeter.greet").then(res => {
			expect(res).toBe("Hello Anonymous!");
			expect(logSpy.mock.calls[0]).toMatchObject([
				"info",
				["Creating a greeting for undefined"],
				{
					nodeID: expect.any(String),
					ns: "",
					mod: "greeter",
					svc: "greeter",
					ver: undefined,
					logRelID: opts.requestID
				}
			]);
		});
	});

	it("should return with 'Hello John' and add same opts.requestID to all log statements ", () => {
		return broker.call("greeter.greet", { name: "John" }).then(res => {
			expect(res).toBe("Hello John!");
			expect(logSpy.mock.calls).toMatchObject([
				[
					"info",
					["Creating a greeting for John"],
					{
						nodeID: expect.any(String),
						ns: "",
						mod: "greeter",
						svc: "greeter",
						ver: undefined,
						logRelID: opts.requestID
					}
				],
				[
					"info",
					["Formatting name John"],
					{
						nodeID: expect.any(String),
						ns: "",
						mod: "formatter",
						svc: "formatter",
						ver: undefined,
						logRelID: opts.requestID
					}
				],
				[
					"info",
					["Request id in method for name John"],
					{
						nodeID: expect.any(String),
						ns: "",
						mod: "formatter",
						svc: "formatter",
						ver: undefined,
						logRelID: opts.requestID
					}
				]
			]);
		});
	});
});
