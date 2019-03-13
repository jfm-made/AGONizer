import EventEmitter from 'events';

class GlobalEmitter extends EventEmitter {}

const globalEmitter = new GlobalEmitter();

export default globalEmitter;