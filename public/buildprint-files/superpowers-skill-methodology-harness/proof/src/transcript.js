export class Transcript {
  constructor() {
    this.events = [];
    this.sequence = 0;
  }

  record(type, data = {}) {
    const event = { seq: ++this.sequence, type, ...data };
    this.events.push(event);
    return event;
  }

  find(type) {
    return this.events.find((event) => event.type === type);
  }

  all(type) {
    return this.events.filter((event) => event.type === type);
  }

  happenedBefore(firstType, secondType) {
    const first = this.find(firstType);
    const second = this.find(secondType);
    return Boolean(first && second && first.seq < second.seq);
  }

  toJSON() {
    return this.events;
  }
}
