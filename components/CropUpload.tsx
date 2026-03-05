"use client";

import React, { useState, useEffect } from "react";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import type { UploadProps, UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import supabase from "../lib/c-supabaseClient";

export interface CropUploadProps {
  bucket: string;                     // ⭐ bucket agora é dinâmico
  path?: string;                      // ⭐ pasta dentro do bucket
  className?: string;
  accept?: string;
  onChange?: (url: string) => void;
  size?: number;
  value?: string | null | { url?: string };
}

export default function CropUpload({
  bucket,
  path = "",
  className,
  accept = "image/*",
  onChange,
  size = 96,
  value = null,
  ...props
}: CropUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // sincroniza value externo
  useEffect(() => {
    if (typeof value === "string" && value) {
      setImageUrl(value);
    } else if (value && typeof value === "object" && "url" in value) {
      setImageUrl(value.url ?? null);
    } else {
      setImageUrl(null);
    }
  }, [value]);

  const fileList: UploadFile[] = imageUrl
    ? [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: imageUrl,
        },
      ]
    : [];

  const handleChange: UploadProps["onChange"] = async (info) => {
    const rawFile = info.file.originFileObj || info.file;

    if (!rawFile) return;

    try {
      setUploading(true);

      const fileExt = rawFile.name?.split(".").pop() || "png";
      const fileName = `${Date.now()}.${fileExt}`;

      const filePath = path ? `${path}/${fileName}` : fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, rawFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      setImageUrl(publicUrl);
      onChange?.(publicUrl);

    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const uploadUI = (
    <div
      style={{
        width: size,
        height: size,
        border: "1px dashed #d9d9d9",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        background: "#fafafa",
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="upload"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : uploading ? (
        "..."
      ) : (
        <PlusOutlined />
      )}
    </div>
  );

  return (
    <ImgCrop cropShape="round" showGrid rotationSlider>
      <Upload
        className={className}
        accept={accept}
        multiple={false}
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleChange}
        fileList={fileList}
        {...props}
      >
        {uploadUI}
      </Upload>
    </ImgCrop>
  );
}
