import React, { useState } from 'react';
import { Share2, Copy, Check, RefreshCw } from 'lucide-react';

interface ShareButtonsProps {
  shareUrl: string;
  onReset?: () => void;
  showReset?: boolean;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  shareUrl,
  onReset,
  showReset = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '有人给你留了一张小纸条',
          text: '点开看看有什么悄悄话~',
          url: shareUrl,
        });
      } catch (err) {
        console.error('分享失败:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 border border-amber-200"
      >
        {copied ? (
          <>
            <Check size={18} />
            已复制
          </>
        ) : (
          <>
            <Copy size={18} />
            复制链接
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      >
        <Share2 size={18} />
        分享纸条
      </button>

      {showReset && onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 border border-stone-200"
        >
          <RefreshCw size={18} />
          重新写
        </button>
      )}
    </div>
  );
};
