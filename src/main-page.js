
var SectionView = Backbone.View.extend({});

var port = chrome.runtime.connect({name: "knockknock"});

$('form.course-input').submit(function(e) {
    e.preventDefault();
    var courseId = $('form.course-input input[name="course"]').val();
    port.postMessage({message:'getPages',courseId:courseId});
});

port.onMessage.addListener(function(response) {
    $('#recently-viewed .item-section').html('');
    _.each(_.first(response['recent'], 5), function(h) {
        var item = _.template('<a href="<%= h.url %>" target="_blank">'+
                                '<div class="item">'+
                                    '<%- h.title %> - (<%- h.url %>)'+
                                '</div>'+
                              '</a>')({h:h});
        $('#recently-viewed .item-section').append(item);
    });
});
