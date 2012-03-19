---
layout: post
title: RVM GCC and Xcode
tagline:
time: 2012-03-19 10:41:40 EDT
---
Just some notes on the issues with GCC and Xcode trying to install RVM under Mac OSX 10.7.3. RVM fails initially using the CC that comes with the Xcode dev tools because the system ruby (1.8) apparently can't handle the LLVM. [This](http://stackoverflow.com/questions/9651670/issue-updating-ruby-on-mac-with-xcode-4-3-1) seems to be the best write-up on the issues. Installing the [osx-gcc-installer](https://github.com/kennethreitz/osx-gcc-installer) package is a work-around to get rvm installed. Please note that this apparently uninstalls the Xcode dev-tools and the two packages do not contain the exact same set of tools. For example, I found that svn was gone from my system after this.

I'm going to try re-installing the Xcode dev-tools. I don't see any clean way to uninstall osx-gcc-installer but I'm hoping Xcode will overwrite the package... Theoretically this should work since I have ruby 1.9.3 now from the working rvm and I can use that to do any future RVM updates using the CC and LLVM from Xcode.

OK, so far so good. That appears to be working. I've used RVM to compile to ruby versions with no issues. Hopefully this is the most "correct" configuration and I've left a minimum of residue on my system. I'll update if I discover otherwise!