FlowRouter.route('/', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {top: "landingHeader", main: "landing"});
    }
});
FlowRouter.route('/search', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {top: "header", main: "titlechainContainer"});
    }
});
FlowRouter.route('/debug', {
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
FlowRouter.route('/user', {
    action: function(params, queryParams) {
        BlazeLayout.render("mainLayout", {top: "header", main: "userProfile"});
    }
});