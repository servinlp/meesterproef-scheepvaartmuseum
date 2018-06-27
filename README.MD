# Meesterproef Scheepvaartmuseum

## Table of Contents

*   [General Overview](#general-overview)
*   [Getting Started](#getting-started)
*   [API Documentation](/wiki/API)
*	[Logbook](./logbook)
*	[Readme Mo](#readme-mo)

## General Overview

This project serves as a platform where people that have knowledge about the ship 'De Oranje' can share their stories in the form of text, audio recordings and video.

## Tech Stack

*   SCSS
*   ESlint
*   Stylelint
*   Nodemon
*   Browserify, including watching, & ES8 features

The tooling used for this project can be downloaded from:
[https://github.com/moniac/node-sass-es8-boilerplate](https://github.com/moniac/node-sass-es8-boilerplate)

## Getting Started

To get started on this project, first `git clone` the repository onto your local machine.

Afterwards:

```js
yarn install
```

To start developing:

```js
yarn run start
```

To build the project:

```js
yarn run build
```

# Readme Servin

## Index

- [Introduction](#introduction)
- [Process](#process)
- [Management](#management)
- [Rendering thumbnails](#rendering-thumbnails)
- [Rendering the detail page](#rendering-the-detail-page)
- [Progressive enhancement](#progressive-enhancement)
- [Creating, using and documenting an API](#creating-using-and-documenting-an-api)
- [Reporting](#reporting)
- [Contributors](#contributors)

## Introduction

This project is a product made for the [Scheepvaartmuseum](https://www.hetscheepvaartmuseum.nl/) to be used during and after there up coming exhibition about The Oranje called [MS Oranje changing course](https://www.hetscheepvaartmuseum.com/about-us/press/1282/persbericht-tentoonstelling-ms-oranje-koers-gewijzigd-eng). What the Scheepvaartmuseum wanted was a place where visitors could leave behind a tale of there own about there history with the Oranje. This could be something they themselves experienced or something they where told by there (grand-)parents. Using these stories the Scheepvaartmuseum wants to create a conversation between people where they tell there story.

### Our design challenge

How can we create a platform that encourages people to share and tell stories about the ship 'De oranje'?

### Personal goals

- Progressive enhancement
- back end

## Process

### Working with a group of six

So before even starting the first challenge we already had was how to work in a group of six people. Especially when no one had experience working in such a large group and halve of the team didn't have proper experience with working with other developers. We needed to work in a way then when creating a PR (pull request) we would have the least amount of merge conflicts. What we (Mees, Mo and I) decided was that for this working in components was probably the best option. This way everyone could work on there own component and once done create a PR with minimal merge conflicts. By working in this way the main merge conflicts were in `index.js` and `index.scss` where every component would be imported to be combined.

### Stack

Seeing as we where in need of a back end the obvious choice for this was node.js. This mainly because Mees, Mo and I had experience using this. For the database we wanted to keep it as simple for ourselves as possible so we decided on MySQL (with PhpMyAdmin as interface, this was my decision). As templating engine we went for [ejs](http://www.ejs.co/) for the same reason we choose node.js.

For the Front end stack we choose SCSS as our CSS preprocessor and JS modules for our JavaScript.

### Working with components

So when we knew that we where going to work using components we needed a folder structure for this. This is something Mo and I worked on. To make sure the components where like there own world it was obvious that per component you needed a folder, an ejs file, a SCSS file and a JavaScript file. And all of this should be in something like a components folder. Beside components we could also use a folder for the head and footer of the page (Mo's idea) so for this we created a partials folder. The components and partials folder would then be placed in the views folder (as is the standard when working with node.js). In the view folder would then also be the page ejs files. From here all necessary components and partials would then be included.

So in the end our views folder to work in looked something like this:

```
.
+-- views
|	+-- components
|		+-- header
|			+-- header.scss
|			+-- header.ejs
|			+-- header.js
|	+-- partials
|		+-- head.ejs
|	+-- index.ejs
```

**Relative commits**

- [Tooling updated](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/914c2d85ccab0a08bd4573dff5661ca948560ee7)
- [Node initial build](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/0a3d450e257e0774c8fe745341265974379e9676)
- [Added partials for simple head and footer](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/b324d5c5f2a6d362db782b45859ff890ac7dd91a)


### Keeping the back end separated

To ensure that the back end stayed clear for any one of us we needed to separate as much as possible. This meant that for (almost) every page a route was preferable. Next to this I also create a lib folder for any scripts that could be imported on the back end (for instance the MySQL pool).

**Relative commits**

- [Add route for index](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/4c5ec88d5c257acd802429dc748f6b45c665796c)
- [Add a route for every page](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/86a3f4f9b0a03bf09784e4c9bf9bcedb4eaa54db#diff-0364f57fbff2fabbe941ed20c328ef1a)
- [Fix eslint errors, servin is boos, added lib folder for our node modules, add promise sql with pool connection](https://github.com/moniac/meesterproef-scheepvaartmuseum/commit/9c318d1752b07b73ff6eeada3566d02c0abc16e3#diff-fd1940159a592c074df64da530d394e3)

## Management

Because we are with a group of 6 people whose level vary greatly it was decided that you could not commit directly to the master branch. To get something here you would need to work on you own branch and create a PR that MUST be reviewed by a college before it can be merged with master. This way everything has to be checked for mistakes or errors.

One thing that also was important for this project was code quality and code style. Code quality could be checked durring the PR reviews but for code style we used ESlint for JavaScript and Stylelint for SCSS. With these tools (courtesy to Mo for this) we could set rules for the code style guide that would show an error when a rule was broken. Nothing in a way that it would prevent you from doing anything but noticeable enough. Using these errors we could just tell someone to fix these errors without having to personally point everything out ourselves.

The rules for the linters where set up by Mo and I (most of the rules where added on my request). The rules lead to a constant code style (and a bit of frustration for people that didn't necessarily agree with a rule).

Total pull request: [163](https://github.com/moniac/meesterproef-scheepvaartmuseum/pulls?q=is%3Apr+is%3Aclosed)

Reviewed pull requests: [75](https://github.com/moniac/meesterproef-scheepvaartmuseum/pulls?q=is%3Apr+is%3Aclosed+reviewed-by%3Aservinlp)

Total comments written: [63](https://github.com/moniac/meesterproef-scheepvaartmuseum/pulls?q=is%3Apr+is%3Aclosed+sort%3Acomments-desc+reviewed-by%3Aservinlp)

## Rendering thumbnails

Here is an example of trying to keep the code as dry as possible. This function gets the content for the story thumbnails that is used on the homepage and story overview page.

```javascript
const pool = require( './mysql' )

async function getThumbnailContent( stories ) {

	return new Promise( async ( resolve, reject ) => {

		try {

			// ...

			resolve( storiesWithContent )

		} catch ( error ) {

			reject( error )

		}

	} )

}

module.exports = getThumbnailContent 
```

Thanks to functions like this the actual route stays clean.

```javascript
const express = require( 'express' ),
	router = 	express.Router(),
	pool = require( '../lib/mysql' ),
	getThumbnailContent = require( '../lib/getThumbnailContent' )

router.get( '/', async ( req, res ) => {

	try {

		const featuredStories = await pool.query( 'SELECT ID, title, components FROM stories WHERE featured = 1' ),
			storiesWithContent = await getThumbnailContent( featuredStories )

		res.render( 'index', {
			content: storiesWithContent,
			path: '/'
		} )

	} catch ( error ) {

		console.error( error )
		res.render( 'index', {
			content: [],
			path: '/'
		} )

	}

} )

module.exports = router
```

**Relative PR's**

- [Feature/data form database #111](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/111)

## Rendering the detail page

Using `moment.js` to create the needed dates for our `<time>` tag used in the reactions.

```javascript
	datetime: moment( x.timestamp ).format( 'DD-MM-YYYY HH:mm' ),
	time: moment( x.timestamp ).format( 'DD MMMM, YYYY HH:mm' )
```

Another example of keeping things dry. This function is used to get certain content for the thumbnails and for the detail page the header.

```javascript
/**
 * @param {Object} el - the story object with content ( el.content )
*/
function getStoryHeaderInfo( el ) {

	// If el.content exists (some stories don't have content...)
	// Check for the type (l.type === 'text')
	const text = el.content && el.content.filter( l => l.type === 'text' )[ 0 ],
		image = el.content && el.content.filter( l => l.type.includes( 'image' ) )[ 0 ]

	if ( text ) {

		// Only return the first 50 characters
		el.text = text.text.substr( 0, 50 ) + '...'

	}

	if ( image )
		el.image = image.link

}

module.exports = getStoryHeaderInfo 
```

And here you see how thanks to our modulair content structure, we are able to easaly render all content and add upon it in the future when a new media type is needed.

```html
<% if ( story.content.length ) { %>

	<% story.content.forEach( function( el ) { %>

		<% if ( el.type === 'title/h2' ) { %>

			<%- include( './components/detailContentContainers/contentTitle.ejs', { title: el.text } ) %>

		<% } else if ( el.type === 'text' ) { %>

			<%- include( './components/detailContentContainers/contentParagraph.ejs', { text: el.text } ) %>

		<% } else if ( el.type === 'videolink/youtube' ) { %>

			<%- include( './components/detailContentContainers/contentVideoYoutube.ejs', { ID: el.text } ) %>

		<% } else if ( el.type === 'image/jpeg' || el.type === 'image/jpg' || el.type === 'image/png' || el.type === 'image/gif' ) { %>

			<%- include( './components/detailContentContainers/contentImage.ejs', { image: el.link } ) %>

		<% } else if ( el.type === 'audio/mpeg' || el.type === 'audio/x-wav' ) { %>

			<%- include( './components/detailContentContainers/contentAudio.ejs', { audio: el.link, type: el.type } ) %>

		<% } %>

	<% } ) %>

<% } else { %>
	<h1 class="title__underline--red stories--title"><span class="underline-red">This</span> <span>story appears to be empty</span></h1>
<% } %>
```

**Relative PR's**

- [Feature/data form database #111](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/111)
- [Feature/detail with content #117](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/117)

## Progressive enhancement

To write CSS for when JavaScript or the `IntersectionObserver` was supported I added the following lines to the `head`.

```html
<script>
	document.documentElement.className=''
	if ( 'IntersectionObserver' in window ) document.documentElement.className+=' intersectionObserver'
</script>
```

By default the `<html>` tag already has a `no-js` class on it. The first line will remove this if JavaScript is enabled while the second line will add a class off `intersectionObserver` to the `<html>` tag when it is supported. This way we can have styles targeted at the moments when JavaScript is not enabled/supported and in the cases where the `IntersectionObserver` isn't supported we can immediately show the elements that would otherwise be hidden until triggered.

Here is the CSS used to target browsers that support the `IntersectionObserver`.

```css
html.intersectionObserver [data-intersect] {
	opacity: 0;
	visibility: hidden;

	&.show {
		opacity: 1;
		visibility: visible;
	}
} 
```

For the autocomplete of tags I also did a small thing to prevent it from breaking when `Promises` aren't supported. It doesn't have a fallback sinds it's not a big problem if it doesn't work.

```javascript
if ( !autocomplete[ 0 ] || !( 'fetch' in window ) ) return
```

(If your wondering is that the only progressive enhancement he did, no it's not. But the most things I did was push others to do PE instead of writing a lot myself.)

**Relative Commits**

- [Checking for IntersectionObserver #145](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/145/files#diff-3ba8b538bde02c786094097bff3dba1c)
- [Hide elements only if IntersectionObserver is supported #145](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/145/files#diff-987b95b2fdceb3e31e640faa6a8da7ba)
- [Apply tag and location api #76](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/76/files#diff-7545532630c12b6a9ae432c1916f90a1)

## Creating, using and documenting an API

[Here](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/76/files#diff-4e8b28a0f7943cb0fe11996dd13fd7df) you can see a small change that made it so on the Front end I only needed one function for both api's. In the end this also made more sense documentation wise. This way the structure of all api's can be more similar.

```javascript
function getDataFromApi( api ) {

	return new Promise( ( resolve, reject ) => {

		fetch( api )
			.then( res => res.json() )
			.then( res => {

				if ( res.succes ) {

					resolve( res.data )

				} else {

					reject( res.message )

				}

			} )
			.catch( err => reject( err ) )

	} )

}
```

**Relative PR's**

- [Add the api for tags and location with link in readme for documentation #71](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/71)
- [Apply tag and location api #76](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/76)
- [Apply tag and location api #87](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/87)

[Link to documentation](https://github.com/moniac/meesterproef-scheepvaartmuseum/wiki/API)

## Reporting

For the reporting of stories 2 things where important. Being able to report a story and not being able to report a story more then once. For the last part `sessions` started becoming important.

Now if you report a story it will be stored in a session object called `reports`. `reports` is an object that contains all of your reports like so.

```javascript
//...
reports: {
	79: [ true, false ],
	STORY_ID : [ INCORRECT, INAPPROPRIATE ]
},
//...
```

The values of the `reports` object are then send on the matching pages so that the checkboxes for reporting can be set accordingly.

**Relative PR's**

- [Add report functionality (with session) #137](https://github.com/moniac/meesterproef-scheepvaartmuseum/pull/137)

## Contributors

| Contributor  | Github URL                       |
|--------------|:-------------------------------  |
| Jamie        | https://github.com/jajan20       |
| Mo           | https://github.com/moniac        |
| Niels        | https://github.com/NielsFS       |
| Robin        | https://github.com/RobinFrugte97 |
| Mees         | https://github.com/meesrutten    |