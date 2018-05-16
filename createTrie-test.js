const assert = require('assert')
const createTrie = require('./createTrie')

test('inserts words and keep counts of the insertions', () => {
  const completion = createTrie()

  expect(completion.count()).toBe(0)
  completion.insert('pizza')
  expect(completion.count()).toBe(1)
  completion.insert('apple')
  expect(completion.count()).toBe(2)
})

test('inserts letters of a word into linked nodes and marks the ending letter', () => {
  const completion = createTrie()

  completion.insert('hey')

  const rootNode = completion.getRootNode()

  expect(rootNode.getChildren().h.getValue()).toEqual('h')
  expect(rootNode.getChildren().h.getIsCompleteString()).toBe(false)

  expect(rootNode.getChildren().h.getChildren().e.getValue()).toEqual('e')
  expect(
    rootNode.getChildren().h.getChildren().e.getIsCompleteString()
  ).toBe(false)

  expect(
    rootNode.getChildren().h.getChildren().e.getChildren().y.getValue()
  ).toEqual('y')
  expect(
    rootNode.getChildren().h.getChildren().e.getChildren().y.getIsCompleteString()
  ).toBe(true)
})

test('insertion should build on existing nodes if the word prefixes match', () => {
  const completion = createTrie()

  completion.insert('hey')
  completion.insert('he')

  const rootNode = completion.getRootNode()

  expect(Object.keys(rootNode.getChildren().h.getChildren()).length).toBe(1)
})

test('insertion should update a node to mark it as the final letter', () => {
  const completion = createTrie()

  completion.insert('hey')
  const rootNodeBefore = completion.getRootNode()

  expect(
    rootNodeBefore.getChildren().h.getChildren().e.getIsCompleteString()
  ).toBe(false)

  completion.insert('he')
  const rootNodeAfter = completion.getRootNode()

  expect(
    rootNodeAfter.getChildren().h.getChildren().e.getIsCompleteString()
  ).toBe(true)
})

test('should be able to offer suggestions based on a word prefix', () => {
  const completion = createTrie()

  completion.insert('pizza')

  expect(completion.suggest('piz')).toEqual(['pizza'])

  completion.insert('pizzeria')

  expect(completion.suggest('piz')).toEqual(['pizza', 'pizzeria'])

  completion.insert('apple')

  expect(completion.suggest('a')).toEqual(['apple'])

  expect(completion.suggest('x')).toEqual([])
})

test('should be able to populate given a dictionary list of words', () => {
  const dictionary = [
    'ape', 'apothecary', 'apple',
    'pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle'
  ]
  const completion = createTrie()

  completion.populate(dictionary)

  expect(completion.suggest('piz')).toEqual(
    ['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']
  )

  expect(completion.suggest('ap')).toEqual(['ape', 'apothecary', 'apple'])
})

test('should be able to handle insertions and queries that include spacing', () => {
  const completion = createTrie()

  completion.insert('  apple     ')

  expect(completion.suggest('   ap ')).toEqual(['apple'])
})

// =================================================================
// ================== Test framework & assertions ==================
// =================================================================

function test (title, callback) {
  const fgGreen = '\x1b[32m'
  const fgRed = '\x1b[31m'

  try {
    if (typeof callback === 'function') {
      callback()
    }
    console.log(fgGreen, `✔ ${title}`)
  } catch (err) {
    console.error(fgRed, `✖ ${title}`)
    console.error(err)
  }
}

function expect (actual) {
  return {
    toBe (expected) {
      assert.strictEqual(actual, expected)
    },
    toEqual (expected) {
      assert.deepStrictEqual(actual, expected)
    },
    not: {
      toBe (expected) {
        assert.notStrictEqual(actual, expected)
      },
      toEqual (expected) {
        assert.notDeepStrictEqual(actual, expected)
      }
    }
  }
}
