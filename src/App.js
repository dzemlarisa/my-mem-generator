import './App.css';
import { useState, useRef } from 'react';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [finalMem, setFinalMem] = useState(null);
  const canvasRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFinalMem(null); 
    }
  };

  const openFileDialog = () => {
    document.getElementById('fileInput').click();
  };

  const generateMem = () => {
    if (!imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px Impact, Arial, sans-serif';

      if (topText) {
        const x = canvas.width / 2;
        const y = 50;
        
        ctx.strokeText(topText, x, y);
        ctx.fillText(topText, x, y);
      }

      if (bottomText) {
        const x = canvas.width / 2;
        const y = canvas.height - 30;

        ctx.strokeText(bottomText, x, y);
        ctx.fillText(bottomText, x, y);
      }
      
      const MemUrl = canvas.toDataURL('image/png');
      setFinalMem(MemUrl);
    };
    
    img.src = imageUrl;
  };

  const downloadMem = () => {
    if (!finalMem) return;
    
    const link = document.createElement('a');
    link.download = 'Mem.png';
    link.href = finalMem;
    link.click();
  };

  const resetForm = () => {
    setTopText('');
    setBottomText('');
    setFinalMem(null);
  };

  return (
    <div className="mem-generator">
      <h1 className="mem-title">Генератор мемов</h1>
      <input id="fileInput" type="file" accept="image/*" onChange={handleImageSelect} className="file-input"/>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={openFileDialog} className="btn btn-image">
          Выбрать изображение
        </button>
        
        {imageUrl && (
          <button onClick={resetForm} className="btn btn-reset">
            Сбросить
          </button>
        )}
      </div>

      {imageUrl && (
        <div className="text-form">
          <div className='form-group'>
            <label className='form-label'>
              Верхний текст:
            </label>
            <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="Введите верхний текст..." className='form-input'/>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Нижний текст:
            </label>
            <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="Введите нижний текст..." className='form-input'/>
          </div>
          
          <button onClick={generateMem} className='btn btn-create'>
            Создать мем
          </button>
        </div>
      )}

      {imageUrl && !finalMem && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Исходное изображение:</h3>
          <img src={imageUrl} alt="Preview" className='preview-image'/>
          <p className='file-info'>
            Файл: {selectedImage?.name}
          </p>
        </div>
      )}

      {finalMem && (
        <div className='result-container'>
          <h3>Ваш мем готов!</h3>
          <img src={finalMem} alt="Generated Mem" className='result-image' />
          <div style={{ marginTop: '15px' }}>
            <button onClick={downloadMem} className="btn btn-download">
              Скачать мем
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
