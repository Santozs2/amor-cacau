import React, { createContext, useContext, useState } from 'react';
import { useAuth, supabase } from './AuthContext';
import { toast } from 'sonner';

export interface Comment {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  rating: number;
  created_at: string;
}

interface CommentsContextType {
  comments: Comment[];
  addComment: (productId: string, comment: string, rating: number) => Promise<void>;
  loadComments: (productId: string) => Promise<void>;
  loading: boolean;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const addComment = async (productId: string, comment: string, rating: number) => {
    if (!user) {
      toast.error('Você precisa estar logado para comentar');
      return;
    }

    if (!comment.trim()) {
      toast.error('Comentário não pode ficar em branco');
      return;
    }

    const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário';

    try {
      const { data: insertedComment, error } = await supabase
        .from('comments')
        .insert({
          product_id: productId,
          user_id: user.id,
          user_name: userName,
          comment,
          rating,
        })
        .select()
        .single();

      if (error) throw error;

      if (insertedComment) {
        setComments(prev => [insertedComment as Comment, ...prev]);
        toast.success('Comentário adicionado com sucesso!');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erro ao adicionar comentário');
    }
  };

  const loadComments = async (productId: string) => {
    setLoading(true);
    if (!productId) {
      setComments([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id, product_id, user_id, user_name, comment, rating, created_at')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading comments:', error);
        setComments([]);
        return;
      }

      setComments((data as Comment[]) || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommentsContext.Provider value={{
      comments,
      addComment,
      loadComments,
      loading,
    }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentsContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
}