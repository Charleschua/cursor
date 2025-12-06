import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = body?.key?.trim();
    const repoUrl = body?.repo?.trim();

    // Step 1: Validate API key
    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 400 });
    }

    const { data: keyData, error: keyError } = await supabase
      .from("api_keys")
      .select("id, name, type")
      .eq("id", apiKey)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Step 2: Get the GitHub repo URL from request
    if (!repoUrl) {
      return NextResponse.json({ error: "GitHub repo URL is required" }, { status: 400 });
    }

    // Parse the repo URL to extract owner and repo name
    const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!repoMatch) {
      return NextResponse.json({ error: "Invalid GitHub repo URL" }, { status: 400 });
    }

    const owner = repoMatch[1];
    const repo = repoMatch[2].replace(/\.git$/, "");

    // Step 3: Fetch repo data from GitHub API
    const [repoResponse, readmeResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "GitHub-Summarizer",
        },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "GitHub-Summarizer",
        },
      }),
    ]);

    if (!repoResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repository. It may not exist or is private." },
        { status: 404 }
      );
    }

    const repoData = await repoResponse.json();

    // Decode README content (base64 encoded)
    let readmeContent = null;
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json();
      if (readmeData.content) {
        readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8");
        // Truncate README if too long (first 2000 chars)
        if (readmeContent.length > 2000) {
          readmeContent = readmeContent.substring(0, 2000) + "...";
        }
      }
    }

    // Step 4: Return a summary
    const summary = {
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      url: repoData.html_url,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.watchers_count,
      openIssues: repoData.open_issues_count,
      language: repoData.language,
      topics: repoData.topics || [],
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      defaultBranch: repoData.default_branch,
      license: repoData.license?.name || null,
      readme: readmeContent,
    };

    return NextResponse.json({ success: true, summary }, { status: 200 });
  } catch (error) {
    console.error("Error in GitHub summarizer:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
