import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { supabase } from '../context/AuthContext';
import { passwordSchema, validatePassword } from '../utils/validation';
import { ArrowRight, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Verificando link de recuperação...');
  

  useEffect(() => {
    const verifyRecoveryLink = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const accessToken = searchParams.get('access_token') ?? hashParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token') ?? hashParams.get('refresh_token');
        const type = searchParams.get('type') ?? hashParams.get('type');

        if (type === 'recovery') {
          if (!accessToken || !refreshToken) {
            setStatusMessage('Link de recuperação inválido ou expirado. Solicite um novo e-mail.');
            return;
          }

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error || !data?.session) {
            console.error('Error setting session:', error);
            setStatusMessage('Link de recuperação inválido ou expirado. Solicite um novo e-mail.');
            return;
          }

          window.history.replaceState({}, document.title, window.location.pathname);
          setStatusMessage('Link válido! Defina uma nova senha para concluir a recuperação.');
          setIsReady(true);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatusMessage('Link válido! Defina uma nova senha para concluir a recuperação.');
          setIsReady(true);
        } else {
          setStatusMessage('Aguardando o clique no link de recuperação enviado por e-mail.');
        }
      } catch (error) {
        console.error('Error verifying recovery link:', error);
        setStatusMessage('Erro ao verificar o link de recuperação.');
      }
    };

    verifyRecoveryLink();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validar senha usando Zod
      passwordSchema.parse(password);

      if (password !== confirmPassword) {
        setErrors({ confirmPassword: 'As senhas precisam ser iguais' });
        return;
      }

      if (!isReady) {
        toast.error('Não foi possível validar o link de recuperação.');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success('Senha redefinida com sucesso!', {
        description: 'Agora você pode entrar com sua nova senha.',
      });
      navigate('/auth');
    } catch (error: any) {
      console.error('Reset Password error:', error);

      if (error.name === 'ZodError') {
        const [firstError] = error.errors;
        setErrors({ password: firstError.message });
      } else {
        toast.error('Não foi possível atualizar a senha.', {
          description: error.message || 'Tente novamente mais tarde.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordValidationErrors = useMemo<string[]>(() => {
    if (!password) return [];
    try {
      passwordSchema.parse(password);
      return [];
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return error.errors.map((err: any) => err.message);
      }
      return [];
    }
  }, [password]);

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FAF6F0]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-[#F0E6DD]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#2D160C] tracking-tight font-serif mb-2 cursor-pointer">
            Redefinir senha
          </h1>
          <p className="text-[#8B7366] text-sm">
            {statusMessage}
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B7366]">
              <Lock size={20} strokeWidth={1.5} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-12 py-3 border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all placeholder:text-gray-400 bg-[#FAF6F0]/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B7366] hover:text-[#2D160C] transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {(errors.password || passwordValidationErrors.length > 0) && (
              <div className="space-y-1 mt-1 text-red-600 text-xs">
                {errors.password && (
                  <div className="flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.password}
                  </div>
                )}
                {passwordValidationErrors.map((errorText, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errorText}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B7366]">
              <Lock size={20} strokeWidth={1.5} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all placeholder:text-gray-400 bg-[#FAF6F0]/50"
            />
            {errors.confirmPassword && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                <AlertCircle size={12} />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isReady}
            className="w-full bg-[#2D160C] text-white py-3 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Atualizando...' : 'Atualizar senha'}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/auth" className="text-[#2D160C] hover:text-[#E0B58C] transition-colors text-sm underline underline-offset-2">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
