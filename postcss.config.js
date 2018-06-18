module.exports = {
	plugins: [
		require( 'css-mqpacker' ),
		require( 'postcss-preset-env' )( {
			browsers: [ 'ie >= 9' ]
		} ),
		require( 'cssnano' )( {
			autoprefixer: false
		} )
	]
}