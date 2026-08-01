import cluster from "node:cluster";
import os from "node:os";
import Fastify from "fastify";

const numClusterWorkers = os.cpus().length;
console.log("Número de núcleos: ", numClusterWorkers);

if (cluster.isPrimary) {
	for (let i = 0; i < numClusterWorkers; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker) =>
		console.log(`worker ${worker.process.pid} died`),
	);
} else {
	const fastify = Fastify({ logger: false });
	fastify.get("/", () => {
		return "Hello world!";
	});

	fastify.listen({ port: 3000 });
}
