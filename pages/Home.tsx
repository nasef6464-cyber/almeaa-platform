import React, { useMemo } from 'react';
import { Clock, TrendingUp, AlertTriangle, Zap, FileText, PieChart, Heart, Map as MapIcon, HelpCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Link } from 'react-router-dom';
import { SmartLearningPath } from '../components/SmartLearningPath';
import { useStore } from '../store/useStore';
import { QuizResult, SkillGap } from '../types';

const buildSmartPathSkillsFromResults = (examResults: QuizResult[]): SkillGap[] => {
  if (!examResults || examResults.length === 0) return [];

  const skillMap = new globalThis.Map<string, { skill: string; masterySum: number; attempts: number }>();

  examResults.forEach((result) => {
    result.skillsAnalysis?.forEach((skill) => {
      const key = skill.skillId || skill.skill;
      const existing = skillMap.get(key);
      if (existing) {
        existing.masterySum += skill.mastery;
        existing.attempts += 1;
        return;
      }
      skillMap.set(key, { skill: skill.skill, masterySum: skill.mastery, attempts: 1 });
    });
  });

  return Array.from(skillMap.values())
    .map((item): SkillGap => {
      const mastery = Math.round(item.masterySum / item.attempts);
      return {
        skill: item.skill,
        mastery,
        status: mastery < 50 ? 'weak' : mastery < 75 ? 'average' : 'strong',
      };
    })
    .sort((a, b) => a.mastery - b.mastery);
};

