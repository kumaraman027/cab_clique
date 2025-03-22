

// import * as http from 'http';
// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";
// import bcrypt from "bcrypt";
// import passport from "passport";
// import { Strategy } from "passport-local";
// import session from "express-session";
// import env from "dotenv";
// import GoogleStrategy from "passport-google-oauth2"
// import { Server, Socket } from "socket.io";


// const app = express();
// const port = 4000;
// const saltRounds = 10;
// env.config();
// const server=http.createServer(app);



// const io=new Server(server);
// io.on('connection',(socket)=>{
//   console.log("A new user has connected ",socket.id);
// })





  



// app.use(
//   session({
//     secret: "SECRET",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// app.use(passport.initialize());
// app.use(passport.session());

// const db = new pg.Client({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
// });
// db.connect();

// app.get("/", (req, res) => {
//   res.render("Landing.ejs");
// });

// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });

// app.get("/register", (req, res) => {
//   res.render("login.ejs");
// });
// // app.get("/joingroup", (req, res) => {
// //   if (req.isAuthenticated()) {
// //     res.render("joingroup.ejs");
// //   } else {
// //     res.redirect("/login");
// //   }
// // });

// app.get('/joingroup', async (req, res) => {
//   if (req.isAuthenticated()) {
//     try {
//       const result = await db.query('SELECT * FROM user_data'); // Modify this query according to your table and needs
//       res.render('joingroup.ejs', { data: result.rows });
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   } else {
//     res.redirect('/login');
//   }
// });

// app.get("/logout", (req, res) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

// app.get("/group", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.render("group.ejs");
//   } else {
//     res.redirect("/login");
//   }
// });

// app.get("/auth/google",passport.authenticate("google",{
//   scope:["profile","email"],
// }))
// app.get("/auth/google/group",
//   passport.authenticate("google",{
//     successRedirect:"/group",
//     failureRedirect:"/login",
//   })
// )
// app.get("/myprofile", async (req, res) => {
//   try {
    
//     res.render("myprofile.ejs");
//   } catch (error) {
//     console.error("Error fetching posts :", error);
//     res.status(500).json({ message: "Error fetching posts" });
//   }
// });

// // app.get("/group", (req, res) => {
// //   // console.log(req.user);
// //   if (req.isAuthenticated()) {
// //     res.render("index.js");
// //   } else {
// //     res.redirect("/login");
// //   }
// // });
// app.post("/create", async (req, res) => {
//   if (req.isAuthenticated()) {
//     const { vacancy, time, date, from_location, to_location,type } = req.body;
//     console.log(type);
//     // Check if any required field is missing
//     // if (!date) {
//     //   return res.status(400).send("Date is required");
//     // }

//     const userId = req.user.id;
//     console.log(userId);

//     try {
//       await db.query(
//         "INSERT INTO user_data (vacancy, time, date, from_location, to_location, user_id, type) VALUES ($1, $2, $3, $4, $5, $6,$7)",
//         [vacancy, time, date, from_location, to_location, userId,type]
//       );
//       res.redirect("/group");
//     } catch (error) {
//       console.error("Error creating group:", error);
//       res.status(500).send("Internal Server Error");
//     }
//   } else {
//     res.redirect("/login");
//    }
// });


// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/group",
//     failureRedirect: "/login",
//   })
// );

// app.post("/register", async (req, res) => {
//   const email = req.body.username;
//   const password = req.body.password;

//   try {
//     const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
//       email,
//     ]);

//     if (checkResult.rows.length > 0) {
//       // Email already exists, send alert message to the client and redirect to sign-in page
//       res.send("<script>alert('Email already exists'); window.location='/login';</script>");
//     } else {
//       bcrypt.hash(password, saltRounds, async (err, hash) => {
//         if (err) {
//           console.error("Error hashing password:", err);
//           // Handle error
//           res.status(500).send("Internal Server Error");
//         } else {
//           const result = await db.query(
//             "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
//             [email, hash]
//           );
//           const user = result.rows[0];
//           req.login(user, (err) => {
//             if (err) {
//               console.error("Error logging in user:", err);
//               // Handle error
//               res.status(500).send("Internal Server Error");
//             } else {
//               console.log("User registered successfully");
//               res.redirect("/group");
//             }
//           });
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// passport.use(
//   "local",
//   new Strategy(async function verify(username, password, cb) {
//     try {
//       const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
//         username,
//       ]);
//       if (result.rows.length > 0) {
//         const user = result.rows[0];
//         const storedHashedPassword = user.password;
//         bcrypt.compare(password, storedHashedPassword, (err, valid) => {
//           if (err) {
//             console.error("Error comparing passwords:", err);
//             return cb(err);
//           } else {
//             if (valid) {
//               return cb(null, user);
//             } else {
              
//               return cb(null, false);
//             }
//           }
//         });
//       } else {
//         return cb("User not found");
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   })  
// );
// passport.use(
//   "google",
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:4000/auth/google/group",
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       try {
        
//         const result = await db.query("SELECT * FROM users WHERE email = $1", [
//           profile.email,
//         ]);
//         if (result.rows.length === 0) {
//           const newUser = await db.query(
//             "INSERT INTO users (email, password) VALUES ($1, $2)",
//             [profile.email, "google"]
//           );
//           return cb(null, newUser.rows[0]);
//         } else {
//           console.log("email exist")
//           return cb(null, result.rows[0]);
//         }
//       } catch (err) {
//         return cb(err);
//       }
//     }
//   )
// );
// passport.serializeUser((user, cb) => {
//   cb(null, user.id); // Serialize user ID
// });

// passport.deserializeUser(async (id, cb) => {
//   try {
//     const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
//     cb(null, result.rows[0]); // Deserialize user based on ID
//   } catch (err) {
//     cb(err);
//   }
// });


// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

















import * as http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy } from 'passport-local';
import session from 'express-session';
import env from 'dotenv';
import GoogleStrategy from 'passport-google-oauth2';
import { Server } from 'socket.io';

