# jkeane.me Portfolio Backend

This is the codebase for my portfolio backend, where I store data and run scheduled tasks. As I am inherently lazy, I do not want to update my portfolio whenever I am developing something new. To amend this issue, I run a scheduled task in the backend using the Heroku Scheduler plug-in, which uses the GitHub API to get and process data from my repositories.

While I was at this, I figured I could use another API to perform a similar task. So, I also use the Reddit API to get data from my personal subreddit, where I cross-post articles that I find interest in.

## TODO

- Use less janky filters when collecting data from APIs.
- Merge in fresh data into database instead of replacement.

## Links

- View the [website](http://jakeane.surge.sh/)
- View the [frontend repo](https://github.com/jakeane/jkeane.me)
