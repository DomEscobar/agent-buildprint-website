declare module 'node:assert/strict' {
  const assert: {
    ok(value: unknown, message?: string): void;
    equal(actual: unknown, expected: unknown, message?: string): void;
    match(value: string, regexp: RegExp, message?: string): void;
  };
  export default assert;
}

declare module 'node:test' {
  export default function test(name: string, fn: () => void | Promise<void>): void;
}
