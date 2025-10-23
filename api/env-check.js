export default async function handler(req, res) {
  const hasKey = !!process.env.OPENAI_API_KEY;
  res.status(200).json({
    hasKey,
    note: hasKey
      ? "Server can see OPENAI_API_KEY."
      : "Server CANNOT see OPENAI_API_KEY. Check project env vars + redeploy."
  });
}
