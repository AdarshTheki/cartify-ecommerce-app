import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import { errorHandler } from "../../helper";
import {
  Download,
  Folder,
  Globe2Icon,
  Image,
  Loader,
  Trash2Icon,
} from "lucide-react";
import { Button } from "../../utils";

const GalleryCard = ({
  secure_url,
  public_id,
  onDelete,
  filename,
  folder,
  format,
  bytes,
  height,
  width,
}) => {
  const { callApi, loading } = useApi();
  const user = useSelector((state) => state.auth?.user);

  const handleDownload = () => {
    if (!secure_url) return;
    // download image on current page
    fetch(secure_url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `download.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  const handleDelete = async () => {
    try {
      const result = await callApi(
        "/cloudinary",
        { imageUrl: secure_url },
        "delete"
      );
      if (result) {
        onDelete();
      }
    } catch (error) {
      errorHandler(error);
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-xl">
      <a href={secure_url} target="_blank">
        <img src={secure_url} alt={public_id} className="w-full" />
      </a>
      <div className="flex items-center justify-between absolute top-2 px-2 w-full">
        <Button
          onClick={handleDownload}
          svg={<Download size={16} />}
          className="text-white bg-slate-800 border-none"
        />
        {user && user?.role === "admin" && (
          <Button
            disabled={loading}
            onClick={handleDelete}
            svg={loading ? <Loader size={16} /> : <Trash2Icon size={16} />}
            className="text-red-600 !border-red-600"
          />
        )}
      </div>
      <div className="py-2 px-4 space-y-2 bg-white">
        <p className="text-sm font-medium">{filename}</p>
        <div className="flex gap-2 text-xs items-center border-b border-gray-300">
          <Folder size={14} /> {folder || "/"}
        </div>
        <div className="flex flex-wrap gap-1 items-center justify-between text-xs">
          <div className="flex gap-2 items-center">
            <Image size={14} />
            {format}
          </div>
          <span>{(bytes / 1024).toFixed(0)} kb</span>
          <span>
            {width}x{height}
          </span>
          <Globe2Icon size={14} />
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
