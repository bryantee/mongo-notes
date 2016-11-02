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

  // read function takes name as argument -- passed from commandline as argument
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
        console.log('Version', snippet.version);
      }
      mongoose.disconnect();
    });
  };

  // update function -- takes name and contents passed as arguments from commandline
  const update = function(name, contents) {
    let query = {
      name: name
    };

    let update = {
      $set: {
        content: contents,
        date: new Date()
      },
      $inc: {version: 1}
    };

    Snippet.findOneAndUpdate(query, update, {upsert: true, new: true}, function(err, snippet) {
      if (!snippet || err) {
        console.error('Could not update snippet', name, 'Error:', err);
        mongoose.disconnect();
        return;
      } else {
        read(name);
      }
    });
  };

  // delete function -- name passed as argument in commandline.
  const del = function(name) {
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

  // Main, where all commandline arguments are parsed and correct functions are called
  const main = function() {
    if (process.argv[2] == 'create') {
      update(process.argv[3], process.argv[4]); // YES, create does call update() in the program -- update handles create + updates
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
