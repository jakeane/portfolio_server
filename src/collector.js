/* eslint-disable prefer-destructuring */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */

const axios = require('axios');

// constants
//  - api calls
const reddit = 'https://api.reddit.com/r/jakeane';
const githubSuffix = '?Accept:=application/vnd.github.v3+json';
const github = `https://api.github.com/users/jakeane/repos${githubSuffix}`;

//  - openstata hardcode
const openstata = `https://api.github.com/repos/dartmouth-cs52-20X/openstata${githubSuffix}`;
const openstataUrl = 'https://open-stata.netlify.app/';
const openstataImage =
  'https://raw.githubusercontent.com/dartmouth-cs52-20X/openstata/master/docs/img/do.gif';

const processRedditPost = (post) => {
  const data = {};

  // filters out subreddit "lounge"
  if (post.data.crosspost_parent_list) {
    data.headline = post.data.title;
    data.source = post.data.crosspost_parent_list[0].subreddit_name_prefixed;
    data.image = post.data.thumbnail;
    data.link = post.data.url;
  }

  return data;
};

const processGithubRepoMeta = async (repo, needImage) => {
  const data = {};

  // has_wiki filters out repos that are not worth showing
  // yes this is a janky filter
  if (!repo.private && repo.has_wiki) {
    data.title = repo.name;
    data.description = repo.description;
    data.language = repo.language;
    data.url = repo.html_url;
    data.last_update = repo.updated_at;

    // grab image and live link from README
    if (needImage) {
      const readme = await axios.get(`${repo.url}/readme${githubSuffix}`);
      // eslint-disable-next-line new-cap
      const decode = new Buffer.from(readme.data.content, 'base64').toString(
        'ascii'
      );

      // find first instance of "![...](...)"
      const media = decode.match(/!\[.*\]\(.*\)/);

      // pulls out info from inside parentheses
      const regExp = /\(([^)]+)\)/;

      if (media) {
        const matches = regExp.exec(media[0]);
        data.image = matches[1];
      }

      // finds first instance of [website](...)
      const live = decode.match(/\[website\]\(.*\)/);
      if (live) {
        const liveUrl = regExp.exec(live[0]);
        data.live = liveUrl[1];
      }
    } else {
      data.image = openstataImage;
      data.live = openstataUrl;
    }
  }
  return data;
};

const getRedditData = async () => {
  const posts = [];

  const postList = await axios.get(reddit);
  postList.data.data.children.forEach((post) => {
    posts.push(processRedditPost(post));
  });

  // filter out posts without data
  // in this case, just the subreddit "lounge"
  return posts.filter((post) => {
    return post.headline;
  });
};

const getGithubData = async () => {
  const repos = [];

  // gather from each repo
  const repoList = await axios.get(github);
  repoList.data.forEach((repo) => {
    repos.push(processGithubRepoMeta(repo, true));
  });

  // gather from openstata
  const openStataData = await axios.get(openstata);
  repos.push(processGithubRepoMeta(openStataData.data, false));

  // resolve all promises, and filter out empty entries
  // in this case, ones where 'has_wiki' was false
  const finalRepos = await Promise.all(repos).then((res) => {
    return res.filter((repo) => {
      return repo.title;
    });
  });

  return finalRepos;
};

const getData = async () => {
  console.log('collecting data');

  // use array to leverage promise all
  const database = [];

  database.push(getRedditData());

  database.push(getGithubData());

  return Promise.all(database).then((result) => {
    return {
      reddit: result[0],
      github: result[1],
    };
  });
};

getData().then((database) => {
  // post to server (self) after collecting data
  axios
    .post('https://jkeane-portfolio.herokuapp.com/api/save', database)
    .then((res) => {
      console.log('result:', res.data);
    });
});
