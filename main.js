$(document).ready(() => {
	var count = 0;

	let sock = new WebSocket('wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post');

	sock.onmessage = (event) => {
		count += 1;

		const data = JSON.parse(event.data);

		try {
			const skeet = data.commit.record.text ?? '';

			if (skeet.toLowerCase().indexOf('xbox') !== -1) {
				$.ajax('https://plc.directory/' + data.did)
					.done((res) => {
						console.log(skeet);
						console.log(res.alsoKnownAs[0]);
					});
			}

		} catch (e) {

		}

		// if (count > 20) {
		// 	sock.close();
		// 	sock = null;
		// }
	};
});



