FlowRouter.route('/', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {top: "header"});
    }
});
FlowRouter.route('/titlechains', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {top: "header", main: "titlechainContainer"});
    }
});

FlowRouter.route('/files', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {top: "header", main: "filesContainer"});
    }
});

FlowRouter.route('/upload', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {top: "header", main: "uploadContainer"});
    }
});


FlowRouter.route('/login', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {top: "header", main: "login"});
    }
});