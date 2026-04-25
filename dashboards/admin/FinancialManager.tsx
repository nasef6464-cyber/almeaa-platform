import React, { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';

type TransactionRow = {
    id: string;
    user: string;
    type: string;
    amount: string;
    date: string;
    status: string;
};

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M12 6h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 14h.01"></path>
        <path d="M16 10h.01"></path>
        <path d="M16 14h.01"></path>
        <path d="M8 10h.01"></path>
        <path d="M8 14h.01"></path>
    </svg>
);

export const FinancialManager: React.FC = () => {
    const { users, groups, b2bPackages, accessCodes, courses } = useStore();
    const [activeTab, setActiveTab] = useState<'overview' | 'b2b' | 'b2c' | 'transactions'>('overview');

    const schools = useMemo(() => groups.filter((group) => group.type === 'SCHOOL'), [groups]);
    const b2cPremiumUsers = useMemo(() => users.filter((user) => user.subscription?.plan === 'premium'), [users]);
    const activePackages = useMemo(() => b2bPackages.filter((pkg) => pkg.status === 'active'), [b2bPackages]);
    const activeCodes = useMemo(() => accessCodes.filter((code) => code.expiresAt > Date.now()), [accessCodes]);

    const estimatedB2BRevenue = useMemo(() => {
        return activePackages.reduce((sum, pkg) => {
            const courseValue = (pkg.courseIds || []).reduce((courseSum, courseId) => {
                const course = courses.find((item) => item.id === courseId);
                return courseSum + (course?.price || 0);
            }, 0);

            return sum + (courseValue * Math.max(pkg.maxStudents || 0, 0));
        }, 0);
    }, [activePackages, courses]);

    const estimatedB2CRevenue = b2cPremiumUsers.length * 199;
    const estimatedTotalRevenue = estimatedB2BRevenue + estimatedB2CRevenue;
    const totalCapacity = activePackages.reduce((sum, pkg) => sum + (pkg.maxStudents || 0), 0);
    const totalCodeUsage = activeCodes.reduce((sum, code) => sum + (code.currentUses || 0), 0);
    const utilizationRate = totalCapacity > 0 ? Math.round((totalCodeUsage / totalCapacity) * 100) : 0;
    const averageCustomerValue = users.length > 0 ? Math.round(estimatedTotalRevenue / users.length) : 0;

    const kpis = [
        {
            label: 'إجمالي الإيرادات التقديرية',
            value: `SAR ${estimatedTotalRevenue.toLocaleString('en-US')}`,
            trend: `${activePackages.length} باقة نشطة`,
            isPositive: true,
            icon: <DollarSign size={24} />,
        },
        {
            label: 'اشتراكات الأفراد (B2C)',
            value: `${b2cPremiumUsers.length}`,
            trend: `${users.length} مستخدم`,
            isPositive: true,
            icon: <Users size={24} />,
        },
        {
            label: 'باقات المدارس (B2B)',
            value: `${b2bPackages.length}`,
            trend: `${schools.length} جهة تعليمية`,
            isPositive: true,
            icon: <BuildingIcon />,
        },
        {
            label: 'متوسط قيمة العميل',
            value: `SAR ${averageCustomerValue.toLocaleString('en-US')}`,
            trend: `${utilizationRate}% معدل الاستخدام`,
            isPositive: utilizationRate >= 50,
            icon: <TrendingUp size={24} />,
        },
    ];

    const recentTransactions = useMemo<TransactionRow[]>(() => {
        const schoolTransactions = activePackages.slice(0, 6).map((pkg) => ({
            id: `B2B-${pkg.id}`,
            user: groups.find((group) => group.id === pkg.schoolId)?.name || 'جهة تعليمية',
            type: `B2B (${pkg.name})`,
            amount: `SAR ${((pkg.maxStudents || 0) * 99).toLocaleString('en-US')}`,
            date: new Date(pkg.createdAt).toLocaleDateString('ar-SA'),
            status: pkg.status === 'active' ? 'نشط' : 'منتهي',
        }));

        const individualTransactions = b2cPremiumUsers.slice(0, 6).map((user, index) => ({
            id: `B2C-${user.id}-${index + 1}`,
            user: user.name,
            type: 'B2C (اشتراك بريميوم)',
            amount: 'SAR 199',
            date: new Date().toLocaleDateString('ar-SA'),
            status: user.isActive === false ? 'موقوف' : 'ناجح',
        }));

        const codeTransactions = activeCodes.slice(0, 6).map((code) => ({
            id: `CODE-${code.id}`,
            user: groups.find((group) => group.id === code.schoolId)?.name || 'جهة تعليمية',
            type: `تفعيل كود (${code.code})`,
            amount: `${code.currentUses}/${code.maxUses}`,
            date: new Date(code.createdAt).toLocaleDateString('ar-SA'),
            status: code.expiresAt > Date.now() ? 'نشط' : 'منتهي',
        }));

        return [...schoolTransactions, ...individualTransactions, ...codeTransactions];
    }, [activeCodes, activePackages, b2cPremiumUsers, groups]);

    const schoolRows = useMemo(() => {
        return schools.map((school) => {
            const schoolPackages = b2bPackages.filter((pkg) => pkg.schoolId === school.id);
            const schoolCodes = accessCodes.filter((code) => code.schoolId === school.id);
            const activeSchoolCodes = schoolCodes.filter((code) => code.expiresAt > Date.now());
            const estimatedValue = schoolPackages.reduce((sum, pkg) => sum + ((pkg.maxStudents || 0) * 99), 0);
            const totalCapacity = schoolPackages.reduce((sum, pkg) => sum + (pkg.maxStudents || 0), 0);
            const usedSeats = schoolCodes.reduce((sum, code) => sum + (code.currentUses || 0), 0);

            return {
                id: school.id,
                name: school.name,
                packages: schoolPackages.length,
                activeCodes: activeSchoolCodes.length,
                estimatedValue,
                usedSeats,
                totalCapacity,
            };
        }).sort((a, b) => b.estimatedValue - a.estimatedValue);
    }, [accessCodes, b2bPackages, schools]);

    const premiumRows = useMemo(() => {
        return b2cPremiumUsers.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email || '-',
            courses: user.subscription?.purchasedCourses?.length || 0,
            packages: user.subscription?.purchasedPackages?.length || 0,
            plan: user.subscription?.plan || 'free',
            status: user.isActive === false ? 'موقوف' : 'نشط',
        }));
    }, [b2cPremiumUsers]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">المالية والاشتراكات</h1>
                    <p className="text-sm text-gray-500 mt-1">إدارة الإيرادات، الاشتراكات، التعاقدات، وحركة التفعيل على المنصة.</p>
                </div>
            </div>

            <div className="flex gap-2 border-b border-gray-200">
                {[
                    { id: 'overview', label: 'نظرة عامة' },
                    { id: 'b2c', label: 'اشتراكات الأفراد' },
                    { id: 'b2b', label: 'باقات المدارس' },
                    { id: 'transactions', label: 'سجل العمليات' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                            activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kpis.map((kpi, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                        {kpi.icon}
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${kpi.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>
                                        {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {kpi.trend}
                                    </div>
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">{kpi.label}</h3>
                                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">أحدث العمليات المالية</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right">
                                <thead className="bg-gray-50 text-gray-600 text-sm">
                                    <tr>
                                        <th className="p-4 font-medium">رقم العملية</th>
                                        <th className="p-4 font-medium">العميل</th>
                                        <th className="p-4 font-medium">النوع</th>
                                        <th className="p-4 font-medium">المبلغ</th>
                                        <th className="p-4 font-medium">التاريخ</th>
                                        <th className="p-4 font-medium">الحالة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentTransactions.slice(0, 8).map((trx) => (
                                        <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900">{trx.id}</td>
                                            <td className="p-4 text-gray-800">{trx.user}</td>
                                            <td className="p-4 text-gray-600">{trx.type}</td>
                                            <td className="p-4 font-bold text-indigo-600">{trx.amount}</td>
                                            <td className="p-4 text-gray-500">{trx.date}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${trx.status === 'ناجح' || trx.status === 'نشط' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {trx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'b2b' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">المدارس والجهات المتعاقدة</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">الجهة</th>
                                    <th className="p-4 font-medium">الباقات</th>
                                    <th className="p-4 font-medium">الأكواد النشطة</th>
                                    <th className="p-4 font-medium">استخدام المقاعد</th>
                                    <th className="p-4 font-medium">القيمة التقديرية</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {schoolRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{row.name}</td>
                                        <td className="p-4 text-gray-600">{row.packages}</td>
                                        <td className="p-4 text-gray-600">{row.activeCodes}</td>
                                        <td className="p-4 text-gray-600">{row.usedSeats}/{row.totalCapacity || 0}</td>
                                        <td className="p-4 font-bold text-indigo-600">SAR {row.estimatedValue.toLocaleString('en-US')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'b2c' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">اشتراكات الأفراد</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">الاسم</th>
                                    <th className="p-4 font-medium">البريد</th>
                                    <th className="p-4 font-medium">الخطة</th>
                                    <th className="p-4 font-medium">الدورات</th>
                                    <th className="p-4 font-medium">الباقات</th>
                                    <th className="p-4 font-medium">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {premiumRows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{row.name}</td>
                                        <td className="p-4 text-gray-600">{row.email}</td>
                                        <td className="p-4 text-gray-600">{row.plan === 'premium' ? 'بريميوم' : 'مجاني'}</td>
                                        <td className="p-4 text-gray-600">{row.courses}</td>
                                        <td className="p-4 text-gray-600">{row.packages}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'نشط' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'transactions' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">سجل العمليات</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-4 font-medium">رقم العملية</th>
                                    <th className="p-4 font-medium">العميل</th>
                                    <th className="p-4 font-medium">النوع</th>
                                    <th className="p-4 font-medium">القيمة</th>
                                    <th className="p-4 font-medium">التاريخ</th>
                                    <th className="p-4 font-medium">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentTransactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{trx.id}</td>
                                        <td className="p-4 text-gray-800">{trx.user}</td>
                                        <td className="p-4 text-gray-600">{trx.type}</td>
                                        <td className="p-4 font-bold text-indigo-600">{trx.amount}</td>
                                        <td className="p-4 text-gray-500">{trx.date}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${trx.status === 'ناجح' || trx.status === 'نشط' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
