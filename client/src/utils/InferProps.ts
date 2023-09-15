type ArgumentTypes<F extends React.FC<any>> = F extends React.FC<infer TT>
  ? TT
  : never;

type Head<T extends Array<React.FC<any>>> = T extends [
  infer TT extends React.FC<any>,
  ...any,
]
  ? TT
  : never;

type Tail<T extends Array<React.FC<any>>> = T extends [
  any,
  ...infer TT extends Array<React.FC<any>>,
]
  ? TT
  : never;

type UglyInferProps<T extends Array<React.FC<any>>> = T extends [React.FC<any>]
  ? ArgumentTypes<Head<T>>
  : ArgumentTypes<Head<T>> & UglyInferProps<Tail<T>>;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type InferProps<T extends Array<React.FC<any>>> = Prettify<UglyInferProps<T>>;

export default InferProps;
