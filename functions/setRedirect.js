const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  const { url } = event.queryStringParameters;

  if (!url) {
    return {
      statusCode: 400,
      body: "URL query parameter is required",
    };
  }

  try {
    const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

    // Delete any existing document
    await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Redirects"))),
        q.Lambda("ref", q.Delete(q.Var("ref")))
      )
    );

    // Store the new redirect URL
    await client.query(
      q.Create(q.Collection("Redirects"), { data: { url } })
    );

    return {
      statusCode: 200,
      body: `Redirect URL updated to ${url}`,
    };
  } catch (error) {
    console.error("Error setting redirect:", error);
    return {
      statusCode: 500,
      body: "Server error",
    };
  }
};