const Home: React.FC = () => {
  const { user, courses, enrolledCourses, completedLessons, examResults, recentActivity, hasScopedPackageAccess } = useStore();

  const smartSkills = useMemo(() => buildSmartPathSkillsFromResults(examResults), [examResults]);

  const accessibleCourseIds = useMemo(
    () =>
      new Set(
        courses
          .filter(
            (course) =>
              enrolledCourses.includes(course.id) ||
              (user.subscription?.purchasedCourses || []).includes(course.id) ||
              hasScopedPackageAccess('courses', course.pathId || course.category, course.subjectId || course.subject),
          )
          .map((course) => course.id),
      ),
    [courses, enrolledCourses, hasScopedPackageAccess, user.subscription?.purchasedCourses],
  );

  const activeCourses = useMemo(() => {
    const enrolled = courses.filter((course) => accessibleCourseIds.has(course.id));
    return enrolled.length > 0 ? enrolled : courses.slice(0, 4);
  }, [accessibleCourseIds, courses]);

  const scheduleItems = useMemo(() => {
    const pendingLessons = activeCourses
      .flatMap((course) =>
        (course.modules || []).flatMap((mod) =>
          mod.lessons.map((lesson) => ({
            id: `${course.id}_${lesson.id}`,
            subject: `${course.title} - ${lesson.title}`,
            duration: lesson.duration || 'â€”',
          }))
        )
      )
      .filter((lesson) => !completedLessons.includes(lesson.id.split('_')[1]))
      .slice(0, 3)
      .map((lesson, index) => ({
        ...lesson,
        day: index === 0 ? 'Ø§Ù„ÙŠÙˆÙ…' : 'Ù‡Ø°Ø§ Ø§Ù„Ø£Ø³Ø¨ÙˆØ¹',
        status: index === 0 ? 'in-progress' : 'upcoming',
      }));

    if (pendingLessons.length > 0) return pendingLessons;

    return recentActivity.slice(0, 3).map((item) => ({
      id: item.id,
      subject: item.title,
      day: new Date(item.date).toLocaleDateString('ar-SA'),
      duration: 'â€”',
      status: 'completed' as const,
    }));
  }, [activeCourses, completedLessons, recentActivity]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ù…Ø±Ø­Ø¨Ø§Ù‹ØŒ {user.name.split(' ')[0]} ðŸ‘‹</h2>
          <p className="text-gray-500">Ù„Ù†ÙˆØ§ØµÙ„ Ø±Ø­Ù„Ø© Ø§Ù„ØªØ¹Ù„Ù… Ø§Ù„ÙŠÙˆÙ…</p>
        </div>
        <Link to="/gamification" className="bg-secondary-100 text-secondary-600 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <TrendingUp size={16} />
          Ø§Ù„Ù…Ø³ØªÙˆÙ‰ 12
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/quiz" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Zap size={24} />
              </div>
              <span className="font-bold text-gray-800 text-sm">Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø§Ù„Ù…Ø­Ø§ÙƒÙŠØ©</span>
            </Link>

            <Link to="/quizzes" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <FileText size={24} />
              </div>
              <span className="font-bold text-gray-800 text-sm">Ø§Ø®ØªØ¨Ø§Ø±Ø§ØªÙŠ</span>
            </Link>

            <Link to="/reports" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <PieChart size={24} />
              </div>
              <span className="font-bold text-gray-800 text-sm">ØªÙ‚Ø§Ø±ÙŠØ±ÙŠ</span>
            </Link>

            <Link to="/favorites" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                <Heart size={24} />
              </div>
              <span className="font-bold text-gray-800 text-sm">Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ù…ÙØ¶Ù„Ø©</span>
            </Link>

            <Link to="/plan" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <MapIcon size={24} />
              </div>
              <span className="font-bold text-gray-800 text-sm">Ø®ÙØ·ØªÙŠ</span>
            </Link>

            <Link to="/qa" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <HelpCircle size={24} />
              </div>
              <span className="font-bold text-gray-800 text-sm">Ø³Ø¤Ø§Ù„ ÙˆØ¬ÙˆØ§Ø¨</span>
            </Link>
          </div>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Ø§Ù„ÙƒÙˆØ±Ø³Ø§Øª Ø§Ù„Ù†Ø´Ø·Ø©</h3>
              <Link to="/courses" className="text-primary-600 text-sm font-medium">Ø¹Ø±Ø¶ Ø§Ù„ÙƒÙ„</Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {activeCourses.map((course) => (
                <Card key={course.id} className="flex flex-col h-full">
                  <div className="relative h-32 bg-gray-900">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute top-3 right-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {course.price} {course.currency}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full">{course.level}</span>
                        <div className="flex items-center text-amber-400 text-sm font-bold">
                          <span>â˜…</span> {course.rating}
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 leading-snug mb-1">{course.title}</h4>
                      <p className="text-xs text-gray-500 mb-3">Ø§Ù„Ù…Ø¯Ø±Ø³: {course.instructor}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {course.features.slice(0, 2).map((feat, idx) => (
                          <span key={idx} className="text-[10px] bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-600">{feat}</span>
                        ))}
                      </div>
                      <Link to={`/course/${course.id}`} className="block w-full bg-secondary-500 hover:bg-secondary-600 text-white text-center py-2 rounded-lg font-bold transition-colors">
                        Ø´Ø±Ø§Ø¡ / Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ÙƒÙˆØ±Ø³
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <SmartLearningPath skills={smartSkills} />

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Ø§Ù„Ø¬Ø¯ÙˆÙ„ Ø§Ù„Ø¯Ø±Ø§Ø³ÙŠ</h3>
            </div>
            <div className="space-y-3">
              {scheduleItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex justify-between items-center ${
                    item.status === 'in-progress' ? 'bg-secondary-50 border-secondary-200' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.status === 'completed'
                        ? 'bg-primary-100 text-primary-600'
                        : item.status === 'in-progress'
                          ? 'bg-secondary-100 text-secondary-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                    >
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{item.subject}</h4>
                      <p className="text-sm text-gray-500">{item.day}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-800">{item.duration}</span>
                    {item.status === 'in-progress' && <span className="text-xs text-secondary-600 font-bold animate-pulse">Ø¬Ø§Ø±ÙŠ Ø§Ù„Ø¢Ù†</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="text-secondary-500" size={20} />
                Ù†Ù‚Ø§Ø· Ø§Ù„Ø¶Ø¹Ù
              </h3>
              <Link to="/reports" className="text-xs text-primary-600 font-bold">Ø§Ù„ØªÙØ§ØµÙŠÙ„</Link>
            </div>

            <div className="space-y-6">
              {smartSkills.slice(0, 2).map((skill, index) => (
                <div key={`${skill.skill}-${index}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700 text-sm">{skill.skill}</span>
                    <span className={`text-xs font-bold ${skill.mastery < 50 ? 'text-red-500' : 'text-amber-500'}`}>{skill.mastery}%</span>
                  </div>
                  <ProgressBar percentage={skill.mastery} showPercentage={false} color={skill.mastery < 50 ? 'danger' : 'secondary'} />
                </div>
              ))}
              {smartSkills.length === 0 && (
                <p className="text-sm text-gray-500">Ø§Ø¨Ø¯Ø£ Ø£ÙˆÙ„ Ø§Ø®ØªØ¨Ø§Ø± Ù„ØªØ¸Ù‡Ø± Ù„Ùƒ Ù†Ù‚Ø§Ø· Ø§Ù„ØªØ­Ø³ÙŠÙ† ØªÙ„Ù‚Ø§Ø¦ÙŠÙ‹Ø§.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;

