// functions/getRedirect.js

const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async () => {
  try {
    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });
    
    // Fetch the latest redirect document
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("redirects")), { size: 1 }),
        q.Lambda("ref", q.Get(q.Var("ref")))
      )
    );

    // Check if any redirect exists
    const redirectData = result.data.length > 0 ? result.data[0].data.url : null;

    if (redirectData) {
      return {
        statusCode: 302,
        headers: {
          Location: redirectData,
        },
      };
    } else {
      return {
        statusCode: 200,
        body: "No redirect URL found.",
      };
    }
  } catch (error) {
    console.error("Error fetching redirect:", error);
    return {
      statusCode: 500,
      body: "Server error",
    };
  }
};
