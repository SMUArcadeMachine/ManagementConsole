window._gaq = window._gaq || [];

App.Analytics = (function() {
	if (!window.TESTING) {
		// This page will almost always be over https, so can just load this directly.
		$.getScript('https://stats.g.doubleclick.net/dc.js', {
			cache: true
		});
	}
	return {
		init: function() {
			if (window.TESTING) {
				return;
			}

            var pluginUrl = '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
			window._gaq.push(
                ['_require', 'inpage_linkid', pluginUrl],
                ['_setAccount', App.GOOGLE.ANALYTICS],
                ['_setDomainName', App.GOOGLE.DOMAIN],
                ['_trackPageview']
            );

		},
        trackPage: _.debounce(function() {
            if (window.TESTING) {
                return;
            }
            var page = window.location.hash.length > 0 ?
                window.location.hash.substring(1) :
                window.location.pathname;
            window._gaq.push(['_trackPageview', page]);
        }, 500),
        trackEvent: function(name, label, value) {
            if (window.TESTING) {
                return;
            }
            if(label){
                window._gaq.push(['_trackEvent', 'website', name, label, value]);
            }else{
                window._gaq.push(['_trackEvent', 'website', name]);
            }
        }
	};
})();
