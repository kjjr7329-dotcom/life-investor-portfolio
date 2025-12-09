import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // 1. 중괄호 { } 다시 꼭 넣어주세요!

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);

  const uploadImage = async () => {
    // 파일 선택 확인
    if (!file) {
      alert("파일을 먼저 선택해주세요!");
      return;
    }
    
    // ★ 2. 이 안전장치 코드를 넣어야 빨간 줄이 사라집니다! ★
    if (!supabase) {
      alert("Supabase 연결 실패! 설정을 확인해주세요.");
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 위에서 검사했기 때문에 이제 빨간 줄이 안 뜰 겁니다.
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;
      alert("업로드 완료!");
      
    } catch (error: any) {
      alert("업로드 실패: " + error.message);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={uploadImage}>이미지 업로드</button>
    </div>
  );
}