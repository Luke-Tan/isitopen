const config = {};

config.baseUrl = process.env.SERVE_ENV == "build" ? "" : "http://localhost:8080";

export default config;
