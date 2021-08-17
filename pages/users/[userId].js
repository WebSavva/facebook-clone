import { useRouter } from "next/router";
import useHttp from "../../hooks/useHttp";
import Feed from "../../components/Feed/Feed";
import WidgetBar from "../../components/WidgetBar/WidgetBar";
import Layout from "../../components/UI/Layout/Layout";

export default function UserPage() {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <Layout>
      <h1>{userId}</h1>;
      <WidgetBar />
    </Layout>
  );
}
