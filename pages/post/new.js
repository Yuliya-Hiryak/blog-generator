import { useRouter } from 'next/router'
import {useState} from 'react';
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import {AppLayout} from "../../components/Layout/AppLayout";
import {getAppProps} from '../../utils/getAppProps'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBrain} from '@fortawesome/free-solid-svg-icons';


export default function NewPost() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      const response = await fetch('/api/generatePost', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({topic, keywords})
      })

      const data = await response.json();

      if (data?.postId) {
        router.push(`/post/${data.postId}`)
      }
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <div className="h-full overflow-hidden">
      {!loading ?
        <div className="w-full h-full flex flex-col overflow-auto">
          <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm border border-slate-200 rounded-md p-4 bg-slate-100 shadow-xl shadow-slate-200">
            <div>
              <label>
                <strong>
                  Generate a blog post on the topic of:
                </strong>
                <textarea
                  value={topic}
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  onChange={(event) => setTopic(event.target.value)}
                  maxLength={180}
                />
              </label>
            </div>
            <div>
              <label>
                  <strong>
                    Targeting the following keywords:
                  </strong>
                  <textarea
                    value={keywords}
                    className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                    onChange={(event) => setKeywords(event.target.value)}
                    maxLength={80}
                  />
                  <small className="block mb-2">
                    Separate keywords with a comma.
                  </small>
                </label>
            </div>
            <button className="btn" type="submit" disabled={!keywords.trim() || !topic.trim()}>
              Generate
            </button>
          </form>
        </div>
        :
        <div className="text-cyan-700 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Generating...</h6>
        </div>
      }
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: '/token-topup',
          permanent: false
        }
      }
    }

    return {props}
  }
})