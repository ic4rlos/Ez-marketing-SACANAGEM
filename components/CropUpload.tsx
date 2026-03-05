"use client";

import React, { useState, useEffect } from "react";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import type { UploadProps, UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import supabase from "../lib/c-supabaseClient";

export interface CropUploadProps {
  className?: string;
  accept?: string;
  onChange?: (url: string) => void;
  size?: number;
  value?: string | null | { url?: string }; // ✅ aceita string ou objeto
}

export default function CropUpload({
  className,
  accept = "image/*",
  onChange,
  size = 96,
  value = null,
  ...props
}: CropUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 🧪 Teste decisivo + conversão automática
  useEffect(() => {
    console.log("🧪 CropUpload recebeu value:", value);

    if (typeof value === "string" && value) {
      setImageUrl(value);
    } else if (value && typeof value === "object" && "url" in value) {
      setImageUrl(value.url ?? null);
    } else {
      setImageUrl(null);
    }
  }, [value]);

  // ✅ fileList controlado tipado corretamente
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
    // Corrigindo a referência do arquivo
    const rawFile = info.file.originFileObj || info.file;

    if (!rawFile) {
      console.log("🚨 No file detected", info);
      return;
    }

    try {
      setUploading(true);

      const fileExt = rawFile.name?.split(".").pop() || "png";
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

console.log("📤 Uploading:", filePath);

const buckets = ["company-logos", "agency-pics"];
let publicUrl: string | null = null;

for (const bucket of buckets) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, rawFile as File, { upsert: true });

  if (!error) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    publicUrl = data.publicUrl;
    console.log(`✅ Uploaded to ${bucket}:`, publicUrl);
    break;
  }

  console.warn(`⚠️ Failed in ${bucket}, trying next...`);
}

if (!publicUrl) {
  throw new Error("Upload failed in all buckets");
}

      const publicUrl = data.publicUrl;

      console.log("✅ Uploaded URL:", publicUrl);

      setImageUrl(publicUrl);
      onChange?.(publicUrl);
    } catch (err) {
      console.error("❌ Upload failed:", err);
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
          alt="logo"
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
        beforeUpload={() => false} // ⭐ ESSENCIAL
        onChange={handleChange}
        fileList={fileList} // ✅ agora tipado corretamente
        {...props}
      >
        {uploadUI}
      </Upload>
    </ImgCrop>
  );
}
