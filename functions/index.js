const admin = require("firebase-admin");
const functions = require("firebase-functions");
const fs = require("fs");

admin.initializeApp();

const firestore = admin.firestore();

exports.rewrite = functions.https.onRequest(async (req, res) => {
  const userAgent = req.headers["user-agent"].toLowerCase();
  let indexHTML = fs.readFileSync("./web/index.html").toString();
  const path = req.path ? req.path.split("/") : req.path;
  const ogPlaceholder = '<meta name="dynamic-meta"/>';

  const isBot =
    userAgent.includes("googlebot") ||
    userAgent.includes("yahoou") ||
    userAgent.includes("bingbot") ||
    userAgent.includes("baiduspider") ||
    userAgent.includes("yandex") ||
    userAgent.includes("yeti") ||
    userAgent.includes("yodaobot") ||
    userAgent.includes("gigabot") ||
    userAgent.includes("ia_archiver") ||
    userAgent.includes("facebookexternalhit") ||
    userAgent.includes("twitterbot") ||
    userAgent.includes("developers.google.com")
      ? true
      : false;

  if (isBot && path && path.length > 1) {
    try {
      const quiz = await firestore.collection("quizzes").doc(path[1]).get();
      const { quizName } = quiz.data();

      indexHTML = indexHTML.replace(
        ogPlaceholder,
        getOpenGraph(quizName, path[1])
      );
      res.status(200).send(indexHTML);

      return;
    } catch (error) {
      console.log(error);
    }
  }

  // optional - turn on caching: res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  indexHTML = indexHTML.replace(ogPlaceholder, getOpenGraph());
  res.status(200).send(indexHTML);
});

const getOpenGraph = (quizName, quizID) => {
  const defaultDesc = "How Well Do You Know Your Friend?";
  const defaultTitle =
    "Take this quiz and really see how tight your bond is with your friend";
  const defaultLogo = "https://viral-quiz-b0207.firebaseapp.com/logo.png";

  let og = "";
  og += `<meta property="fb:app_id" content="234909234538669"/>`;
  og += `<meta property="og:type" content="website"/>`;
  og += `<meta property="og:image" content="${defaultLogo}"/>`;
  og += `<meta property="og:description" content="${defaultDesc}"/>`;
  og += `<meta property="og:url" content="https://viral-quiz-b0207.firebaseapp.com/${quizID}"/>`;

  if (quizName) {
    og += `<meta property="og:title" content="${quizName}"/>`;
  } else {
    og += `<meta property="og:title" content="${defaultTitle}"/>`;
  }

  return og;
};
