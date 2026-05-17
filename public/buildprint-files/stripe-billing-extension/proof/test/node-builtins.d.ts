declare module "node:assert/strict" {
  interface Assert {
    equal(actual: unknown, expected: unknown, message?: string): void;
    match(actual: string, regexp: RegExp, message?: string): void;
    rejects(
      block: () => Promise<unknown>,
      expected?: RegExp | ((error: unknown) => boolean),
      message?: string
    ): Promise<void>;
  }

  const assert: Assert;
  export default assert;
}

declare module "node:test" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => Promise<void> | void): void;
}
