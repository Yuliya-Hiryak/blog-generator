import React from 'react';


const PostsContext = React.createContext({});

export default PostsContext;

export const PostsProvider = ({children}) => {
  const [posts, setPosts] = React.useState([]);
  const [noMorePosts, setNoMorePosts] = React.useState(false);

  const deletePost = React.useCallback((postId) => {
    setPosts((posts) => posts.filter((p) => p._id !== postId))
  }, []);

  const setPostsFromSSR = React.useCallback((postsFromSSR = []) => {
    setPosts((value) => {
      const newPosts = [...value];
      postsFromSSR.forEach((post) => {
        const exist = newPosts.find((p) => p._id === post._id);

        if (!exist) {
          newPosts.push(post);
        }
      })

      return newPosts;
    });
  }, [])

    const getPosts = React.useCallback(async ({lastPostDate, getNewerPosts = false}) => {
    const result = await fetch(`/api/getPosts`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({lastPostDate, getNewerPosts})
    })

    const data = await result.json();
    const postsResults = data.posts || [];

    if (postsResults.length < 5) {
      setNoMorePosts(true);
    }

    setPosts((value) => {
      const newPosts = [...value];
      postsResults.forEach((post) => {
        const exist = newPosts.find((p) => p._id === post._id);

        if (!exist) {
          newPosts.push(post);
        }
      })

      return newPosts;
    });
  }, [])
  return (
    <PostsContext.Provider
      value={{
        posts,
        setPostsFromSSR,
        getPosts,
        noMorePosts,
        deletePost
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}