import { Dropbox } from "dropbox";

export default UploadToDropbox = async (fileContent,fileName, dbxAccessToken,res) => {
  const dbx = new Dropbox({
    accessToken: dbxAccessToken,
    fetch: fetch,
  });
  try {
    const response = await dbx.filesUpload({
      path: `/${Date.now()}-${fileName}`,
      contents: Buffer.from(fileContent, "base64"),
      mode: { ".tag": "add" },
      autorename: true,
    });
    const shareResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: response.result.path_lower,
    });
    const directUrl = shareResponse.result.url
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("?dl=0", "")
      .replace("&dl=0", "");
    return directUrl;
  } catch (error) {
    console.error("Error uploading to Dropbox:", error);
    res.status(500).json({ error: "Failed to upload to Dropbox" });
    return error
  }
};
