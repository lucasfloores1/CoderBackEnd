export default {
    env : process.env.NODE_ENV || "dev",
    port : process.env.PORT,
    front_url : process.env.FRONT_URL,
    mongodb_uri : process.env.MONGODB_URI,
    jwt_secret : process.env.JWT_SECRET,
    cookie_secret : process.env.COOKIE_SECRET,
    github_client_id : process.env.GITHUB_CLIENTID,
    github_secret_key : process.env.GITHUB_SECRETKEY,
    persistence : process.env.PERSISTENCE || "mongodb_dev",
    mail: {
        service: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT ,
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
    },
}