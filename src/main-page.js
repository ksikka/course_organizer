
var SectionView = Backbone.View.extend({});

$('form.course-input').submit(function(e) {
    e.preventDefault();
    var courseId = $('form.course-input input[name="course"]').val();
    chrome.runtime.sendMessage('alabkejlnnhepmgjpdeigipimeghlaej', {message:'getPages',courseId:courseId}, {}, function(response) {
        _.each(response['recent'], function(h) {
            var item = _.template('<a href="<%= h.url %>" target="_blank">'+
                                    '<div class="item">'+
                                        '<%- h.title %> - (<%- h.domain %>)'+
                                    '</div>'+
                                  '</a>')({h:h});
            $('#recently-viewed .item-section').append(item);
        });
    });
});
