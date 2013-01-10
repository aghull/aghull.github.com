---
layout: post
title: Dirty models
tagline: Ruby magic
tags:
category: coding
time: 2013-01-10 12:25:38 EST
---
Cool bit of ActiveRecord magic using [the Dirty methods](http://api.rubyonrails.org/classes/ActiveModel/Dirty.html):

    Model < ActiveRecord::Base
      ...
      def was
        Model.new(attributes.merge changed_attributes).tap { |m| m.readonly! }
      end

      def newly
        Model.new(changes.inject({}) {|h,v| h[v[0]] = v[1][1]; h}).tap { |m| m.readonly! }
      end
      ...

This gives you 2 mock copies of your model, one that holds the previous state and one that only includes values that have just changed, with unchanged attributes nil'ed out. This is useful to run predicate methods that read the model's state, e.g.:

    post.was.published? #=> true if published? was true for the previous state
    post.newly.cancelled? #=> true if cancelled? is currently true and *only* as a result of the current changes

This is great for nice readable callbacks and observer's that act on changes in the model's state that just happened.
