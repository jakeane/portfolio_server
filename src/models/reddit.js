/* eslint-disable comma-dangle */
import mongoose, { Schema } from 'mongoose';

const RedditSchema = new Schema(
  {
    headline: String,
    source: String,
    image: String,
    link: String,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

const RedditModel = mongoose.model('Reddit', RedditSchema);

export default RedditModel;
