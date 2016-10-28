# Mongo Notes

This is a simple CRUD text-snippet-saving-note-taking-app.

## Installation and Use
1. Run `npm install` to install dependencies
2. Make sure you have the latest versions of Nodejs and MongoDB installed.
3. Run `./run_mongod` script (you may need to change permissions)
4. The basic commands go:
    - `node snippets <COMMAND> <NAME> <CONTENT>`
    - ex: `node snippets create Test "This is a test."`
5. Commands are:
    1. `create`
    2. `delete`
    3. `update`
    4. `read`
