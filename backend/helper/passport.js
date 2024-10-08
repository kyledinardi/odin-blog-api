const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStragetgy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

passport.use(
  new LocalStragetgy(
    { usernameField: 'email', passwordField: 'password' },

    async (username, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: username },
        });

        const match = await bcrypt.compare(password, user.passwordHash);

        if (!user) {
          return done(null, false, { message: 'Incorrect email' });
        }

        if (!match) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },

    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: jwtPayload.id },
        });
        
        return done(null, user || false);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);
