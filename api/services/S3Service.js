var cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: 'jesse-dirisu',
	api_key: '872994525413396',
	api_secret: 'ugk7i8bjN4CLIkxJXczmHDOqhA8'
})

urlr = /^(http(s)?)?(:\/\/)?(www\.)?[\d\w]+\.[\d\w\D\W]+/;

function setString(data, type) {
	if (data.startsWith('data:image/')) {
		return data;
	} else {
		switch (type) {
			case 'jpg':
				return 'data:image/jpeg;base64,' + data;
				break;
			case 'png':
				return 'data:image/png;base64,' + data;
				break;
			case 'gif':
				return 'data:image/gif;base64,' + data;
				break;
			case 'mp4':
				return 'data:video/mp4;base64,' + data;
				break;
			case '3gp':
				return 'data:video/3gp;base64,' + data;
				break;
			case 'mp3':
				return 'data:audio/3gpp;base64,' + data;
				break;
			case 'default':
				return data;
		}
	}
}

module.exports = {
	upload: function (bs4Str, title) {
		title = title.split(" ").join('_');
		return new Promise(function (res, rej) {
			if (!bs4Str) {
				res('');
			} else {
				if (urlr.test(bs4Str)) {
					res(bs4Str)
				} else {
					cloudinary.v2.uploader.upload(setString(bs4Str, 'jpg'), { public_id: title, format: 'jpg' }, function (err, result) {
						if (err) {
							cloudinary.v2.uploader.upload(setString(bs4Str, 'png'), { public_id: title, format: 'jpg' }, function (err, result) {
								if (err) {
									cloudinary.v2.uploader.upload(setString(bs4Str, 'gif'), { public_id: title, format: 'jpg' }, function (err, result) {
										if (err) {
											cloudinary.v2.uploader.upload(bs4Str, { public_id: title, format: 'jpg' }, function (err, result) {
												if (err) {
													rej(err)
												}
												if (result) {
													res(result.url)
												}
											})
										}
										if (result) {
											res(result.url)
										}
									})
								}
								if (result) {
									res(result.url)
								}
							})
						}
						if (result) {
							res(result.url)
						}
					})
				}
			}
		})
	},
	uploadVideo: function (bs4Str, title) {
		return new Promise((res, rej) => {
			if (!bs4Str) {
				res('');
			}
			cloudinary
				.v2
				.uploader
				.upload(setString(bs4Str, 'mp4'),
					{ timeout: 12000000, public_id: title, format: 'mp4', resource_type: "video" },
					function (err, result) {
						if (err) {
							cloudinary.v2.uploader.upload(setString(bs4Str, '3gp'),
								{ timeout: 12000000, public_id: title, format: 'mp4', resource_type: "video" }, function (err, result) {
									if (err) {
										rej('');
									} else {
										res(result.url)
									}
								})
						} else {
							res(result.url)
						}
					}
				)
		})

	},
	uploadAudio: function (bs4Str, title) {
		return new Promise((res, rej) => {
			if (!bs4Str) {
				res('');
			} else {
				cloudinary
					.v2
					.uploader
					.upload(setString(bs4Str, 'mp3'),
						{ timeout: 12000000, public_id: title, format: 'm4a', resource_type: "video" },
						function (err, result) {
							if (err) {
								rej(err);
							} else {
								res(result.url)
							}
						}
					)
			}
		})

	}
}
