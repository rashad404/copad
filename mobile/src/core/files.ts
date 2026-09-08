import { Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import api, { API_URL } from "./api";
import { privacyError } from "../api/privacy";
import { tokenStore } from "./storage";
export async function pickFile() {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;
  const file = result.assets[0];
  if ((file.size || 0) > 25 * 1024 * 1024) throw Error("MAX_FILE_SIZE");
  return file;
}
export function fileBody(file: DocumentPicker.DocumentPickerAsset) {
  const body = new FormData();
  if (Platform.OS === "web" && file.file)
    body.append("file", file.file, file.name);
  else
    body.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || "application/octet-stream",
    } as unknown as Blob);
  return body;
}
function extensionName(name: string, contentType: string) {
  const extensions: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/tiff": "tiff",
    "text/plain": "txt",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/zip": "zip",
  };
  const extension = extensions[contentType.split(";")[0].toLowerCase()];
  return extension ? name.replace(/\.[^.]+$/, "") + "." + extension : name;
}
export async function openPrivateFile(path: string, name: string) {
  const startingToken = await tokenStore.get();
  if (Platform.OS === "web") {
    const data = await api
      .get<Blob>(path, { responseType: "blob" })
      .then((r) => r.data)
      .catch(async (error) => {
        throw Error(await privacyError(error, "Could not download the file"));
      });
    if (startingToken !== (await tokenStore.get())) return;
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = extensionName(name, data.type);
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    return;
  }
  if (!FileSystem.cacheDirectory) throw Error("File storage is unavailable");
  const uri = `${FileSystem.cacheDirectory}azdoc-${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  let sharedUri = uri;
  let shared = false;
  try {
    const token = startingToken;
    const response = await FileSystem.downloadAsync(`${API_URL}${path}`, uri, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (response.status < 200 || response.status >= 300) {
      let message = "Could not download the file";
      try {
        const raw = await FileSystem.readAsStringAsync(uri);
        message = JSON.parse(raw)?.message || message;
      } catch {}
      throw Error(message);
    }
    if (startingToken !== (await tokenStore.get())) return;
    const contentType =
      Object.entries(response.headers).find(
        ([key]) => key.toLowerCase() === "content-type",
      )?.[1] || "";
    const corrected = extensionName(uri, contentType);
    if (corrected !== uri) {
      await FileSystem.moveAsync({ from: uri, to: corrected });
      sharedUri = corrected;
    }
    if (!(await Sharing.isAvailableAsync()))
      throw Error("File sharing is unavailable on this device");
    await Sharing.shareAsync(sharedUri);
    shared = true;
  } finally {
    // Give the receiving app time to open the shared file after the sheet closes.
    const cleanup = () => {
      void FileSystem.deleteAsync(sharedUri, { idempotent: true }).catch(
        () => {},
      );
    };
    if (shared) setTimeout(cleanup, 60000);
    else cleanup();
  }
}
