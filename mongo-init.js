db.createUser({
  user: '$MONGO_INITDB_ROOT_USERNAME',
  roles: [
    {
      role: 'readWrite',
      db: '$MONGO_INITDB_DATABASE'
    }
  ]
});
