module.exports = {
	plugins: [
		require('css-mqpacker'),
		require('postcss-cssnext')({
			browsers: ['ie >= 8'],
			features: {
				rem: true,
				customProperties: {
					strict: false,
					warnings: false,
					preserve: true
				}
			}
		}),
		require('cssnano')({
			autoprefixer: false
		})
	]
}