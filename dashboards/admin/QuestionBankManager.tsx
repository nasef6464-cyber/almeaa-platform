import React, { useMemo, useState } from 'react';
import { Question } from '../../types';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { UnifiedQuestionBuilder } from './builders/UnifiedQuestionBuilder';

interface QuestionBankManagerProps {
  subjectId?: string;
}

export const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({ subjectId }) => {
  const { questions: globalQuestions, addQuestion, updateQuestion, deleteQuestion, paths, subjects, sections, topics } = useStore();

  const [selectedPathId, setSelectedPathId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjectId || '');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanation: '',
    difficulty: 'Medium',
    type: 'mcq',
    pathId: selectedPathId || '',
    subject: selectedSubjectId || '',
    sectionId: selectedSectionId || '',
    skillIds: []
  });

  const availableSkillTopics = useMemo(
    () =>
      topics.filter(topic =>
        !!selectedSubjectId &&
        topic.subjectId === selectedSubjectId &&
        !topic.parentId &&
        (!selectedSectionId || topic.sectionId === selectedSectionId || !topic.sectionId)
      ),
    [topics, selectedSubjectId, selectedSectionId]
  );

  const questions = globalQuestions.filter(question => {
    if (subjectId && question.subject !== subjectId) return false;
    if (selectedSubjectId && question.subject !== selectedSubjectId) return false;
    if (selectedSectionId && question.sectionId !== selectedSectionId) return false;
    if (selectedPathId && !subjectId && !selectedSubjectId) {
      const pathSubjects = subjects.filter(subject => subject.pathId === selectedPathId).map(subject => subject.id);
      if (!pathSubjects.includes(question.subject)) return false;
    }
    if (selectedSkillId && (!question.skillIds || !question.skillIds.includes(selectedSkillId))) return false;
    return true;
  });

  const filteredQuestions = questions.filter(question =>
    question.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setCurrentQuestion({
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      explanation: '',
      difficulty: 'Medium',
      type: 'mcq',
      pathId: selectedPathId || '',
      subject: selectedSubjectId || '',
      sectionId: selectedSectionId || '',
      skillIds: []
    });
    setIsEditing(true);
  };

  const handleEdit = (question: Question) => {
    setCurrentQuestion(question);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السؤال نهائيًا؟')) {
      deleteQuestion(id);
    }
  };

  const handleDuplicate = (question: Question) => {
    const duplicatedQuestion: Question = {
      ...question,
      id: `q_${Date.now()}_copy`,
      text: `${question.text} (نسخة)`
    };
    addQuestion(duplicatedQuestion);
  };

  const handleSave = (savedQuestion: Partial<Question>) => {
    if (currentQuestion.id) {
      updateQuestion(currentQuestion.id, { ...savedQuestion, id: currentQuestion.id } as Question);
    } else {
      const newQuestion: Question = {
        ...savedQuestion,
        id: `q_${Date.now()}`
      } as Question;
      addQuestion(newQuestion);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-120px)] animate-fade-in">
        <UnifiedQuestionBuilder
          initialQuestion={currentQuestion as Question}
          subjectId={selectedSubjectId || ''}
          sectionId={selectedSectionId || ''}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مركز الأسئلة</h2>
          <p className="text-gray-500 text-sm mt-1">إدارة جميع الأسئلة في المنصة وربطها ديناميكيًا بالمسارات والمواد والمهارات.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          إضافة سؤال جديد
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        {!subjectId && (
          <>
            <select
              value={selectedPathId}
              onChange={event => {
                setSelectedPathId(event.target.value);
                setSelectedSubjectId('');
                setSelectedSectionId('');
                setSelectedSkillId('');
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">كل المسارات</option>
              {paths.map(path => (
                <option key={path.id} value={path.id}>{path.name}</option>
              ))}
            </select>
            <select
              value={selectedSubjectId}
              onChange={event => {
                setSelectedSubjectId(event.target.value);
                setSelectedSectionId('');
                setSelectedSkillId('');
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={!selectedPathId}
            >
              <option value="">كل المواد</option>
              {subjects.filter(subject => subject.pathId === selectedPathId).map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </>
        )}

        <select
          value={selectedSectionId}
          onChange={event => {
            setSelectedSectionId(event.target.value);
            setSelectedSkillId('');
          }}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={!selectedSubjectId}
        >
          <option value="">كل الأقسام</option>
          {sections.filter(section => section.subjectId === selectedSubjectId).map(section => (
            <option key={section.id} value={section.id}>{section.name}</option>
          ))}
        </select>

        <select
          value={selectedSkillId}
          onChange={event => setSelectedSkillId(event.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={!selectedSubjectId || availableSkillTopics.length === 0}
        >
          <option value="">
            {!selectedSubjectId
              ? 'اختر المادة أولاً'
              : availableSkillTopics.length === 0
                ? 'لا توجد مهارات لهذه المادة'
                : 'كل المهارات'}
          </option>
          {availableSkillTopics.map(mainTopic => (
            <optgroup key={mainTopic.id} label={mainTopic.title}>
              <option value={mainTopic.id}>{mainTopic.title} (رئيسية)</option>
              {topics.filter(subTopic => subTopic.parentId === mainTopic.id).map(subTopic => (
                <option key={subTopic.id} value={subTopic.id}>- {subTopic.title}</option>
              ))}
            </optgroup>
          ))}
        </select>

        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ابحث في نص السؤال..."
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600 w-1/2">نص السؤال</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">المهارة</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الصعوبة</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuestions.map(question => (
                <tr key={question.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-800 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: question.text }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {question.skillIds?.map(skillId => {
                        const skill = topics.find(topic => topic.id === skillId);
                        return skill ? (
                          <span key={skillId} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-xs font-bold">
                            {skill.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        question.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-600'
                          : question.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {question.difficulty === 'Easy' ? 'سهل' : question.difficulty === 'Medium' ? 'متوسط' : 'صعب'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDuplicate(question)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="نسخ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      </button>
                      <button onClick={() => handleEdit(question)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(question.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredQuestions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    لا توجد أسئلة مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
