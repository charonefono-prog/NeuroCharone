# Auditoria de Cálculos de Melhora - Todos os Componentes

## Problema Central
Escalas inversas (EAT-10, GRBASI, PHQ-9, DOSS, etc.) onde score ALTO = pior e score BAIXO = melhor.
Exemplo: EAT-10 de 38→0 significa 100% de melhora, mas o app mostra 0% ou -38.

## Lista de Escalas Inversas (score alto = pior)
eat10, grbasi, phq9, phq44, mdq, conners, vanderbilt, oddrs, snapiv, mdsupdrs, amisos

## Lista de Escalas Diretas (score alto = melhor)  
doss, btss, bdae, cm, sara, qcs, pdq39, fois, dsfs, stopbang, hb, saliva

## Arquivos com Cálculos Errados

### 1. comparative-charts.tsx (linha 59) - ERRADO
```
improvement: Math.max(0, ((lastResponse.totalScore - firstResponse.totalScore) / firstResponse.totalScore) * 100)
```
PROBLEMA: Para EAT-10 38→0: ((0-38)/38)*100 = -100%. Math.max(0, -100) = 0%. ERRADO!
CORRETO: Deve detectar escala inversa e calcular: ((38-0)/38)*100 = 100%

### 2. scale-chart.tsx ScaleChart (linhas 80-81, 179-195) - ERRADO
```
isImproving = index > 0 && score > scores[index - 1]  // Verde se score SOBE
isDecline = index > 0 && score < scores[index - 1]    // Vermelho se score DESCE
Variação: scores[last] - scores[0]                     // Mostra -38
```
PROBLEMA: Para escalas inversas, score DESCENDO é melhora, não piora!
- Barras: verde quando score sobe (errado para inversas)
- Variação: mostra -38 (errado, deveria ser +38 de melhora)

### 3. multi-patient-comparison.tsx (linha 39) - ERRADO
```
improvement = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0
```
PROBLEMA: Mesmo que comparative-charts. Para inversas, lastScore < firstScore = melhora.

### 4. symptom-evolution-line-chart.tsx (linhas 350-354) - PARCIALMENTE ERRADO
```
Variação: (chartData[0].score - chartData[last].score).toFixed(1)
```
Aqui calcula score[0] - score[last], que para sintomas (inversas) dá positivo. Mas o label diz "Variação" em vez de "Melhora".

### 5. comparative-charts.tsx - Cores das barras (linhas 198-201, 211-215)
Barra "Antes" = warning (laranja), Barra "Depois" = success (verde)
PROBLEMA: Se score DIMINUIU (melhora em inversa), a barra verde é menor que a laranja. Visualmente confuso.

## Solução Unificada
Criar função utilitária `calculateImprovement(scaleType, firstScore, lastScore)` que:
1. Detecta se é escala inversa
2. Para inversas: melhora = (firstScore - lastScore) / firstScore * 100
3. Para diretas: melhora = (lastScore - firstScore) / firstScore * 100
4. Retorna sempre valor >= 0 (sem negativos)
5. Se não melhorou, retorna 0
