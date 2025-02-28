import { UserButton } from "@clerk/nextjs";

const RootPage = () => {
  return (
    <div>
      Root Page (Protected)
      <UserButton afterSwitchSessionUrl="" />
    </div>
  );
};

export default RootPage;
