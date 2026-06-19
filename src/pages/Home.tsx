import { useState, useCallback } from 'react';
import { PaperStrip } from '@/components/PaperStrip/PaperStrip';
import { ShareButtons } from '@/components/ShareButtons/ShareButtons';
import { generateShareUrl } from '@/utils/encode';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState('');
  const [isFolded, setIsFolded] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleFold = useCallback(() => {
    if (!text.trim()) return;
    setIsFolded(true);
  }, [text]);

  const handleUnfold = useCallback(() => {
    setIsFolded(false);
    setShowShare(false);
  }, []);

  const handleFoldComplete = useCallback(() => {
    setShowShare(true);
  }, []);

  const handleReset = useCallback(() => {
    setIsFolded(false);
    setShowShare(false);
    setText('');
  }, []);

  const shareUrl = text ? generateShareUrl(text) : '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-3 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-amber-500" />
          纸条悄悄话
          <Sparkles className="w-8 h-8 text-amber-500" />
        </h1>
        <p className="text-amber-700 text-lg">
          写下你的悄悄话，折成小方块，发给你想告诉的人
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <PaperStrip
          text={text}
          isFolded={isFolded}
          editable={!isFolded}
          onTextChange={setText}
          onClick={isFolded ? handleUnfold : undefined}
          onFoldComplete={handleFoldComplete}
          showHint={isFolded}
        />
      </div>

      <div className="mt-8">
        {!isFolded ? (
          <button
            onClick={handleFold}
            disabled={!text.trim()}
            className={`
              px-10 py-4 rounded-2xl text-xl font-bold
              transition-all duration-300 transform
              flex items-center gap-3
              ${text.trim()
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                : 'bg-amber-200 text-amber-400 cursor-not-allowed'
              }
            `}
          >
            <span>📝</span>
            折起纸条
          </button>
        ) : showShare ? (
          <ShareButtons
            shareUrl={shareUrl}
            onReset={handleReset}
            showReset={true}
          />
        ) : null}
      </div>

      <div className="mt-16 text-amber-600 text-sm opacity-70">
        <p>✨ 像学生时代传纸条一样，把秘密折起来 ✨</p>
      </div>
    </div>
  );
}
