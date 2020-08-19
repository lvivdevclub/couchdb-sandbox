docker run -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -d couchdb
docker run -p 5985:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -d couchdb

//to open UI
npm install
cd node_modules/fauxton
npm start

//to create user
curl -X PUT http://admin:password@127.0.0.1:5985/_node/_local/_config/admins/user -d '"password"'
