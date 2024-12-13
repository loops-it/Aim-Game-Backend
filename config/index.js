module.exports = {
  SMTP_EMAIL: process.env.SMTP_EMAIL ?? "prince08@zohomail.com",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? "Prince#08",
  JWT_SECRET: process.env.JWT_SECRET ?? "secretAimGame",
  port: process.env.PORT ?? 4065,
  key:
    process.env.KEY ??
    "$2a$12$Px4BgXSpSTGZcVrhvK27SeIt5fvdlp//RybVBv1/2PvX4iLVifMMG",
  database: {
    database: process.env.DB_NAME ?? "aimgame-web",
    host: process.env.DB_HOST ?? "cluster0.o4rpy.mongodb.net",
    user: process.env.DB_USER ?? "yohan",
    password: process.env.DB_PASSWORD ?? "123admin",
  }
};
