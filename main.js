$(document).ready(() => {
	var jetstreamURL = 'wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post';
	var sock = null;
	var counter = 0;

	$('#goButton').on('click', () => {
		let query = $('#hashtagInput').val();

		if (query.length > 0) {
			startSocket(query);
		}
	});

	$('#stopButton').on('click', () => {
		closeSocket();
	});

	$('#clearButton').on('click', () => {
		$('#skeetContainer').empty();
	});

	function updateCounter() {
		counter += 1;
		$('header #counter span.count').html(counter);
	}

	function startSocket(hashtag) {
		// Ensure we're starting with a fresh websocket
		closeSocket();

		sock = new WebSocket(jetstreamURL);

		sock.onmessage = (event) => {
			updateCounter();

			const data = JSON.parse(event.data);

			try {
				const skeet = data.commit.record.text ?? false;
				const postID = data.commit.rkey ?? false;

				if (skeet.toLowerCase().indexOf(hashtag.toLowerCase()) !== -1) {
					$.ajax('https://plc.directory/' + data.did).done((res) => {
						let username = res.alsoKnownAs[0] ?? false;

						if (skeet && username && postID) {
							addSkeetSheet(skeet, username, postID);
						}
					});
				}
			} catch (e) {
				// I only really care if there's content I can use
			}
		};
	}

	function addSkeetSheet(skeet, username, postID) {
		let container = $('#skeetContainer');
		let revProto = username.replace('at://', '');
		let userURL = `https://bsky.app/profile/${revProto}`;
		let postURL = `https://bsky.app/profile/${revProto}/post/${postID}`;

		let skeetItem = `
			<div class="skeetItem">
				<div class="skeetText"><a href="${postURL}">${skeet}</a></div>
				<div class="skeetUsername"> — <a href="${userURL}">${revProto}</a></div>
			</div>
		`;

		container.prepend(skeetItem);
	}

	function closeSocket() {
		if (sock !== null) {
			sock.close();
			sock = null;
		}
	}
});



