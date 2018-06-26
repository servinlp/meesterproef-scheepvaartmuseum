module.exports = {
	plugins: [
		require( 'postcss-preset-env' )( {
			browsers: [ 'ie >= 9' ]
		} ),
		require( 'cssnano' )( {
			autoprefixer: false
		} )
	]
}