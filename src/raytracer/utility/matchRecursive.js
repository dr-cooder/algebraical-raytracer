import { mapObject } from './mapObject.js';

const matchRecursive = (matchFunctions) => (operation) => {
  if (operation._tag === undefined) {
    return operation;
  } else {
    const finishedNode = mapObject(operation, matchRecursive(matchFunctions));
    if (finishedNode._tag in matchFunctions === false) {
      throw new Error(`No matching function provided for _tag === "${finishedNode._tag}"`);
    }
    return matchFunctions[finishedNode._tag](finishedNode);
  }
};

export { matchRecursive };
