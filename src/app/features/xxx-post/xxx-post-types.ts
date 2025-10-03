export interface XxxPostType {
  body: string;
  id: number;
  title: string;
  userId: number;
}

// SignalStore withState initial state requires all properties to be defined
export const xxxPostInitialState: XxxPostState = {
  isPostsLoading: false,
  postForm: undefined,
  posts: [],
  selectedPostId: undefined,
  selectedUserId: undefined,
};

export interface XxxPostState {
  isPostsLoading: boolean;
  postForm?: XxxPostType;
  posts: XxxPostType[];
  selectedPostId?: number;
  selectedUserId?: number;
}
