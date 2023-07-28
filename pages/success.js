import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from '../components/Layout/AppLayout';
import { getAppProps } from '../utils/getAppProps';



export default function Success() {
  return (
    <div className="flex items-center justify-center">
      <h1>Thank you for your purchase!</h1>
    </div>
  );
}

Success.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {props}
  }
})
