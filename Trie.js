module.exports = Trie

function Trie () {
  const rootNode = TrieNode('__root__')
  let numberOfWords = 0

  const insert = word => {
    numberOfWords++

    word.split('').reduce((parentNode, letter) => {
      const children = parentNode.getChildren()
      const trieNode = children[letter] || TrieNode(letter)

      // create the node if it doesn't exist yet
      if (!children[letter]) {
        children[letter] = trieNode
      }

      // mark the last letter of the word
      if (letter === word[word.length - 1]) {
        trieNode.setIsCompleteString(true)
      }

      return trieNode
    }, rootNode)
  }

  const getRootNode = () => rootNode

  const count = () => numberOfWords

  const suggest = query => {
    const startNode = query
      .split('')
      .reduce((parentNode, letter) => {
        if (!parentNode) return undefined
        const node = parentNode.getChildren()[letter]
        return node
      }, rootNode)

    // the Trie contains no path match for the query
    if (!startNode) return []

    return getSuggestions(startNode, query)
  }

  const getSuggestions = (node, substring, suggestions = []) => {
    const children = node.getChildren()

    for (let key in children) {
      const childNode = children[key]
      const nextSubstring = substring + childNode.getValue()

      if (!childNode) return substring

      if (childNode.getIsCompleteString()) {
        suggestions.push(nextSubstring)
      }

      getSuggestions(childNode, nextSubstring, suggestions)
    }

    return suggestions
  }

  const populate = wordList => wordList.forEach(word => insert(word))

  return {
    insert,
    count,
    suggest,
    populate,
    getRootNode
  }
}

function TrieNode (letter) {
  const value = letter
  const children = {}
  let isCompleteString = false

  const getValue = () => value

  const getChildren = () => children

  const getIsCompleteString = () => isCompleteString

  const setIsCompleteString = bool => {
    isCompleteString = Boolean(bool)
    return isCompleteString
  }

  return {
    getValue,
    getChildren,
    setIsCompleteString,
    getIsCompleteString
  }
}
