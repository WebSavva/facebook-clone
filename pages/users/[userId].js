import dynamic from "next/dynamic";

const UserClientPage = dynamic(
  () => import("./../../components/UserPage/UserPage"),
  {
    ssr: false,
  }
);

export default function UserPage() {
  return <UserClientPage />;
}

UserPage.auth = true;
