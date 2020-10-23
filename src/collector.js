/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
import axios from 'axios';

const reddit = 'https://api.reddit.com/r/jakeane';
const githubSuffix = '?Accept:=application/vnd.github.v3+json';
const github = `https://api.github.com/users/jakeane/repos${githubSuffix}`;

const processRedditPost = (post) => {
  if (post.data.crosspost_parent_list && post.asdf) {
    console.log('----------------');
    console.log('Title:', post.data.title);
    console.log(
      'Source:',
      post.data.crosspost_parent_list[0].subreddit_name_prefixed
    );
    console.log('Link:', post.data.url);
    console.log('----------------');
  }
};

const processGithubRepoMeta = (repo) => {
  if (!repo.private && repo.language) {
    console.log('----------------');
    console.log('Title:', repo.name);
    console.log('Description:', repo.description);
    console.log('Language:', repo.language);
    console.log('Updated:', repo.updated_at);
    console.log('To go:', repo.url);

    console.log('----------------');
  }
};

const getData = () => {
  console.log('collecting data');

  axios.get(reddit).then((res) => {
    res.data.data.children.forEach((post) => {
      return processRedditPost(post);
    });
  });

  axios.get(github).then((res) => {
    res.data.forEach((repo) => {
      return processGithubRepoMeta(repo);
    });
  });
};

export default getData;
