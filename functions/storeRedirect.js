const faunadb = require('faunadb');
const q = faunadb.query;

// Initialize FaunaDB client
const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET, // Set in Netlify Environment Variables
});

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { url } = JSON.parse(event.body);

    if (!url) {
        return { statusCode: 400, body: 'Bad Request: URL is required' };
    }

    try {
        // Store the URL in FaunaDB
        const result = await client.query(
            q.Create(q.Collection('Redirects'), {
                data: { url, timestamp: Date.now() },
            })
        );
        return { statusCode: 200, body: JSON.stringify(result) };
    } catch (error) {
        console.error('Error storing URL:', error);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};
