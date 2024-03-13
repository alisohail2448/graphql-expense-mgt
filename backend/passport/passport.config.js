import { GraphQLLocalStrategy } from "graphql-passport";
import passport from "passport";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("serializing Userrr");
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deseralizing Userrr");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
      try {
        const user = User.findOne({ username });
        if (!user) {
          throw new Error("Invalid username or password");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error("Invalid username or password");
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
};
