-- Script para testar a conexão com o banco e verificar se a tabela existe
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'cadastroatletas'
ORDER BY ordinal_position;

-- Verificar se há dados na tabela
SELECT COUNT(*) as total_atletas FROM CadastroAtletas;

-- Mostrar alguns registros de exemplo (se existirem)
SELECT * FROM CadastroAtletas LIMIT 5;
