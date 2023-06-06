const Show: React.FC<{
  when: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ when, children, fallback }) => {
  return <> {when ? children : fallback}</>;
};
export default Show;
