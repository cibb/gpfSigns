chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "update") {
		var version = details.previousVersion.split(".");
		if (version[0] < "2") {
			localStorage.removeItem("signs");
		}
  }
});
