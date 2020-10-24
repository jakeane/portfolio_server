/* eslint-disable comma-dangle */
import mongoose, { Schema } from 'mongoose';

const GitHubSchema = new Schema(
  {
    title: String,
    description: String,
    language: String,
    last_update: String,
    image: String,
    url: String,
    live: String,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

const GitHubModel = mongoose.model('GitHub', GitHubSchema);

export default GitHubModel;
