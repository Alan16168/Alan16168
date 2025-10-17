import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MessageSquare, FileText, UserCheck, BookOpen } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: MessageSquare,
      title: t('nav.chat'),
      description: t('chat.subtitle'),
      link: '/chat',
      color: 'bg-blue-500'
    },
    {
      icon: FileText,
      title: t('nav.forms'),
      description: t('forms.subtitle'),
      link: '/forms',
      color: 'bg-green-500'
    },
    {
      icon: UserCheck,
      title: t('nav.backgroundCheck'),
      description: t('backgroundCheck.subtitle'),
      link: '/background-check',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('common.appName')}
          </h1>
          <p className="text-xl text-gray-600">
            Professional landlord management system for BC Province
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Link
              key={idx}
              to={feature.link}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to BC Landlord Manager
          </h2>
          <div className="prose max-w-none">
            <p>
              This system helps BC Province landlords to:
            </p>
            <ul>
              <li>✅ Manage rental properties legally and efficiently</li>
              <li>✅ Get AI-powered advice based on official BC documents</li>
              <li>✅ Access and download official rental forms</li>
              <li>✅ Screen tenants professionally</li>
              <li>✅ Maintain properties smartly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
