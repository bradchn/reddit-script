// ==UserScript==
// @name         Reddit script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Brad Chin
// @match        https://www.reddit.com/*
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

const hidePost = (post) => {
	const link = getLink(post);
	let storage = localStorage.getItem("hiddenPosts");
	if (!storage) {
		const baseStorage = {};
		baseStorage[link] = true;
		localStorage.setItem("hiddenPosts", JSON.stringify(baseStorage));
	} else {
		let storageJSON = JSON.parse(storage);
		storageJSON[link]  = true;
		localStorage.setItem("hiddenPosts", JSON.stringify(storageJSON));
	}
	$(post).hide();
}

const addButton = (post) => {
	let button = document.createElement("BUTTON");
	button.innerHTML = 'Hide';
	post.querySelector('.Post').appendChild(button);
	$(button).css('position', 'absolute').css('top', 80).css('left', 6).css('font-size', 14).css('color', 'white');
	button.addEventListener('click', (e) => {
		hidePost(post)
	})
}

const init = (posts) => {
	for(let i = 0; i < posts.length; i++) {
		let post = posts[i];
		let postHeight = post.offsetHeight;
		if (postHeight > 0){
			addButton(post);
			hideStoragePost(post);
		}
	}
}

const getLink = (post) => {
	if (post.querySelector("a[data-click-id='body']")) {
		return post.querySelector("a[data-click-id='body']").getAttribute('href');
	}
	else {
		return "";
	}
}

const hideStoragePost = (post) => {
	let storage = localStorage.getItem("hiddenPosts");
	if (storage) {
		let storageJSON = JSON.parse(storage);
		let postLink = getLink(post);
		if (storageJSON[postLink]) {
			console.log('hidden post: ' + postLink)
			$(post).hide();
		}
	}
}

$(document).ready(function() {
	let allPostsContainer = document.querySelector(".rpBJOHq2PR60pnwJlUyP0");
	if (allPostsContainer) {
		init(allPostsContainer.children);
	}
})