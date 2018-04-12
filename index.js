const fs = require('fs')

const text = '/usr/share/dict/words'
const dictionary = fs.readFileSync(text).toString().trim().split('\n')

const completion = Trie()

// Phase 1
completion.insert('pizza')

console.log(completion.count())

completion.insert('apple')

console.log(completion.count())

// Phase 2
console.log(completion.suggest('piz'))

completion.insert('pizzeria')

console.log(completion.suggest('piz'))
console.log(completion.suggest('a'))

// Phase 3
completion.populate(dictionary)

console.log(completion.count())
console.log(completion.suggest('piz'))

// ==================== Trie Implementation ====================

function Trie () {
  let words = []

  const insert = word => {
    words.push(word)
  }

  const count = () => words.length

  const suggest = query => words.filter(word => word.startsWith(query))

  const populate = dictionary => {
    words = dictionary
  }

  return {
    insert,
    suggest,
    populate,
    count
  }
}
