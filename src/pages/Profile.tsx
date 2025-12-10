import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Camera, User, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Inline worker code for portability
const WORKER_CODE = `
self.onmessage = async (e) => {
  const { file } = e.data;
  if (!file) return;
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(300, 300);
    const ctx = canvas.getContext('2d');
    const scale = Math.min(300 / bitmap.width, 300 / bitmap.height);
    const width = bitmap.width * scale;
    const height = bitmap.height * scale;
    const x = (300 - width) / 2;
    const y = (300 - height) / 2;
    ctx.drawImage(bitmap, x, y, width, height);
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 });
    self.postMessage({ blob, success: true });
  } catch (error) {
    self.postMessage({ success: false, error });
  }
};
`;

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, setUser } = useStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    const workerBlob = new Blob([WORKER_CODE], { type: 'application/javascript' });
    const worker = new Worker(URL.createObjectURL(workerBlob));

    worker.postMessage({ file });

    worker.onmessage = async (event) => {
      const { blob, success } = event.data;
      
      if (success && blob) {
        try {
          // Convert Blob to Base64
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          
          reader.onloadend = async () => {
            const base64data = reader.result as string;
            
            // Save Base64 to Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { photoBase64: base64data }, { merge: true });
            
            // Update local state immediately
            setUser({ ...user, photoURL: base64data });
            setUploading(false);
            worker.terminate();
          };
        } catch (error) {
          console.error("Upload failed", error);
          alert("Failed to save image");
          setUploading(false);
          worker.terminate();
        }
      } else {
        alert("Image processing failed");
        setUploading(false);
        worker.terminate();
      }
    };
  };

  if (!user) return <div>Access Denied</div>;

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 p-8">
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 p-2 bg-brand-600 rounded-full text-white hover:bg-brand-500 transition shadow-lg"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            className="hidden"
          />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-white">{user.displayName || 'User'}</h1>
        <p className="text-slate-400">{user.email}</p>

        <div className="mt-8 w-full border-t border-slate-800 pt-8">
          <h2 className="text-lg font-semibold text-white mb-4">{t('account_stats')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
              <span className="block text-2xl font-bold text-brand-500">0</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t('stats_reviews')}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
              <span className="block text-2xl font-bold text-brand-500">-</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{t('stats_lists')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;