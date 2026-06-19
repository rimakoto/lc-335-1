import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PaperStrip } from '@/components/PaperStrip/PaperStrip';
import { decodeText } from '@/utils/encode';
import { Gift, ArrowLeft, Heart } from 'lucide-react';

export default function Share() {
  const { data } = useParams<{ data: string }>();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [isFolded, setIsFolded] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (data) {
      const decoded = decodeText(data);
      if (decoded) {
        setText(decoded);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [data]);

  const handleUnfold = useCallback(() => {
    setIsFolded(false);
  }, []);

  const handleUnfoldComplete = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">😕</div>
          <h1 className="text-3xl font-bold text-amber-800 mb-4">
            纸条好像坏掉了...
          </h1>
          <p className="text-amber-700 mb-8">
            无法打开这张纸条，可能链接有误或者已经失效了
          </p>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
          >
            <ArrowLeft size={18} />
            回去写一张新纸条
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Gift className="w-8 h-8 text-amber-500" />
          <h1 className="text-3xl md:text-4xl font-bold text-amber-800">
            有人给你留了一张小纸条
          </h1>
          <Gift className="w-8 h-8 text-amber-500" />
        </div>
        {isFolded && (
          <p className="text-amber-700 text-lg animate-pulse">
            轻点一下，拆开看看吧~
          </p>
        )}
        {isRevealed && (
          <p className="text-amber-600 text-sm mt-4">
            这是专属于你的悄悄话 💕
          </p>
        )}
      </div>

      <div className="w-full max-w-3xl">
        <PaperStrip
          text={text}
          isFolded={isFolded}
          editable={false}
          onClick={isFolded ? handleUnfold : undefined}
          onUnfoldComplete={handleUnfoldComplete}
          showHint={isFolded}
        />
      </div>

      {isRevealed && (
        <div className="mt-10 text-center">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-medium transition-all duration-300 hover:shadow-lg border border-amber-200"
          >
            <Heart size={18} className="text-red-400" />
            我也想写一张纸条
          </button>
        </div>
      )}

      <div className="mt-16 text-amber-600 text-sm opacity-70">
        <p>✨ 像学生时代传纸条一样，把秘密折起来 ✨</p>
      </div>
    </div>
  );
}
