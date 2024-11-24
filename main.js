$(document).ready(() => {
	var count = 0;

	let sock = new WebSocket('wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post');

	sock.onmessage = (event) => {
		count += 1;

		try {
			const data = JSON.parse(event.data);
			console.log(`Received: ${JSON.stringify(data, null, 2)}`);
		} catch (e) {
			console.log(`Raw message: ${event.data}`);
		}

		if (count > 11) {
			sock.close();
			sock = null;
		}
	};
});



