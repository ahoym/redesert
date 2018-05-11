export type Meta = {
  referenceId: string | number;
};

export type Action = {
  readonly type: string;
  readonly payload?: {
    [id: string]: string | number;
  };
  readonly errors?: object;
  meta?: Meta;
};
