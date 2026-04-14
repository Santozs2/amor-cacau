import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, User as UserIcon, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { signUpSchema, signInSchema, resetPasswordSchema, validatePassword } from '../utils/validation';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const navigate = useNavigate();
  const { signUp, signIn, resetPassword } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Validate password in real-time
    if (field === 'password') {
      const { errors: pwdErrors } = validatePassword(value);
      setPasswordErrors(pwdErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Validate login form
        const validatedData = signInSchema.parse({
          email: formData.email,
          password: formData.password,
        });

        await signIn(validatedData.email, validatedData.password);

        toast.success('Login realizado com sucesso!', {
          description: 'Bem-vindo de volta à Amor & Cacau.',
        });
        navigate('/');
      } else {
        // Validate signup form
        const validatedData = signUpSchema.parse({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        await signUp(validatedData.email, validatedData.password, validatedData.name);

        toast.success('Conta criada com sucesso!', {
          description: 'Verifique seu e-mail para confirmar a conta antes de entrar.',
        });
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
        navigate('/auth');
      }
    } catch (error: any) {
      console.error('Auth error:', error);

      if (error.name === 'ZodError') {
        const fieldErrors: Record<string, string> = {};
        const pwdErrors: string[] = [];
        error.errors.forEach((err: any) => {
          if (err.path[0] === 'password') {
            pwdErrors.push(err.message);
          } else {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
        if (pwdErrors.length > 0) {
          setPasswordErrors(pwdErrors);
        }
      } else {
        // Handle Supabase specific errors
        let message = error.message || 'Ocorreu um erro inesperado';
        const title = isLogin ? 'Não foi possível entrar' : 'Conta não foi criada';

        if (error.message?.includes('Invalid login credentials')) {
          message = 'E-mail ou senha incorretos';
        } else if (error.message?.includes('Email not confirmed')) {
          message = 'Confirme seu e-mail antes de fazer login';
        } else if (error.message?.includes('User already registered')) {
          message = 'Este e-mail já está cadastrado';
        } else if (error.message?.includes('Password should be at least')) {
          message = 'A senha deve atender aos requisitos mínimos';
        } else if (error.message?.includes('Unable to validate email address')) {
          message = 'E-mail inválido';
        }

        toast.error(title, {
          description: message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validatedData = resetPasswordSchema.parse({
        email: formData.email,
      });

      await resetPassword(validatedData.email);

      toast.success('E-mail enviado!', {
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error('Reset password error:', error);

      if (error.name === 'ZodError') {
        setErrors({ email: error.errors[0].message });
      } else {
        toast.error('Erro ao enviar e-mail', {
          description: error.message || 'Tente novamente mais tarde.',
        });
      }
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FAF6F0]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-[#F0E6DD]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-[#2D160C] tracking-tight font-serif mb-2">
              Esqueceu sua senha?
            </h1>
            <p className="text-[#8B7366] text-sm">
              Digite seu e-mail para receber instruções de redefinição.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleForgotPassword}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B7366]">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <input
                type="email"
                required
                placeholder="Seu E-mail"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all placeholder:text-gray-400 bg-[#FAF6F0]/50"
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                  <AlertCircle size={12} />
                  {errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2D160C] text-white py-3 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Enviar E-mail
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => setShowForgotPassword(false)}
            className="w-full mt-4 text-[#8B7366] hover:text-[#2D160C] transition-colors text-sm"
          >
            ← Voltar ao login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#FAF6F0]">
      <div className="max-w-4xl w-full flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#F0E6DD]">

        <div className="relative w-full md:w-1/2 h-64 md:h-auto hidden md:block group overflow-hidden bg-[#2D160C]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1771498326035-c148ca1511de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBwYXN0cnklMjBzaG9wJTIwZGlzcGxheXxlbnwxfHx8fDE3NzQ0Njk0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D160C]/90 via-[#2D160C]/40 to-transparent flex flex-col justify-end p-8 text-[#E0B58C]">
            <h2 className="text-3xl font-serif font-bold mb-2 tracking-wide text-white drop-shadow-md">
              Bem-vindo à AMOR & CACAU
            </h2>
            <p className="text-sm font-light tracking-wider opacity-90 drop-shadow">
              Entre para adoçar seu dia com nossas delícias artesanais e novidades exclusivas.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center relative">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-[#2D160C] tracking-tight font-serif mb-2">
              {isLogin ? 'Acesse sua Conta' : 'Crie sua Conta'}
            </h1>
            <p className="text-[#8B7366] text-sm">
              {isLogin
                ? 'Insira seus dados para continuar comprando doces maravilhosos.'
                : 'Junte-se a nós para uma experiência mais doce e rápida.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B7366]">
                  <UserIcon size={20} strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nome Completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all placeholder:text-gray-400 bg-[#FAF6F0]/50"
                />
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                    <AlertCircle size={12} />
                    {errors.name}
                  </div>
                )}
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8B7366]">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <input
                type="email"
                required
                placeholder="Seu E-mail"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all placeholder:text-gray-400 bg-[#FAF6F0]/50"
              />
              {errors.email && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                  <AlertCircle size={12} />
                  {errors.email}
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
                placeholder="Sua Senha"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-[#F0E6DD] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E0B58C] focus:border-[#E0B58C] transition-all placeholder:text-gray-400 bg-[#FAF6F0]/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B7366] hover:text-[#2D160C] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                  <AlertCircle size={12} />
                  {errors.password}
                </div>
              )}
              {!isLogin && passwordErrors.length > 0 && (
                <div className="space-y-1">
                  {passwordErrors.map((error, index) => (
                    <div key={index} className="flex items-center gap-1 text-red-600 text-xs">
                      <AlertCircle size={12} />
                      {error}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[#8B7366] hover:text-[#2D160C] transition-colors text-sm underline underline-offset-2 cursor-pointer"
                >
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2D160C] text-white py-3 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-[#E0B58C] hover:text-[#2D160C] transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8B7366] text-sm">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setPasswordErrors([]);
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="ml-1 text-[#2D160C] hover:text-[#E0B58C] transition-colors font-medium underline underline-offset-2 cursor-pointer"
              >
                {isLogin ? 'Criar conta' : 'Fazer login'}
              </button>
            </p>
          </div>
          
          <div className="mt-auto pt-8 flex justify-center">
            <Link to="/" className="text-xs tracking-wider uppercase text-[#8B7366] hover:text-[#2D160C] transition-colors border-b border-transparent hover:border-[#2D160C] pb-0.5 cursor-pointer">
              Voltar para a Loja
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
