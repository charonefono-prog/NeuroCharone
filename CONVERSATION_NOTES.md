# Notas da Conversa com Carlos

## Problema Principal
Carlos quer que os cálculos de melhora sejam CORRETOS para TODAS as escalas.

## Exemplo Concreto (EAT-10):
- Score inicial: 38 (sintomas severos)
- Score final: 0 (sem sintomas)
- **CORRETO**: Melhora de 100% (+38 pontos de melhora)
- **ERRADO (atual)**: Mostra "Variação: -38" e "Melhora: 0.0%"

## Requisitos:
1. Entender a direção de cada escala (direta vs inversa)
2. Calcular melhora CORRETAMENTE para cada tipo
3. Nunca mostrar valores negativos
4. Mostrar apenas "melhora" (positivo) ou "sem melhora" (0)
5. Precisa ser verificado MINUCIOSAMENTE em TODOS os componentes
