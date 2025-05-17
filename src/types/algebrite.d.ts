declare module 'algebrite' {
  function factor(expr: string): { toString(): string };
  function expand(expr: string): { toString(): string };
  function gcd(expr: string): { toString(): string };
  function lcm(expr: string): { toString(): string };
} 