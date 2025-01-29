import { DateTime } from "luxon";

export default function(eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format = "dd LLLL yyyy", zone = "utc") => {
		if (typeof dateObj === 'string') {
		  // If the input is a string (likely ISO format), use fromISO()
		  return DateTime.fromISO(dateObj, { zone }).toFormat(format);
		} else if (dateObj instanceof Date) {
		  // If the input is a JS Date object, use fromJSDate()
		  return DateTime.fromJSDate(dateObj, { zone }).toFormat(format);
		} else {
		  // If the input is neither string nor Date, return a default or error
		  return "Invalid date";
		}
	  });
	
	  // Optional: Add another filter for HTML5 date formatting
	  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		if (typeof dateObj === 'string') {
		  return DateTime.fromISO(dateObj).toFormat('yyyy-LL-dd');
		} else if (dateObj instanceof Date) {
		  return DateTime.fromJSDate(dateObj).toFormat('yyyy-LL-dd');
		} else {
		  return "Invalid date";
		}
	  });

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts", "notes", "mastodon"].indexOf(tag) === -1);
	});

};
