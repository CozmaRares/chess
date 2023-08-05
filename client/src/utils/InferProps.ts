// NOTE: will work as long as React keeps the props as the first argument in the functional components
type ArgumentTypes<F extends Function> = F extends (
    props: infer TT,
    ...args: any
) => any
    ? TT
    : never;

type Head<T extends Array<Function>> = T extends [
    infer TT extends Function,
    ...any
]
    ? TT
    : never;

type Tail<T extends Array<Function>> = T extends [
    any,
    ...infer TT extends Array<Function>
]
    ? TT
    : never;

type UglyInferProps<T extends Array<Function>> = T extends [Function]
    ? ArgumentTypes<Head<T>>
    : ArgumentTypes<Head<T>> & UglyInferProps<Tail<T>>;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

type InferProps<T extends Array<Function>> = Prettify<UglyInferProps<T>>;

export default InferProps;
