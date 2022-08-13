export class Stack<T> {
  data: T[] = [];
  current(): T | undefined {
    return this.data.length > 0 ? this.data[this.data.length - 1] : undefined;
  }

  push(value: T): void {
    this.data.push(value);
  }

  pop(): T | undefined {
    if (this.data.length === 0) return;
    return this.data.pop();
  }
}
