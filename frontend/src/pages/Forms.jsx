import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formsAPI } from '../services/api';
import { FileText, Download, Loader } from 'lucide-react';

export default function Forms() {
  const { t, i18n } = useTranslation();
  const [forms, setForms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
    loadCategories();
  }, [i18n.language]);

  const loadForms = async () => {
    try {
      const response = await formsAPI.getAllForms({ language: i18n.language });
      setForms(response.data.forms);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await formsAPI.getFormCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filteredForms = selectedCategory
    ? forms.filter(form => form.category === selectedCategory)
    : forms;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('forms.title')}</h1>
          <p className="text-gray-600">{t('forms.subtitle')}</p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('forms.category')}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            <option value="">{t('forms.allCategories')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Forms List */}
        <div className="grid gap-6">
          {filteredForms.map(form => (
            <div key={form.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-800">{form.name}</h3>
                  </div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold mb-3">
                    {form.category}
                  </span>
                  <p className="text-gray-600 mb-4">{form.description}</p>
                  
                  {form.useCases && form.useCases.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">{t('forms.useCases')}:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {form.useCases.map((useCase, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{useCase}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <a
                  href={form.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  {t('forms.downloadForm')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
