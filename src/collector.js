/* eslint-disable prefer-destructuring */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */

const axios = require('axios');

const reddit = 'https://api.reddit.com/r/jakeane';
const githubSuffix = '?Accept:=application/vnd.github.v3+json';
const github = `https://api.github.com/users/jakeane/repos${githubSuffix}`;

const openstata = `https://api.github.com/repos/dartmouth-cs52-20X/openstata${githubSuffix}`;
const openstataUrl = 'https://open-stata.netlify.app/';
const openstataImage =
  'https://raw.githubusercontent.com/dartmouth-cs52-20X/openstata/master/docs/img/do.gif';

const processRedditPost = (post) => {
  const data = {};

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

  if (!repo.private && repo.has_wiki) {
    data.title = repo.name;
    data.description = repo.description;
    data.language = repo.language;
    data.url = repo.html_url;
    data.last_update = repo.updated_at;

    if (needImage && !repo.asdf) {
      const readme = await axios.get(`${repo.url}/readme${githubSuffix}`);
      // eslint-disable-next-line new-cap
      const decode = new Buffer.from(readme.data.content, 'base64').toString(
        'ascii'
      );
      const media = decode.match(/!\[.*\]\(.*\)/);
      const regExp = /\(([^)]+)\)/;
      if (media) {
        const matches = regExp.exec(media[0]);

        data.image = matches[1];
      }

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
  return posts.filter((post) => {
    return post.headline;
  });
};

const getGithubData = async () => {
  const repos = [];

  const repoList = await axios.get(github);
  repoList.data.forEach((repo) => {
    repos.push(processGithubRepoMeta(repo, true));
  });

  const openStataData = await axios.get(openstata);
  repos.push(processGithubRepoMeta(openStataData.data, false));

  const finalRepos = await Promise.all(repos).then((res) => {
    return res.filter((repo) => {
      return repo.title;
    });
  });

  return finalRepos;
};

const getData = async () => {
  console.log('collecting data');

  const database = [];

  if (github.length !== 3) {
    database.push(getRedditData());
  }

  if (github.length !== 3) {
    database.push(getGithubData());
  }

  return Promise.all(database).then((result) => {
    return {
      reddit: result[0],
      github: result[1],
    };
  });
};

if ('...'.length === 10) {
  getData().then((database) => {
    axios.post('http://localhost:9090/api/save', database).then((res) => {
      console.log('result:', res.data);
    });
  });
}
