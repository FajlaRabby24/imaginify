import { UserButton } from "@clerk/nextjs";

const Home = () => {
  return (
    <div>
      <p>Home</p>

      <UserButton afterSwitchSessionUrl="/" />
    </div>
  );
};

export default Home;
