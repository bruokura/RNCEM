import { useState } from 'react';
import { FaImage, FaTrash, FaUpload } from 'react-icons/fa';
import './style.css';

export const Home = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [classificationResult, setClassificationResult] = useState<
    string | null
  >(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClassify = async () => {
    if (!selectedImage) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/classify', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Resultado:', result);
      if (response.ok) {
        if (result && result.result === 'DESCONHECIDA') {
          setErrorMessage(result.message);
          setShowErrorPopup(true);
        } else if (result && result.result) {
          setClassificationResult(result.result);
          setShowSuccessPopup(true);
        }
      } else {
        throw new Error(
          result.message || 'Erro desconhecido ao classificar a imagem.'
        );
      }
    } catch (error) {
      console.error('Erro:', error);
      setErrorMessage(
        'Ocorreu um erro ao classificar a imagem. Por favor, tente novamente.'
      );
      setShowErrorPopup(true);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const closeErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorMessage(null);
  };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setClassificationResult(null);
  };

  return (
    <div className='container'>
      <h1>Classificação de Mosquitos</h1>

      {/* Contêiner das caixas lado a lado */}
      <div className='boxes-container'>
        {/* Caixa de referência */}
        <div className='reference-box'>
          <p className='reference-title'>Imagem de Referência</p>
          <img src='/reference.jpg' alt='Exemplo de foto de mosquito' />
          <p className='reference-text'>
            Certifique-se de tirar uma foto clara e nítida do mosquito. Evite
            sombras ou iluminação excessiva que possam obscurecer os detalhes.
            Se necessário, corte as bordas da imagem para que o mosquito esteja
            centralizado e destacado.
          </p>
          <p className='reference-text'>
            A imagem acima mostra como deve ser a aparência esperada para obter
            o melhor resultado na classificação.
          </p>
        </div>

        {/* Caixa de upload */}
        <div className='upload-box'>
          <div className='left-side'>
            <p className='image-title'>Selecione a imagem</p>
            {imagePreview && (
              <img
                src={imagePreview}
                alt='Pré-visualização'
                className='image-real-size'
              />
            )}
          </div>
          <div className='right-side'>
            <input
              type='file'
              id='file'
              onChange={handleImageChange}
              style={{ display: 'none' }}
              accept='image/*'
            />
            <div className='buttons'>
              <button className='btn' onClick={triggerFileInput}>
                <FaUpload /> Buscar
              </button>

              <button
                className='btn classify-btn'
                onClick={handleClassify}
                disabled={!selectedImage}
              >
                <FaImage /> Classificar
              </button>

              {selectedImage && (
                <div className='remove-container' onClick={removeImage}>
                  <FaTrash className='trash-icon' />
                  <span className='remove-text'>Remover</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showErrorPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>Erro</h2>
            <p>{errorMessage}</p>
            <div className='button-container'>
              <button className='btn' onClick={closeErrorPopup}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className='popup'>
          <div className='popup-content'>
            <h2>Classificação Concluída</h2>
            <p>
              O resultado da classificação é:{' '}
              <strong>{classificationResult}</strong>
            </p>
            <div className='button-container'>
              <button className='btn' onClick={closeSuccessPopup}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className='loading-popup'>
          <div className='loading-popup-content'>
            <h2>Carregando...</h2>
            <div className='spinner'></div>
            <p>Aguarde enquanto estamos processando a imagem.</p>
          </div>
        </div>
      )}
    </div>
  );
};
