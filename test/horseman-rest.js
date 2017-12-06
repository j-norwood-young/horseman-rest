process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

var server = require("../index.js");

chai.use(chaiHttp);

describe('Basics', () => {
	describe("/GET open", () => {
		it("it should open horseman", (done) => {
			chai.request(server)
			.get("/open")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.message.should.equal('horseman open')
				done();
			});
		});
	});

	describe("/POST open", () => {
		it("it should open horseman with a specific url", (done) => {
			chai.request(server)
			.post("/open")
			.send({ url: "https://www.google.com"})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.message.should.equal('horseman open')
				res.body.should.have.property('url')
				done();
			});
		});
	});

	describe("/POST tab", () => {
		it("it should open a new tab with a specific url", (done) => {
			chai.request(server)
			.post("/tab")
			.send({ url: "https://www.google.com"})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.message.should.equal('tab open')
				res.body.should.have.property('url')
				res.body.should.have.property('tabnumber')
				done();
			});
		});
	})

	describe("/GET tab/:tabnumber", () => {
		it("it should switch to a specific tab", (done) => {
			chai.request(server)
			.get("/tab/0")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.message.should.equal('tab active')
				res.body.should.have.property('url')
				done();
			});
		});
	})

	describe("/GET tab/count", () => {
		it("it should count open tabs", (done) => {
			chai.request(server)
			.get("/tab/count")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.count.should.equal(1)
				done();
			});
		});
	})

	describe("/GET tab", () => {
		it("should get info on all the tabs", done => {
			chai.request(server)
			.get("/tab")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.should.have.property('tabs')
				res.body.tabs.should.be.an("array")
				done();
			});
		})
	})

	describe("/POST text", () => {
		it("should get text based on selector", done => {
			chai.request(server)
			.post("/text")
			.send({ selector: "body" })
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.should.have.property('text')
				res.body.text.should.be.a("string")
				done();
			});
		})
	})

	describe("/DELETE tab/:tabnumber", () => {
		it("it should close a tab", (done) => {
			chai.request(server)
			.del("/tab/0")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.message.should.equal('tab closed')
				done();
			});
		});
	})

	describe("/GET close", () => {
		it("it should close horseman", (done) => {
			chai.request(server)
			.get("/close")
			.end((err, res) => {
				res.should.have.status(200);
				res.body.status.should.equal('ok');
				res.body.message.should.equal('horseman closed')
				done();
			});
		});
	});

});