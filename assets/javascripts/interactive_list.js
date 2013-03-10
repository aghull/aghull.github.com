/**
 * Base class for an interactive list.
 * To use pass the following options:
 * - template (JST template for line item)
 * - el: element
 * - limit: optional limit of items to display
 * - click: optional click callback for each item. receives 2 args, model and index
 * instantiate and attach this.refresh(url) to any event of your choosing
*/
Pgl.Views.InteractiveList = Backbone.View.extend({
  initialize: function(options) {
    this.template = options.template;
    if (!_.isObject(this.collection)) {
      this.collection = new Backbone.Collection();
    }
  },

  render: function() {
    var click = this.options.click;
    this.$el.empty();
    // append items to el
    this.collection.each(function(model, i) {
      if (_.isEmpty(this.options.limit) || i <= this.options.limit) {
        var li = $(this.template(model.attributes));
        if ($.isFunction(click)) {
          this.$el.on('click', function() { click.call(this.el, model, i); });
        }
        this.$el.append(li);
      }
    }, this);
    return this;
  },

  refresh: function(url) {
    var view = this;
    if (this.collection.url != url) {
      this.collection.url = url;
      // fetch collection from server and render it
      this.collection.fetch({
        success: function() { view.render(); }
      });
    } else {
      view.render();
    }
  }
});
