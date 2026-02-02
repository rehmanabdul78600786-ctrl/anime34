export default async function handler(req, res) {
  try {
    const response = await fetch("https://codedew.com/cdn/liptron.php/");
    const contentType = response.headers.get("content-type");
    console.log("Content Type:", contentType);

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(200).json({ status: true, data });
    }

    const text = await response.text();
    return res.status(200).json({ status: true, text });

  } catch (error) {
    console.error("Function Error:", error);
    return res.status(500).json({ status: false, error: error.message });
  }
}
