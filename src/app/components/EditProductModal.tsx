import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader, AlertCircle, CheckCircle, Edit } from 'lucide-react';
import { useProducts, Product } from '../context/ProductsContext';
import { supabase } from '../context/AuthContext';
import { toast } from 'sonner';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const { updateProduct } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category || 'Doces',
    description: product.description,
    price: product.price.toString(),
    tags: product.tags.join(', '),
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product.image);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category || 'Doces',
        description: product.description,
        price: product.price.toString(),
        tags: product.tags.join(', '),
        imageUrl: '',
      });
      setImagePreview(product.image);
      setImageFile(null);
      setUploadError('');
    }
  }, [product]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('❌ Imagem muito grande. Máximo 5MB.');
      toast.error('Imagem muito grande.');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setUploadError('❌ Arquivo deve ser uma imagem válida (JPG, PNG, GIF, WebP).');
      toast.error('Tipo de arquivo inválido.');
      return;
    }

    setImageFile(file);
    setUploadError('');
    setFormData(prev => ({ ...prev, imageUrl: '' })); // Limpar URL ao selecionar arquivo

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        // Se o bucket não existe, usar a URL data como fallback
        if (uploadError.message.includes('not found') || uploadError.message.includes('does not exist')) {
          console.warn('Bucket not found, usando imagem local como fallback');
          return imagePreview;
        }
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.warn('Upload falhou, usando base64 como fallback:', error);
      return imagePreview;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError('');

    // Validações
    if (!formData.name.trim()) {
      toast.error('Nome do produto é obrigatório.');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Preço válido é obrigatório.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Descrição do produto é obrigatória.');
      return;
    }

    setIsLoading(true);

    // Mostrar notificação de carregamento
    const loadingToastId = toast.loading('⏳ Atualizando produto...');

    try {
      let imageUrl = product.image; // Manter imagem atual por padrão

      // Se há nova imagem, fazer upload
      if (imageFile) {
        imageUrl = await uploadImageToSupabase(imageFile);
      } else if (formData.imageUrl.trim()) {
        imageUrl = formData.imageUrl.trim();
      }

      await updateProduct(product.id, {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        image: imageUrl,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
          .slice(0, 3), // Máximo 3 tags
      });

      // Fechar o toast de carregamento e mostrar sucesso
      toast.dismiss(loadingToastId);
      toast.success('✅ Produto atualizado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setUploadError(`❌ Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      // Fechar o toast de carregamento e mostrar erro
      toast.dismiss(loadingToastId);
      toast.error('Erro ao atualizar produto.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container - Responsivo */}
      <div className="relative w-full sm:w-full md:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl ring-1 ring-[#E0B58C]/20">
        {/* Header com botão fechar */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white border-b border-[#F0E6DD] p-4 sm:p-6 rounded-t-3xl sm:rounded-t-3xl">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D160C] flex items-center gap-2">
              <Edit size={24} />
              Editar Produto
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#6B4E3E]">
              Atualize as informações do produto
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 rounded-full border border-[#E0B58C] bg-white p-2 text-[#2D160C] shadow-lg transition-transform hover:scale-110 active:scale-95"
            aria-label="Fechar modal"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Conteúdo do formulário */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

            {/* 🖼️ UPLOAD DE IMAGEM - RESPONSIVO */}
            <div>
              <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wider pl-1 mb-2 block">
                📷 Imagem do Produto
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-[#E0B58C] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition hover:border-[#D4A76A] hover:bg-[#FAF6F0] active:scale-98"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isLoading}
                />

                {imagePreview ? (
                  <div className="space-y-2 sm:space-y-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto h-32 sm:h-40 w-auto rounded-lg sm:rounded-xl object-cover shadow-md"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-[#2D160C]">
                        ✅ Imagem selecionada
                      </p>
                      <p className="text-xs text-[#6B4E3E]">
                        Clique para alterar
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3 py-4 sm:py-6">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-[#FAF6F0] p-3 sm:p-4 text-[#E0B58C]">
                        <Upload size={28} className="sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-[#2D160C]">
                        Clique para selecionar
                      </p>
                      <p className="text-xs sm:text-sm text-[#6B4E3E] mt-1">
                        JPG, PNG, GIF ou WebP - Máx 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Alternativa: URL de imagem */}
              <div className="mt-3 sm:mt-4">
                <details className="group">
                  <summary className="cursor-pointer text-xs sm:text-sm text-[#E0B58C] font-semibold hover:text-[#D4A76A]">
                    💡 Ou usar URL de imagem
                  </summary>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full mt-2 px-3 sm:px-4 py-2 bg-white border border-[#F0E6DD] rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all"
                    disabled={isLoading || !!imageFile}
                  />
                </details>
              </div>

              {/* Mensagem de erro */}
              {uploadError && (
                <div className="mt-2 sm:mt-3 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-2 sm:p-3 text-xs sm:text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* 📝 CAMPOS PRINCIPAIS - GRID RESPONSIVO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Nome */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wide pl-1">
                  Nome *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Brigadeiro Trufado"
                  maxLength={50}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-[#F0E6DD] rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Preço */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wide pl-1">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max="9999"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-[#F0E6DD] rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>

              {/* Categoria */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wide pl-1">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-[#F0E6DD] rounded-lg sm:rounded-xl text-xs sm:text-sm text-[#6B4E3E] focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-transparent transition-all"
                  disabled={isLoading}
                >
                  <option value="Doces">🍫 Doces</option>
                  <option value="Tortas">🎂 Tortas</option>
                  <option value="Bolos">🧁 Bolos</option>
                  <option value="Especiais">👑 Especiais</option>
                  <option value="Bebidas">🥤 Bebidas</option>
                  <option value="Pães">🥐 Pães</option>
                </select>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wide pl-1">
                  Tags (até 3)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Novo, Premium, Bestseller"
                  maxLength={50}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-[#F0E6DD] rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 📄 DESCRIÇÃO */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#6B4E3E] uppercase tracking-wide pl-1">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva ingredientes, sabor e características..."
                maxLength={300}
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-[#F0E6DD] rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-transparent transition-all resize-none"
                disabled={isLoading}
              />
              <p className="text-xs text-[#8B7366]">
                {formData.description.length}/300
              </p>
            </div>

            {/* 🔘 BOTÕES DE AÇÃO - RESPONSIVOS */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-lg sm:rounded-xl border border-[#E0B58C] px-4 sm:px-6 py-3 sm:py-3 font-bold text-[#2D160C] text-sm sm:text-base transition hover:bg-[#FAF6F0] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg sm:rounded-xl bg-[#2D160C] px-4 sm:px-6 py-3 sm:py-3 font-bold text-white text-sm sm:text-base transition hover:bg-[#3F210E] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Atualizar Produto</span>
                  </>
                )}
              </button>
            </div>

            {/* 💡 DICA */}
            <div className="rounded-lg bg-[#FBF5EB] border border-[#E0B58C]/30 p-3 sm:p-4 text-xs sm:text-sm text-[#6B4E3E]">
              <span className="font-semibold">💡 Dica:</span> Se não conseguir fazer upload, use uma URL de imagem pública (Unsplash, Pexels, etc).
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}