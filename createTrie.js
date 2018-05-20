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

    // the trie contains no path match for the query, only rootNode
    if (nodePath.length === 1) return [];

    return getSuggestions(endOfQueryNode, normalizedQuery);
  }

  function populate(wordList) {
    wordList.forEach(word => insert(word));
  }

  function getRootNode() {
    return rootNode;
  }

  // public api
  return {
    insert,
    count,
    suggest,
    populate,
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
