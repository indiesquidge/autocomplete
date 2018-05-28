# Autocomplete

A low-level, primitive autocomplete using trie data structure


## Features

This autocomplete library has the ability to insert words manually, get word
suggestions based on a query, populate the data structure with a dictionary
array of words, and delete undesired words.

_NOTE: The library is not populated with any words by default._

### Insertion

```javascript
const completion = createTrie();

completion.insert("hello");

completion.count(); // => 1

completion.insert("world");

completion.count(); // => 2
```


### Suggestions

```javascript
completion.suggest("he"); // => ['hello']

completion.insert("hellen");

completion.suggest("he"); // => ["hello", "hellen"]

completion.suggest("w"); // => ["world"]
```


### Population

```javascript
const fs = require("fs");
const text = "/usr/share/dict/words";
const dictionary = fs.readFileSync(text).toString().trim().split("\n");
const completion = createTrie();

completion.populate(dictionary);

completion.suggest("world"); // => [ 'world', 'worlded', 'worldful', …]
```


### Deletion

```javascript
completion.suggest("world"); // => ['world', 'worlded', 'worldful', …]

completion.delete("worlded");

completion.suggest("world"); // => ['world', 'worldful', …]
```


## Future Improvements

- [ ] case-insensitive suggestions
  - it'd be nice to be able to type in "ap" and have something like "Apache"
    come up as a suggestion; since keys are strings in JS and strings are
    case-sensitive, this would require a bit of refactoring around how we
    discover the `startNode` in `Trie#suggest`

- [ ] substring suggestions
  - right now, words are only displayed as suggestions if the word is prefixed
      by the query; a better implementation would include suggestions that have
      the query as a substring appearing anywhere in the word, not just as a
      prefix; e.g., querying in "ist" would return suggestions like "istle" and
      "isthmus", but also "listen"

---

_Inspired by the ["Compelete-Me"][1] project from the Turing School of Software &
Design_

[1]: http://frontend.turing.io/projects/complete-me.html
