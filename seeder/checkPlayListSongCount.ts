const colors = require('colors')

export const playlistSearchEqual = async () => {
	const playlistCount = []
	for (let i = 0; i < 200; i++) {
		setTimeout(async () => {
			await fetch(`https://api.deezer.com/chart/${i}/playlists?limit=1000`)
				.then(res => res.json())
				.then(res => {
					if (res.total > 60) {
						console.log(colors.bgGreen(`Playlist ${i} | ${res.total}`))
						playlistCount.push({
							i: res.total
						})
					}
				})
		}, i * 100)
	}
	return playlistCount
}
