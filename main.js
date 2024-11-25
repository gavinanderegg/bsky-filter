$(document).ready(() => {
	var jetstreamURL = 'wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post';
	var sock = null;

	$('#goButton').on('click', () => {
		if ($('#clearCheck').prop('checked')) {
			$('#skeetContainer').empty();
		}

		let query = $('#hashtagInput').val();

		if (query.length > 0) {
			console.log('starting with ' + query);

			startSocket(query);
		}
	});

	$('#stopButton').on('click', () => {
		if ($('#clearCheck').prop('checked')) {
			$('#skeetContainer').empty();
		}

		closeSocket();
	});

	function startSocket(hashtag) {
		// Ensure we're starting with a fresh websocket
		closeSocket();

		sock = new WebSocket(jetstreamURL);

		sock.onmessage = (event) => {
			const data = JSON.parse(event.data);

			// get the post URL?


			try {
				// console.log(data);
				// https://plc.directory/did:plc:olakmyzv3okn6djhbcpkg2rl

				const skeet = data.commit.record.text ?? false;
				const postID = data.commit.rkey ?? false;

				if (skeet.toLowerCase().indexOf(hashtag) !== -1) {
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

		container.append(skeetItem);
	}

	function closeSocket() {
		if (sock !== null) {
			sock.close();
			sock = null;
		}
	}
});



