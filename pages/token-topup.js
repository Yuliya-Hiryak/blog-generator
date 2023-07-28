import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from '../components/Layout/AppLayout';
import { getAppProps } from '../utils/getAppProps';



export default function TokenTopUp() {
  const handleClick = async () => {
    const response = await fetch('/api/addTokens', {
      method: 'POST'
    })

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return null;
    }

    return window.location.href = data.session.url;
  }

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-lg w-full border border-slate-200 rounded-md bg-slate-100 shadow-xl shadow-slate-200 p-8">
        <div className="mb-4 text-center">Click the button to buy more tokens</div>
        <button
          className="btn"
          onClick={handleClick}
        >
          Add tokens
        </button>
      </div>
    </div>
  );
}

TokenTopUp.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {props}
  }
})
