import React, { useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { CheckCircle, Clock, XCircle, FileText, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';

type RequestStatus = 'completed' | 'pending' | 'cancelled';

interface RequestRow {
  id: string;
  itemName: string;
  status: RequestStatus;
  orderDate: string;
  sortDate: string;
  price: number;
  paymentMethod: string;
  typeLabel: string;
}

export const MyRequests: React.FC = () => {
  const { user, courses, enrolledCourses, b2bPackages, recentActivity, hasScopedPackageAccess } = useStore();

  const rows = useMemo<RequestRow[]>(() => {
    const purchasedCourseIds = user.subscription?.purchasedCourses || [];
    const purchasedPackageIds = user.subscription?.purchasedPackages || [];
    const accessibleCourseIds = Array.from(
      new Set(
        courses
          .filter(
            (course) =>
              purchasedCourseIds.includes(course.id) ||
              enrolledCourses.includes(course.id) ||
              hasScopedPackageAccess('courses', course.pathId || course.category, course.subjectId || course.subject),
          )
          .map((course) => course.id),
      ),
    );
    const today = new Date();
    const todayLabel = today.toLocaleDateString('ar-SA');
    const todayIso = today.toISOString();

    const sessionRows = recentActivity
      .filter((activity) => activity.type === 'session_booked')
      .map((activity) => ({
        id: `session_${activity.id}`,
        itemName: activity.title.replace(/^تم حجز حصة خاصة:\s*/u, '') || 'حصة خاصة',
        status: 'pending' as const,
        orderDate: new Date(activity.date).toLocaleDateString('ar-SA'),
        sortDate: activity.date,
        price: 0,
        paymentMethod: 'طلب جلسة خاصة بانتظار التأكيد',
        typeLabel: 'جلسة',
      }));

    const courseRows = accessibleCourseIds
      .map((courseId) => {
        const course = courses.find((item) => item.id === courseId);
        if (!course) return null;

        const hasDirectPurchase = purchasedCourseIds.includes(courseId);
        const hasScopedPackage = hasScopedPackageAccess('courses', course.pathId || course.category, course.subjectId || course.subject);

        return {
          id: `req_${courseId}`,
          itemName: course.title,
          status: 'completed' as const,
          orderDate: todayLabel,
          sortDate: todayIso,
          price: course.price || 0,
          paymentMethod: hasDirectPurchase
            ? 'بطاقة إلكترونية / شراء مباشر'
            : hasScopedPackage
              ? 'مفعلة ضمن باقة مرتبطة بالمسار أو المادة'
              : 'تفعيل ضمن اشتراك أو كود وصول',
          typeLabel: 'دورة',
        };
      })
      .filter(Boolean) as RequestRow[];

    const packageRows = purchasedPackageIds.map((packageId) => {
      const pkg = b2bPackages.find((item) => item.id === packageId);
      const packageKinds = Array.isArray(pkg?.contentTypes) ? pkg.contentTypes : [];
      const packageLabel =
        packageKinds.length === 0 || packageKinds.includes('all')
          ? 'باقة شاملة'
          : `باقة ${packageKinds
              .map((type) => {
                switch (type) {
                  case 'courses':
                    return 'الدورات';
                  case 'foundation':
                    return 'التأسيس';
                  case 'banks':
                    return 'التدريبات';
                  case 'tests':
                    return 'الاختبارات';
                  case 'library':
                    return 'المكتبة';
                  default:
                    return 'المحتوى';
                }
              })
              .join(' + ')}`;

      return {
        id: `pkg_${packageId}`,
        itemName: pkg?.name || 'باقة اشتراك مفعلة',
        status: 'completed' as const,
        orderDate: todayLabel,
        sortDate: todayIso,
        price: 0,
        paymentMethod: pkg ? `كود تفعيل / ${packageLabel}` : 'اشتراك مفعل من داخل المنصة',
        typeLabel: 'باقة',
      };
    });

    return [...sessionRows, ...packageRows, ...courseRows].sort(
      (a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime(),
    );
  }, [
    user.subscription?.purchasedCourses,
    user.subscription?.purchasedPackages,
    enrolledCourses,
    courses,
    b2bPackages,
    hasScopedPackageAccess,
    recentActivity,
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">طلباتي</h1>
        <p className="text-sm text-gray-500">سجل الاشتراكات والدورات والباقات المفعلة وحجوزات الجلسات على حسابك</p>
      </header>

      {rows.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          <FileText size={48} className="mx-auto mb-4 opacity-20" />
          <p>لا توجد طلبات حاليًا.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {rows.map((req) => (
            <Card key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-gray-800">{req.itemName}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
                    {req.typeLabel}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      req.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : req.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {req.status === 'completed' && <CheckCircle size={10} />}
                    {req.status === 'pending' && <Clock size={10} />}
                    {req.status === 'cancelled' && <XCircle size={10} />}
                    {req.status === 'completed' ? 'مكتمل' : req.status === 'pending' ? 'قيد التنفيذ' : 'ملغي'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{req.paymentMethod}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {req.orderDate}
                  </span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <div className="text-xs text-gray-400 mb-1">القيمة</div>
                <div className="text-lg font-black text-gray-800">
                  {req.price === 0 ? 'تم التفعيل' : `${req.price} ر.س`}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

