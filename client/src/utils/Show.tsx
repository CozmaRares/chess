const Show: React.FC<{
  when: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ when, children, fallback }) => {
  return <> {when === true ? children : fallback ?? <></>}</>;
};

export default Show;
