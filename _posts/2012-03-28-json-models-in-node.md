---
layout: post
title: Javascript models
tagline: in node.js
tags: nodejs json
category: coding
time: 2012-03-28 23:29:23 EDT
---
One of the other projects I spent some time on in my few weeks semi-off was my Lost Cities game. This was just an excude to do a node.js project and play around with some sockets and Javascript tools. The first thing I wanted to know was how much I could reuse Javascript on the server in the browser itself and vice versa, so I immediately looked for ways to build model classes that could act on both sides. It was definitely a eureka moment when I realized I could just take my models and literally write:

    socket.emit('update', {game:game});

and on the client (in Jade) go

    script!= "game = "+JSON.stringify(game)

and pass the entire game state from the server to the client, including all contained objects, in one tiny line each. It's so simple it's stupid.

The next thing I wanted to do was to see if I could actually get that JSON back into the original model class so I could reuse the methods along with the data. At first I had planned to use backbone.js to handle the models, but decided to try writing really simple 'plain-ol' Javascript objects to see what the drawbacks would be of having structureless models, so I could later appreciate why I needed backbone. I found that in backbone, [someone had done this very same thing](http://andyet.net/blog/2011/feb/15/re-using-backbonejs-models-on-the-server-with-node/) using import/export methods that reached into the internal backbone collection members and reconstructed the objects on the other side.

But already enamored with the sheer simplicity of passing the raw object, I wanted to see how hard it would be to re-import raw JSON data back into an object. Thus turned out to be trickier than I hoped. I quickly realized that Javascript object simply do not provide any one clean way to introspect objects for serializing without manually hacking in some hooks. I used a `__class` member to keep track of the original class and a recursize import method to reconstruct trees of objects on the receiving side. My base class looked like this:

    Base = function() {
      this.__class = 'Base';
    }
    Base.prototype.load = function(data) {
      function expand(obj,val) {
        if (val==null) {
          obj = null;
        } else if (val instanceof Array) {
          if (obj==null) obj = [];
          _(val).each(function(v,n) { obj[n] = expand(obj[n], v); });
        } else if (typeof val=='object') {
          if (obj==null) obj = val.__class?eval('new '+val.__class):{};
          _(val).each(function(v,n) { obj[n] = expand(obj[n], v); });
        } else {
          obj = val;
        }
        return obj;
      }
      expand(this, data);
      return this;
    };

I don't know if this is absolutely complete in object types but it worked fine for my set of objects. I know that any circular references in the objects will break this and I have no way of preventing that without assigning unique IDs to instances to keep track of things. It feels hackish and ended up being more code than I had hoped. But still it's fairly lean and readable and seems to do the trick. In order to use this Base class, I just extend it in each of my objects:

    Game = function() {
      this.__class = 'Game';
      ...
    }

    Game.prototype = new Base;

Which is the old-school way to do Javascript inheritance. Now I can export my raw object just the same as before, and on the client-side I can import the javascript using the load method:

    game = new Game().load(json);

And I have my original object back again! Ok, cool. How useful is this? Well one obvious application is validation. If you write your data validation directly into your model objects, then you can duplicate the validation on the client-side. This is often done in ORMs by specifiying object rules in configuration files that are translated into server-side and client-side code by different translators. With node.js, you don't need any translators. You can use the exact same code in the exact same file and pass the entire object back and forth! And any other custom logic in your models that helps determine how objects are composed and rendered can be used on both the client and server as well.

All in all, I feel like I'm on kinda shaky ground here with this hack. Javascript objects seem so flimsy and flexible I'm afraid of trying to make them do acrobatics like this. I think backbone could help provide some of the structure to prevent mishaps like I fear. I've since given backbone a more serious try. But I think the idea of reusing models is definitely a keeper and I intend to continue to look for ways to exploit node.js to that end.