import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Tags,
  Users,
  BarChart3,
  Database,
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  BookOpen,
  Shield,
  AlertCircle,
  Image,
  FolderSearch
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useDocumentStore } from '../stores/documentStore';
import { Document } from '../types';
import { databases } from '../data/documents';
import { scanPDFFilenames } from '../utils/documentScanner';

const TAG_COLORS = [
  'from-accent-gold to-accent-red',
  'from-blue-500 to-purple-500',
  'from-green-500 to-teal-500',
  'from-pink-500 to-rose-500',
  'from-orange-500 to-amber-500',
];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { documents, addDocument, updateDocument, deleteDocument, addTag, deleteTag, tags } = useDocumentStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'documents' | 'tags' | 'stats' | 'databases' | 'scan'>('upload');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const showNotification = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dark via-surface-primary to-surface-dark p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-gold to-accent-red flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">管理员控制台</h1>
            <p className="text-sm text-white/60">欢迎，{user?.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-4 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'upload', icon: Upload, label: '上传文献' },
                  { id: 'scan', icon: FolderSearch, label: '扫描文献' },
                  { id: 'documents', icon: FileText, label: '文献管理' },
                  { id: 'tags', icon: Tags, label: '标签管理' },
                  { id: 'databases', icon: Database, label: '数据库管理' },
                  { id: 'stats', icon: BarChart3, label: '数据统计' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.id
                        ? 'bg-accent-gold/20 text-accent-gold'
                        : 'hover:bg-white/5 text-white/70 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'upload' && <UploadSection onSuccess={showNotification} />}
                {activeTab === 'scan' && <ScanSection onSuccess={showNotification} />}
                {activeTab === 'documents' && <DocumentsSection onSuccess={showNotification} />}
                {activeTab === 'tags' && <TagsSection onSuccess={showNotification} />}
                {activeTab === 'databases' && <DatabasesSection />}
                {activeTab === 'stats' && <StatsSection documents={documents} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 glass rounded-lg px-6 py-4 flex items-center gap-3 border border-accent-gold/30"
          >
            <Check className="w-5 h-5 text-accent-gold" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UploadSection: React.FC<{ onSuccess: (msg: string) => void }> = ({ onSuccess }) => {
  const { addDocument } = useDocumentStore();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    dynasty: '',
    type: '',
    database: 'difang',
    summary: '',
    content: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newDoc: Document = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      dynasty: formData.dynasty,
      type: formData.type,
      database: formData.database,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      summary: formData.summary,
      content: formData.content,
      pdfUrl: '/documents/new.pdf',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
      createdAt: new Date().toISOString().split('T')[0],
      viewCount: 0,
    };

    addDocument(newDoc);
    setIsSubmitting(false);
    onSuccess('文献上传成功！');
    setFormData({
      title: '',
      author: '',
      dynasty: '',
      type: '',
      database: 'difang',
      summary: '',
      content: '',
      tags: '',
    });
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Upload className="w-5 h-5 text-accent-gold" />
        上传新文献
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-white/70 mb-2">文献标题 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold/50"
              placeholder="请输入文献标题"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">作者 *</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold/50"
              placeholder="请输入作者"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">朝代 *</label>
            <select
              value={formData.dynasty}
              onChange={(e) => setFormData({ ...formData, dynasty: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white focus:outline-none focus:border-accent-gold/50"
              required
            >
              <option value="">选择朝代</option>
              <option value="春秋">春秋</option>
              <option value="西汉">西汉</option>
              <option value="三国">三国</option>
              <option value="北宋">北宋</option>
              <option value="南宋">南宋</option>
              <option value="近代">近代</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">文献类型 *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white focus:outline-none focus:border-accent-gold/50"
              required
            >
              <option value="">选择类型</option>
              <option value="史书">史书</option>
              <option value="诸子">诸子</option>
              <option value="表文">表文</option>
              <option value="绘画">绘画</option>
              <option value="诗词">诗词</option>
              <option value="科技">科技</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">所属数据库 *</label>
            <select
              value={formData.database}
              onChange={(e) => setFormData({ ...formData, database: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white focus:outline-none focus:border-accent-gold/50"
              required
            >
              {databases.filter((d) => d.id !== 'all').map((db) => (
                <option key={db.id} value={db.id}>
                  {db.icon} {db.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-2">标签</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold/50"
              placeholder="多个标签用逗号分隔"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-2">文献简介</label>
          <textarea
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold/50 h-24 resize-none"
            placeholder="请输入文献简介"
          />
        </div>

        <div>
          <label className="block text-sm text-white/70 mb-2">文献内容 *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold/50 h-48 resize-none"
            placeholder="请输入文献内容"
            required
          />
        </div>

        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-accent-gold/50 transition-colors">
          <Image className="w-12 h-12 mx-auto text-white/30 mb-4" />
          <p className="text-white/60 mb-2">拖拽PDF文件到此处或点击上传</p>
          <p className="text-xs text-white/40">支持 PDF 格式，单文件不超过 50MB</p>
          <button
            type="button"
            className="mt-4 px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
          >
            选择文件
          </button>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-accent-gold to-accent-red text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {isSubmitting ? '上传中...' : '确认上传'}
        </motion.button>
      </form>
    </div>
  );
};

const DocumentsSection: React.FC<{ onSuccess: (msg: string) => void }> = ({ onSuccess }) => {
  const { documents, updateDocument, deleteDocument } = useDocumentStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Document>>({});

  const handleEdit = (doc: Document) => {
    setEditingId(doc.id);
    setEditData({ ...doc });
  };

  const handleSave = (id: string) => {
    updateDocument(id, editData);
    setEditingId(null);
    onSuccess('文献更新成功！');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这篇文献吗？')) {
      deleteDocument(id);
      onSuccess('文献已删除');
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-accent-gold" />
        文献管理
        <span className="ml-auto text-sm text-white/50">共 {documents.length} 篇</span>
      </h2>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-surface-dark/30 rounded-lg p-4 border border-white/5">
            {editingId === doc.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.title || ''}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                />
                <input
                  type="text"
                  value={editData.author || ''}
                  onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-white/5 border border-white/10 text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(doc.id)}
                    className="px-4 py-2 rounded bg-accent-gold/20 text-accent-gold"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 rounded bg-white/5 text-white/70"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white">{doc.title}</h3>
                  <p className="text-sm text-white/50">{doc.author} · {doc.dynasty} · {doc.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 rounded-lg hover:bg-accent-red/20 text-white/50 hover:text-accent-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ScanSection: React.FC<{ onSuccess: (msg: string) => void }> = ({ onSuccess }) => {
  const { addDocument, documents } = useDocumentStore();
  const [scannedDocs, setScannedDocs] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());

  const handleScan = async () => {
    setIsScanning(true);
    const files = await scanPDFFilenames();
    setScannedDocs(files);
    setSelectedDocs(new Set(files));
    setIsScanning(false);
    if (files.length > 0) {
      onSuccess(`扫描到 ${files.length} 篇文献！`);
    } else {
      onSuccess('未扫描到任何PDF文件，请将PDF放入 public/documents/ 文件夹');
    }
  };

  const toggleDoc = (filename: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(filename)) {
      newSelected.delete(filename);
    } else {
      newSelected.add(filename);
    }
    setSelectedDocs(newSelected);
  };

  const handleImport = () => {
    let importCount = 0;
    scannedDocs.forEach(filename => {
      if (selectedDocs.has(filename)) {
        const title = filename.replace(/\.pdf$/i, '');
        const newDoc: Document = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          title: title,
          author: '',
          dynasty: '',
          type: '',
          database: 'difang',
          tags: [],
          summary: '',
          content: '',
          pdfUrl: `/documents/${filename}`,
          coverUrl: '/documents/covers/' + filename.replace(/\.pdf$/i, '.png'),
          createdAt: new Date().toISOString().split('T')[0],
          viewCount: 0,
        };
        addDocument(newDoc);
        importCount++;
      }
    });
    onSuccess(`成功导入 ${importCount} 篇文献！`);
    setScannedDocs([]);
    setSelectedDocs(new Set());
  };

  const existingUrls = new Set(documents.map(d => d.pdfUrl));

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FolderSearch className="w-5 h-5 text-accent-gold" />
        扫描文献文件夹
      </h2>

      <div className="bg-surface-dark/30 rounded-lg p-4 mb-6 border border-white/5">
        <h3 className="font-medium mb-2">使用说明</h3>
        <ol className="text-sm text-white/60 space-y-2 list-decimal list-inside">
          <li>将 PDF 文件放入 <code className="bg-white/10 px-2 py-0.5 rounded">public/documents/</code> 文件夹</li>
          <li>点击"扫描文件夹"按钮</li>
          <li>选择要导入的文献，点击"导入选中"</li>
          <li>在文献管理中完善文献信息</li>
        </ol>
        <p className="text-xs text-white/40 mt-3">提示：图片命名需与PDF文件名一致，如 example.pdf 对应 example.png</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex-1 py-3 rounded-lg bg-gradient-to-r from-accent-gold to-accent-red text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FolderSearch className="w-5 h-5" />
          {isScanning ? '扫描中...' : '扫描文件夹'}
        </button>

        {scannedDocs.length > 0 && (
          <button
            onClick={handleImport}
            disabled={selectedDocs.size === 0}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            导入选中 ({selectedDocs.size})
          </button>
        )}
      </div>

      {scannedDocs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50">扫描结果：{scannedDocs.length} 篇</span>
            <button
              onClick={() => setSelectedDocs(new Set(scannedDocs))}
              className="text-xs text-accent-gold hover:underline"
            >
              全选
            </button>
          </div>
          {scannedDocs.map((filename) => {
            const isAlreadyImported = existingUrls.has(`/documents/${filename}`);
            return (
              <div
                key={filename}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  selectedDocs.has(filename)
                    ? 'bg-accent-gold/10 border-accent-gold/30'
                    : 'bg-surface-dark/30 border-white/5'
                } ${isAlreadyImported ? 'opacity-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedDocs.has(filename)}
                  onChange={() => toggleDoc(filename)}
                  disabled={isAlreadyImported}
                  className="w-5 h-5 rounded accent-accent-gold"
                />
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-accent-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">{filename.replace(/\.pdf$/i, '')}</h4>
                  <p className="text-sm text-white/50 truncate">{filename}</p>
                  {isAlreadyImported && (
                    <span className="text-xs text-yellow-500">已导入</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {scannedDocs.length === 0 && !isScanning && (
        <div className="text-center py-12 text-white/40">
          <FolderSearch className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>点击"扫描文件夹"开始扫描</p>
          <p className="text-xs mt-2">将PDF文件放入文件夹后点击扫描</p>
        </div>
      )}
    </div>
  );
};

const TagsSection: React.FC<{ onSuccess: (msg: string) => void }> = ({ onSuccess }) => {
  const { tags, addTag, deleteTag } = useDocumentStore();
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
      onSuccess('标签添加成功！');
    }
  };

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Tags className="w-5 h-5 text-accent-gold" />
        标签管理
        <span className="ml-auto text-sm text-white/50">共 {tags.length} 个标签</span>
      </h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          className="flex-1 px-4 py-3 rounded-lg bg-surface-dark/50 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent-gold/50"
          placeholder="输入新标签名称"
        />
        <button
          onClick={handleAddTag}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent-gold to-accent-red text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`px-4 py-2 rounded-full bg-gradient-to-r ${TAG_COLORS[index % TAG_COLORS.length]} text-white text-sm flex items-center gap-2`}
          >
            <span>{tag}</span>
            <button
              onClick={() => {
                deleteTag(tag);
                onSuccess('标签已删除');
              }}
              className="hover:opacity-70"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="text-center py-12 text-white/40">
          <Tags className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>暂无标签，请添加新标签</p>
        </div>
      )}
    </div>
  );
};

const DatabasesSection: React.FC = () => {
  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Database className="w-5 h-5 text-accent-gold" />
        数据库管理
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {databases.filter((d) => d.id !== 'all').map((db) => (
          <div
            key={db.id}
            className="p-4 rounded-lg bg-surface-dark/30 border border-white/5 hover:border-accent-gold/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{db.icon}</span>
              <div>
                <h3 className="font-medium text-white">{db.name}</h3>
                <p className="text-xs text-white/50">{db.description}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors">
                编辑
              </button>
              <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors">
                查看文献
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 w-full py-3 rounded-lg border-2 border-dashed border-white/10 hover:border-accent-gold/50 text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        添加新数据库
      </button>
    </div>
  );
};

const StatsSection: React.FC<{ documents: Document[] }> = ({ documents }) => {
  const totalDocs = documents.length;
  const totalViews = documents.reduce((sum, doc) => sum + doc.viewCount, 0);
  const dbStats = databases.slice(1).map((db) => ({
    ...db,
    count: documents.filter((doc) => doc.database === db.id).length,
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-accent-gold" />
        数据统计
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-gradient-to-br from-accent-gold/20 to-accent-gold/5 border border-accent-gold/20">
          <BookOpen className="w-8 h-8 text-accent-gold mb-2" />
          <p className="text-2xl font-bold">{totalDocs}</p>
          <p className="text-sm text-white/60">文献总数</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-accent-red/20 to-accent-red/5 border border-accent-red/20">
          <BarChart3 className="w-8 h-8 text-accent-red mb-2" />
          <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
          <p className="text-sm text-white/60">总浏览量</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
          <Tags className="w-8 h-8 text-blue-500 mb-2" />
          <p className="text-2xl font-bold">{documents.reduce((sum, doc) => sum + doc.tags.length, 0)}</p>
          <p className="text-sm text-white/60">标签总数</p>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20">
          <Database className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-2xl font-bold">{databases.length - 1}</p>
          <p className="text-sm text-white/60">数据库数量</p>
        </div>
      </div>

      <h3 className="font-medium mb-4">各数据库文献分布</h3>
      <div className="space-y-3">
        {dbStats.map((db) => (
          <div key={db.id} className="flex items-center gap-4">
            <span className="text-xl w-8">{db.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{db.name}</span>
                <span className="text-sm text-white/50">{db.count} 篇</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent-gold to-accent-red rounded-full transition-all"
                  style={{ width: `${totalDocs > 0 ? (db.count / totalDocs) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};