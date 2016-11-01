const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost')

mongoose.connection.on('error', function(err) {
  console.error('Couldn\'t connect. Error:', err);
});

mongoose.connection.once('open', function() {
  const snippetSchema = mongoose.Schema({
    name: {type: String, unique: true},
    content: String,
    date: {type: Date},
    version: Number
  });

  const Snippet = mongoose.model('Snippet', snippetSchema);

  const create = function(name, content) {
    let snippet = {
      name: name,
      content: content,
      date: new Date(),
      version: 1
    }
    Snippet.create(snippet, function(err, result) {
      if (err || !snippet) {
        console.error('Could not create snippet', name);
        mongoose.disconnect();
        return;
      }
      console.log('Created snippet', name);
      mongoose.disconnect();
    });
  };

  const read = function(name) {
    const query = {
      name: name
    };
    Snippet.findOne(query, function(err, snippet) {
      if (!snippet || err) {
        console.error('Could not read snippet', name);
      } else {
        snippet.version > 1 ? console.log('Updated on', snippet.date) : console.log('Created on', snippet.date);
        console.log('Read snippet', snippet.name);
        console.log(snippet.content);
      }
      mongoose.disconnect();
    });
  };

  const update = function(name, contents) {
    let query = {
      name: name
    };

    let update = {
        content: contents,
        date: new Date(),
    };

    Snippet.findOneAndUpdate(query, update, function(err, snippet) {
      // console.log(result.value);
      if (!snippet || err) {
        console.error('Could not update snippet', name, 'Error:', err);
        mongoose.disconnect();
        return;
      } else {
        console.log('Updated snippet', snippet.name);
        console.log(snippet.content);
        mongoose.disconnect();
      }
    });
  };

  const del = function(name, content) {
    let query = {
      name: name
    };
    Snippet.findOneAndRemove(query, function(err, snippet) {
      if (!snippet || err) {
        console.error('Could not delete snippet', name, 'Error:', err);
        mongoose.disconnect();
        return;
      } else {
        console.log('Deleted snippet', snippet.name);
      }
      mongoose.disconnect();
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
      mongoose.disconnect();
    }
  }

  main();


});
