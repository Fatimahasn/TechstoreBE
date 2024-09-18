const os = require("os");
const { generateEmailAuthToken } = require("./authHelper");

// Function to compose the verification link with token and IP
let composeLink = async (email) => {

  // Generate an email verification token for the given email
  let token = await generateEmailAuthToken(email);

  // Get the server's IP address dynamically
  const serverIP = process.env.AWS_SERVERIP;

  // Construct the base URL including the server's IP and port
  const baseUrl = `http://${serverIP}:${process.env.PORT}`;

  // Compose the verification link with the token
  let link = `${baseUrl}/api/user/verifyEmail?token=${token}`;

  return link;
};

module.exports = composeLink;
