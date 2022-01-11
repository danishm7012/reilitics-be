import nodeMailer from "nodemailer"
import emailTemp from 'email-templates'

const EmailTemplate = emailTemp.EmailTemplate;

let transporter = nodeMailer.createTransport({
    port: 587,
    host: "dev.professoryapp.com",
    secure: false,
    secureConnection: false,
    requireTLS: true,
    auth: {
      user: "no-reply2@professoryapp.com",
      pass: "Professory965!",
    },
    requireTLS: true,
    tls: {
      // ciphers: 'SSLv3'
      rejectUnauthorized: false,
    },
  }),
  // generate code
  function generateCode() {
    return Math.floor(1000 + Math.random() * 9000);
  }
  // generate expiry date
  function GenerateExpireDate() {
    var myDate = new Date();
    myDate.setHours(myDate.getHours() + 24);
    //console.log(myDate);
    return myDate;
  }
  //generic methods
function sendEmail(userObj) {
    let code = generateCode();
  const payload = {
    userId: userObj.userID,
    // token: generateHash(7),
    token: code,
    expired_at: GenerateExpireDate(),
  };
  Verify.create(payload)
    .then(async (result) => {
      // let link = `http://professoryapp.com/verify/?email=${userObj.email}&token=${payload.token}`;
      let link = code;
      let notification =
        "Please enter code to verify your e-mail to complete signing up for Professory Application.";
      sendingEmail(
        userObj.email,
        userObj.name,
        link,
        "Verify email",
        notification,
        "Verify Email"
      );
    })
    .catch((err) => {
      console.log(err.message);
    });
    
  }
//load email template

function loadTemplate(templateName, context) {
    let template = new EmailTemplate(
      path.join(__dirname, "templates", templateName)
    );
    return new Promise((resolve, reject) => {
        template.render(context, (err, result) => {
          if (err) reject(err);
          else
            resolve({
              email: result,
              context,
            });
        });
      });
  }

  async function sendingEmail(Email, name, link, btnText, notification, SubjectText){

    let user = {
        fullName: name,
        email: Email,
        notification: notification,
        link: link,
        btnText: btnText,
        SubjectText: "Email verification required.",
      }
  await loadTemplate("activation-email", user)
  return transporter.sendMail(obj);
  }
  
  export {
    sendEmail
  };