export function dumpJSON(obj) {
  console.log(`Dumping JSON string of: ${typeof obj}`);
  console.log(JSON.stringify(obj, null, 2));
}


function toStructure(obj) {
  const structure = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === undefined) {
      structure[key] = '[undefined]';
    } else if (value === null) {
      structure[key] = null;
    } else if (typeof value === 'object') {
      structure[key] = toStructure(value);
    } else {
      structure[key] = typeof value;
    }
  });
  return structure;
}

export function dumpStructure(obj) {
  console.log(`Dumping structure of: ${typeof obj}`);
  console.log(JSON.stringify(toStructure(obj), null, 2));
}


export default {
  dumpJSON,
  dumpStructure,
};
