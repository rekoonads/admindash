"use client";

import { ContentEditor } from "@/components/content-editor";
import { useState } from "react";

export default function LatestUpdatesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSave = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handlePublish = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-6">
      <ContentEditor
        key={refreshKey}
        type="Latest Updates"
        onSave={handleSave}
        onPublish={handlePublish}
      />
    </div>
  );
}