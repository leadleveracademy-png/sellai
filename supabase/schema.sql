-- =====================================================
-- Schema do banco de dados — SellAI
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Tabela de analises
CREATE TABLE IF NOT EXISTS public.analises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  imagem_url TEXT DEFAULT '',
  contexto_detectado TEXT NOT NULL,
  sugestoes JSONB NOT NULL DEFAULT '[]',
  criado_em TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indice para busca por usuario
CREATE INDEX IF NOT EXISTS analises_usuario_id_idx ON public.analises (usuario_id, criado_em DESC);

-- Row Level Security — cada usuario ve apenas suas proprias analises
ALTER TABLE public.analises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios veem apenas suas analises"
  ON public.analises
  FOR ALL
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- =====================================================
-- Storage — bucket para imagens
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imagens-analise',
  'imagens-analise',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- Politica de storage: usuario faz upload apenas na propria pasta
CREATE POLICY "Upload na pasta do usuario"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'imagens-analise'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Leitura publica das imagens"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'imagens-analise');

CREATE POLICY "Usuario deleta proprias imagens"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'imagens-analise'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