const app = express();
const port = 4000;
const saltRounds = 10;
env.config();
const server = http.createServer(app);
const io = new Server(server);

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();


app.use(
  session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('Landing.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/register', (req, res) => {
  res.render('login.ejs');
});


app.get('/joingroup', async (req, res) => {
  if (req.isAuthenticated()) {
    const userId=req.user.id; 
    try {
      const result2 = await db.query('SELECT username,profilepic FROM users WHERE id = $1', [userId]);
      const result = await db.query('SELECT * FROM user_data');
      res.render('joingroup.ejs', { data: result.rows,username: result2.rows[0].username,
        profilepic: result2.rows[0].profilepic });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
});
app.get('/yourgroup',async(req,res)=>{
  // console.log("correct");  
  if (req.isAuthenticated()) {
  const userId=req.user.id;
  try {
    const result2 = await db.query('SELECT username,profilepic FROM users WHERE id = $1', [userId]);
    const result = await db.query('SELECT * FROM user_data WHERE user_id = $1 ',[userId]);
    
    res.render('yourgrp.ejs', { data: result.rows,username: result2.rows[0].username,
      profilepic: result2.rows[0].profilepic });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
  } else {
  res.redirect('/login');
}
})

app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/");
    });
  });
});
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});


// Assuming you have a database client instance called `db`
// Ensure you have a route to handle DELETE requests
app.delete('/delete-entry/:id', async (req, res) => {
  const entryId = req.params.id;

  try {
      const deleteQuery = 'DELETE FROM user_data WHERE id = $1';
      const result = await db.query(deleteQuery, [entryId]);

      if (result.rowCount > 0) {
          res.json({ success: true, message: 'Entry deleted successfully' });
      } else {
          res.status(404).json({ success: false, message: 'Entry not found' });
      }
  } catch (error) {
      console.error('Error deleting entry:', error);
      res.status(500).json({ success: false, message: 'Failed to delete entry' });
  }
});


