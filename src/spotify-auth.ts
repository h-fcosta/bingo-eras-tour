import axios from "axios";

export async function getAccessToken(clientId, clientSecret) {
  const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        params: {
          grant_type: "client_credentials"
        },
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error("Error retrieving access token:" + error.message);
  }
}
