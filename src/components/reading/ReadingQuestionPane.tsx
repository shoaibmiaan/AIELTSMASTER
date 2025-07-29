// ReadingQuestionPane.tsx
import React, { useMemo } from 'react';
import { allowedQuestionTypes } from '@/utils/readingQuestionTypes';
import { getQuestionTypeInfo } from '@/utils/readingQuestionTypes';

const T_F_NG = ['TRUE', 'FALSE', 'NOT GIVEN'];
const Y_N_NG = ['YES', 'NO', 'NOT GIVEN'];

function OptionList({
  options,
  value,
  onChange,
  multi = false,
  disabled = false,
}: {
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
  disabled?: boolean;
}) {
  if (multi) {
    return (
      <div className="flex flex-col gap-2">
        {options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Array.isArray(value) && value.includes(opt)}
              disabled={disabled}
              onChange={(e) => {
                if (!Array.isArray(value)) return;
                if (e.target.checked) {
                  onChange([...value, opt]);
                } else {
                  onChange(value.filter((v: string) => v !== opt));
                }
              }}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, idx) => (
        <label key={idx} className="flex items-center gap-2">
          <input
            type="radio"
            name="option"
            value={opt}
            checked={value === opt}
            disabled={disabled}
            onChange={() => onChange(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export default function ReadingQuestionPane({
  passages,
  answers,
  flags,
  onAnswerChange,
  onFlag,
  readOnly = false,
}: {
  passages: any[];
  answers: Record<string, string | string[]>;
  flags: Record<string, boolean>;
  onAnswerChange: (qnId: string, value: string | string[]) => void;
  onFlag: (qnId: string) => void;
  readOnly?: boolean;
}) {
  // Process passages and group questions by type
  const processedPassages = useMemo(() => {
    return passages.map((p) => {
      const processedGroups = p.question_groups.map((g: any) => {
        // Sort questions by question number
        const sortedQuestions = [...g.questions].sort(
          (a: any, b: any) => a.question_number - b.question_number
        );
        
        // Group consecutive questions by type
        const groupedQuestions: any[] = [];
        let currentGroup: any = null;
        
        sortedQuestions.forEach((q: any) => {
          const qType = q.question_type;
          
          if (!currentGroup || currentGroup.type !== qType) {
            currentGroup = {
              type: qType,
              instruction: q.instruction || g.instruction || '',
              questions: [],
            };
            groupedQuestions.push(currentGroup);
          }
          
          currentGroup.questions.push(q);
        });
        
        return {
          ...g,
          groupedQuestions,
        };
      });
      
      return {
        ...p,
        question_groups: processedGroups,
      };
    });
  }, [passages]);

  return (
    <div className="space-y-8">
      {processedPassages.map((p: any, pi: number) =>
        p.question_groups.map((g: any, gi: number) => (
          <div key={`${pi}-${gi}`} className="mb-8">
            {g.instruction && (
              <div className="mb-3 p-2 rounded bg-blue-50 border-l-4 border-blue-400 text-blue-700 text-sm">
                {g.instruction}
              </div>
            )}
            
            {g.groupedQuestions.map((group: any, groupIdx: number) => (
              <div key={`group-${groupIdx}`} className="mb-6">
                {group.instruction && (
                  <div className="mb-3 p-2 rounded bg-gray-100 border-l-4 border-gray-400 text-gray-700 text-sm">
                    {group.instruction}
                  </div>
                )}
                
                {group.questions.map((q: any, qidx: number) => {
                  const qnId = q.id || `p${p.passage_number}q${q.question_number}`;
                  const userAnswer = answers[qnId] || (Array.isArray(q.correct_answer) ? [] : '');
                  const flagged = flags[qnId];
                  const qType = q.question_type;
                  const qTypeInfo = getQuestionTypeInfo(qType);
                  const mainText = q.question_text || q.text || '';
                  const isTFNG = qType === 'Identifying Information (True/False/Not Given)';
                  const isYNNG = qType === "Identifying Writer's Views/Claims (Yes/No/Not Given)";
                  const dropdownOptions = 
                    q.options?.length ? q.options : isTFNG ? T_F_NG : isYNNG ? Y_N_NG : [];

                  return (
                    <div
                      key={qnId}
                      id={`question-${qnId}`}
                      className={`mb-4 p-4 rounded-lg border shadow-sm bg-white relative ${
                        flagged ? 'border-yellow-500' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4 mb-1">
                        <span className="font-bold text-lg">
                          Q{q.question_number}
                        </span>
                        <button
                          type="button"
                          onClick={() => onFlag(qnId)}
                          className={`ml-auto text-xs px-3 py-1 rounded ${
                            flagged
                              ? 'bg-yellow-200 text-yellow-900 border border-yellow-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {flagged ? 'Flagged' : 'Flag'}
                        </button>
                      </div>
                      <div className="mb-2 text-base font-medium">{mainText}</div>
                      
                      {/* Question input based on type */}
                      {isTFNG || isYNNG ? (
                        <select
                          value={userAnswer || ''}
                          onChange={(e) => onAnswerChange(qnId, e.target.value)}
                          disabled={readOnly}
                          className="w-52 p-2 border rounded"
                        >
                          <option value="">Select…</option>
                          {dropdownOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : qTypeInfo?.ui === 'mcq' ? (
                        <OptionList
                          options={q.options || []}
                          value={userAnswer}
                          onChange={(v) => onAnswerChange(qnId, v)}
                          disabled={readOnly}
                        />
                      ) : qTypeInfo?.ui === 'dropdown' ? (
                        <select
                          value={userAnswer || ''}
                          onChange={(e) => onAnswerChange(qnId, e.target.value)}
                          disabled={readOnly}
                          className="w-52 p-2 border rounded"
                        >
                          <option value="">Select…</option>
                          {(q.options || []).map((opt: string) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : qTypeInfo?.ui === 'matching' ? (
                        <div className="flex flex-col gap-3">
                          {(q.options || []).map(
                            (opt: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex gap-3 items-center"
                              >
                                <div className="w-56 font-medium">
                                  {opt}
                                </div>
                                <select
                                  className="p-2 border rounded"
                                  value={
                                    userAnswer &&
                                    typeof userAnswer === 'object'
                                      ? userAnswer[idx] || ''
                                      : ''
                                  }
                                  onChange={(e) => {
                                    const arr =
                                      Array.isArray(userAnswer) &&
                                      userAnswer.length ===
                                        q.options.length
                                        ? [...userAnswer]
                                        : Array(q.options.length).fill(
                                            ''
                                          );
                                    arr[idx] = e.target.value;
                                    onAnswerChange(qnId, arr);
                                  }}
                                  disabled={readOnly}
                                >
                                  <option value="">Choose…</option>
                                  {q.matching_targets?.length
                                    ? q.matching_targets.map(
                                        (t: string) => (
                                          <option key={t} value={t}>
                                            {t}
                                          </option>
                                        )
                                      )
                                    : ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((c) => (
                                        <option key={c} value={c}>
                                          {c}
                                        </option>
                                      ))}
                                </select>
                              </div>
                            )
                          )}
                        </div>
                      ) : qTypeInfo?.ui === 'options' ? (
                        <OptionList
                          options={q.options || []}
                          value={userAnswer}
                          onChange={(v) => onAnswerChange(qnId, v)}
                          multi
                          disabled={readOnly}
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-64 p-2 border rounded"
                          value={userAnswer || ''}
                          onChange={(e) =>
                            onAnswerChange(qnId, e.target.value)
                          }
                          disabled={readOnly}
                          placeholder="Your answer…"
                          autoComplete="off"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}