const config = {}

config.baseUrl = process.env.NODE_ENV == "production" ? "http://glints-luke.herokuapp.com" : "http://localhost:8080"
config.socketUrl = process.env.NODE_ENV == "production" ? "https://glints-luke.herokuapp.com" : "http://localhost:8080"

export default config
