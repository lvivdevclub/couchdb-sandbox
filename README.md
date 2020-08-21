docker run --net=bridge --name couch1 -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -d couchdb
docker run --net=bridge --name couch2 -p 5985:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -d couchdb

//to open UI
npm install
cd node_modules/fauxton
npm start

//to create user
curl -X PUT http://admin:password@127.0.0.1:5985/_node/_local/_config/admins/user -d '"password"'
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' c258c306aa39