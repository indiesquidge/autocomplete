module.exports = createTrie;

function createTrie() {
  const rootNode = createTrieNode("__root__");
  let numberOfWords = 0;

  function insert(word) {
    const normalizedWord = word.trim();

    numberOfWords++;

    normalizedWord.split("").reduce((parentNode, letter) => {
      const children = parentNode.getChildren();
      const trieNode = children[letter] || createTrieNode(letter);

      // set the child if it does not exist
      if (!children[letter]) {
        children[letter] = trieNode;
      }

      // mark the last letter of the word
      if (letter === normalizedWord[normalizedWord.length - 1]) {
        trieNode.setIsCompleteString(true);
      }

      return trieNode;
    }, rootNode);
  }

  function count() {
    return numberOfWords;
  }

  function suggest(query) {
    const normalizedQuery = query.trim();
    const nodePath = getNodePath(normalizedQuery);
    const endOfQueryNode = nodePath[nodePath.length - 1];
    const startingSuggestions = [];

    // the trie contains no path match for the query, only rootNode
    if (nodePath.length === 1) return [];

    // the query itself matches a word in the trie
    if (endOfQueryNode.getIsCompleteString()) {
      startingSuggestions.push(normalizedQuery);
    }

    return getSuggestions(endOfQueryNode, normalizedQuery, startingSuggestions);
  }

  function populate(wordList) {
    wordList.forEach(word => insert(word));
  }

  function getRootNode() {
    return rootNode;
  }

  function remove(word) {
    const nodePath = getNodePath(word);
    const lastNodeIndex = nodePath.length - 1;

    // the word to delete is not a word that exists in the trie
    if (!nodePath[lastNodeIndex].getIsCompleteString()) {
      throw Error(`${word} is not a word, nothing deleted`);
    }

    for (let index = lastNodeIndex; index > 0; index--) {
      const node = nodePath[index];
      const parentNode = nodePath[index - 1];

      // we've found a full word
      if (node.getIsCompleteString()) {
        if (index === lastNodeIndex) {
          // the word found is the word requested to be deleted
          node.setIsCompleteString(false);
        } else {
          // the word found is a prefix of the word requested to be deleted;
          // return from loop since rest nodes belong to this prefix word
          return;
        }
      }

      if (isEmpty(node.getChildren())) {
        delete parentNode.getChildren()[node.getValue()];
      }
    }
  }

  // public api
  return {
    insert,
    count,
    suggest,
    populate,
    delete: remove,
    getRootNode
  };

  // private methods
  function getNodePath(query) {
    let nodePath = [rootNode];
    let parentNode = rootNode;

    for (const letter of query.split("")) {
      const childNode = parentNode.getChildren()[letter];
      if (!childNode) return nodePath;
      nodePath.push(childNode);
      parentNode = childNode;
    }

    return nodePath;
  }

  function getSuggestions(node, substring, suggestions = []) {
    const children = node.getChildren();

    for (const key in children) {
      const childNode = children[key];
      const nextSubstring = substring + childNode.getValue();

      if (!childNode) return substring;

      if (childNode.getIsCompleteString()) {
        suggestions.push(nextSubstring);
      }

      getSuggestions(childNode, nextSubstring, suggestions);
    }

    return suggestions;
  }
}

function createTrieNode(letter) {
  const value = letter;
  const children = {};
  let isCompleteString = false;

  function getValue() {
    return value;
  }

  function getChildren() {
    return children;
  }

  function getIsCompleteString() {
    return isCompleteString;
  }

  function setIsCompleteString(bool) {
    isCompleteString = Boolean(bool);
    return isCompleteString;
  }

  // public api
  return {
    getValue,
    getChildren,
    setIsCompleteString,
    getIsCompleteString
  };
}

/**
 * Check if value is an empty object
 * @param {Object} value - the value to check
 */
function isEmpty(value) {
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}
