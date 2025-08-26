import React, { useEffect, useState } from 'react';
import { axios } from '../config';
import useDebounce from '../hooks/useDebounce';
import { useSelector } from 'react-redux';

export default function S3FileManager() {
  const { user } = useSelector((s) => s.auth);
  const [files, setFiles] = useState([]);
  const [dir, setDir] = useState('');
  const debounce = useDebounce(dir, 600);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { data } = await axios.get(`/s3-bucket`, {
      params: { prefix: debounce },
    });
    setFiles(data.files || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce]);

  async function onUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const form = new FormData();
    form.append('file', f);
    form.append('dir', dir);
    setUploading(true);
    try {
      await axios.post(`/s3-bucket/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await load();
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function onDelete(key) {
    const encKey = encodeURIComponent(key);
    await axios.delete(`/s3-bucket/${encKey}`);
    load();
  }

  function onDownload(key) {
    const encKey = encodeURIComponent(key);
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/s3-bucket/download/${encKey}`,
      '_blank'
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        S3 File Manager
      </h2>

      {/* Directory input + upload */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Optional folder prefix e.g. invoices/2025"
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" onChange={onUpload} className="hidden" />
        </label>
      </div>

      {/* File table */}
      <div className="!overflow-x-auto w-full">
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Key</th>
              <th className="px-4 py-2 text-right">Size</th>
              <th className="px-4 py-2">Last Modified</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.key} className="border-t border-gray-200">
                <td className="px-4 py-2 break-all text-gray-700 text-nowrap">
                  {f.key}
                </td>
                <td className="px-4 py-2 text-right text-gray-600">
                  {(f.size / 1024).toFixed(2)} KB
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {new Date(f.lastModified).toLocaleString()}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => onDownload(f.key)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600">
                    Download
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => onDelete(f.key)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {files.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-gray-500 py-[100px]">
                  No files found for this prefix
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
