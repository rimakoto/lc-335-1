import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PaperStrip.css';

interface PaperStripProps {
  text: string;
  isFolded: boolean;
  editable?: boolean;
  onTextChange?: (text: string) => void;
  onFoldComplete?: () => void;
  onUnfoldComplete?: () => void;
  onClick?: () => void;
  showHint?: boolean;
}

const FOLD_STEPS = 3;
const STEP_DURATION = 650;
const STEP_DELAY = 100;

export const PaperStrip: React.FC<PaperStripProps> = ({
  text,
  isFolded,
  editable = false,
  onTextChange,
  onFoldComplete,
  onUnfoldComplete,
  onClick,
  showHint = false,
}) => {
  const [foldStep, setFoldStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutsRef = useRef<number[]>([]);
  const onFoldCompleteRef = useRef(onFoldComplete);
  const onUnfoldCompleteRef = useRef(onUnfoldComplete);
  const foldStepRef = useRef(foldStep);

  useEffect(() => {
    foldStepRef.current = foldStep;
  }, [foldStep]);

  useEffect(() => {
    onFoldCompleteRef.current = onFoldComplete;
  }, [onFoldComplete]);

  useEffect(() => {
    onUnfoldCompleteRef.current = onUnfoldComplete;
  }, [onUnfoldComplete]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => {
    clearAllTimeouts();
    const currentStep = foldStepRef.current;

    if (isFolded && currentStep < FOLD_STEPS) {
      setIsAnimating(true);
      for (let i = currentStep + 1; i <= FOLD_STEPS; i++) {
        const timeout = (i - currentStep - 1) * (STEP_DURATION + STEP_DELAY);
        const t = window.setTimeout(() => {
          setFoldStep(i);
          if (i === FOLD_STEPS) {
            const finishT = window.setTimeout(() => {
              setIsAnimating(false);
              onFoldCompleteRef.current?.();
            }, STEP_DURATION);
            timeoutsRef.current.push(finishT);
          }
        }, timeout);
        timeoutsRef.current.push(t);
      }
    } else if (!isFolded && currentStep > 0) {
      setIsAnimating(true);
      for (let i = currentStep - 1; i >= 0; i--) {
        const timeout = (currentStep - 1 - i) * (STEP_DURATION + STEP_DELAY);
        const t = window.setTimeout(() => {
          setFoldStep(i);
          if (i === 0) {
            const finishT = window.setTimeout(() => {
              setIsAnimating(false);
              onUnfoldCompleteRef.current?.();
            }, STEP_DURATION);
            timeoutsRef.current.push(finishT);
          }
        }, timeout);
        timeoutsRef.current.push(t);
      }
    }

    return clearAllTimeouts;
  }, [isFolded, clearAllTimeouts]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange?.(e.target.value);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (editable && (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }
    if (!isAnimating) {
      onClick?.();
    }
  };

  if (editable) {
    return (
      <div className={`paper-container ${isFolded ? 'is-folded' : ''}`} onClick={handleClick}>
        <div className="paper-edit-layer">
          <div className="paper-base">
            <textarea
              className="paper-input"
              value={text}
              onChange={handleTextChange}
              placeholder="写下你想说的悄悄话..."
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`paper-container fold-step-${foldStep} ${isFolded ? 'is-folded' : ''}`}
      onClick={handleClick}
    >
      <div className="paper">
        {/* 第一层容器 - 垂直对半分 */}
        <div className="fold-layer v-fold-layer">
          {/* 上半部分 - 固定 */}
          <div className="paper-half v-half top-half">
            {/* 第二层容器 - 水平对半分 */}
            <div className="fold-layer h-fold-layer">
              {/* 右半部分 - 固定 */}
              <div className="paper-half h-half right-half">
                {/* 第三层容器 - 垂直对半分 */}
                <div className="fold-layer v-fold-layer small">
                  {/* 上半部分 - 固定 */}
                  <div className="paper-segment seg-1">
                    <div className="paper-base">
                      <div className="paper-text seg-text-1">{text}</div>
                    </div>
                  </div>
                  {/* 第三次折叠：下半部分向上折 */}
                  <div 
                    className="fold-panel fold-v-up"
                    style={{
                      transform: foldStep >= 3 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                    }}
                  >
                    <div className="fold-inner">
                      <div className="fold-front">
                        <div className="paper-segment seg-2">
                          <div className="paper-base">
                            <div className="paper-text seg-text-2">{text}</div>
                          </div>
                        </div>
                      </div>
                      <div className="fold-back">
                        <div className="paper-back"></div>
                      </div>
                    </div>
                  </div>
                  {foldStep < 3 && <div className="crease crease-h crease-small"></div>}
                </div>
              </div>

              {/* 第二次折叠：左半部分向右折 */}
              <div 
                className="fold-panel fold-h-right"
                style={{
                  transform: foldStep >= 2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div className="fold-inner">
                  <div className="fold-front">
                    <div className="paper-half h-half left-half">
                      {/* 第三层容器 - 垂直对半分 */}
                      <div className="fold-layer v-fold-layer small">
                        {/* 上半部分 - 固定 */}
                        <div className="paper-segment seg-3">
                          <div className="paper-base">
                            <div className="paper-text seg-text-3">{text}</div>
                          </div>
                        </div>
                        {/* 第三次折叠：下半部分向上折 */}
                        <div 
                          className="fold-panel fold-v-up"
                          style={{
                            transform: foldStep >= 3 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                          }}
                        >
                          <div className="fold-inner">
                            <div className="fold-front">
                              <div className="paper-segment seg-4">
                                <div className="paper-base">
                                  <div className="paper-text seg-text-4">{text}</div>
                                </div>
                              </div>
                            </div>
                            <div className="fold-back">
                              <div className="paper-back"></div>
                            </div>
                          </div>
                        </div>
                        {foldStep < 3 && <div className="crease crease-h crease-small"></div>}
                      </div>
                    </div>
                  </div>
                  <div className="fold-back">
                    <div className="paper-back"></div>
                  </div>
                </div>
              </div>
              {foldStep < 2 && <div className="crease crease-v crease-center"></div>}
            </div>
          </div>

          {/* 第一次折叠：下半部分向上折 */}
          <div 
            className="fold-panel fold-v-up fold-v-full"
            style={{
              transform: foldStep >= 1 ? 'rotateX(180deg)' : 'rotateX(0deg)',
            }}
          >
            <div className="fold-inner">
              <div className="fold-front">
                <div className="paper-half v-half bottom-half">
                  {/* 第二层容器 - 水平对半分 */}
                  <div className="fold-layer h-fold-layer">
                    {/* 右半部分 - 固定 */}
                    <div className="paper-half h-half right-half">
                      {/* 第三层容器 - 垂直对半分 */}
                      <div className="fold-layer v-fold-layer small">
                        {/* 上半部分 - 固定 */}
                        <div className="paper-segment seg-5">
                          <div className="paper-base">
                            <div className="paper-text seg-text-5">{text}</div>
                          </div>
                        </div>
                        {/* 第三次折叠：下半部分向上折 */}
                        <div 
                          className="fold-panel fold-v-up"
                          style={{
                            transform: foldStep >= 3 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                          }}
                        >
                          <div className="fold-inner">
                            <div className="fold-front">
                              <div className="paper-segment seg-6">
                                <div className="paper-base">
                                  <div className="paper-text seg-text-6">{text}</div>
                                </div>
                              </div>
                            </div>
                            <div className="fold-back">
                              <div className="paper-back"></div>
                            </div>
                          </div>
                        </div>
                        {foldStep < 3 && <div className="crease crease-h crease-small"></div>}
                      </div>
                    </div>

                    {/* 第二次折叠：左半部分向右折 */}
                    <div 
                      className="fold-panel fold-h-right"
                      style={{
                        transform: foldStep >= 2 ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      }}
                    >
                      <div className="fold-inner">
                        <div className="fold-front">
                          <div className="paper-half h-half left-half">
                            {/* 第三层容器 - 垂直对半分 */}
                            <div className="fold-layer v-fold-layer small">
                              {/* 上半部分 - 固定 */}
                              <div className="paper-segment seg-7">
                                <div className="paper-base">
                                  <div className="paper-text seg-text-7">{text}</div>
                                </div>
                              </div>
                              {/* 第三次折叠：下半部分向上折 */}
                              <div 
                                className="fold-panel fold-v-up"
                                style={{
                                  transform: foldStep >= 3 ? 'rotateX(180deg)' : 'rotateX(0deg)',
                                }}
                              >
                                <div className="fold-inner">
                                  <div className="fold-front">
                                    <div className="paper-segment seg-8">
                                      <div className="paper-base">
                                        <div className="paper-text seg-text-8">{text}</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="fold-back">
                                    <div className="paper-back"></div>
                                  </div>
                                </div>
                              </div>
                              {foldStep < 3 && <div className="crease crease-h crease-small"></div>}
                            </div>
                          </div>
                        </div>
                        <div className="fold-back">
                          <div className="paper-back"></div>
                        </div>
                      </div>
                    </div>
                    {foldStep < 2 && <div className="crease crease-v crease-center"></div>}
                  </div>
                </div>
              </div>
              <div className="fold-back">
                <div className="paper-back"></div>
              </div>
            </div>
          </div>
          {foldStep < 1 && <div className="crease crease-h crease-center-big"></div>}
        </div>

        {/* 底部阴影 */}
        <div className="paper-shadow"></div>
      </div>

      {showHint && isFolded && (
        <div className="hint-text">✨ 点击展开纸条 ✨</div>
      )}
    </div>
  );
};