app.put('/edit', async(req, res) => {
  if(req.isAuthenticated()){
    const entryId=req.user.id;
    console.log("edit");
  console.log(entryId);
  const { vacancy, time, from_location, to_location, date, type } = req.body;
  console.log(req.body);

  const sql = `UPDATE user_data SET vacancy = ?, time = ?, from_location = ?, to_location = ?, date = ?, type = ? WHERE id = ?`;
  db.query(sql, [vacancy, time, from_location, to_location, date, type, entryId], (err, result) => {
      if (err) {
          // console.error(err);
          return res.status(500).json({ success: false, message: 'Failed to update entry' });
      }
      res.json({ success: true });
  });}
});

app.get('/group', async(req, res) => {
  if (req.isAuthenticated()) {
   const userId=req.user.id;
    try {
      const result = await db.query('SELECT username,profilepic FROM users WHERE id = $1', [userId]);
      // res.json({ messages: result.rows });
      // console.log(result.rows[0].username);
      res.render('group.ejs',{username: result.rows[0].username,
        profilepic: result.rows[0].profilepic});
  } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
  }
    
  } else {
    res.redirect('/login');
  }
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

app.get('/auth/google/group',
  passport.authenticate('google', {
    successRedirect: '/group',
    failureRedirect: '/login',
  })
);

app.get('/myprofile', async (req, res) => {
  try {
    res.render('myprofile.ejs');
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

app.post('/create', async (req, res) => {
  if (req.isAuthenticated()) {
    const { vacancy, time, date, from_location, to_location, type } = req.body;

    const userId = req.user.id;

    try {
      await db.query(
        'INSERT INTO user_data (vacancy, time, date, from_location, to_location, user_id, type) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [vacancy, time, date, from_location, to_location, userId, type]
      );
      res.redirect('/group');
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.redirect('/login');
  }
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/group',
  failureRedirect: '/login',
}));
app.use(express.json());  // Ensure this middleware is present

// Add this route to handle message sending
app.post('/sendMessage', async (req, res) => {
  if (req.isAuthenticated()) {
    const { userId, message } = req.body;
    console.log(userId);
    const senderId = req.user.id; // Get the ID of the logged-in user

    try {
      await db.query(       
        'INSERT INTO messages (user_id, sender_id, message) VALUES ($1, $2, $3)',
        [userId, senderId, message]
      );
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending message:', error);
      res.json({ success: false });
    }
  } else {
    res.status(401).json({ success: false });
  }
});



app.get('/fetchMessages', async (req, res) => {
  if (req.isAuthenticated()) {
      const userId = req.user.id; // Get the ID of the logged-in user

      try {
          const result = await db.query('SELECT message FROM messages WHERE user_id = $1', [userId]);
          res.json({ messages: result.rows });
          // console.log(result);
      } catch (error) {
          console.error('Error fetching messages:', error);
          res.status(500).json({ error: 'Failed to fetch messages' });
      }
  } else {
      res.status(401).json({ error: 'Unauthorized' });
  }
});

app.post('/register', async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (checkResult.rows.length > 0) {
      res.send("<script>alert('Email already exists'); window.location='/login';</script>");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          res.status(500).send('Internal Server Error');
        } else {
          const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            if (err) {
              console.error('Error logging in user:', err);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('User registered successfully');
              res.redirect('/group');
            }
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
passport.use(
  'local',
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1', [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb('User not found');
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/group',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [profile.email]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            'INSERT INTO users (email, password,username,profilepic) VALUES ($1, $2,$3,$4)',
            [profile.email, 'google',profile.given_name,profile.picture]
          );
          return cb(null, newUser.rows[0]);
        } else {
          console.log('email exists');
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});
// Middleware to prevent caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    cb(null, result.rows[0]);
  } catch (err) {
    cb(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
