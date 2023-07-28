import { useState, useContext } from "react";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { useRouter } from 'next/router';
import {ObjectId} from 'mongodb';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHashtag} from '@fortawesome/free-solid-svg-icons';
import {AppLayout} from "../../components/Layout/AppLayout";
import clientPromise from '../../lib/mongodb';
import {getAppProps} from '../../utils/getAppProps';
import PostsContext from '../../context/postsContext';


export default function PostPage(props) {
  const router = useRouter();
  const { postContent, title, metaDescription, keywords, postId } = props;
  const { deletePost } = useContext(PostsContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false);
    try {
      const response = await fetch(`/api/deletePost`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({postId})
      })

      const data = await response.json();

      if (data.success) {
        deletePost(postId)
        router.replace('/post/new')
      }
    } catch (error) {
      console.log('Error', error);
    }
  }
  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{title}</div>
          <div className="mt-2">{metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {keywords.split(',').map((keyword, i) => (
            <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} />
              {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog post
        </div>
        <div dangerouslySetInnerHTML={{__html: postContent}} />
        <div className="my-4">
          {showDeleteConfirm ?
            <div>
              <p className="p-2 bg-red-300 text-center">Are you sure you want to delete this post? This action is irreversible.</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn to-stone-600 from-stone-600 hover:shadow-stone-600/40" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="btn to-red-600 from-red-600" onClick={handleDeleteConfirm}>Confirm Delete</button>
              </div>
            </div>
          :
            <button className="btn to-red-600 from-red-600" onClick={() => setShowDeleteConfirm(true)}>
              Delete Post
            </button>
          }
        </div>
      </div>
    </div>
  );
}

PostPage.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db('BlogGenerator');
    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub
    })
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id
    });

    if (!post) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false
        }
      }
    }

    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        postId: ctx.params.postId,
        ...props
      }
    }
  }
})
