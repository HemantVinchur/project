let settings = {};

const DBConfig = {
    local: {
        port: 3002,
        mongo: {
            host: "localhost",
            port: 27017,
            database: "project",
        },
    },
    dev: {
        port: 4000,
        mongo: {
            user: process.env.MONGO_USER ? process.env.MONGO_USER : "myUserAdmin",
            password: process.env.MONGO_PASS ? process.env.MONGO_PASS : "abc123",
            host: "localhost",
            port: 27017,
            database: process.env.MONGO_DBNAME_DEV ? process.env.MONGO_DBNAME_DEV : "admin"
        },

    },
}

switch (process.env.NODE_ENV) {
    case "dev":
        let dev = DBConfig.dev;
        DBConfig.dev.URI = `mongodb://${dev.mongo.user}:${dev.mongo.password}@${dev.mongo.host}:${dev.mongo.port}/${dev.mongo.database}`
        settings = DBConfig.dev
        break;

    default:
        let local = DBConfig.local;
        DBConfig.local.URI = `mongodb://${local.mongo.host}:${local.mongo.port}/${local.mongo.database}`;
        settings = DBConfig.local;
        break;
}


module.exports = settings;