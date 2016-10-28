const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost/snippetsdb', function(err, db) {
  if (err) {
    console.error(err);
    db.close();
    return;
  }

const collection = db.collection('snippets');

  const create = function(name, content) {
    let snippet = {
      name: name,
      content: content,
      date: new Date(),
      version: 1
    }
    collection.insert(snippet, function(err, result) {
      if (err) {
        console.error('Could not create snippet', name);
        db.close();
        return;
      }
      console.log('Created snippet', name);
      db.close();
    });
    db.close();
  };

  const read = function(name) {
    let query = {
      name: name
    };
    collection.findOne(query, function(err, snippet) {
      if (!snippet || err) {
        console.error('Could not read snippet', name);
      } else {
        snippet.version > 1 ? console.log('Updated on', snippet.date) : console.log('Created on', snippet.date);
        console.log('Read snippet', snippet.name);
        console.log(snippet.content);
      }
      db.close();
    });
  };

  const update = function(name, contents) {
    let query = {
      name: name
    };

    let update = {
      $set: {
        content: contents,
        date: new Date(),
      },
      $inc: {
        version: 1
      }
    };

    collection.findAndModify(query, null, update, function(err, result) {
      let snippet = result.value;
      if (!snippet || err) {
        console.error('Could not update snippet', name);
        db.close();
      } else {
        collection.findOne(query, function(err, result) {
          console.log('Updated snippet', result.name);
          console.log(result.content);
          db.close();
        });
      }
    });
  };

  const del = function(name, content) {
    let query = {
      name: name
    };
    collection.findAndRemove(query, function(err, result) {
      let snippet = result.value;
      if (!snippet || err) {
        console.error('Could not delete snippet', name);
      } else {
        console.log('Deleted snippet', snippet.name);
      }
      db.close();
    })
  };

  const main = function() {
    if (process.argv[2] == 'create') {
      create(process.argv[3], process.argv[4]);
    }
    else if (process.argv[2] == 'read') {
      read(process.argv[3]);
    }
    else if (process.argv[2] == 'update') {
      update(process.argv[3], process.argv[4]);
    }
    else if (process.argv[2] == 'delete') {
      del(process.argv[3]);
    }
    else {
      console.error('Command not recognized');
      db.close();
    }
  }
  main();
});
