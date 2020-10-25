# jkeane.me Portfolio Backend

This is the codebase for my portfolio backend. It acheives two tasks.

First, it runs a scheduled process through the Heroku Scheduler plug-in on the file `collector.js`. This collector calls the GitHub and Reddit APIs, and then it collects data from my GitHub repositories and personal sub-Reddit. After organizing this data, it creates an API call on itself to store the data.

This is where the other task comes into play, it receives data from the scheduler, and it is added into the database. This data is then queried by the portfolio frontend. The only sore issue about this is the fact that I replace the database with every call from the scheduler, so for an instance, the database will be empty. So, in the future, I want to merge in the data provided by the scheduler such that no duplicates are made and all data is up to date.

## TODO

- Use less janky filters when collecting data from APIs.
- Merge in fresh data into database instead of replacement.

## Links

- View the [website](http://jakeane.surge.sh/)
- View the [frontend repo](https://github.com/jakeane/jkeane.me)
