#!/usr/bin/ruby

# Some constants
TARGET_DIR = "_posts"

# Get the title which was passed as an argument
title = ARGV[0]
# Get the filename
filename = title.gsub(' ','-')
now = Time.now
filename = "#{ now.strftime('%Y-%m-%d') }-#{filename}.md" 
filepath = File.join(TARGET_DIR, filename)

# Create a copy of the template with the title replaced
new_post = <<-eos
---
layout: post
title: #{ title }
tagline:
time: #{ now.strftime('%Y-%m-%d %H:%M:%S %Z') }
---
eos

# Write out the file to the target directory
new_post_file = File.open(filepath, 'w')
new_post_file.puts new_post
new_post_file.close
puts filepath
