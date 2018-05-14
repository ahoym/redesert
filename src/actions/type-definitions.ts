export type Meta = {
  referenceId: string | number;
};

export type Action = {
  readonly type: string;
  readonly payload?: any;
  readonly errors?: object;
  meta?: Meta;
};
