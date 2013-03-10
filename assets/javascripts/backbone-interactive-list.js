(function($, Backbone) {
  /**
   * Base class for an interactive list.
   * To use pass the following options:
   * - template (JST template for line item)
   * - el: element
   * - limit: optional limit of items to display
   * - click: optional click callback for each item. receives 2 args, model and index
   * instantiate and attach this.refresh() to any event of your choosing
   */
  Backbone.InteractiveList = Backbone.View.extend({
    initialize: function(options) {
      this.template = options.template;
      if (!_.isObject(this.collection)) {
        this.collection = new Backbone.Collection();
      }
      this.collection.url = options.url;
    },

    render: function() {
      var view = this,
      click = this.options.click,
      filter = this.options.filter,
      limit = this.options.limit;
      this.$el.empty();
      this.refresh(function() {
        // append items to el
        _.each(this.collection.filter(function(model) {
          return !_.isFunction(filter) || filter.call(view, model);
        }), function(model, i) {
          if (_.isUndefined(limit) || i < limit) {
            var li = $(view.template(model.attributes));
            if (_.isFunction(click)) {
              li.on('click', function() { click.call(view, model, i); });
            }
            view.$el.append(li);
          }
        });
        this.$el.show();
      });
      return this;
    },

    refresh: function(callback) {
      var view = this;
      if (!_.isUndefined(this.collection.url) && (_.isUndefined(this.lastUrl) || this.lastUrl!=_.result(this.collection.url))) {
        // fetch collection from server and render it
        this.collection.fetch({
          success: function() {
            view.lastUrl = _.result(view.collection.url);
            callback.call(view);
          }
        });
      } else {
        callback.call(view);
      }
    }
  });

  Backbone.AutocompleteList = Backbone.View.extend({
    initialize: function(options) {
      var view = this;
      this.timer = null;
      this.term = this.$el.val();

      // if no filter method passed use standard case-insensitive contains using the input value
      if (_.isUndefined(this.options.filter)) {
        this.options.filter = function(model) {
          return options.value.call(view, model).toLowerCase().indexOf(view.$el.val().toLowerCase())!=-1;
        };
      }

      this.options.click = this.options.click || _.bind(function(model) {
        this.results.hide();
        this.$selected().removeClass('selected');
        this.$el.val(options.value.call(this, model));
        this.term = this.$el.val();
        this.$el.focus();
      }, this);

      this.delegateEvents(_.defaults(options.events || {}, {
        keyup: 'keyup',
        keydown: 'keydown',
        blur: 'blur'
      }));

      // create the results element if not passed as an option
      this.results = options.results || $('<div>', { class: 'autocomplete-results' }).css({
        position: 'absolute',
        zIndex: 1,
        left: this.$el.position().left,
        top: this.$el.position().top + this.$el.outerHeight(),
        width: this.$el.outerWidth(),
      }).appendTo($('body'));
      this.resultsView = new Backbone.InteractiveList(_.defaults({ el: this.results }, this.options));
    },

    $selected: function() {
      return this.resultsView.$('.selected');
    },
    
    keyup: function() {
      var view = this.resultsView;
      if (this.term != this.$el.val()) {
        this.term = this.$el.val();
        clearTimeout(this.timer);
        if (!this.options.minLength || this.term.length >= this.options.minLength) {
          this.timer = setTimeout(function() { view.render(); }, this.options.delay);
        } else {
          this.results.hide();
        }
      }
      return true;
    },

    keydown: function(e) {
      // Esc
      if (e.keyCode == 27) {
        this.blur();
        return true;
      }
      // Enter
      if (e.keyCode == 13 || e.keyCode == 9) {
        // if an item is selected, act like it was clicked
        if (this.$selected().length > 0) {
          this.$selected().click();
          return false;
        }
      }
      // Down
      if (e.keyCode == 40) {
        if (this.$selected().length == 0) {
	  this.results.children().first().addClass('selected');
        } else {
	  this.$selected().removeClass('selected').next().addClass('selected');
        }
        this.scroll();
        return false;
      }
      // Up
      if (e.keyCode == 38) {
        if (this.$selected().length == 0) {
	  this.results.children().last().addClass('selected');
        } else {
	  this.$selected().removeClass('selected').prev().addClass('selected');
        }
        this.scroll();
        return false;
      }
      return true;
    },

    blur: function() {
      this.results.hide();
    },

    // scroll till selected element is in view
    scroll: function() {
      if (this.$selected().length==1) {
        if (this.$selected().position().top + this.$selected().height() > this.results.height()) {
          this.results.scrollTop(this.results.scrollTop() + this.$selected().position().top + this.$selected().height() - this.results.height());
        } else if (this.$selected().position().top < 0) {
          this.results.scrollTop(this.results.scrollTop() + this.$selected().position().top);
        }
      }
    },
  });
}(window.jQuery, window.Backbone));
