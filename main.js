$(document).ready(() => {
	let count = 0;
	let jetstreamURL = 'wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post';
	let sock = null;

	function startSocket(hashtag) {
		sock = new WebSocket(jetstreamURL);

		sock.onmessage = (event) => {
			count += 1;

			const data = JSON.parse(event.data);

			try {
				const skeet = data.commit.record.text ?? false;

				if (skeet.toLowerCase().indexOf(hashtag) !== -1) {
					$.ajax('https://plc.directory/' + data.did).done((res) => {
						let username = res.alsoKnownAs[0] ?? false;

						if (skeet && username) {
							addSkeetSheet(skeet, username)
						}
					});
				}
			} catch (e) {
				// I only really care if there's content I can use
			}
		};
	}

	function addSkeetSheet(skeet, username) {

	}

	function closeSocket() {
		sock.close();
		sock = null;
	}
});



