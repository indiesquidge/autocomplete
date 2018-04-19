module.exports = Trie

function Trie () {
  const rootNode = TrieNode('__root__')
  let numberOfWords = 0

  const insert = word => {
    numberOfWords++

    word.split('').reduce((parentNode, letter) => {
      const children = parentNode.getChildren()
      const nodeInTrie = children[letter]
      const trieNode = nodeInTrie || TrieNode(letter)

      // create the node if it doesn't exist yet
      if (!nodeInTrie) {
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

  return {
    insert,
    count,
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
