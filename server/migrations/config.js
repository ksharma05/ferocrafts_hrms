require('dotenv').config();

module.exports = {
  mongodb: {
    url: process.env.MONGO_URI || 'mongodb://localhost:27017/ferocrafts_hrms',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

