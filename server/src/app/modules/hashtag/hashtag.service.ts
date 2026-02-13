import { QueryBuilder } from "../../lib/queryBuilder";
import Hashtag from "./hashtag.model";

const getAllHashtags = async () => {
  const builder = new QueryBuilder(Hashtag, {});
  const res = await builder.search(["tag"]).paginate().sort().execWithMeta();
  return res;
};

export const HashtagService = {
  getAllHashtags,
};
