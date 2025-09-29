-- Consultar todos os atletas cadastrados
SELECT 
    id,
    nome,
    sobrenome,
    data_nascimento,
    idade,
    posicao,
    posicao_secundaria,
    categoria,
    cpf,
    telefone_responsavel,
    status,
    created_at,
    updated_at
FROM cadastroatletas
ORDER BY created_at DESC;

-- Estatísticas dos atletas
SELECT 
    categoria,
    COUNT(*) as total_atletas
FROM cadastroatletas
GROUP BY categoria
ORDER BY categoria;

-- Atletas por posição
SELECT 
    posicao,
    COUNT(*) as total_atletas
FROM cadastroatletas
GROUP BY posicao
ORDER BY posicao;
