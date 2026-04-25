/* ============================================================
   HOT SHOT ENTERTAINMENT — publish-calendar.js
   Netlify Function — pushes updated config.js to GitHub
   so Cory can publish calendar changes without a developer.

   Required environment variable in Netlify dashboard:
     GITHUB_TOKEN = a Personal Access Token from the Radichio
                    GitHub account with 'repo' scope.

   ⚠ DOMAIN CHANGE NOTE:
     This function uses a relative URL (/.netlify/functions/...)
     so it works on BOTH hotshotent.netlify.app AND hotshotent.com
     with no changes needed.
   ============================================================ */

exports.handler = async (event) => {

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { content } = body;

  // Basic validation — must look like our config file
  if (!content || typeof content !== 'string' || !content.trim().startsWith('const SITE_CONFIG')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid config content' }) };
  }

  // GitHub token from environment
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GITHUB_TOKEN environment variable not set in Netlify dashboard' }) };
  }

  const owner   = 'Radichio';
  const repo    = 'Hotshot';
  const path    = 'js/config.js';
  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const headers = {
    'Authorization':        `Bearer ${token}`,
    'Accept':               'application/vnd.github.v3+json',
    'Content-Type':         'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent':           'HotShot-Calendar-Publisher'
  };

  try {
    // Step 1: Get the current file SHA (required by GitHub API to update a file)
    const getRes = await fetch(apiBase, { headers });
    if (!getRes.ok) {
      const err = await getRes.json().catch(() => ({}));
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not fetch current file from GitHub', detail: err.message || getRes.status })
      };
    }
    const fileData = await getRes.json();
    const sha = fileData.sha;

    // Step 2: Push the updated content
    const today   = new Date().toISOString().split('T')[0];
    const putRes  = await fetch(apiBase, {
      method:  'PUT',
      headers,
      body: JSON.stringify({
        message: `Calendar update ${today} — via admin panel`,
        content: Buffer.from(content).toString('base64'),
        sha
      })
    });

    if (putRes.ok) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Published to GitHub — Netlify will deploy in ~60 seconds.' })
      };
    } else {
      const err = await putRes.json().catch(() => ({}));
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'GitHub rejected the update', detail: err.message || putRes.status })
      };
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected error', detail: err.message })
    };
  }

};
