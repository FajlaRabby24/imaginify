const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <>
      <h2 className="font-bold text-2xl text-gray-800 "> {title} </h2>
      {subtitle && <p className="mt-2">{subtitle}</p>}
    </>
  );
};

export default Header;
