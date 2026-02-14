import { PostType, TComment } from "@/lib/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TStorePost {
  posts: PostType<{
    id: string;
    fullName: string;
    profilePicture: { url: string; pub_id: string };
  }>[];
  selectedPost: string | null;
}

const initialState: TStorePost = {
  posts: [],
  selectedPost: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setMyReaction: (
      state,
      action: PayloadAction<{
        userId: string;
        reactionType:
          | "LIKE"
          | "CARE"
          | "WOW"
          | "LOVE"
          | "HAHA"
          | "SAD"
          | "ANGRY"
          | null;
        targetId: string;
      }>
    ) => {
      const { userId, reactionType, targetId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === targetId);

      if (postIndex === -1) return;

      const oldPost = state.posts[postIndex];
      const currentReaction = oldPost.myReaction;

      let newMyReaction = null;

      // Add new reaction count
      if (
        reactionType &&
        (!currentReaction || currentReaction.reactionType !== reactionType)
      ) {
        newMyReaction = {
          reactionType,
          userId,
          targetId,
          targetType: "POST",
        };
      }

      const updatedPost = {
        ...oldPost,
        myReaction: newMyReaction,
      };

      state.posts = [
        ...state.posts.slice(0, postIndex),
        updatedPost,
        ...state.posts.slice(postIndex + 1),
      ];
    },
    setReactionSummary: (
      state,
      action: PayloadAction<{
        postId: string;
        reactionSummary: PostType["reactionSummary"];
      }>
    ) => {
      const { postId, reactionSummary } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex].reactionSummary = reactionSummary;
      }
    },
    setSelectedPost: (
      state,
      action: PayloadAction<{ postId: string | null }>
    ) => {
      state.selectedPost = action.payload.postId || null;
    },
    setPosts: (
      state,
      action: PayloadAction<
        PostType<{
          id: string;
          fullName: string;
          profilePicture: { url: string; pub_id: string };
        }>[]
      >
    ) => {
      state.posts = action.payload;
    },
    setComments: (
      state,
      action: PayloadAction<{ comments: TComment[]; postId: string }>
    ) => {
      const { comments, postId } = action.payload;

      // Find the post index
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) {
        console.log("post not found");
        return;
      }

      // Update the post with new comments using immer from Redux Toolkit
      state.posts[postIndex].comments = comments;
    },
    addComment: (
      state,
      action: PayloadAction<{ comment: TComment; postId: string }>
    ) => {
      const { comment, postId } = action.payload;

      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex === -1) {
        console.log("post not found");
        return;
      }

      state.posts[postIndex] = {
        ...state.posts[postIndex],
        comments: [
          comment,
          ...state.posts[postIndex].comments.map((c) => {
            if (c.id === comment.parentId) {
              return {
                ...c,
                replyCount: c.replyCount + 1,
              };
            }
            return c;
          }),
        ],
        commentCount: state?.posts[postIndex]?.commentCount + 1,
      };
    },
  },
});

export const {
  setMyReaction,
  setPosts,
  setSelectedPost,
  setComments,
  setReactionSummary,
  addComment,
  // setRepliesComments,
  // setReplyComment
} = postSlice.actions;
export default postSlice.reducer;
