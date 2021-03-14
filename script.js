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
	$(button).css({"position": "absolute", "top": "80px", "left": "2px", "font-size": "14px", "color": "white", "background-color": "black", "border-radius": "4px", "padding": "4px"})
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

const addClearStorageButton = () => {
	let button = document.createElement("BUTTON");
	button.innerHTML = 'Restore Hidden Posts';
	$(button).css({"position": "absolute", "color": "white", "top": "60px", "left": "20px", "background-color": "black", "border-radius": "8px", "padding": "12px"})
	const header = document.querySelector("header");
	header.appendChild(button);
	button.addEventListener("click", () => {
		let storage = localStorage.getItem("hiddenPosts");
		if (storage) {
			localStorage.removeItem("hiddenPosts");
			location.reload();
		}
	})
}

$(document).ready(function() {
	let allPostsContainer = document.querySelector(".rpBJOHq2PR60pnwJlUyP0");
	if (allPostsContainer) {
		addClearStorageButton();
		init(allPostsContainer.children);
		window.addEventListener('scroll', () => {
			init(allPostsContainer.children);
		})
	}
})