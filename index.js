const Horseman = require("node-horseman");
const restify = require("restify");
const config = require("config");

const server = restify.createServer();

server.use(restify.plugins.bodyParser());

const horseman = new Horseman(config.horseman);

server.get("/open", (req, res) => {
	horseman.open("http://localhost")
	.then(result => {
		res.send({ status: "ok", message: "horseman open"})
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

server.post("/open", (req, res) => {
	if (!req.body.url) {
		console.error("url required")
		return res.send(500, { status: "error", message: "url required" })
	}
	horseman.open(req.body.url)
	.url()
	.then(url => {
		res.send({ status: "ok", message: "horseman open", url })
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

server.get("/close", (req, res) => {
	horseman.close()
	.then(result => {
		res.send({ status: "ok", message: "horseman closed"})
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

server.post("/tab", (req, res) => {
	if (!req.body.url) {
		console.error("url required")
		return res.send(500, { status: "error", message: "url required" })
	}
	horseman.open(req.body.url)
	.then(result => {
		tabnumber = result;
	})
	.url()
	.then(url => {
		res.send({ status: "ok", message: "tab open", url, tabnumber })
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

server.get("/tab/count", (req,res) => {
	horseman.tabCount(req.params.tabnumber)
	.then(count => {
		res.send({ status: "ok", count })
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

server.del("/tab/:tabnumber", (req,res) => {
	console.log("Closing tab", req.params)
	horseman.closeTab(parseInt(req.params.tabnumber))
	.then(count => {
		res.send({ status: "ok", message: "tab closed" })
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

server.get("/tab/:tabnumber", (req, res) => {
	horseman.switchToTab(req.params.tabnumber)
	.url()
	.then(url => {
		res.send({ status: "ok", message: "tab active", url, tabnumber })
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

var getTabInfo = tabnumber => {
	return horseman.switchToTab(tabnumber)
	.url()
	.then(result => {
		url = result;
	})
	.status()
	.then(result => {
		status = result;
	})
	.title()
	.then(result => {
		title = result;
	})
	.then(() => {
		return ({ tabnumber, url, status, title })
	})
}

server.get("/tab", (req, res) => {
	horseman.tabCount()
	.then(tabcount => {
		queue = [];
		for (let x = 0; x < tabcount; x++) {
			queue.push(getTabInfo(x))
		}
		return Promise.all(queue);
	})
	.then(tabs => {
		res.send({ status: "ok", tabs });
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

server.post("/text", (req, res) => {
	if (!req.body.selector) {
		return res.send(500, { status: "error", message: "selector required" })
	}
	horseman.text(req.body.selector)
	.then(text => {
		res.send({ status: "ok", text });
	})
	.catch(err => {
		console.error(err)
		res.send(500, { status: "error", message: err.message })
	})
})

server.listen(config.server.port, function() {
	console.log('%s listening at %s', server.name, server.url);
});

module.exports = server;