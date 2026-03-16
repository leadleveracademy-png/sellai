CREATE TABLE IF NOT EXISTS clint_eventos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  evento text,
  deal_id text,
  deal_nome text,
  deal_etapa text,
  deal_valor numeric,
  contato_nome text,
  contato_email text,
  contato_telefone text,
  responsavel text,
  data_evento timestamptz DEFAULT now(),
  payload jsonb
);