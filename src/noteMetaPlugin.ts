const markdownLinkExtractor = require('markdown-link-extractor');
const removeMd = require('remove-markdown');

export {
  countNum,
  countWords,
  countLines,
  countChar,
  countLetter,
  getByteSize,
};

// Gets number of 'links' in a note
export function getNumLinks(str) {
  const linkNo = markdownLinkExtractor(str).length;
  return linkNo;
}

// Gets number of characters excluding MD
export function noMdChar(str) {
  let cleanStr = removeMd(str);
  cleanStr = cleanStr.replace(/\n /, '');
  return cleanStr.length;
}

// Gets number of 'words' in a note
function countWords(str) {
  // prettier-ignore
  str = str.replace(/(^\s*)|(\s*$)/gi, '');
  str = str.replace(/[ ]{2,}/gi, ' ');
  str = str.replace(/\n /, '\n');
  return str.split(' ').length;
}

// Gets number of 'lines' in a note
function countLines(str) {
  return str.split('\n').length;
}

// Gets number of 'characters' in a note
function countChar(str) {
  str = str.replace(/\n /, '');
  return str.length;
}

// Gets number of 'numbers' in a note
function countNum(str) {
  return str.replace(/[^0-9]/g, '').length;
}

// Gets number of 'letters' in a note
function countLetter(str) {
  return str.replace(/[^a-z]/gi, '').length;
}

// Gets the size in bytes of the note
function getByteSize(str) {
  const byteSize = (str) => new Blob([str]).size;
  const result = byteSize(str);

  // determines note size unit
  const convertBytes = (result) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (result == 0) {
      return 'n/a';
    }
    const i = Math.floor(Math.log(result) / Math.log(1024));

    if (i == 0) {
      return result + ' ' + sizes[i];
    }

    return (result / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  return convertBytes(result);
}

// Gets number of images
export function getImageNum(str) {
  // prettier-ignore
  // regex matches all images in note
  const regex = /(?:!\[(.*?)\]\((.*?)\))/g;

  const numImages = str.match(regex);
  if (numImages != null) {
    return numImages.length;
  } else {
    return '0';
  }
}

// fix
// Gets number of code blocks
export function getNumCodeBlocks(str) {
  // prettier-ignore
  //regex matches codeblocks
  const regex = /```[a-z]*\n[\s\S]*?\n```/g;

  const numCodeBlocks = str.match(regex);
  if (numCodeBlocks != null) {
    return numCodeBlocks.length;
  } else {
    return 0;
  }
}

// Get read time
export function readTime(str) {
  const wpm = 225;
  const words = countWords(str);
  const eqn = words / wpm;
  const time = Math.ceil(eqn);

  if (eqn <= 0.9) {
    return `< 1 min`;
  }
  if (eqn > 0.9 && eqn <= 1.9) {
    return `1 min`;
  }
  if (eqn >= 2.0) {
    return `${time} mins`;
  }
}
