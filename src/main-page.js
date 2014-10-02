
var SectionView = Backbone.View.extend({});

var port = chrome.runtime.connect({name: "knockknock"});

$('form.course-input').submit(function(e) {
    e.preventDefault();
    var courseId = $('form.course-input input[name="course"]').val();
    port.postMessage({message:'getPages',courseId:courseId});
});

var renderItems = function(type, items) {
    $('#'+type+'ly-viewed .item-section').html('');
    _.each(items, function(h) {
        var item = _.template('<a href="<%= h.url %>" target="_blank">'+
                                '<div class="item">'+
                                    '<%- h.title %> - (<%- h.url %>)'+
                                '</div>'+
                              '</a>')({h:h});
        $('#'+type+'ly-viewed .item-section').append(item);
    });
};

port.onMessage.addListener(function(response) {
    renderItems('recent', _.first(response.recent, 5));
    renderItems('frequent', _.first(response.frequent, 5));
});
