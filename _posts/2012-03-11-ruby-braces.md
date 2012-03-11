---
layout: post
title: Ruby Braces
tagline: and other ambiguities
author: aghull
time: 2012-03-12 23:50:00 -05:00
---
Ok, ruby. You're confusing me a bit with your syntax. Sometimes I can't tell when I need a space or brace or carriage return. For example:

    puts {:a=>1, :b=>2}

is an error. This got me at first until I realized what was going on. The curly brace does double duty for associative arrays and control blocks. In this case it's ambiguous since the `puts` method can take an optional control block. If you want to pass the array directly to `puts`, you have to be explicit:

    puts ( {:a=>1, :b=>2} )

OK. Fine. I understand what's going on here. This next one I'm not sure about though. The ruby `while` loop seems to take a block, but it doesn't act like a normal block. Here's a normal `while` loop:

    i=0; while i<3
        puts i=i+1
    end

If you want to write it on one line you probably just use the inverted "perl" syntax:

    i=0; puts i=i+1 while i<3

or you can just write it the same way as the normal syntax with semi-colons:

    i=0; while i<3; puts i=i+1; end

*or* you can use a do-end instead of a semi-colon:

    i=0; while i<3 do puts i=i+1; end

What's going on here? I honestly didn't know at first. It looks like a normal do-end control block. But I was pretty sure that `while` was not a normal method -- it was a language construct. So this do-end is not actually a do-end block, any more than an if-then-end block uses a literal do-end block. For example you cannot substitute this with:

    i=0; while i<3 { puts i=i+1; }

even though braces and do-end are supposed to be interchangeable. That's because this is a special do, I think. The error message seems to indicate its specialness:

    unexpected '{', expecting kDO_COND or ':' or '\n' or ';'

apparently this is a `kDO_COND` not a `kDO`. Yet another double-duty piece of syntax. Oh but look! According to the error message a *colon* also works!

    i=0; while i<4: puts i=i+1 end

Of course this is also not the same colon as in a ternary operater although the follow 2 statements look kind of similar:

    puts (if true: 1 else 0 end)
    puts (true ? 1 : 0)

Probably best to avoid the if/while colon syntax. Does anyone use that?