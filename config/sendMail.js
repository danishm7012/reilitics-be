import nodeMailer from 'nodemailer'
import path from 'path'
import Promise from 'bluebird'
import emailTemp from 'email-templates'
import Verify from '../models/verify.js'

const EmailTemplate = emailTemp.EmailTemplate
//create transport
let transporter = nodeMailer.createTransport({
  port: 587,
  host: 'dev.professoryapp.com',
  secure: false,
  secureConnection: false,
  requireTLS: true,
  auth: {
    user: 'no-reply2@professoryapp.com',
    pass: 'Professory965!',
  },
  requireTLS: true,
  tls: {
    // ciphers: 'SSLv3'
    rejectUnauthorized: false,
  },
})

// generate code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000)
}
// generate expiry date
function GenerateExpireDate() {
  var myDate = new Date()
  myDate.setHours(myDate.getHours() + 24)
  //console.log(myDate);
  return myDate
}
//load email template

function loadTemplate(templateName, context) {
  let template = new EmailTemplate(
    path.join(__dirname, 'templates', templateName)
  )
  return new Promise((resolve, reject) => {
    template.render(context, (err, result) => {
      if (err) reject(err)
      else
        resolve({
          email: result,
          context,
        })
    })
  })
}

async function sendingEmail(
  Email,
  name,
  link,
  btnText,
  notification,
  SubjectText
) {
  // let user = {
  //   fullName: name,
  //   email: Email,
  //   notification: notification,
  //   link: link,
  //   btnText: btnText,
  //   SubjectText: "Email verification required.",
  // };
  const obj = {
    to: Email,
    //from: 'noreplay@moquire.maqware.com',
    //from: 'no-reply@aghazinvest.com',
    from: `"no reply" <verify@reilitics.com>`,
    // from: `"Forgot password" <no-reply@aghazinvest.com>`,
    subject: SubjectText,
    html: `<p>${link}</p>`,
  }
  // loadTemplate("activation-email", user).then(result=>{

  // }).catch(err=>console.log(object));
  return transporter.sendMail(obj)
}

//generic methods
function sendEmail(userObj) {
  let code = generateCode()
  const payload = {
    user: userObj._id,
    // token: generateHash(7),
    code,
    expired_at: GenerateExpireDate(),
  }
  let link = code
  let notification =
    'Please enter code to verify your e-mail to complete signing up for Reilitics Application.'

  Verify.findOne({ user: userObj._id })
    .then((profile) => {
      if (profile) {
        // Update profile if exist
        Verify.findOneAndUpdate(
          { user: userObj._id },
          { $set: payload },
          { new: true }
        ).then((profile) => {
          console.log('updated:' + profile)
          sendingEmail(
            userObj.email,
            userObj.firstName,
            link,
            'Verify email',
            notification,
            'Verify Email'
          )
            .then((result) => {
              console.log(result)
            })
            .catch((err) => console.log('Error', err))
        })
      } else {
        // Create new

        new Verify(payload).save().then((profile) => {
          console.log('created:' + profile)
          sendingEmail(
            userObj.email,
            userObj.firstName,
            link,
            'Verify email',
            notification,
            'Verify Email'
          )
            .then((result) => {
              console.log(result)
            })
            .catch((err) => console.log('Error', err))
        })
      }
    })
    .catch((err) => {
      console.log(err.message)
    })
}

export { sendEmail }
