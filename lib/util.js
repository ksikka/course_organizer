// Generally useful stuff

String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// source: http://stackoverflow.com/a/8498629
function urlDomain(url) {
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    return matches[1];
}

// source: https://gist.github.com/panzi/1857360
var XML_CHAR_MAP = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;'
}; function escapeXml (s) {
    return s.replace(/[<>&"']/g, function (ch) {
        return XML_CHAR_MAP[ch];
    });
} var HTML_CHAR_MAP = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
}; function escapeHtml (s) {
    return s.replace(/[<>&"']/g, function (ch) {
        return HTML_CHAR_MAP[ch];
    });
}
