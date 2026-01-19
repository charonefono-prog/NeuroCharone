import { View, Text, Dimensions, PanResponder, Animated, GestureResponderEvent } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import type { Session, Patient } from '@/lib/local-storage';
import { useMemo, useRef, useState } from 'react';
import Svg, { Line, Circle, Text as SvgText, Path, G, Rect } from 'react-native-svg';

interface SymptomEvolutionLineChartProps {
  patient: Patient;
  sessions: Session[];
}

interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  score: number;
  date: string;
  sessionDetails?: string;
}

export function SymptomEvolutionLineChart({
  patient,
  sessions,
}: SymptomEvolutionLineChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // 32px padding on each side
  const chartHeight = 250;
  const padding = 40;

  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    score: 0,
    date: '',
  });

  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  // Preparar dados do gráfico
  const chartData = useMemo(() => {
    const sessionsWithScores = sessions
      .filter((s) => s.symptomScore !== undefined)
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());

    if (sessionsWithScores.length === 0) {
      return null;
    }

    // Incluir score inicial se disponível
    const allDataPoints = [];
    if (patient.initialSymptomScore !== undefined) {
      allDataPoints.push({
        score: patient.initialSymptomScore,
        date: new Date(patient.createdAt),
        label: 'Inicial',
        isBaseline: true,
        sessionDetails: 'Avaliação Inicial',
      });
    }

    allDataPoints.push(
      ...sessionsWithScores.map((session, index) => ({
        score: session.symptomScore || 0,
        date: new Date(session.sessionDate),
        label: `S${index + 1}`,
        isBaseline: false,
        sessionDetails: `Sessão ${index + 1}`,
      }))
    );

    return allDataPoints;
  }, [sessions, patient]);

  if (!chartData || chartData.length < 2) {
    return (
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 20,
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 14 }}>
          Registre pelo menos 2 avaliações para visualizar a evolução.
        </Text>
      </View>
    );
  }

  // Encontrar min e max para escala
  const scores = chartData.map((d) => d.score);
  const minScore = Math.floor(Math.min(...scores, 0));
  const maxScore = Math.ceil(Math.max(...scores, 10));
  const scoreRange = maxScore - minScore || 1;

  // Calcular posições dos pontos
  const points = chartData.map((data, index) => {
    const x = (index / (chartData.length - 1)) * (chartWidth - padding * 2) + padding;
    const normalizedScore = (data.score - minScore) / scoreRange;
    const y = chartHeight - padding - normalizedScore * (chartHeight - padding * 2);
    return { ...data, x, y };
  });

  // Gerar caminho SVG para a linha
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Detectar toque nos pontos
  const handlePointPress = (point: (typeof points)[0], screenX: number, screenY: number) => {
    const dateStr = point.date.toLocaleDateString('pt-BR');
    
    setTooltip({
      visible: true,
      x: screenX,
      y: screenY,
      label: point.label,
      score: point.score,
      date: dateStr,
      sessionDetails: point.sessionDetails,
    });

    Animated.timing(tooltipOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-hide após 4 segundos
    setTimeout(() => {
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setTooltip({ ...tooltip, visible: false }));
    }, 4000);
  };

  const hideTooltip = () => {
    Animated.timing(tooltipOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setTooltip({ ...tooltip, visible: false }));
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>
        Evolução de Sintomas
      </Text>

      {/* Gráfico SVG com detecção de toque */}
      <View
        style={{
          alignItems: 'center',
          marginBottom: 16,
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: chartWidth,
            height: chartHeight,
            zIndex: 10,
          }}
          onStartShouldSetResponder={() => true}
          onResponderMove={(evt: GestureResponderEvent) => {
            const { locationX, locationY } = evt.nativeEvent;
            
            // Verificar se tocou em algum ponto
            points.forEach((point) => {
              const distance = Math.sqrt(
                Math.pow(locationX - (point.x - 32), 2) + Math.pow(locationY - point.y, 2)
              );
              
              // Raio de 20px para detectar toque
              if (distance < 20) {
                handlePointPress(point, locationX, locationY);
              }
            });
          }}
        />

        <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid horizontal */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction, index) => {
            const y = chartHeight - padding - fraction * (chartHeight - padding * 2);
            const scoreValue = Math.round(minScore + fraction * scoreRange);
            return (
              <G key={`grid-${index}`}>
                <Line
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4,4"
                  opacity="0.5"
                />
                <SvgText
                  x={padding - 8}
                  y={y + 4}
                  fontSize="12"
                  fill={colors.muted}
                  textAnchor="end"
                >
                  {scoreValue}
                </SvgText>
              </G>
            );
          })}

          {/* Linha do gráfico */}
          <Path
            d={pathData}
            stroke={colors.primary}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pontos de dados */}
          {points.map((point, index) => (
            <G key={`point-${index}`}>
              {/* Círculo de fundo */}
              <Circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill={colors.surface}
                stroke={colors.primary}
                strokeWidth="2"
              />
              {/* Ponto interno */}
              <Circle cx={point.x} cy={point.y} r="3" fill={colors.primary} />
              {/* Label */}
              <SvgText
                x={point.x}
                y={point.y - 15}
                fontSize="11"
                fill={colors.foreground}
                textAnchor="middle"
                fontWeight="600"
              >
                {point.label}
              </SvgText>
              {/* Score value */}
              <SvgText
                x={point.x}
                y={point.y + 20}
                fontSize="10"
                fill={colors.muted}
                textAnchor="middle"
              >
                {point.score.toFixed(1)}
              </SvgText>
            </G>
          ))}
        </Svg>
      </View>

      {/* Tooltip */}
      {tooltip.visible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: Math.max(20, tooltip.y - 120),
            left: Math.max(16, Math.min(tooltip.x - 80, screenWidth - 176)),
            backgroundColor: colors.foreground,
            borderRadius: 8,
            padding: 12,
            zIndex: 100,
            opacity: tooltipOpacity,
            minWidth: 160,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.background, marginBottom: 4 }}>
            {tooltip.sessionDetails}
          </Text>
          <Text style={{ fontSize: 11, color: colors.background, marginBottom: 4 }}>
            Score: {tooltip.score.toFixed(1)}
          </Text>
          <Text style={{ fontSize: 10, color: colors.background, opacity: 0.8 }}>
            {tooltip.date}
          </Text>
        </Animated.View>
      )}

      {/* Legenda e informações */}
      <View style={{ gap: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted }}>
              Score Inicial
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground }}>
              {chartData[0].score.toFixed(1)}
            </Text>
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted }}>
              Score Atual
            </Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: colors.primary }}>
              {chartData[chartData.length - 1].score.toFixed(1)}
            </Text>
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.muted }}>
              Variação
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: chartData[0].score > chartData[chartData.length - 1].score ? colors.success : colors.error,
              }}
            >
              {(chartData[0].score - chartData[chartData.length - 1].score).toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
