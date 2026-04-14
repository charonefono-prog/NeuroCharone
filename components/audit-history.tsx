import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useColors } from "@/hooks/use-colors";
import {
  getAuditLogsByEntity,
  getActionDescription,
  getFieldName,
  formatValue,
  type AuditLog,
} from "@/lib/audit-log";

interface AuditHistoryProps {
  entityType: "patient" | "plan" | "session";
  entityId: string;
}

export function AuditHistory({ entityType, entityId }: AuditHistoryProps) {
  const colors = useColors();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [entityId]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getAuditLogsByEntity(entityType, entityId);
      // Ordenar por data mais recente primeiro
      data.sort((a, b) => b.timestamp - a.timestamp);
      setLogs(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (logs.length === 0) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
          Nenhuma alteração registrada
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      {logs.map((log) => (
        <View
          key={log.id}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 8,
          }}
        >
          {/* Cabeçalho do log */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.foreground, flex: 1 }}>
              {getActionDescription(log.action)}
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              {new Date(log.timestamp).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Alterações */}
          {log.changes && log.changes.length > 0 && (
            <View style={{ gap: 8, marginTop: 8 }}>
              {log.changes.map((change, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: 8,
                    padding: 12,
                    gap: 4,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.foreground }}>
                    {getFieldName(change.field)}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 2 }}>De:</Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.foreground,
                          textDecorationLine: "line-through",
                        }}
                      >
                        {formatValue(change.oldValue)}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: colors.muted }}>→</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 11, color: colors.muted, marginBottom: 2 }}>Para:</Text>
                      <Text style={{ fontSize: 12, color: colors.success, fontWeight: "600" }}>
                        {formatValue(change.newValue)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Metadata */}
          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
              <Text style={{ fontSize: 12, color: colors.muted }}>
                {Object.entries(log.metadata)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(" • ")}
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
