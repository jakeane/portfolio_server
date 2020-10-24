/* eslint-disable comma-dangle */
import GitHubModel from './models/github';
import RedditModel from './models/reddit';

const saveData = async (database) => {
  // I know, this is hacky af
  console.log('deleting collections');
  await GitHubModel.deleteMany({});
  await RedditModel.deleteMany({});
  console.log('collections deleted');

  database.github.forEach((repoData) => {
    const repo = new GitHubModel();
    repo.title = repoData.title;
    repo.description = repoData.description;
    repo.language = repoData.language;
    repo.last_update = repoData.last_update;
    repo.url = repoData.url;
    repo.live = repoData.live;
    repo.save();
  });

  database.reddit.forEach((postData) => {
    const post = new RedditModel();
    post.headline = postData.headline;
    post.source = postData.source;
    post.image = postData.image;
    post.link = postData.link;
    post.save();
  });
  console.log('done');
};

export const getAllData = async (req, res) => {
  const data = [];
  data.push(
    GitHubModel.find({}).then((repos) => {
      return repos;
    })
  );

  data.push(
    RedditModel.find({}).then((posts) => {
      return posts;
    })
  );

  Promise.all(data).then((result) => {
    res.json({
      github: result[0],
      reddit: result[1],
    });
  });
};

export default saveData;